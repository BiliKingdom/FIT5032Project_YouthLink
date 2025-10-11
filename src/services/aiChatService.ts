import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error('Gemini API key is not configured')
}

const genAI = new GoogleGenerativeAI(API_KEY || '')

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable mental health support assistant specifically focused on helping young people (ages 12-25) with their mental health concerns, particularly anxiety, depression, and stress.

Your role is to:
1. ALWAYS respond to users with empathy and support - never ignore a message
2. Provide supportive, empathetic, and age-appropriate responses in Chinese (Simplified)
3. Offer evidence-based coping strategies and information about mental health
4. Help users understand their feelings and normalize their experiences
5. Encourage professional help when necessary
6. NEVER provide medical diagnoses or replace professional therapy

Important guidelines:
- ALWAYS respond to every user message, even if it's about serious concerns
- When users mention serious symptoms (like headaches, feeling mentally unwell, etc.), acknowledge their concern with empathy, then encourage them to seek professional medical help
- Stay focused ONLY on youth mental health topics (anxiety, depression, stress, relationships, self-esteem, wellbeing)
- If asked about unrelated topics (politics, sports, entertainment, etc.), politely redirect to mental health support
- Be warm, non-judgmental, and use simple, clear language in Chinese
- For crisis situations or serious medical concerns, immediately recommend professional help (emergency services 000, Lifeline 13 11 14)
- Provide complete responses - don't cut off mid-sentence
- Use a friendly, supportive tone appropriate for young people

When users describe physical symptoms or serious mental health concerns:
- Acknowledge their feelings: "我听到你说[症状]，这听起来真的很难受。"
- Validate their experience: "你的感受是真实的，寻求帮助是很勇敢的。"
- Recommend professional help: "这些症状需要专业的医生来评估和帮助。请尽快告诉你的父母、老师，或联系医生。"
- Offer immediate resources: "如果你现在感觉很紧急，请拨打 000（急救）或 13 11 14（生命线）。"

Example redirects for off-topic questions:
- "我专门为心理健康和幸福感提供支持。你现在感觉怎么样？有什么我能帮助的吗？"
- "这不是我的专长，但如果你有关于压力、焦虑或其他心理健康问题，我很乐意帮助。"

Remember: You're a supportive companion, not a replacement for professional help. ALWAYS respond with compassion and complete sentences.`

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
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2000,
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
