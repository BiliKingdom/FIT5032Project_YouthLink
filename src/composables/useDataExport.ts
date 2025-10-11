import { ref } from 'vue'
import { csvExportService, type CSVColumn } from '@/services/export/csvExportService'
import { pdfExportService, type PDFColumn } from '@/services/export/pdfExportService'

export type ExportFormat = 'csv' | 'pdf'

export interface ExportOptions {
  format: ExportFormat
  filename: string
  title?: string
  subtitle?: string
}

export function useDataExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)

  const exportToCSV = (
    data: any[],
    columns: CSVColumn[],
    filename: string = 'export'
  ): void => {
    isExporting.value = true
    exportError.value = null

    try {
      csvExportService.export({
        filename,
        columns,
        data,
        includeTimestamp: true
      })
    } catch (error) {
      console.error('CSV export error:', error)
      exportError.value = 'Failed to export data to CSV'
    } finally {
      isExporting.value = false
    }
  }

  const exportToPDF = (
    data: any[],
    columns: PDFColumn[],
    title: string,
    filename: string = 'export',
    subtitle?: string,
    orientation: 'portrait' | 'landscape' = 'portrait'
  ): void => {
    isExporting.value = true
    exportError.value = null

    try {
      pdfExportService.export({
        filename,
        title,
        subtitle,
        columns,
        data,
        includeTimestamp: true,
        orientation
      })
    } catch (error) {
      console.error('PDF export error:', error)
      exportError.value = 'Failed to export data to PDF'
    } finally {
      isExporting.value = false
    }
  }

  const exportData = (
    data: any[],
    columns: any[],
    options: ExportOptions
  ): void => {
    if (data.length === 0) {
      exportError.value = 'No data to export'
      return
    }

    if (options.format === 'csv') {
      exportToCSV(data, columns, options.filename)
    } else if (options.format === 'pdf') {
      exportToPDF(
        data,
        columns,
        options.title || 'Report',
        options.filename,
        options.subtitle
      )
    }
  }

  return {
    isExporting,
    exportError,
    exportToCSV,
    exportToPDF,
    exportData
  }
}
