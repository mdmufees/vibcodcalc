export interface GraphFunction {
  id: string
  expression: string
  color: string
  visible: boolean
}

export interface Viewport {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export interface TracePoint {
  x: number
  y: number
  functionId: string
}
