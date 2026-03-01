import type { Matrix } from '@/types/matrix'

export function createMatrix(rows: number, cols: number, fill = 0): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(fill))
}

export function add(a: Matrix, b: Matrix): Matrix {
  if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('Matrix dimensions must match')
  return a.map((row, i) => row.map((v, j) => v + b[i][j]))
}

export function subtract(a: Matrix, b: Matrix): Matrix {
  if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('Matrix dimensions must match')
  return a.map((row, i) => row.map((v, j) => v - b[i][j]))
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  if (a[0].length !== b.length) throw new Error('Invalid dimensions for multiplication')
  const rows = a.length
  const cols = b[0].length
  const k = b.length
  const result = createMatrix(rows, cols)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0
      for (let p = 0; p < k; p++) {
        sum += a[i][p] * b[p][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

export function transpose(m: Matrix): Matrix {
  const rows = m.length
  const cols = m[0].length
  return Array.from({ length: cols }, (_, j) => Array.from({ length: rows }, (_, i) => m[i][j]))
}

export function determinant(m: Matrix): number {
  const n = m.length
  if (n !== m[0].length) throw new Error('Matrix must be square')
  if (n === 1) return m[0][0]
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]

  let det = 0
  for (let j = 0; j < n; j++) {
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinant(minor(m, 0, j))
  }
  return det
}

function minor(m: Matrix, row: number, col: number): Matrix {
  return m
    .filter((_, i) => i !== row)
    .map((r) => r.filter((_, j) => j !== col))
}

export function inverse(m: Matrix): Matrix {
  const n = m.length
  if (n !== m[0].length) throw new Error('Matrix must be square')
  const det = determinant(m)
  if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular (no inverse)')

  // Cofactor matrix
  const cofactors = createMatrix(n, n)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cofactors[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor(m, i, j))
    }
  }

  // Adjugate (transpose of cofactors) / det
  const adj = transpose(cofactors)
  return adj.map((row) => row.map((v) => v / det))
}

export function scalarMultiply(m: Matrix, s: number): Matrix {
  return m.map((row) => row.map((v) => v * s))
}

export function formatMatrix(m: Matrix): string {
  return m.map((row) => row.map((v) => v.toFixed(4).replace(/\.?0+$/, '')).join('\t')).join('\n')
}
