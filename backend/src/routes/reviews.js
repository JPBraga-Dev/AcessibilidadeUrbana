import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /reviews — cria avaliação + checklist em uma transação lógica
router.post(
  '/',
  requireAuth,
  [
    body('place_id').isUUID(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim(),
    body('ramp').optional().isBoolean(),
    body('sidewalk').optional().isBoolean(),
    body('sound_signaling').optional().isBoolean(),
    body('tactile_floor').optional().isBoolean(),
    body('disabled_parking').optional().isBoolean(),
    body('elevator').optional().isBoolean(),
    body('accessible_bathroom').optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      place_id, rating, comment,
      ramp = false, sidewalk = false, sound_signaling = false,
      tactile_floor = false, disabled_parking = false,
      elevator = false, accessible_bathroom = false,
    } = req.body;

    // Verifica se o local existe
    const { data: place } = await supabase
      .from('places')
      .select('id')
      .eq('id', place_id)
      .maybeSingle();

    if (!place) return res.status(404).json({ error: 'Local não encontrado.' });

    // Insere a review (UNIQUE place_id + user_id)
    const { data: review, error: revErr } = await supabase
      .from('reviews')
      .insert({ place_id, user_id: req.user.id, rating, comment: comment ?? null })
      .select()
      .single();

    if (revErr) {
      if (revErr.code === '23505') {
        return res.status(409).json({ error: 'Você já avaliou este local.' });
      }
      return res.status(500).json({ error: revErr.message });
    }

    // Insere o checklist vinculado
    const { error: checkErr } = await supabase
      .from('accessibility_checklist')
      .insert({
        review_id: review.id,
        ramp, sidewalk, sound_signaling,
        tactile_floor, disabled_parking,
        elevator, accessible_bathroom,
      });

    if (checkErr) {
      console.error('Erro ao criar checklist:', checkErr.message);
    }

    return res.status(201).json(review);
  }
);

// DELETE /reviews/:id — autor pode remover sua própria avaliação
router.delete('/:id', requireAuth, async (req, res) => {
  const { data: review } = await supabase
    .from('reviews')
    .select('user_id')
    .eq('id', req.params.id)
    .maybeSingle();

  if (!review) return res.status(404).json({ error: 'Avaliação não encontrada.' });
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Sem permissão para excluir esta avaliação.' });
  }

  const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
});

export default router;
