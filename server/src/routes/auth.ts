import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { pool } from '../db'
dotenv.config()
export const authRouter = express.Router()
authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email+password required' })
  try {
    const hash = bcrypt.hashSync(password, 8)
    const r = await pool.query('INSERT INTO users(email,password_hash) VALUES($1,$2) RETURNING id,email,created_at', [email, hash])
    res.json({ ok: true, user: r.rows[0] })
  } catch (e:any) { res.status(400).json({ error: e.message }) }
})
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email+password required' })
  const r = await pool.query('SELECT id,email,password_hash FROM users WHERE email=$1', [email])
  if (r.rowCount===0) return res.status(401).json({ error: 'invalid credentials' })
  const u = r.rows[0]
  if (!bcrypt.compareSync(password, u.password_hash)) return res.status(401).json({ error: 'invalid credentials' })
  const token = jwt.sign({ sub: u.id, email: u.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
  res.json({ ok:true, token })
})
