import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_ky1fzlt'
const TEMPLATE_ID = 'template_kba0mkb'
const PUBLIC_KEY = 'zXsYcTogkvV_BnVDTkXdw'

emailjs.init(PUBLIC_KEY)

export interface EmailParams {
  to_email: string
  to_name: string
  subject: string
  message: string
  from_name?: string
}

export interface BookingConfirmationParams {
  to_email: string
  to_name: string
  course_name: string
  booking_date: string
  booking_time: string
  instructor: string
  duration: string
}

export const emailService = {
  async sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Sending email with params:', params)

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: params.to_email,
          to_name: params.to_name,
          subject: params.subject,
          message: params.message,
          from_name: params.from_name || 'YouthLink'
        }
      )

      console.log('Email sent successfully:', response)
      return { success: true }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }
    }
  },

  async sendBookingConfirmation(params: BookingConfirmationParams): Promise<{ success: boolean; error?: string }> {
    const message = `
Dear ${params.to_name},

Your course booking has been confirmed!

Course Details:
- Course: ${params.course_name}
- Date: ${params.booking_date}
- Time: ${params.booking_time}
- Instructor: ${params.instructor}
- Duration: ${params.duration}

We look forward to seeing you at the session. If you need to cancel or reschedule, please visit your profile page.

Best regards,
YouthLink Team
    `.trim()

    return this.sendEmail({
      to_email: params.to_email,
      to_name: params.to_name,
      subject: `Booking Confirmed: ${params.course_name}`,
      message: message,
      from_name: 'YouthLink - Course Booking'
    })
  },

  async sendBulkEmails(
    recipients: Array<{ email: string; name: string }>,
    subject: string,
    message: string
  ): Promise<{ success: boolean; sentCount: number; failedCount: number; errors: string[] }> {
    let sentCount = 0
    let failedCount = 0
    const errors: string[] = []

    for (const recipient of recipients) {
      const result = await this.sendEmail({
        to_email: recipient.email,
        to_name: recipient.name,
        subject: subject,
        message: message
      })

      if (result.success) {
        sentCount++
      } else {
        failedCount++
        errors.push(`Failed to send to ${recipient.email}: ${result.error}`)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return {
      success: failedCount === 0,
      sentCount,
      failedCount,
      errors
    }
  }
}
