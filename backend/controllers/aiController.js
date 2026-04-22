import Groq from "groq-sdk";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { CycleLog } from "../models/cycleLogSchema.js";

const BASE_SYSTEM_PROMPT = `You are SyncoraAI — a warm, empathetic, and knowledgeable AI health companion embedded inside the Syncora menstrual health platform.

Your role:
• Provide personalised menstrual health care, support, and education.
• When a user describes symptoms (cramps, headaches, bloating, fatigue, mood swings, back pain, nausea, etc.) offer tailored, evidence-informed advice: natural remedies, dietary tips, gentle yoga/exercise suggestions, breathing techniques, when to consider OTC medication, and when to see a doctor.
• Be conversational, compassionate, and non-judgmental — like a caring nurse friend.
• You may discuss general menstrual cycle phases, PMS, PMDD, PCOS, endometriosis awareness, and hygiene tips.
• Always remind users you are an AI assistant and not a replacement for professional medical advice. If symptoms sound severe or unusual, recommend consulting a healthcare provider.
• Use the user's profile and recent cycle data (provided below) to personalise every response. Reference their specific conditions, cycle patterns, and recent symptoms naturally — don't just recite the data back, weave it into your advice.

Boundaries — you must NEVER:
• Diagnose medical conditions.
• Prescribe specific medications or dosages.
• Provide advice on topics unrelated to menstrual health, women's reproductive wellness, or general self-care during periods.
• If asked about unrelated topics, politely redirect: "I'm here to help with menstrual health and wellness! How can I support you today?"

Tone: Warm, supportive, clear, and encouraging. Use simple language. You may use gentle emojis sparingly (💜, 🌸, 🩺, 💧) to feel approachable.

Format: Keep responses concise (2-4 short paragraphs max). Use bullet points for lists of tips. Bold key terms with **markdown**.`;

// Builds the personalised context block from DB data
const buildUserContext = (user, logs) => {
  if (!user) return "";

  // ── Cycle log analysis ─────────────────────────────────────
  const flowDays = logs.filter((l) => l.flow && l.flow !== "none");
  const heavyDays = flowDays.filter((l) => l.flow === "heavy").length;
  const mediumDays = flowDays.filter((l) => l.flow === "medium").length;
  const lightDays = flowDays.filter((l) => l.flow === "light").length;

  // Top symptoms by frequency
  const symptomCount = {};
  logs.forEach((l) =>
    l.symptoms.forEach((s) => {
      symptomCount[s] = (symptomCount[s] || 0) + 1;
    })
  );
  const topSymptoms = Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([s, c]) => `${s} (${c}x)`);

  // Top moods by frequency
  const moodCount = {};
  logs.forEach((l) =>
    l.mood.forEach((m) => {
      moodCount[m] = (moodCount[m] || 0) + 1;
    })
  );
  const topMoods = Object.entries(moodCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([m, c]) => `${m} (${c}x)`);

  // Most recent log details (last 3 days logged)
  const recentLogs = logs.slice(-3).map((l) => {
    const d = new Date(l.date).toDateString();
    const parts = [];
    if (l.flow && l.flow !== "none") parts.push(`flow: ${l.flow}`);
    if (l.symptoms?.length) parts.push(`symptoms: ${l.symptoms.join(", ")}`);
    if (l.mood?.length) parts.push(`mood: ${l.mood.join(", ")}`);
    if (l.notes) parts.push(`notes: "${l.notes}"`);
    return `  • ${d} — ${parts.length ? parts.join(" | ") : "no details"}`;
  });

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER PROFILE (use this to personalise responses):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Name: ${user.firstname}
- Age: ${user.age}
- City: ${user.city || "not set"}
- Average cycle length: ${user.avgCycleLength ? `${user.avgCycleLength} days` : "not set"}
- Cycle regularity: ${user.cycleRegularity || "not specified"}
- Period duration: ${user.periodDuration ? `${user.periodDuration} days` : "not set"}
- Last period start: ${user.lastPeriodStartDate ? new Date(user.lastPeriodStartDate).toDateString() : "not set"}
- Known medical conditions: ${user.Medical_Conditions?.length ? user.Medical_Conditions.join(", ") : "none reported"}
- Currently on medication: ${user.currentMedications ? "yes" : "no"}

RECENT CYCLE DATA (last 3 months, ${logs.length} logged days):
- Flow breakdown: light ${lightDays}d · medium ${mediumDays}d · heavy ${heavyDays}d
- Most frequent symptoms: ${topSymptoms.length ? topSymptoms.join(", ") : "none logged"}
- Most frequent moods: ${topMoods.length ? topMoods.join(", ") : "none logged"}
- Most recent entries:
${recentLogs.length ? recentLogs.join("\n") : "  • No recent logs"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
};

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

  // ── Fetch user profile + cycle logs in parallel ────────────
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [user, logs] = await Promise.all([
    User.findById(req.user._id).select(
      "firstname age city avgCycleLength cycleRegularity periodDuration lastPeriodStartDate Medical_Conditions currentMedications"
    ),
    CycleLog.find({
      user: req.user._id,
      date: { $gte: threeMonthsAgo },
    }).sort({ date: 1 }),
  ]);

  // ── Build personalised system prompt ──────────────────────
  const userContext = buildUserContext(user, logs);
  const systemPrompt = userContext
    ? `${BASE_SYSTEM_PROMPT}\n\n${userContext}`
    : BASE_SYSTEM_PROMPT;

  // ── Assemble messages ──────────────────────────────────────
  const chatMessages = [
    { role: "system", content: systemPrompt },
    {
      role: "assistant",
      content: `Understood! I'm SyncoraAI 💜 — your menstrual health companion. I'm here to help you with symptom relief, cycle insights, and wellness tips. How can I support you today? 🌸`,
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

  // ── Call Groq ──────────────────────────────────────────────
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

    if (
      errorMessage.includes("401") ||
      errorMessage.toLowerCase().includes("invalid api key")
    ) {
      return next(
        new ErrorHandler(
          "Groq API key is invalid. Please update GROQ_API_KEY in backend/config/config.env and restart the backend.",
          401
        )
      );
    }

    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("rate limit")
    ) {
      return next(
        new ErrorHandler("Groq rate limit reached. Please try again shortly.", 429)
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

  res.status(200).json({ success: true, reply });
});