export type NumBase = 'HEX' | 'DEC' | 'OCT' | 'BIN'
export type WordSize = 'BYTE' | 'WORD' | 'DWORD' | 'QWORD'

const WORD_SIZES: Record<WordSize, number> = {
  BYTE: 8,
  WORD: 16,
  DWORD: 32,
  QWORD: 64
}

export function getMask(size: WordSize): bigint {
  return (1n << BigInt(WORD_SIZES[size])) - 1n
}

export function getBitCount(size: WordSize): number {
  return WORD_SIZES[size]
}

export function clampToSize(value: bigint, size: WordSize): bigint {
  return value & getMask(size)
}

export function toBase(value: bigint, base: NumBase, size: WordSize): string {
  const clamped = clampToSize(value, size)
  switch (base) {
    case 'HEX': return clamped.toString(16).toUpperCase()
    case 'DEC': return clamped.toString(10)
    case 'OCT': return clamped.toString(8)
    case 'BIN': return clamped.toString(2)
  }
}

export function fromBase(str: string, base: NumBase): bigint {
  const clean = str.replace(/\s/g, '')
  switch (base) {
    case 'HEX': return BigInt('0x' + (clean || '0'))
    case 'DEC': return BigInt(clean || '0')
    case 'OCT': return BigInt('0o' + (clean || '0'))
    case 'BIN': return BigInt('0b' + (clean || '0'))
  }
}

export function bitwiseAnd(a: bigint, b: bigint, size: WordSize): bigint {
  return clampToSize(a & b, size)
}

export function bitwiseOr(a: bigint, b: bigint, size: WordSize): bigint {
  return clampToSize(a | b, size)
}

export function bitwiseXor(a: bigint, b: bigint, size: WordSize): bigint {
  return clampToSize(a ^ b, size)
}

export function bitwiseNot(a: bigint, size: WordSize): bigint {
  return clampToSize(~a, size)
}

export function leftShift(a: bigint, n: bigint, size: WordSize): bigint {
  return clampToSize(a << n, size)
}

export function rightShift(a: bigint, n: bigint, size: WordSize): bigint {
  return clampToSize(a >> n, size)
}

export function getBits(value: bigint, size: WordSize): boolean[] {
  const bits = getBitCount(size)
  const result: boolean[] = []
  const clamped = clampToSize(value, size)
  for (let i = bits - 1; i >= 0; i--) {
    result.push(((clamped >> BigInt(i)) & 1n) === 1n)
  }
  return result
}

export function toggleBit(value: bigint, bitIndex: number, size: WordSize): bigint {
  return clampToSize(value ^ (1n << BigInt(bitIndex)), size)
}
