import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatters } from '@/utils/export/formatters'

export interface PDFColumn {
  field: string
  header: string
  formatter?: (value: any) => string
}

export interface PDFExportOptions {
  filename?: string
  title: string
  subtitle?: string
  columns: PDFColumn[]
  data: any[]
  includeTimestamp?: boolean
  orientation?: 'portrait' | 'landscape'
}

export const pdfExportService = {
  export(options: PDFExportOptions): void {
    const {
      filename = 'export',
      title,
      subtitle,
      columns,
      data,
      includeTimestamp = true,
      orientation = 'portrait'
    } = options

    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    })

    let yPosition = 20

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, yPosition)
    yPosition += 10

    if (subtitle) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(subtitle, 14, yPosition)
      yPosition += 8
    }

    const generatedDate = new Date().toLocaleString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text(`Generated: ${generatedDate}`, 14, yPosition)
    yPosition += 10

    const headers = [columns.map(col => col.header)]

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

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: yPosition,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 10, left: 14, right: 14 }
    })

    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }

    const timestamp = includeTimestamp ? `-${new Date().toISOString().split('T')[0]}` : ''
    const fullFilename = `${filename}${timestamp}.pdf`

    doc.save(fullFilename)
  },

  exportReport(
    title: string,
    sections: Array<{ title: string; data: any[]; columns: PDFColumn[] }>,
    filename: string = 'report'
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    let yPosition = 20

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, yPosition)
    yPosition += 15

    const generatedDate = new Date().toLocaleString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text(`Generated: ${generatedDate}`, 14, yPosition)
    yPosition += 10

    sections.forEach((section, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 14, yPosition)
      yPosition += 8

      const headers = [section.columns.map(col => col.header)]

      const rows = section.data.map(item =>
        section.columns.map(col => {
          const value = item[col.field]
          if (col.formatter) {
            return col.formatter(value)
          }
          return formatters.text(value)
        })
      )

      autoTable(doc, {
        head: headers,
        body: rows,
        startY: yPosition,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          fontStyle: 'bold'
        },
        margin: { left: 14, right: 14 }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 10
    })

    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }

    const timestamp = `-${new Date().toISOString().split('T')[0]}`
    doc.save(`${filename}${timestamp}.pdf`)
  }
}
