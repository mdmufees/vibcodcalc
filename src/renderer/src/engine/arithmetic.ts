const PRECISION = 1e-12

export function add(a: number, b: number): number {
  return fixFloat(a + b)
}

export function subtract(a: number, b: number): number {
  return fixFloat(a - b)
}

export function multiply(a: number, b: number): number {
  return fixFloat(a * b)
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero')
  return fixFloat(a / b)
}

export function modulo(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero')
  return fixFloat(a % b)
}

export function negate(a: number): number {
  return -a
}

export function percent(a: number): number {
  return a / 100
}

export function sqrt(a: number): number {
  if (a < 0) throw new Error('Square root of negative number')
  return Math.sqrt(a)
}

export function fixFloat(n: number): number {
  if (Math.abs(n) < PRECISION) return 0
  const rounded = parseFloat(n.toPrecision(14))
  return rounded
}

export function formatResult(n: number): string {
  if (!isFinite(n)) return n > 0 ? 'Infinity' : '-Infinity'
  if (isNaN(n)) return 'Error'
  const str = n.toPrecision(14)
  const parsed = parseFloat(str)
  if (Math.abs(parsed) >= 1e16 || (Math.abs(parsed) < 1e-7 && parsed !== 0)) {
    return parsed.toExponential(6)
  }
  const formatted = parsed.toString()
  if (formatted.length > 16) {
    return parseFloat(parsed.toPrecision(12)).toString()
  }
  return formatted
}
