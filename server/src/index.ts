import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { migrateIfNeeded } from './migrate'
import { authRouter } from './routes/auth'
import { genRouter } from './routes/generate'
import { experimentsRouter } from './routes/experiments'

dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/health', (_, res) => res.json({ ok:true }))
app.use('/auth', authRouter)
app.use('/generate', genRouter)
app.use('/api/experiments', experimentsRouter)

const port = process.env.PORT || 4000
migrateIfNeeded().then(()=> {
  app.listen(port, () => console.log(`[server] listening on ${port}`))
}).catch(err=>{
  console.error('[server] migration error', err)
  process.exit(1)
})
