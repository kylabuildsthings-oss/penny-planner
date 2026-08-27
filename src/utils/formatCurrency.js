const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const gbpPrecise = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value, { cents = false } = {}) {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0
  return (cents ? gbpPrecise : gbp).format(cents ? amount : Math.round(amount))
}
