import { useState } from 'react'
import { asClick } from '../utils/handlers'
export default function Home(){
  const [count,setCount]=useState(0)
  async function doThing(){ setCount(c=>c+1) }
  return (
    <div style={{padding:20}}>
      <h1>AI Response Quality Analyzer (Frontend)</h1>
      <button onClick={asClick(()=>doThing())}>Click me</button>
      <div>Count: {count}</div>
    </div>
  )
}
