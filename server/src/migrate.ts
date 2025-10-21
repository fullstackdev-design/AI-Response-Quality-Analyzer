import { pool } from './db'
export async function migrateIfNeeded() {
  const c = await pool.connect()
  try {
    await c.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`)
    await c.query(`CREATE TABLE IF NOT EXISTS experiments (
      id TEXT PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      prompt TEXT,
      results JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`)
    console.log('[db] migrations ensured')
  } finally { c.release() }
}
if (require.main === module) migrateIfNeeded().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})
