import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

const VALID_CATEGORIES = ['bug', 'question', 'other'];
const VALID_STATUSES = ['open', 'in_progress', 'closed'];

// GET /support/tickets — usuário vê os seus; admin vê todos
router.get('/tickets', requireAuth, async (req, res) => {
  const { status } = req.query;

  let q = supabase
    .from('support_tickets')
    .select('id, subject, category, status, created_at, updated_at, user_id')
    .order('created_at', { ascending: false });

  if (req.user.role !== 'admin') {
    q = q.eq('user_id', req.user.id);
  }

  if (status) q = q.eq('status', status);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST /support/tickets — abrir ticket
router.post(
  '/tickets',
  requireAuth,
  [
    body('subject').trim().notEmpty(),
    body('category').isIn(VALID_CATEGORIES),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { subject, category } = req.body;

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ user_id: req.user.id, subject, category })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }
);

// PATCH /support/tickets/:id — admin atualiza status
router.patch(
  '/tickets/:id',
  requireAdmin,
  [body('status').isIn(VALID_STATUSES)],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Ticket não encontrado.' });
    return res.json(data);
  }
);

// Helpers para verificar acesso ao ticket
async function canAccessTicket(ticketId, userId, role) {
  const { data } = await supabase
    .from('support_tickets')
    .select('user_id')
    .eq('id', ticketId)
    .maybeSingle();

  if (!data) return { ticket: null, allowed: false };
  return { ticket: data, allowed: role === 'admin' || data.user_id === userId };
}

// GET /support/tickets/:id/messages
router.get('/tickets/:id/messages', requireAuth, async (req, res) => {
  const { ticket, allowed } = await canAccessTicket(req.params.id, req.user.id, req.user.role);
  if (!ticket) return res.status(404).json({ error: 'Ticket não encontrado.' });
  if (!allowed) return res.status(403).json({ error: 'Sem permissão.' });

  const { data, error } = await supabase
    .from('support_messages')
    .select('id, message, created_at, sender_id, profiles ( name, avatar_url )')
    .eq('ticket_id', req.params.id)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST /support/tickets/:id/messages
router.post(
  '/tickets/:id/messages',
  requireAuth,
  [body('message').trim().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { ticket, allowed } = await canAccessTicket(req.params.id, req.user.id, req.user.role);
    if (!ticket) return res.status(404).json({ error: 'Ticket não encontrado.' });
    if (!allowed) return res.status(403).json({ error: 'Sem permissão.' });

    const { data, error } = await supabase
      .from('support_messages')
      .insert({ ticket_id: req.params.id, sender_id: req.user.id, message: req.body.message })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }
);

export default router;
