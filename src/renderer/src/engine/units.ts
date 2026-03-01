import type { UnitCategory } from '@/types/units'

function linear(factor: number): { toBase: (v: number) => number; fromBase: (v: number) => number } {
  return { toBase: (v) => v * factor, fromBase: (v) => v / factor }
}

export const CATEGORIES: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { id: 'meter', name: 'Meter', symbol: 'm', ...linear(1) },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km', ...linear(1000) },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', ...linear(0.01) },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm', ...linear(0.001) },
      { id: 'mile', name: 'Mile', symbol: 'mi', ...linear(1609.344) },
      { id: 'yard', name: 'Yard', symbol: 'yd', ...linear(0.9144) },
      { id: 'foot', name: 'Foot', symbol: 'ft', ...linear(0.3048) },
      { id: 'inch', name: 'Inch', symbol: 'in', ...linear(0.0254) }
    ]
  },
  {
    name: 'Weight',
    units: [
      { id: 'kilogram', name: 'Kilogram', symbol: 'kg', ...linear(1) },
      { id: 'gram', name: 'Gram', symbol: 'g', ...linear(0.001) },
      { id: 'milligram', name: 'Milligram', symbol: 'mg', ...linear(0.000001) },
      { id: 'pound', name: 'Pound', symbol: 'lb', ...linear(0.453592) },
      { id: 'ounce', name: 'Ounce', symbol: 'oz', ...linear(0.0283495) },
      { id: 'ton', name: 'Metric Ton', symbol: 't', ...linear(1000) }
    ]
  },
  {
    name: 'Temperature',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
    ]
  },
  {
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meters/second', symbol: 'm/s', ...linear(1) },
      { id: 'kph', name: 'Kilometers/hour', symbol: 'km/h', ...linear(1 / 3.6) },
      { id: 'mph', name: 'Miles/hour', symbol: 'mph', ...linear(0.44704) },
      { id: 'knot', name: 'Knots', symbol: 'kn', ...linear(0.514444) },
      { id: 'fps', name: 'Feet/second', symbol: 'ft/s', ...linear(0.3048) }
    ]
  },
  {
    name: 'Area',
    units: [
      { id: 'sqm', name: 'Square Meter', symbol: 'm²', ...linear(1) },
      { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', ...linear(1e6) },
      { id: 'sqft', name: 'Square Foot', symbol: 'ft²', ...linear(0.092903) },
      { id: 'sqmi', name: 'Square Mile', symbol: 'mi²', ...linear(2.59e6) },
      { id: 'acre', name: 'Acre', symbol: 'ac', ...linear(4046.86) },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', ...linear(10000) }
    ]
  },
  {
    name: 'Volume',
    units: [
      { id: 'liter', name: 'Liter', symbol: 'L', ...linear(1) },
      { id: 'milliliter', name: 'Milliliter', symbol: 'mL', ...linear(0.001) },
      { id: 'gallon', name: 'US Gallon', symbol: 'gal', ...linear(3.78541) },
      { id: 'quart', name: 'Quart', symbol: 'qt', ...linear(0.946353) },
      { id: 'cup', name: 'Cup', symbol: 'cup', ...linear(0.236588) },
      { id: 'cubicm', name: 'Cubic Meter', symbol: 'm³', ...linear(1000) }
    ]
  },
  {
    name: 'Data',
    units: [
      { id: 'byte', name: 'Byte', symbol: 'B', ...linear(1) },
      { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB', ...linear(1024) },
      { id: 'megabyte', name: 'Megabyte', symbol: 'MB', ...linear(1024 ** 2) },
      { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB', ...linear(1024 ** 3) },
      { id: 'terabyte', name: 'Terabyte', symbol: 'TB', ...linear(1024 ** 4) },
      { id: 'bit', name: 'Bit', symbol: 'bit', ...linear(1 / 8) }
    ]
  },
  {
    name: 'Time',
    units: [
      { id: 'second', name: 'Second', symbol: 's', ...linear(1) },
      { id: 'minute', name: 'Minute', symbol: 'min', ...linear(60) },
      { id: 'hour', name: 'Hour', symbol: 'hr', ...linear(3600) },
      { id: 'day', name: 'Day', symbol: 'day', ...linear(86400) },
      { id: 'week', name: 'Week', symbol: 'wk', ...linear(604800) },
      { id: 'month', name: 'Month (30d)', symbol: 'mo', ...linear(2592000) },
      { id: 'year', name: 'Year (365d)', symbol: 'yr', ...linear(31536000) }
    ]
  },
  {
    name: 'Energy',
    units: [
      { id: 'joule', name: 'Joule', symbol: 'J', ...linear(1) },
      { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ', ...linear(1000) },
      { id: 'calorie', name: 'Calorie', symbol: 'cal', ...linear(4.184) },
      { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal', ...linear(4184) },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', ...linear(3.6e6) },
      { id: 'btu', name: 'BTU', symbol: 'BTU', ...linear(1055.06) }
    ]
  },
  {
    name: 'Pressure',
    units: [
      { id: 'pascal', name: 'Pascal', symbol: 'Pa', ...linear(1) },
      { id: 'kilopascal', name: 'Kilopascal', symbol: 'kPa', ...linear(1000) },
      { id: 'bar', name: 'Bar', symbol: 'bar', ...linear(100000) },
      { id: 'psi', name: 'PSI', symbol: 'psi', ...linear(6894.76) },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', ...linear(101325) },
      { id: 'mmhg', name: 'mmHg', symbol: 'mmHg', ...linear(133.322) }
    ]
  }
]

export function convert(value: number, fromUnit: string, toUnit: string, category: UnitCategory): number {
  const from = category.units.find((u) => u.id === fromUnit)
  const to = category.units.find((u) => u.id === toUnit)
  if (!from || !to) throw new Error('Unit not found')
  const baseValue = from.toBase(value)
  return to.fromBase(baseValue)
}
