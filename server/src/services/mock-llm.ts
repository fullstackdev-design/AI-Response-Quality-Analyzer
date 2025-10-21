import { v4 as uuidv4 } from 'uuid'
import { computeMetrics } from './metrics'
export type GenParams = { temperature: number; top_p: number }
function mockGenerate(prompt: string, params: GenParams){
  const base = prompt.trim() || 'concept'
  const len = Math.max(60, Math.min(600, Math.floor(80 + params.temperature*250)))
  const repeat = Math.max(1, Math.floor(1 + params.temperature*3))
  const filler = base.split(' ').slice(0,12).join(' ')
  const text = (`${filler} — ` + 'This is a mock LLM response generated for analysis. ').repeat(repeat).slice(0,len)
  return text
}
export async function generateExperiment(opts:{prompt:string, temps:number[], topps:number[], n:number}){
  const { prompt, temps, topps, n } = opts
  const combos: GenParams[] = []
  for (const t of temps) for (const p of topps) combos.push({ temperature: t, top_p: p })
  const results:any[] = []
  for (const params of combos){
    for (let j=0;j<n;j++){
      const text = mockGenerate(prompt, params)
      const metrics = computeMetrics(prompt, text)
      results.push({ id: uuidv4(), params, text, metrics })
    }
  }
  return { id: uuidv4(), prompt, results, createdAt: new Date().toISOString() }
}
