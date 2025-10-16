<template>
  <div class="mental-health-ai">
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8 mx-auto text-center">
            <div class="hero-content">
              <div class="ai-badge mb-3">
                <Sparkles :size="20" class="me-2" />
                <span>AI-Powered Mental Health Support</span>
              </div>
              <h1 class="display-4 fw-bold mb-4">Talk to Our Mental Health Assistant</h1>
              <p class="lead mb-4">
                Get instant support for anxiety, stress, and other mental health concerns. Our AI assistant
                is here to listen, provide coping strategies, and guide you to resources that can help.
              </p>
              <div class="hero-features">
                <div class="feature-item">
                  <Shield :size="24" class="text-success" />
                  <span>Safe & Confidential</span>
                </div>
                <div class="feature-item">
                  <Clock :size="24" class="text-primary" />
                  <span>24/7 Available</span>
                </div>
                <div class="feature-item">
                  <Heart :size="24" class="text-danger" />
                  <span>Youth-Focused</span>
                </div>
              </div>
              <button class="btn btn-primary btn-lg mt-4" @click="openChat">
                <MessageCircle class="me-2" :size="20" />
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="text-center mb-5">
              <h2 class="h1 fw-bold mb-3">How It Works</h2>
              <p class="lead text-muted">Simple, supportive conversations when you need them</p>
            </div>
            <div class="steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h5 class="fw-bold">Share What's On Your Mind</h5>
                  <p class="text-muted">
                    Tell our AI assistant how you're feeling or what you're struggling with. There's no
                    judgment here.
                  </p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h5 class="fw-bold">Get Supportive Responses</h5>
                  <p class="text-muted">
                    Receive empathetic responses with helpful information, coping strategies, and resources
                    tailored to your needs.
                  </p>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h5 class="fw-bold">Take Action</h5>
                  <p class="text-muted">
                    Use the strategies you learn, explore additional resources, or connect with
                    professional services when ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="important-notice py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="notice-card">
              <div class="notice-header">
                <Info :size="32" class="text-primary" />
                <h3 class="fw-bold mb-0">Important Information</h3>
              </div>
              <div class="notice-body">
                <ul class="notice-list">
                  <li>
                    <Check :size="18" class="text-success" />
                    <span>This AI assistant provides information and support, but is NOT a replacement for
                      professional mental health care</span>
                  </li>
                  <li>
                    <Check :size="18" class="text-success" />
                    <span>Your conversations are private and not stored after you close the chat</span>
                  </li>
                  <li>
                    <Check :size="18" class="text-success" />
                    <span>The AI focuses on youth mental health topics and will redirect other questions</span>
                  </li>
                  <li>
                    <AlertTriangle :size="18" class="text-warning" />
                    <span>If you're in crisis, please contact emergency services (000) or Lifeline (13 11
                      14) immediately</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="h1 fw-bold mb-4">Ready to Talk?</h2>
            <p class="lead mb-4">
              Start a conversation with our AI assistant anytime. It's free, confidential, and here for
              you 24/7.
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <button class="btn btn-primary btn-lg" @click="openChat">
                <MessageCircle class="me-2" :size="20" />
                Start Chatting Now
              </button>
              <router-link to="/support/map" class="btn btn-outline-primary btn-lg">
                <MapPin class="me-2" :size="20" />
                Find Professional Services
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="crisis-banner py-4 bg-danger text-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <div class="d-flex align-items-center">
              <AlertTriangle :size="28" class="me-3" />
              <div>
                <h5 class="mb-1 fw-bold">In Crisis? Get Help Now</h5>
                <p class="mb-0">If you're having thoughts of self-harm or suicide, please reach out
                  immediately.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <div class="d-flex gap-2 justify-content-md-end">
              <a href="tel:000" class="btn btn-light">Emergency 000</a>
              <a href="tel:131114" class="btn btn-outline-light">Lifeline 13 11 14</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showChat" class="chat-dialog-overlay" @click.self="closeChat">
      <div class="chat-dialog">
        <div class="chat-header">
          <div class="d-flex align-items-center">
            <div class="chat-avatar">
              <Bot :size="24" />
            </div>
            <div>
              <h5 class="mb-0 fw-bold">Mental Health Assistant</h5>
              <small class="text-muted">Powered by AI</small>
            </div>
          </div>
          <button class="btn-close-chat" @click="closeChat">
            <X :size="24" />
          </button>
        </div>

        <div class="chat-body" ref="chatBody">
          <div class="welcome-message">
            <div class="assistant-message">
              <div class="message-avatar">
                <Bot :size="20" />
              </div>
              <div class="message-bubble">
                <p class="mb-2">
                  Hi there! I'm here to support you with any mental health concerns you might have. Whether
                  you're dealing with anxiety, stress, feeling down, or just need someone to talk to, I'm
                  here to listen and help.
                </p>
                <p class="mb-0">What's on your mind today?</p>
              </div>
            </div>
          </div>

          <div v-for="(message, index) in messages" :key="index" :class="message.role + '-message'">
            <div v-if="message.role === 'user'" class="message-bubble user-bubble">
              {{ message.content }}
            </div>
            <div v-else class="assistant-message">
              <div class="message-avatar">
                <Bot :size="20" />
              </div>
              <div class="message-bubble">
                {{ message.content }}
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="assistant-message">
            <div class="message-avatar">
              <Bot :size="20" />
            </div>
            <div class="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <form @submit.prevent="sendMessage" class="chat-input-form">
            <input
              v-model="userInput"
              type="text"
              class="form-control chat-input"
              placeholder="Type your message..."
              :disabled="isLoading"
              maxlength="500"
            />
            <button type="submit" class="btn btn-primary btn-send" :disabled="!userInput.trim() || isLoading">
              <Send :size="20" />
            </button>
          </form>
          <div class="chat-footer-notice">
            <small class="text-muted">
              <AlertCircle :size="12" class="me-1" />
              This is an AI assistant, not a replacement for professional care
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import {
  Sparkles,
  Shield,
  Clock,
  Heart,
  MessageCircle,
  Brain,
  Lightbulb,
  MapPin,
  Info,
  Check,
  AlertTriangle,
  Bot,
  X,
  Send,
  AlertCircle,
} from 'lucide-vue-next'
import { aiChatService, type ChatMessage } from '@/services/aiChatService'

