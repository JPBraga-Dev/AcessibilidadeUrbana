import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /regions
router.get('/', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('regions')
    .select('id, name, created_at')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST /regions — apenas admin
router.post(
  '/',
  requireAdmin,
  [body('name').trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { data, error } = await supabase
      .from('regions')
      .insert({ name: req.body.name })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Região já existe.' });
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }
);

export default router;
