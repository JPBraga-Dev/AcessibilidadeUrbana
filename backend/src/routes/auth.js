import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

// POST /auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error: userErr } = await supabase
      .from('users')
      .insert({ email, password_hash })
      .select('id, email, role')
      .single();

    if (userErr) {
      return res.status(500).json({ error: 'Erro ao criar usuário.', detail: userErr.message });
    }

    const { error: profileErr } = await supabase
      .from('profiles')
      .insert({ user_id: user.id, name });

    if (profileErr) {
      // Usuário criado mas perfil falhou — retorna aviso mas não bloqueia
      console.error('Erro ao criar perfil:', profileErr.message);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
    );

    return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, name } });
  }
);

// POST /auth/login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('id, email, role, password_hash, is_active, failed_login_attempts, locked_until')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Conta desativada.' });
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({
        error: 'Conta bloqueada temporariamente.',
        locked_until: user.locked_until,
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      const attempts = user.failed_login_attempts + 1;
      const update = { failed_login_attempts: attempts };

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        update.locked_until = new Date(
          Date.now() + LOCK_DURATION_MINUTES * 60 * 1000
        ).toISOString();
        update.failed_login_attempts = 0;
      }

      await supabase.from('users').update(update).eq('id', user.id);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Reset de tentativas e registro de último login
    await supabase
      .from('users')
      .update({ failed_login_attempts: 0, locked_until: null, last_sign_in_at: new Date().toISOString() })
      .eq('id', user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile?.name ?? null,
        avatar_url: profile?.avatar_url ?? null,
      },
    });
  }
);

// GET /auth/me
router.get('/me', requireAuth, async (req, res) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('user_id', req.user.id)
    .maybeSingle();

  return res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    name: profile?.name ?? null,
    avatar_url: profile?.avatar_url ?? null,
  });
});

// PUT /auth/profile
router.put(
  '/profile',
  requireAuth,
  [body('name').optional().trim().notEmpty(), body('avatar_url').optional().isURL()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, avatar_url } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (avatar_url !== undefined) update.avatar_url = avatar_url;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(update)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }
);

export default router;
