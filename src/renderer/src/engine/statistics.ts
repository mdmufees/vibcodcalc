export function mean(data: number[]): number {
  if (data.length === 0) throw new Error('Empty dataset')
  return data.reduce((s, v) => s + v, 0) / data.length
}

export function median(data: number[]): number {
  if (data.length === 0) throw new Error('Empty dataset')
  const sorted = [...data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

export function mode(data: number[]): number[] {
  if (data.length === 0) throw new Error('Empty dataset')
  const freq = new Map<number, number>()
  let maxFreq = 0
  for (const v of data) {
    const f = (freq.get(v) || 0) + 1
    freq.set(v, f)
    if (f > maxFreq) maxFreq = f
  }
  if (maxFreq === 1) return [] // no mode
  return [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v)
}

export function variance(data: number[], population = true): number {
  if (data.length === 0) throw new Error('Empty dataset')
  const m = mean(data)
  const sumSq = data.reduce((s, v) => s + (v - m) ** 2, 0)
  return sumSq / (population ? data.length : Math.max(data.length - 1, 1))
}

export function stddev(data: number[], population = true): number {
  return Math.sqrt(variance(data, population))
}

export function min(data: number[]): number {
  return Math.min(...data)
}

export function max(data: number[]): number {
  return Math.max(...data)
}

export function sum(data: number[]): number {
  return data.reduce((s, v) => s + v, 0)
}

export function count(data: number[]): number {
  return data.length
}

export function quartiles(data: number[]): { q1: number; q2: number; q3: number } {
  const sorted = [...data].sort((a, b) => a - b)
  const q2 = median(sorted)
  const mid = Math.floor(sorted.length / 2)
  const lower = sorted.slice(0, mid)
  const upper = sorted.length % 2 === 0 ? sorted.slice(mid) : sorted.slice(mid + 1)
  return {
    q1: lower.length > 0 ? median(lower) : q2,
    q2,
    q3: upper.length > 0 ? median(upper) : q2
  }
}

export function linearRegression(data: number[]): { slope: number; intercept: number; r2: number } {
  const n = data.length
  if (n < 2) throw new Error('Need at least 2 data points')
  // x values are indices 0..n-1
  const xs = data.map((_, i) => i)
  const ys = data
  const xMean = mean(xs)
  const yMean = mean(ys)
  let ssXY = 0, ssXX = 0, ssYY = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - xMean
    const dy = ys[i] - yMean
    ssXY += dx * dy
    ssXX += dx * dx
    ssYY += dy * dy
  }
  const slope = ssXX === 0 ? 0 : ssXY / ssXX
  const intercept = yMean - slope * xMean
  const r2 = ssXX === 0 || ssYY === 0 ? 0 : (ssXY * ssXY) / (ssXX * ssYY)
  return { slope, intercept, r2 }
}

export function histogram(data: number[], bins = 10): { edges: number[]; counts: number[] } {
  const lo = min(data)
  const hi = max(data)
  const range = hi - lo || 1
  const binWidth = range / bins
  const edges: number[] = []
  const counts = new Array(bins).fill(0)
  for (let i = 0; i <= bins; i++) edges.push(lo + i * binWidth)
  for (const v of data) {
    let idx = Math.floor((v - lo) / binWidth)
    if (idx >= bins) idx = bins - 1
    counts[idx]++
  }
  return { edges, counts }
}
