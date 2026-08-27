export function calculateFreedomDate(months, from = new Date()) {
  if (months === 0) {
    return {
      label: "🎉 You're already debt-free!",
      iso: from.toISOString(),
    }
  }

  if (!Number.isFinite(months) || months < 0) {
    return {
      label: 'Keep going — trim costs or add extra',
      iso: null,
    }
  }

  const date = new Date(from.getFullYear(), from.getMonth() + months, 1)
  const label = date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return { label, iso: date.toISOString() }
}
