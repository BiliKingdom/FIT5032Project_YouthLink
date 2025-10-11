import Papa from 'papaparse'
import { formatters } from '@/utils/export/formatters'

export interface CSVColumn {
  field: string
  header: string
  formatter?: (value: any) => string
}

export interface CSVExportOptions {
  filename?: string
  columns: CSVColumn[]
  data: any[]
  includeTimestamp?: boolean
}

export const csvExportService = {
  export(options: CSVExportOptions): void {
    const { filename = 'export', columns, data, includeTimestamp = true } = options

    const headers = columns.map(col => col.header)

    const rows = data.map(item =>
      columns.map(col => {
        const value = item[col.field]

        if (col.formatter) {
          return col.formatter(value)
        }

        if (value === null || value === undefined) {
          return ''
        }

        if (value instanceof Date) {
          return formatters.datetime(value)
        }

        if (typeof value === 'boolean') {
          return formatters.boolean(value)
        }

        return formatters.text(value)
      })
    )

    const csvData = [headers, ...rows]

    const csv = Papa.unparse(csvData, {
      quotes: true,
      delimiter: ',',
      newline: '\n'
    })

    const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : ''
    const fullFilename = `${filename}${timestamp}.csv`

    this.downloadCSV(csv, fullFilename)
  },

  downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.setAttribute('download', filename)
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  },

  exportSimple(data: any[], filename: string = 'export'): void {
    if (data.length === 0) {
      console.warn('No data to export')
      return
    }

    const firstRow = data[0]
    const columns: CSVColumn[] = Object.keys(firstRow).map(key => ({
      field: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
    }))

    this.export({
      filename,
      columns,
      data
    })
  }
}
