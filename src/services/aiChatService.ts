import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error('Gemini API key is not configured')
}

const genAI = new GoogleGenerativeAI(API_KEY || '')

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable mental health support assistant specifically focused on helping young people (ages 12-25) with their mental health concerns, particularly anxiety, depression, and stress.

Your role is to:
1. Provide supportive, empathetic, and age-appropriate responses
2. Offer evidence-based coping strategies and information about mental health
3. Help users understand their feelings and normalize their experiences
4. Encourage professional help when necessary
5. NEVER provide medical diagnoses or replace professional therapy

Important guidelines:
- Stay focused ONLY on youth mental health topics (anxiety, depression, stress, relationships, self-esteem, wellbeing)
- If asked about unrelated topics (politics, sports, entertainment, etc.), politely redirect to mental health support
- Be warm, non-judgmental, and use simple, clear language
- For crisis situations, immediately recommend professional help (emergency services, Lifeline 13 11 14)
- Keep responses concise (2-3 paragraphs maximum)
- Use a friendly, supportive tone appropriate for young people

Example redirects for off-topic questions:
- "I'm here specifically to support you with mental health and wellbeing. Is there anything on your mind about how you're feeling that I can help with?"
- "That's not my area of expertise, but I'd love to help if you have questions about managing stress, anxiety, or other mental health concerns."

Remember: You're a supportive companion, not a replacement for professional help.`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

class AIChatService {
  private model
  private conversationHistory: ChatMessage[] = []

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 500,
      },
    })
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      })

      const history = this.conversationHistory
        .slice(-6)
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')

      const prompt = `${SYSTEM_PROMPT}

Conversation history:
${history}

Please respond to the user's latest message in a supportive and helpful way.`

      const result = await this.model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      this.conversationHistory.push({
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      })

      return text
    } catch (error) {
      console.error('Error sending message to Gemini:', error)
      return "I'm having trouble connecting right now. If you're experiencing a crisis, please call Lifeline on 13 11 14 or emergency services on 000. Otherwise, please try again in a moment."
    }
  }

  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory]
  }

  clearHistory(): void {
    this.conversationHistory = []
  }
}

export const aiChatService = new AIChatService()