const showChat = ref(false)
const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isLoading = ref(false)
const chatBody = ref<HTMLElement | null>(null)

const openChat = () => {
  showChat.value = true
  messages.value = []
}

const closeChat = () => {
  showChat.value = false
  aiChatService.clearHistory()
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date(),
  })

  userInput.value = ''
  isLoading.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await aiChatService.sendMessage(userMessage)
    messages.value.push({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      role: 'assistant',
      content:
        "I'm having trouble responding right now. If you're in crisis, please call Lifeline on 13 11 14 or emergency services on 000.",
      timestamp: new Date(),
    })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}
</script>

<style scoped>
.mental-health-ai {
  overflow-x: hidden;
}

.hero-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.hero-features {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.info-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.notice-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 2rem;
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.notice-list li:last-child {
  margin-bottom: 0;
}

.notice-list li span {
  flex: 1;
}

.crisis-banner {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

.chat-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.chat-dialog {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.btn-close-chat {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-close-chat:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.welcome-message,
.user-message,
.assistant-message {
  display: flex;
  gap: 0.75rem;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-bubble {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 16px;
  line-height: 1.6;
}

.user-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
  border-radius: 16px 16px 4px 16px;
}

.assistant-message .message-bubble {
  border-radius: 16px 16px 16px 4px;
}

.typing-indicator {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #6c757d;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid #e9ecef;
}

.chat-input-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.chat-input {
  flex: 1;
  border-radius: 50px;
  padding: 0.75rem 1.25rem;
  border: 2px solid #e9ecef;
  font-size: 0.95rem;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-send {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-footer-notice {
  text-align: center;
}

@media (max-width: 768px) {
  .hero-features {
    flex-direction: column;
    align-items: stretch;
  }

  .feature-item {
    justify-content: center;
  }

  .chat-dialog {
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
  }

  .chat-header {
    border-radius: 0;
  }
}
</style>
