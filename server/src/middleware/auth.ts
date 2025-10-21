import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export interface AuthRequest extends Request { userId?: number }
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'no token' })
  try {
    const payload:any = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'secret')
    req.userId = payload.sub
    next()
  } catch { return res.status(401).json({ error: 'invalid token' }) }
}
