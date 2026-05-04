import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /favorites — favoritos do usuário autenticado
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id, created_at, places ( id, name, category, address, avg_rating )')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST /favorites — adicionar favorito
router.post(
  '/',
  requireAuth,
  [body('place_id').isUUID()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { place_id } = req.body;

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: req.user.id, place_id })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Local já está nos favoritos.' });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }
);

// DELETE /favorites/:placeId — remover favorito
router.delete('/:placeId', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', req.user.id)
    .eq('place_id', req.params.placeId);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
});

export default router;
