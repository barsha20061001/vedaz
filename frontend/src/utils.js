export const groupSlotsByDate = (slots = []) =>
  slots
    .map((slot) => ({ date: slot.date, times: slot.times || [] }))
    .sort((a, b) => a.date.localeCompare(b.date))

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const isValidPhone = (value) => /^[0-9+\-\s]{7,15}$/.test(value)
