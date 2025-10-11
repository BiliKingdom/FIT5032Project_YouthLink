export const formatters = {
  date(value: any): string {
    if (!value) return ''

    const date = value instanceof Date ? value : new Date(value)

    if (isNaN(date.getTime())) return ''

    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  datetime(value: any): string {
    if (!value) return ''

    const date = value instanceof Date ? value : new Date(value)

    if (isNaN(date.getTime())) return ''

    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  boolean(value: any): string {
    return value ? 'Yes' : 'No'
  },

  currency(value: any): string {
    if (value === null || value === undefined || isNaN(value)) return ''

    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(value)
  },

  number(value: any): string {
    if (value === null || value === undefined || isNaN(value)) return ''

    return new Intl.NumberFormat('en-AU').format(value)
  },

  text(value: any): string {
    if (value === null || value === undefined) return ''
    return String(value)
  },

  sanitizeForCSV(value: any): string {
    const text = this.text(value)

    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`
    }

    return text
  }
}

export type FormatterType = keyof typeof formatters
