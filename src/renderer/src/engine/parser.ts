import * as sci from './scientific'
import { fixFloat } from './arithmetic'

export interface ParserOptions {
  isDeg?: boolean
  variables?: Record<string, number>
}

class Parser {
  private pos = 0
  private expr: string
  private opts: ParserOptions

  constructor(expression: string, opts: ParserOptions = {}) {
    this.expr = expression.replace(/\s+/g, '')
    this.opts = { isDeg: true, ...opts }
  }

  parse(): number {
    const result = this.parseExpression()
    if (this.pos < this.expr.length) {
      throw new Error(`Unexpected character: ${this.expr[this.pos]}`)
    }
    return result
  }

  private parseExpression(): number {
    let left = this.parseTerm()
    while (this.pos < this.expr.length) {
      const ch = this.expr[this.pos]
      if (ch === '+') {
        this.pos++
        left = fixFloat(left + this.parseTerm())
      } else if (ch === '-') {
        this.pos++
        left = fixFloat(left - this.parseTerm())
      } else {
        break
      }
    }
    return left
  }

  private parseTerm(): number {
    let left = this.parsePower()
    while (this.pos < this.expr.length) {
      const ch = this.expr[this.pos]
      if (ch === '*' || ch === '×') {
        this.pos++
        left = fixFloat(left * this.parsePower())
      } else if (ch === '/' || ch === '÷') {
        this.pos++
        const right = this.parsePower()
        if (right === 0) throw new Error('Division by zero')
        left = fixFloat(left / right)
      } else if (ch === '%') {
        this.pos++
        const right = this.parsePower()
        if (right === 0) throw new Error('Division by zero')
        left = fixFloat(left % right)
      } else {
        break
      }
    }
    return left
  }

  private parsePower(): number {
    let base = this.parseUnary()
    while (this.pos < this.expr.length && this.expr[this.pos] === '^') {
      this.pos++
      const exp = this.parseUnary()
      base = Math.pow(base, exp)
    }
    return base
  }

  private parseUnary(): number {
    if (this.expr[this.pos] === '-') {
      this.pos++
      return -this.parsePostfix()
    }
    if (this.expr[this.pos] === '+') {
      this.pos++
    }
    return this.parsePostfix()
  }

  private parsePostfix(): number {
    let value = this.parsePrimary()
    while (this.pos < this.expr.length && this.expr[this.pos] === '!') {
      this.pos++
      value = sci.factorial(value)
    }
    return value
  }

  private parsePrimary(): number {
    // Parentheses
    if (this.expr[this.pos] === '(') {
      this.pos++
      const value = this.parseExpression()
      if (this.expr[this.pos] !== ')') throw new Error('Missing closing parenthesis')
      this.pos++
      return value
    }

    // Named functions
    const funcMatch = this.expr.slice(this.pos).match(/^([a-zA-Z_]\w*)/)
    if (funcMatch) {
      const name = funcMatch[1].toLowerCase()

      // Constants
      if (name === 'pi' || name === 'π') {
        this.pos += funcMatch[1].length
        return sci.PI
      }
      if (name === 'e' && this.expr[this.pos + 1] !== '(') {
        // only match 'e' as constant if not followed by '('
        if (this.pos + 1 >= this.expr.length || !/[a-zA-Z(]/.test(this.expr[this.pos + 1])) {
          this.pos += 1
          return sci.E
        }
      }

      // Variables
      if (this.opts.variables && name in this.opts.variables) {
        this.pos += funcMatch[1].length
        return this.opts.variables[name]
      }

      // Functions requiring arguments
      this.pos += funcMatch[1].length
      if (this.expr[this.pos] !== '(') {
        // Check if it's a known variable or constant
        if (name === 'e') return sci.E
        throw new Error(`Unknown identifier: ${name}`)
      }
      this.pos++ // skip (
      const arg = this.parseExpression()
      if (this.expr[this.pos] !== ')') throw new Error('Missing closing parenthesis')
      this.pos++ // skip )

      return this.callFunction(name, arg)
    }

    // Number
    return this.parseNumber()
  }

  private callFunction(name: string, arg: number): number {
    const isDeg = this.opts.isDeg!
    switch (name) {
      case 'sin': return sci.sin(arg, isDeg)
      case 'cos': return sci.cos(arg, isDeg)
      case 'tan': return sci.tan(arg, isDeg)
      case 'asin': return sci.asin(arg, isDeg)
      case 'acos': return sci.acos(arg, isDeg)
      case 'atan': return sci.atan(arg, isDeg)
      case 'log': return sci.log10(arg)
      case 'ln': return sci.ln(arg)
      case 'exp': return sci.exp(arg)
      case 'sqrt': case '√': return Math.sqrt(arg)
      case 'abs': return sci.abs(arg)
      case 'ceil': return sci.ceil(arg)
      case 'floor': return sci.floor(arg)
      case 'round': return sci.round(arg)
      default: throw new Error(`Unknown function: ${name}`)
    }
  }

  private parseNumber(): number {
    const start = this.pos
    // Handle negative numbers already handled in parseUnary
    while (this.pos < this.expr.length && /[\d.]/.test(this.expr[this.pos])) {
      this.pos++
    }
    // Scientific notation
    if (this.pos < this.expr.length && this.expr[this.pos] === 'e' && this.pos > start) {
      this.pos++
      if (this.expr[this.pos] === '+' || this.expr[this.pos] === '-') {
        this.pos++
      }
      while (this.pos < this.expr.length && /\d/.test(this.expr[this.pos])) {
        this.pos++
      }
    }
    if (this.pos === start) {
      throw new Error(`Unexpected character at position ${this.pos}: "${this.expr[this.pos] || 'end'}"`)
    }
    return parseFloat(this.expr.slice(start, this.pos))
  }
}

export function evaluate(expression: string, opts?: ParserOptions): number {
  if (!expression.trim()) throw new Error('Empty expression')
  const parser = new Parser(expression, opts)
  return parser.parse()
}

export function compileFunction(expression: string, variable = 'x'): (x: number) => number {
  return (x: number) => {
    const parser = new Parser(expression, {
      isDeg: false,
      variables: { [variable]: x }
    })
    return parser.parse()
  }
}
