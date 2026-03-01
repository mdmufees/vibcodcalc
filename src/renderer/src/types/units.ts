export interface UnitCategory {
  name: string
  units: Unit[]
}

export interface Unit {
  id: string
  name: string
  symbol: string
  toBase: (v: number) => number
  fromBase: (v: number) => number
}
