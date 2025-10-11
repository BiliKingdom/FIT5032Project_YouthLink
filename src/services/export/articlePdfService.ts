import { jsPDF } from 'jspdf'

interface ArticleData {
  title: string
  author: string
  content: string
  publishedDate?: string
  category?: string
}

export const articlePdfService = {
  generatePDF(article: ArticleData): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let yPosition = margin

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)

    const titleLines = doc.splitTextToSize(article.title, contentWidth)
    doc.text(titleLines, margin, yPosition)
    yPosition += titleLines.length * 10

    yPosition += 10

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)

    if (article.author) {
      doc.text(`Author: ${article.author}`, margin, yPosition)
      yPosition += 7
    }

    if (article.publishedDate) {
      doc.text(`Published: ${article.publishedDate}`, margin, yPosition)
      yPosition += 7
    }

    if (article.category) {
      doc.text(`Category: ${article.category}`, margin, yPosition)
      yPosition += 7
    }

    yPosition += 5
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    const cleanContent = article.content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()

    const paragraphs = cleanContent.split('\n').filter(p => p.trim().length > 0)

    for (const paragraph of paragraphs) {
      const lines = doc.splitTextToSize(paragraph, contentWidth)

      for (const line of lines) {
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage()
          yPosition = margin
        }

        doc.text(line, margin, yPosition)
        yPosition += 6
      }

      yPosition += 4
    }

    yPosition += 10
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Generated from YouthLink Mental Health Platform', margin, yPosition)

    const fileName = article.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50)

    doc.save(`${fileName}.pdf`)
  }
}
