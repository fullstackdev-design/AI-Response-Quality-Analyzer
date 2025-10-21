import express from 'express'
import { pool } from '../db'
import { requireAuth, AuthRequest } from '../middleware/auth'
export const experimentsRouter = express.Router()
experimentsRouter.get('/', requireAuth, async (req: AuthRequest, res) => {
  const r = await pool.query('SELECT id,prompt,results,created_at FROM experiments WHERE user_id=$1 ORDER BY created_at', [req.userId])
  res.json(r.rows)
})
experimentsRouter.get('/export/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id
  const r = await pool.query('SELECT results FROM experiments WHERE id=$1 AND user_id=$2', [id, req.userId])
  if (r.rowCount===0) return res.status(404).json({ error: 'not found' })
  res.json(r.rows[0].results)
})
