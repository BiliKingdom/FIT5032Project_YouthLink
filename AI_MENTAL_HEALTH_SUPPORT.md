# AI Mental Health Support Feature

## Overview

The platform has been transformed to feature an AI-powered mental health support chatbot using Google's Gemini API. This provides 24/7 instant support for young people dealing with anxiety, stress, depression, and other mental health concerns.

## What Changed

### Removed
- ❌ All old mental health info pages (InfoList.vue, InfoTopic.vue, Anxiety.vue)
- ❌ Multi-topic navigation (Depression, Stress, Relationships, etc.)
- ❌ Static information pages

### Added
- ✅ AI-powered chat interface (MentalHealthAI.vue)
- ✅ Real-time conversation with Gemini AI
- ✅ Youth-focused mental health assistant
- ✅ Professional chat dialog component
- ✅ Intelligent context-aware responses

## Features

### 1. Landing Page (`/ai-support`)

#### Hero Section
- Eye-catching gradient design
- AI badge with sparkles icon
- Three key features highlighted:
  - 🛡️ Safe & Confidential
  - ⏰ 24/7 Available
  - ❤️ Youth-Focused
- Large "Start Conversation" button

#### Information Cards
- **Understanding Support**: Learn about mental health topics
- **Coping Strategies**: Get practical techniques
- **Professional Help**: Know when to seek help

#### How It Works
3-step process:
1. Share what's on your mind
2. Get supportive responses
3. Take action with strategies and resources

#### Important Information
- Clear disclaimers about AI limitations
- Privacy assurance
- Crisis contact information
- Appropriate use guidelines

#### Crisis Banner
- Red alert-style banner at bottom
- Emergency contacts (000, Lifeline 13 11 14)
- Always visible for urgent situations

### 2. AI Chat Dialog

#### Chat Interface
- Modal overlay with professional design
- Purple gradient header
- Bot avatar with AI branding
- Clean, modern chat bubbles
- Typing indicator for AI responses
- Smooth scrolling to latest messages

#### User Experience
- **Welcome Message**: Friendly greeting explaining the assistant's purpose
- **User Messages**: Right-aligned purple bubbles
- **AI Responses**: Left-aligned with bot avatar
- **Input Field**: Bottom-fixed with send button
- **Character Limit**: 500 characters per message
- **Loading State**: Animated typing indicator

#### Chat Features
- Instant responses using Gemini API
- Conversation history (last 6 messages for context)
- Clear chat on close (privacy)
- Mobile-responsive design
- Smooth animations

## AI Configuration

### Model Used
- **Model**: `gemini-2.0-flash-exp` (most affordable option)
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 500 (concise responses)
- **Top P**: 0.8
- **Top K**: 40

### System Prompt
The AI is configured with strict guidelines:

#### Role & Scope
- Compassionate mental health support assistant
- Focused on ages 12-25
- Youth mental health topics only
- Evidence-based information

#### Capabilities
✅ Provide supportive, empathetic responses
✅ Offer coping strategies
✅ Normalize mental health experiences
✅ Guide to professional resources
✅ Age-appropriate language

#### Limitations
❌ No medical diagnoses
❌ Not a replacement for therapy
❌ Redirects off-topic questions
❌ Concise responses only (2-3 paragraphs)

#### Safety Features
- Immediate crisis intervention guidance
- Professional help recommendations when needed
- Clear boundaries on what AI can/cannot do

### Example Interactions

**On-Topic (Anxiety)**
```
User: I feel anxious all the time
AI: It sounds like you're going through a really challenging time,
and I'm here to support you. Feeling anxious frequently can be
overwhelming, but it's important to know that you're not alone...
[provides coping strategies and support]
```

**Off-Topic Redirect**
```
User: What's the weather like?
AI: I'm here specifically to support you with mental health and
wellbeing. Is there anything on your mind about how you're feeling
that I can help with?
```

**Crisis Detection**
```
User: I'm having thoughts of hurting myself
AI: I'm really concerned about you. If you're having thoughts of
self-harm, please reach out immediately to:
- Emergency services: 000
- Lifeline: 13 11 14
[immediate professional help guidance]
```

## Technical Implementation

### Files Created

