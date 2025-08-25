<template>
  <div>
    <h1>Contact Us</h1>
    <p>Get in touch with our team. We're here to support you and answer any questions.</p>

    <!-- Contact Form -->
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Full Name *</label>
        <input v-model="form.name" type="text" id="name">
      </div>

      <div>
        <label for="email">Email Address *</label>
        <input v-model="form.email" type="email" id="email">
      </div>

      <div>
        <label for="phone">Phone Number</label>
        <input v-model="form.phone" type="tel" id="phone">
      </div>

      <div>
        <label for="subject">Subject *</label>
        <select v-model="form.subject" id="subject">
          <option value="">Choose a subject...</option>
          <option value="general">General Inquiry</option>
          <option value="support">Mental Health Support</option>
          <option value="services">Service Information</option>
          <option value="volunteer">Volunteer Opportunities</option>
          <option value="partnership">Partnership</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      <div>
        <label for="message">Message *</label>
        <textarea v-model="form.message" id="message" rows="5"></textarea>
      </div>

      <div>
        <input v-model="form.consent" type="checkbox" id="consent">
        <label for="consent">
          I consent to MindWell NFP collecting and using my information to respond to my inquiry.
        </label>
      </div>

      <div>
        <button type="submit">Send Message</button>
        <button type="button" @click="resetForm">Clear Form</button>
      </div>
    </form>

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
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false
})

const submitForm = () => {
  console.log('Form submitted:', form.value)
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
}
</script>
