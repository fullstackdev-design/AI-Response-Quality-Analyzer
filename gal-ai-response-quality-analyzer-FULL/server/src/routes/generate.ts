import express from 'express'
import { pool } from '../db'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { generateExperiment } from '../services/mock-llm'
export const genRouter = express.Router()
genRouter.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { prompt, temps = [0.6], topps = [0.9], n = 3 } = req.body
  if (!prompt) return res.status(400).json({ error: 'prompt required' })
  const experiment = await generateExperiment({ prompt, temps, topps, n })
  await pool.query('INSERT INTO experiments(id,user_id,prompt,results) VALUES($1,$2,$3,$4)', [
    experiment.id, req.userId, experiment.prompt, JSON.stringify(experiment.results)
  ])
  res.json({ ok:true, id: experiment.id })
})
