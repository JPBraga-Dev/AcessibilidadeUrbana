import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /ranking?region=NomeRegiao — ranking_by_region
router.get('/', requireAuth, async (req, res) => {
  const { region } = req.query;

  let q = supabase
    .from('ranking_by_region')
    .select('place_id, place_name, category, address, avg_rating, region_name, rank')
    .order('rank', { ascending: true });

  if (region) q = q.eq('region_name', region);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// GET /ranking/stats — stats_by_region
router.get('/stats', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('stats_by_region')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// GET /ranking/regioes — lista nomes únicos de regiões
router.get('/regioes', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('regions')
    .select('id, name')
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

export default router;