1. **src/services/aiChatService.ts**
   - Gemini API integration
   - Conversation management
   - Error handling
   - Message history tracking

2. **src/views/MentalHealthAI.vue**
   - Landing page UI
   - Chat dialog component
   - User interaction handling
   - Responsive design

### API Integration

```typescript
// Service initialization
const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: { ... }
})

// Send message
async sendMessage(userMessage: string): Promise<string> {
  // Builds context with conversation history
  // Sends to Gemini API
  // Returns AI response
}
```

### Environment Variables

```env
VITE_GEMINI_API_KEY=AIzaSyAXgWUPUQ3ddqSkVgn-UVLktRetJbjRHrQ
```

### Routes

- **Old**: `/info`, `/info/:slug`, `/anxiety`
- **New**: `/ai-support`

### Navigation

- Header: "AI Mental Health Support" with sparkles icon
- Home page: Two prominent links to AI support
- Feature card on home page

## Security & Privacy

### Data Handling
- ✅ Conversations not stored permanently
- ✅ Chat history cleared on dialog close
- ✅ No user identification required
- ✅ Client-side message handling
- ✅ Secure API key in environment variables

### Safety Measures
- Clear disclaimers about AI limitations
- Not a replacement for professional care
- Immediate crisis resource display
- Professional help encouraged when needed
- Youth-appropriate responses only

## Cost Considerations

### Gemini 2.0 Flash Experimental Pricing
- **Free Tier**: 15 requests per minute
- **Paid**: $0.075 per 1M input tokens, $0.30 per 1M output tokens
- **Our Config**: 500 max output tokens (very economical)

### Estimated Usage
- Average conversation: 5-10 messages
- Tokens per message: ~300-500
- Cost per conversation: < $0.01
- Free tier sufficient for testing and moderate use

## User Benefits

1. **Immediate Support**: No waiting for appointments
2. **24/7 Availability**: Help whenever needed
3. **No Judgment**: Safe space to share feelings
4. **Privacy**: Anonymous conversations
5. **Accessible**: Simple chat interface
6. **Youth-Focused**: Age-appropriate responses
7. **Free**: No cost to users

## Limitations

1. **Not Professional Therapy**: Cannot replace qualified therapists
2. **No Diagnoses**: Cannot provide medical diagnoses
3. **Limited Scope**: Youth mental health only
4. **AI Constraints**: May occasionally provide generic responses
5. **Conversation Memory**: Only remembers last 6 messages
6. **Internet Required**: Needs active connection

## Future Enhancements

Potential improvements:
- [ ] Persistent chat history (with user consent)
- [ ] Mood tracking over time
- [ ] Resource recommendations based on topics
- [ ] Crisis detection automation
- [ ] Multi-language support
- [ ] Voice chat capability
- [ ] Integration with professional services booking
- [ ] Feedback system for response quality
- [ ] Advanced analytics for improvement

## Testing Checklist

- [x] AI responds appropriately to mental health questions
- [x] Off-topic questions redirected properly
- [x] Crisis situations handled with urgency
- [x] Chat dialog opens/closes correctly
- [x] Messages display in proper order
- [x] Typing indicator works
- [x] Mobile responsive design
- [x] API errors handled gracefully
- [x] Build succeeds without errors
- [x] Navigation updated correctly

## Usage Guidelines

### For Users
1. Click "Start Conversation" or "Start Chatting Now"
2. Type your message in the chat input
3. Receive instant AI-powered support
4. Continue conversation as needed
5. Close dialog when done

### For Administrators
- Monitor API usage in Google Cloud Console
- Check API key is secure and not exposed
- Review conversation patterns (no PII stored)
- Ensure crisis resources stay updated

## Troubleshooting

### AI Not Responding
- Check API key in `.env` file
- Verify internet connection
- Check Google Cloud Console for API status
- Look for console errors

### Build Failures
- Ensure `@google/generative-ai` is installed
- Check TypeScript types are correct
- Verify all imports are present

### Chat Not Opening
- Check browser console for errors
- Verify Bootstrap JS is loaded
- Test in different browsers

## Support Resources

The platform still provides:
- Find Services map (`/support/map`)
- Course booking (`/courses/book`)
- Resources library (`/resources/list`)
- Professional contact information

The AI assistant complements these services, not replaces them.
