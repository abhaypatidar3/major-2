import Groq from "groq-sdk";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const SYSTEM_PROMPT = `You are SyncoraAI — a warm, empathetic, and knowledgeable AI health companion embedded inside the Syncora menstrual health platform.

Your role:
• Provide personalised menstrual health care, support, and education.
• When a user describes symptoms (cramps, headaches, bloating, fatigue, mood swings, back pain, nausea, etc.) offer tailored, evidence-informed advice: natural remedies, dietary tips, gentle yoga/exercise suggestions, breathing techniques, when to consider OTC medication, and when to see a doctor.
• Be conversational, compassionate, and non-judgmental — like a caring nurse friend.
• You may discuss general menstrual cycle phases, PMS, PMDD, PCOS, endometriosis awareness, and hygiene tips.
• Always remind users you are an AI assistant and not a replacement for professional medical advice. If symptoms sound severe or unusual, recommend consulting a healthcare provider.

Boundaries — you must NEVER:
• Diagnose medical conditions.
• Prescribe specific medications or dosages.
• Provide advice on topics unrelated to menstrual health, women's reproductive wellness, or general self-care during periods.
• If asked about unrelated topics, politely redirect: "I'm here to help with menstrual health and wellness! How can I support you today?"

Tone: Warm, supportive, clear, and encouraging. Use simple language. You may use gentle emojis sparingly (💜, 🌸, 🩺, 💧) to feel approachable.

Format: Keep responses concise (2-4 short paragraphs max). Use bullet points for lists of tips. Bold key terms with **markdown**.`;

export const chatWithAI = catchAsyncErrors(async (req, res, next) => {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

  if (!groqApiKey || !groq) {
    return next(
      new ErrorHandler(
        "GROQ_API_KEY is missing in backend/config/config.env. Please add it and restart backend.",
        500
      )
    );
  }

  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return next(new ErrorHandler("Message is required", 400));
  }

  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "assistant",
      content:
        "Understood! I'm SyncoraAI 💜 — your menstrual health companion. I'm here to help you with symptom relief, cycle insights, and wellness tips. How can I support you today? 🌸",
    },
  ];

  if (history && Array.isArray(history)) {
    history.forEach((msg) => {
      chatMessages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      });
    });
  }

  chatMessages.push({ role: "user", content: message });

  let reply = "";

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatMessages,
      temperature: 0.6,
      max_completion_tokens: 700,
    });

    reply = completion.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    const errorMessage = String(error?.message || "");

    if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("invalid api key")) {
      return next(
        new ErrorHandler(
          "Groq API key is invalid. Please update GROQ_API_KEY in backend/config/config.env and restart the backend.",
          401
        )
      );
    }

    if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit")) {
      return next(
        new ErrorHandler(
          "Groq rate limit reached. Please try again shortly.",
          429
        )
      );
    }

    return next(
      new ErrorHandler(
        "SyncoraAI is temporarily unavailable. Please try again in a moment.",
        502
      )
    );
  }

  if (!reply) {
    return next(
      new ErrorHandler(
        "SyncoraAI could not generate a response right now. Please try again.",
        502
      )
    );
  }

  res.status(200).json({
    success: true,
    reply,
  });
});
