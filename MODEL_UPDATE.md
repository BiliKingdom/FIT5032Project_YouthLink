# Gemini Model Update

## Change Summary

Updated the AI model from **Gemini 1.5 Flash** to **Gemini 2.0 Flash Experimental** (`gemini-2.0-flash-exp`)

## Model Details

### Gemini 2.0 Flash Experimental

According to Google's documentation, Gemini 2.0 Flash is the latest generation model with:

- **Better Performance**: Improved understanding and generation capabilities
- **Faster Response**: Optimized for speed
- **Enhanced Reasoning**: Better contextual understanding
- **Multimodal Support**: Handles text and images (we're using text only)
- **Cost-Effective**: Free tier available for testing

### Configuration

```typescript
model: 'gemini-2.0-flash-exp'
generationConfig: {
  temperature: 0.7,      // Balanced creativity
  topP: 0.8,            // Nucleus sampling
  topK: 40,             // Token diversity
  maxOutputTokens: 500  // Concise responses
}
```

## Benefits for Our Use Case

1. **Better Mental Health Support**
   - More nuanced understanding of emotional context
   - Improved empathy in responses
   - Better handling of complex situations

2. **Improved Topic Filtering**
   - More accurate detection of off-topic questions
   - Better redirection to mental health topics
   - Enhanced safety in responses

3. **Youth-Appropriate Language**
   - Better adaptation to age-appropriate communication
   - More natural conversational flow
   - Improved clarity for young users

4. **Crisis Detection**
   - Enhanced ability to recognize urgent situations
   - More appropriate emergency response guidance
   - Better contextual awareness

## Pricing (As of Update)

### Free Tier
- 15 requests per minute
- Sufficient for testing and moderate usage
- No credit card required

### Paid Tier (if needed)
- Input: ~$0.075 per 1M tokens
- Output: ~$0.30 per 1M tokens
- Our 500 token limit keeps costs very low
- Estimated: < $0.01 per conversation

## Testing Recommendations

After this update, test the following scenarios:

1. **Mental Health Questions**
   - ✓ Anxiety-related questions
   - ✓ Depression symptoms
   - ✓ Stress management
   - ✓ Self-esteem concerns
   - ✓ Relationship issues

2. **Off-Topic Redirection**
   - ✓ Sports questions
   - ✓ Entertainment queries
   - ✓ General knowledge
   - ✓ Homework help
   - ✓ Technical questions

3. **Crisis Situations**
   - ✓ Self-harm mentions
   - ✓ Suicide ideation
   - ✓ Severe distress
   - ✓ Emergency situations

4. **Response Quality**
   - ✓ Empathy and warmth
   - ✓ Age-appropriate language
   - ✓ Concise responses (2-3 paragraphs)
   - ✓ Actionable advice
   - ✓ Professional help suggestions

## File Changes

- **Updated**: `src/services/aiChatService.ts`
  - Line 46: `model: 'gemini-2.0-flash-exp'`

- **Updated**: `AI_MENTAL_HEALTH_SUPPORT.md`
  - Model references updated throughout

## Migration Notes

- ✅ No code changes required (same API interface)
- ✅ No breaking changes
- ✅ Configuration remains the same
- ✅ Backward compatible
- ✅ Build succeeds without errors

## Rollback Plan

If issues arise with the new model, revert by changing:

```typescript
// From:
model: 'gemini-2.0-flash-exp'

// To:
model: 'gemini-1.5-flash'
```

## References

- [Gemini 2.0 Flash Documentation](https://ai.google.dev/gemini-api/docs/models?hl=zh-cn#gemini-2.5-flash-lite)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Pricing](https://ai.google.dev/pricing)

## Notes

The model name `gemini-2.0-flash-exp` indicates this is an **experimental** version. Google may update or change this model name. Monitor the API documentation for updates.

If the model name changes or is deprecated, update the configuration accordingly.
