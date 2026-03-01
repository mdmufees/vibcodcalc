export function compoundInterest(principal: number, rate: number, time: number, n: number): number {
  // rate as decimal (e.g., 0.05 for 5%)
  return principal * Math.pow(1 + rate / n, n * time)
}

export function loanPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months
  const r = annualRate / 12
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export function loanTotal(principal: number, annualRate: number, months: number): number {
  return loanPayment(principal, annualRate, months) * months
}

export function loanInterest(principal: number, annualRate: number, months: number): number {
  return loanTotal(principal, annualRate, months) - principal
}

export function roi(gain: number, cost: number): number {
  if (cost === 0) throw new Error('Cost cannot be zero')
  return ((gain - cost) / cost) * 100
}

export function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0)
}

export function irr(cashFlows: number[], guess = 0.1, maxIter = 100, tolerance = 1e-7): number {
  let rate = guess
  for (let i = 0; i < maxIter; i++) {
    let f = 0
    let df = 0
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t)
      f += cashFlows[t] / denom
      if (t > 0) df -= t * cashFlows[t] / Math.pow(1 + rate, t + 1)
    }
    if (Math.abs(f) < tolerance) return rate
    if (df === 0) throw new Error('IRR calculation failed')
    rate = rate - f / df
  }
  throw new Error('IRR did not converge')
}

export function tipCalculator(billAmount: number, tipPercent: number, people: number): { tip: number; total: number; perPerson: number } {
  const tip = billAmount * (tipPercent / 100)
  const total = billAmount + tip
  return {
    tip,
    total,
    perPerson: people > 0 ? total / people : total
  }
}
