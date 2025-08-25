<template>
  <div>
    <h1>Contact Us</h1>
    <p>Get in touch with our team. We're here to support you and answer any questions.</p>

    <!-- Contact Form -->
    <form @submit.prevent="submitForm" novalidate>
      <div>
        <label for="name">Full Name *</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          @blur="validateField('name')"
        >
        <div v-if="errors.name">{{ errors.name }}</div>
      </div>

      <div>
        <label for="email">Email Address *</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          @blur="validateField('email')"
        >
        <div v-if="errors.email">{{ errors.email }}</div>
      </div>

      <div>
        <label for="phone">Phone Number</label>
        <input
          v-model="form.phone"
          type="tel"
          id="phone"
          @blur="validateField('phone')"
        >
        <div v-if="errors.phone">{{ errors.phone }}</div>
      </div>

      <div>
        <label for="subject">Subject *</label>
        <select
          v-model="form.subject"
          id="subject"
          @blur="validateField('subject')"
        >
          <option value="">Choose a subject...</option>
          <option value="general">General Inquiry</option>
          <option value="support">Mental Health Support</option>
          <option value="services">Service Information</option>
          <option value="volunteer">Volunteer Opportunities</option>
          <option value="partnership">Partnership</option>
          <option value="feedback">Feedback</option>
        </select>
        <div v-if="errors.subject">{{ errors.subject }}</div>
      </div>

      <div>
        <label for="message">Message *</label>
        <textarea
          v-model="form.message"
          id="message"
          rows="5"
          @blur="validateField('message')"
        ></textarea>
        <div v-if="errors.message">{{ errors.message }}</div>
        <div>{{ form.message.length }}/1000 characters</div>
      </div>

      <div>
        <input
          v-model="form.consent"
          type="checkbox"
          id="consent"
          @change="validateField('consent')"
        >
        <label for="consent">
          I consent to MindWell NFP collecting and using my information to respond to my inquiry. *
        </label>
        <div v-if="errors.consent">{{ errors.consent }}</div>
      </div>

      <div>
        <button type="submit" :disabled="loading || !isFormValid">
          {{ loading ? 'Sending...' : 'Send Message' }}
        </button>
        <button type="button" @click="resetForm" :disabled="loading">
          Clear Form
        </button>
      </div>
    </form>

    <div v-if="submitStatus">
      {{ submitStatus.message }}
    </div>

    <!-- Contact Information -->
    <div>
      <h2>Get in Touch</h2>
      <p><strong>Address:</strong> 123 Collins Street, Melbourne VIC 3000</p>
      <p><strong>Phone:</strong> (03) 9123 4567</p>
      <p><strong>Email:</strong> info@mindwellnfp.org</p>
      <p><strong>Office Hours:</strong> Mon-Fri 9:00 AM - 5:00 PM, Sat 10:00 AM - 2:00 PM</p>
    </div>

    <!-- Crisis Support -->
    <div>
      <h3>Crisis Support</h3>
      <p>If you're experiencing a mental health emergency, please contact:</p>
      <p><strong>Lifeline:</strong> 13 11 14</p>
      <p><strong>Kids Helpline:</strong> 1800 55 1800</p>
      <p><strong>Emergency:</strong> 000</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  consent: boolean
}

interface ValidationErrors {
  [key: string]: string
}

interface SubmitStatus {
  type: 'alert-success' | 'alert-danger'
  message: string
}

const form = ref<ContactForm>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false
})

const errors = ref<ValidationErrors>({})
const loading = ref(false)
const submitStatus = ref<SubmitStatus | null>(null)

const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.email.includes('@') &&
         form.value.subject &&
         form.value.message.length >= 10 &&
         form.value.consent &&
         Object.keys(errors.value).length === 0
})

const validateField = (fieldName: keyof ContactForm) => {
  errors.value = { ...errors.value }
  delete errors.value[fieldName]

  switch (fieldName) {
    case 'name':
      if (!form.value.name.trim()) {
        errors.value.name = 'Name is required'
      } else if (form.value.name.trim().length < 2) {
        errors.value.name = 'Name must be at least 2 characters'
      }
      break
    case 'email':
      if (!form.value.email.trim()) {
        errors.value.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email address'
      }
      break
    case 'phone':
      if (form.value.phone && !/^[\d\s\-\+\(\)]+$/.test(form.value.phone)) {
        errors.value.phone = 'Please enter a valid phone number'
      }
      break
    case 'subject':
      if (!form.value.subject) {
        errors.value.subject = 'Please select a subject'
      }
      break
    case 'message':
      if (!form.value.message.trim()) {
        errors.value.message = 'Message is required'
      } else if (form.value.message.trim().length < 10) {
        errors.value.message = 'Message must be at least 10 characters'
      } else if (form.value.message.length > 1000) {
        errors.value.message = 'Message cannot exceed 1000 characters'
      }
      break
    case 'consent':
      if (!form.value.consent) {
        errors.value.consent = 'You must provide consent to proceed'
      }
      break
  }
}

const validateForm = () => {
  Object.keys(form.value).forEach(key => {
    validateField(key as keyof ContactForm)
  })
}

const submitForm = async () => {
  validateForm()

  if (!isFormValid.value) {
    submitStatus.value = {
      type: 'alert-danger',
      message: 'Please correct the errors above before submitting.'
    }
    return
  }

  loading.value = true
  submitStatus.value = null

  try {
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟 API 请求
    submitStatus.value = {
      type: 'alert-success',
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    }

    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]')
    submissions.push({
      ...form.value,
      timestamp: new Date().toISOString(),
      id: Date.now()
    })
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions))

    resetForm()
  } catch (error) {
    submitStatus.value = {
      type: 'alert-danger',
      message: 'Sorry, there was an error sending your message. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false
  }
  errors.value = {}
  submitStatus.value = null
}
</script>
