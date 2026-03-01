export const PI = Math.PI
export const E = Math.E

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI
}

export function sin(x: number, isDeg: boolean): number {
  const v = isDeg ? toRadians(x) : x
  const result = Math.sin(v)
  return Math.abs(result) < 1e-14 ? 0 : result
}

export function cos(x: number, isDeg: boolean): number {
  const v = isDeg ? toRadians(x) : x
  const result = Math.cos(v)
  return Math.abs(result) < 1e-14 ? 0 : result
}

export function tan(x: number, isDeg: boolean): number {
  const c = cos(x, isDeg)
  if (Math.abs(c) < 1e-14) throw new Error('Undefined (tan at 90°)')
  return sin(x, isDeg) / c
}

export function asin(x: number, isDeg: boolean): number {
  if (x < -1 || x > 1) throw new Error('Domain error (asin)')
  const result = Math.asin(x)
  return isDeg ? toDegrees(result) : result
}

export function acos(x: number, isDeg: boolean): number {
  if (x < -1 || x > 1) throw new Error('Domain error (acos)')
  const result = Math.acos(x)
  return isDeg ? toDegrees(result) : result
}

export function atan(x: number, isDeg: boolean): number {
  const result = Math.atan(x)
  return isDeg ? toDegrees(result) : result
}

export function log10(x: number): number {
  if (x <= 0) throw new Error('Domain error (log)')
  return Math.log10(x)
}

export function ln(x: number): number {
  if (x <= 0) throw new Error('Domain error (ln)')
  return Math.log(x)
}

export function exp(x: number): number {
  return Math.exp(x)
}

export function pow(base: number, exponent: number): number {
  return Math.pow(base, exponent)
}

export function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial of negative number')
  if (n !== Math.floor(n)) throw new Error('Factorial requires integer')
  if (n > 170) return Infinity
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

export function abs(x: number): number {
  return Math.abs(x)
}

export function ceil(x: number): number {
  return Math.ceil(x)
}

export function floor(x: number): number {
  return Math.floor(x)
}

export function round(x: number): number {
  return Math.round(x)
}
