const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

admin.initializeApp();

setGlobalOptions({maxInstances: 10});

exports.aiChat = onCall({
  cors: true,
  maxInstances: 5,
  secrets: [geminiApiKey],
}, async (request) => {
  try {
    const {message, userId} = request.data;

    if (!message || typeof message !== "string") {
      throw new Error("Invalid message parameter");
    }

    const apiKey = geminiApiKey.value();
    if (!apiKey) {
      logger.error("GEMINI_API_KEY not configured");
      throw new Error("AI service is not configured properly");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    logger.info("Processing AI chat request", {
      userId: userId || "anonymous",
      messageLength: message.length,
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    try {
      await admin.firestore().collection("ai_chat_logs").add({
        userId: userId || "anonymous",
        message: message.substring(0, 500),
        response: text.substring(0, 500),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        model: "gemini-2.0-flash-exp",
      });
    } catch (logError) {
      logger.warn("Failed to log conversation", {error: logError.message});
    }

    logger.info("AI chat request successful");

    return {
      success: true,
      response: text,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("AI chat error", {
      error: error.message,
      stack: error.stack,
    });

    if (error.message.includes("API key")) {
      throw new Error("AI service configuration error");
    } else if (error.message.includes("quota")) {
      throw new Error("AI service temporarily unavailable");
    } else {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
});

exports.aiChatHttp = onRequest({
  cors: true,
  maxInstances: 5,
  secrets: [geminiApiKey],
}, async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {message, userId} = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({error: "Invalid message parameter"});
      return;
    }

    const apiKey = geminiApiKey.value();
    if (!apiKey) {
      logger.error("GEMINI_API_KEY not configured");
      res.status(500).json({error: "AI service not configured"});
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    logger.info("Processing HTTP AI chat request", {
      userId: userId || "anonymous",
      messageLength: message.length,
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    try {
      await admin.firestore().collection("ai_chat_logs").add({
        userId: userId || "anonymous",
        message: message.substring(0, 500),
        response: text.substring(0, 500),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        model: "gemini-2.0-flash-exp",
        source: "http",
      });
    } catch (logError) {
      logger.warn("Failed to log conversation", {error: logError.message});
    }

    logger.info("HTTP AI chat request successful");

    res.status(200).json({
      success: true,
      response: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("HTTP AI chat error", {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      error: "AI service error",
      message: error.message,
    });
  }
});
