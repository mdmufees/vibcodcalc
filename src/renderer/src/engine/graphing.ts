import { compileFunction } from './parser'

export interface PlotPoint {
  x: number
  y: number
}

export function sampleFunction(
  expression: string,
  xMin: number,
  xMax: number,
  numSamples = 500
): PlotPoint[] {
  const fn = compileFunction(expression)
  const points: PlotPoint[] = []
  const step = (xMax - xMin) / numSamples

  for (let i = 0; i <= numSamples; i++) {
    const x = xMin + i * step
    try {
      const y = fn(x)
      if (isFinite(y)) {
        points.push({ x, y })
      } else {
        points.push({ x, y: NaN })
      }
    } catch {
      points.push({ x, y: NaN })
    }
  }

  return points
}

export function evaluateAt(expression: string, x: number): number | null {
  try {
    const fn = compileFunction(expression)
    const y = fn(x)
    return isFinite(y) ? y : null
  } catch {
    return null
  }
}
