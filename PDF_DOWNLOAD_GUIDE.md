# PDF Download Feature Guide

## Overview

The YouthLink platform now supports downloading articles as professionally formatted PDF documents. This feature allows users to save and read mental health resources offline.

## Features

### PDF Content Includes:
- **Article Title** - Large, bold heading at the top
- **Author Information** - Clearly displayed author name
- **Publication Date** - When the article was published (if available)
- **Category** - Article category/topic
- **Full Article Content** - Complete article text with proper formatting
- **Platform Branding** - Footer with YouthLink attribution

### Professional Formatting:
- Clean, readable layout with A4 page size
- Proper margins and spacing
- Automatic page breaks for long content
- Text wrapping for optimal readability
- Gray divider line separating metadata from content

## How to Use

### From Resources List Page (`/resources/list`)
1. Browse the resources table
2. Find an article you want to download
3. Click the **Download** button (📥 icon) in the Actions column
4. PDF will automatically download to your device

### From Article Detail Page (`/resources/{id}`)
1. Open any article to read it
2. Scroll to the bottom of the article content
3. Click the green **"Download as PDF"** button
4. PDF will automatically download to your device

## Technical Details

### PDF Generation
- Uses **jsPDF** library (already installed in the project)
- No external API required - 100% client-side generation
- Free and unlimited downloads
- Works offline after page load

### File Naming
- PDF files are automatically named based on article title
- Special characters are replaced with underscores
- Limited to 50 characters for compatibility
- Format: `article_title.pdf`

### Supported Content Types
- Currently supports: **Articles only**
- Other resource types (Videos, Guides, etc.) show appropriate message

### Content Processing
- HTML tags are automatically cleaned
- Line breaks preserved for readability
- Special characters properly handled (&nbsp;, &amp;, etc.)
- Paragraphs formatted with proper spacing

## Code Structure

### Service File
`src/services/export/articlePdfService.ts`
- Main PDF generation logic
- Handles formatting and layout
- Manages page breaks

### Integration Points
1. **ResourcesList.vue** - Download button in table
2. **ResourceDetail.vue** - Download button at article bottom

## User Feedback

### Success Messages
- "PDF downloaded successfully!" (green toast notification)

### Error Messages
- "PDF download is currently only available for articles" (when clicking on non-article resources)
- "Failed to generate PDF" (if technical error occurs)

## Example PDF Layout

```
┌────────────────────────────────────────┐
│                                        │
│  Understanding Anxiety in Young People │
│                                        │
│  Author: Dr. Sarah Johnson            │
│  Published: January 15, 2024          │
│  Category: Anxiety                    │
│  ────────────────────────────────────  │
│                                        │
│  Anxiety is a normal human emotion    │
│  that everyone experiences from time   │
│  to time. However, when anxiety       │
│  becomes persistent and interferes... │
│                                        │
│  [Full article content continues]     │
│                                        │
│                                        │
│  Generated from YouthLink Mental      │
│  Health Platform                      │
└────────────────────────────────────────┘
```

## Browser Compatibility

The PDF download feature works in all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

Potential improvements for future versions:
- Support for other resource types (Guides, Videos)
- Include resource ratings in PDF
- Add table of contents for long articles
- Custom styling options
- Batch download multiple articles
- Email PDF directly to user

## Troubleshooting

### PDF doesn't download
- Check browser's download settings
- Ensure pop-ups are not blocked
- Verify JavaScript is enabled

### Content looks incorrect
- Article content should be properly formatted in the database
- HTML tags are automatically cleaned
- Contact admin if content appears corrupted

### Download button not visible
- Only available for **Article** type resources
- Ensure you're viewing an article (not a video or guide)

## Security & Privacy

- All PDF generation happens client-side (in your browser)
- No data is sent to external servers
- Downloads are private and secure
- No tracking of download activity
