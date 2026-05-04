import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

const VALID_REASONS = ['offensive', 'wrong_info', 'spam', 'other'];
const VALID_STATUSES = ['pending', 'resolved', 'dismissed'];

// POST /reports — qualquer usuário autenticado pode denunciar
router.post(
  '/',
  requireAuth,
  [
    body('review_id').isUUID(),
    body('reason').isIn(VALID_REASONS),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { review_id, reason } = req.body;

    const { data: review } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', review_id)
      .maybeSingle();

    if (!review) return res.status(404).json({ error: 'Avaliação não encontrada.' });

    const { data, error } = await supabase
      .from('reports')
      .insert({ review_id, reported_by: req.user.id, reason })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }
);

// GET /reports — apenas admin
router.get('/', requireAdmin, async (req, res) => {
  const { status } = req.query;

  let q = supabase
    .from('reports')
    .select('id, reason, status, created_at, review_id, reported_by')
    .order('created_at', { ascending: false });

  if (status) q = q.eq('status', status);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// PATCH /reports/:id — admin atualiza status
router.patch(
  '/:id',
  requireAdmin,
  [body('status').isIn(VALID_STATUSES)],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { data, error } = await supabase
      .from('reports')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Denúncia não encontrada.' });
    return res.json(data);
  }
);

export default router;
