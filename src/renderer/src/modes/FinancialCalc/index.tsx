import { useState } from 'react'
import * as fin from '@/engine/financial'

type FinTab = 'compound' | 'loan' | 'tip'

export default function FinancialCalc() {
  const [tab, setTab] = useState<FinTab>('compound')

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        {(['compound', 'loan', 'tip'] as FinTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
          >
            {t === 'compound' ? 'Interest' : t === 'loan' ? 'Loan' : 'Tip'}
          </button>
        ))}
      </div>
      {tab === 'compound' && <CompoundInterest />}
      {tab === 'loan' && <LoanCalc />}
      {tab === 'tip' && <TipCalc />}
    </div>
  )
}

function CompoundInterest() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('10')
  const [frequency, setFrequency] = useState('12')

  const p = parseFloat(principal) || 0
  const r = (parseFloat(rate) || 0) / 100
  const t = parseFloat(years) || 0
  const n = parseFloat(frequency) || 1

  const result = fin.compoundInterest(p, r, t, n)
  const interest = result - p

  return (
    <div style={styles.form}>
      <FormField label="Principal" value={principal} onChange={setPrincipal} prefix="$" />
      <FormField label="Annual Rate (%)" value={rate} onChange={setRate} suffix="%" />
      <FormField label="Years" value={years} onChange={setYears} />
      <FormField label="Compounds/Year" value={frequency} onChange={setFrequency} />
      <div style={styles.results} className="glass-panel">
        <ResultRow label="Final Amount" value={`$${result.toFixed(2)}`} />
        <ResultRow label="Interest Earned" value={`$${interest.toFixed(2)}`} />
      </div>
    </div>
  )
}

function LoanCalc() {
  const [principal, setPrincipal] = useState('250000')
  const [rate, setRate] = useState('6.5')
  const [years, setYears] = useState('30')

  const p = parseFloat(principal) || 0
  const r = (parseFloat(rate) || 0) / 100
  const months = (parseFloat(years) || 0) * 12

  const payment = months > 0 ? fin.loanPayment(p, r, months) : 0
  const total = payment * months
  const interest = total - p

  return (
    <div style={styles.form}>
      <FormField label="Loan Amount" value={principal} onChange={setPrincipal} prefix="$" />
      <FormField label="Annual Rate (%)" value={rate} onChange={setRate} suffix="%" />
      <FormField label="Term (Years)" value={years} onChange={setYears} />
      <div style={styles.results} className="glass-panel">
        <ResultRow label="Monthly Payment" value={`$${payment.toFixed(2)}`} />
        <ResultRow label="Total Paid" value={`$${total.toFixed(2)}`} />
        <ResultRow label="Total Interest" value={`$${interest.toFixed(2)}`} />
      </div>
    </div>
  )
}

function TipCalc() {
  const [bill, setBill] = useState('50')
  const [tipPercent, setTipPercent] = useState('18')
  const [people, setPeople] = useState('1')

  const b = parseFloat(bill) || 0
  const tp = parseFloat(tipPercent) || 0
  const p = parseInt(people) || 1

  const result = fin.tipCalculator(b, tp, p)

  return (
    <div style={styles.form}>
      <FormField label="Bill Amount" value={bill} onChange={setBill} prefix="$" />
      <FormField label="Tip (%)" value={tipPercent} onChange={setTipPercent} suffix="%" />
      <FormField label="Split Between" value={people} onChange={setPeople} suffix="people" />
      <div style={styles.results} className="glass-panel">
        <ResultRow label="Tip" value={`$${result.tip.toFixed(2)}`} />
        <ResultRow label="Total" value={`$${result.total.toFixed(2)}`} />
        <ResultRow label="Per Person" value={`$${result.perPerson.toFixed(2)}`} />
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, prefix, suffix }: {
  label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        {prefix && <span style={styles.affix}>{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
        {suffix && <span style={styles.affix}>{suffix}</span>}
      </div>
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.resultRow}>
      <span style={styles.resultLabel}>{label}</span>
      <span style={styles.resultValue} className="neon-text">{value}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', flex: 1, gap: 8 },
  tabs: { display: 'flex', gap: 4 },
  tab: {
    flex: 1, padding: '8px 0', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)',
    color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'var(--font-display)'
  },
  tabActive: {
    background: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)',
    borderColor: 'rgba(var(--accent-rgb), 0.4)'
  },
  form: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--glass-border)', background: 'var(--btn-bg)'
  },
  input: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--text-primary)', fontSize: 16, fontFamily: 'var(--font-display)',
    fontWeight: 600, textAlign: 'right'
  },
  affix: { fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 },
  results: { padding: 12, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 13, color: 'var(--text-secondary)' },
  resultValue: { fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700 }
}
