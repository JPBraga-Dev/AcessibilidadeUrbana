import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /stats — estatísticas por região (view stats_by_region)
router.get('/', requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from('stats_by_region').select('*');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// GET /ranking — ranking de locais por região (view ranking_by_region)
// Query param: region_name (opcional)
router.get('/ranking', requireAuth, async (req, res) => {
  const { region_name } = req.query;

  let q = supabase
    .from('ranking_by_region')
    .select('*')
    .order('rank', { ascending: true });

  if (region_name) q = q.eq('region_name', region_name);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

export default router;
