import { create } from 'zustand'
import type { Matrix, MatrixOp } from '@/types/matrix'
import * as mat from '@/engine/matrix'

interface MatrixState {
  size: number
  matrixA: Matrix
  matrixB: Matrix
  result: Matrix | null
  resultScalar: number | null
  operation: MatrixOp
  error: string | null

  setSize: (size: number) => void
  setCellA: (row: number, col: number, value: number) => void
  setCellB: (row: number, col: number, value: number) => void
  setOperation: (op: MatrixOp) => void
  calculate: () => void
  clearAll: () => void
}

export const useMatrixStore = create<MatrixState>()((set, get) => ({
  size: 3,
  matrixA: mat.createMatrix(3, 3),
  matrixB: mat.createMatrix(3, 3),
  result: null,
  resultScalar: null,
  operation: 'add',
  error: null,

  setSize: (size) => set({
    size,
    matrixA: mat.createMatrix(size, size),
    matrixB: mat.createMatrix(size, size),
    result: null,
    resultScalar: null,
    error: null
  }),

  setCellA: (row, col, value) => set((s) => {
    const m = s.matrixA.map((r) => [...r])
    m[row][col] = value
    return { matrixA: m }
  }),

  setCellB: (row, col, value) => set((s) => {
    const m = s.matrixB.map((r) => [...r])
    m[row][col] = value
    return { matrixB: m }
  }),

  setOperation: (operation) => set({ operation, result: null, resultScalar: null, error: null }),

  calculate: () => {
    const { matrixA, matrixB, operation } = get()
    try {
      switch (operation) {
        case 'add':
          set({ result: mat.add(matrixA, matrixB), resultScalar: null, error: null })
          break
        case 'subtract':
          set({ result: mat.subtract(matrixA, matrixB), resultScalar: null, error: null })
          break
        case 'multiply':
          set({ result: mat.multiply(matrixA, matrixB), resultScalar: null, error: null })
          break
        case 'determinant':
          set({ resultScalar: mat.determinant(matrixA), result: null, error: null })
          break
        case 'inverse':
          set({ result: mat.inverse(matrixA), resultScalar: null, error: null })
          break
        case 'transpose':
          set({ result: mat.transpose(matrixA), resultScalar: null, error: null })
          break
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Error', result: null, resultScalar: null })
    }
  },

  clearAll: () => {
    const { size } = get()
    set({
      matrixA: mat.createMatrix(size, size),
      matrixB: mat.createMatrix(size, size),
      result: null,
      resultScalar: null,
      error: null
    })
  }
}))
