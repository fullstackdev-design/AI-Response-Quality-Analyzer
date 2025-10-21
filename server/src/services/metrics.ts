export function computeMetrics(prompt: string, text: string) {
  const coherence = computeCoherence(text)
  const relevance = computeRelevance(prompt, text)
  const lengthScore = computeLengthScore(prompt, text)
  const qualityScore = Math.max(0, Math.min(1, 0.45*coherence + 0.4*relevance + 0.15*lengthScore))
  return { coherence, relevance, lengthScore, qualityScore }
}
function sentencesOf(s: string){ return s.split(/[\.\!\?]+/).map(x=>x.trim()).filter(Boolean) }
function computeCoherence(text: string){ const s = sentencesOf(text); if (!s.length) return 0; const lens = s.map(x=>x.split(/\s+/).filter(Boolean).length); const avg = lens.reduce((a,b)=>a+b,0)/lens.length; const vari = lens.reduce((a,b)=>a+Math.pow(b-avg,2),0)/lens.length; const repeats = (text.match(/This is a mock LLM response/g) || []).length; const repPenalty = Math.min(1, repeats / Math.max(1, s.length)); const score = Math.max(0, Math.min(1, (1 - Math.tanh(vari/10)) * (1 - repPenalty*0.5))); return Number(score.toFixed(3)) }
function computeRelevance(prompt: string, text: string){ const kws = prompt.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); if (!kws.length) return 0; const txt = text.toLowerCase(); let hits = 0; for (const k of Array.from(new Set(kws)).slice(0,20)){ if (k.length<3) continue; if (txt.includes(k)) hits++ } return Number((hits / Math.min(20,kws.length)).toFixed(3)) }
function computeLengthScore(prompt: string, text: string){ const complexity = Math.min(1, prompt.split(/\s+/).filter(Boolean).length / 30); const ideal = 120 + complexity*250; const len = text.length, diff = Math.abs(len-ideal); return Number((Math.max(0, 1 - Math.tanh(diff/ideal))).toFixed(3)) }
