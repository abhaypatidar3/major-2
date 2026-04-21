import Groq from "groq-sdk";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

// Same Groq, different prompt — that's the only difference
const REMEDY_PROMPT = `You are a holistic menstrual health advisor with expertise in Ayurveda, nutrition, yoga, and women's wellness.

A user will provide their:
- Cycle phase
- Current mood
- Cravings
- Symptoms they are experiencing

Your job is to respond ONLY with a valid JSON object — no explanation, no markdown, no extra text. 
The JSON must have exactly these 6 keys:

{
  "recipe": { 
    "title": "...", 
    "description": "2 sentence description of a nourishing recipe", 
    "reason": "1 sentence explaining why this helps their specific symptoms" 
  },
  "ayurvedic": { 
    "title": "...", 
    "description": "2 sentence Ayurvedic remedy", 
    "reason": "1 sentence why" 
  },
  "dietary": { 
    "title": "...", 
    "description": "2 sentence dietary recommendation", 
    "reason": "1 sentence why" 
  },
  "yoga": { 
    "title": "...", 
    "description": "2 sentence yoga or gentle exercise suggestion", 
    "reason": "1 sentence why" 
  },
  "home_remedy": { 
    "title": "...", 
    "description": "2 sentence home remedy", 
    "reason": "1 sentence why" 
  },
  "medication": { 
    "title": "...", 
    "description": "General OTC options that are commonly used — never specific dosages", 
    "reason": "1 sentence why", 
    "disclaimer": "Always consult a doctor or pharmacist before taking any medication. Do not self-medicate." 
  }
}`;

export const getRemedySuggestions = catchAsyncErrors(async (req, res, next) => {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

  if (!groqApiKey || !groq) {
    return next(new ErrorHandler("GROQ_API_KEY is missing.", 500));
  }

  // What the user sends from the frontend
  const { phase, mood, cravings, symptoms } = req.body;

  // At least symptoms or mood must be provided
  if (!symptoms?.length && !mood?.length) {
    return next(
      new ErrorHandler("Please provide at least your mood or symptoms.", 400),
    );
  }

  // Build the user message — clean and readable for the AI
  const userMessage = `
    Cycle phase: ${phase || "not specified"}
    Mood: ${Array.isArray(mood) ? mood.join(", ") : mood || "not specified"}
    Cravings: ${Array.isArray(cravings) ? cravings.join(", ") : cravings || "not specified"}
    Symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms || "not specified"}
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: REMEDY_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.5, // lower = more consistent JSON output
      max_completion_tokens: 1000,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || "";

    if (!raw) {
      return next(
        new ErrorHandler(
          "Could not generate recommendations. Please try again.",
          502,
        ),
      );
    }

    // Strip markdown code fences if model wraps JSON in them
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let recommendations;
    try {
      recommendations = JSON.parse(cleaned);
    } catch (parseError) {
      // If JSON parsing fails, return a helpful error instead of crashing
      return next(
        new ErrorHandler(
          "AI response was not in expected format. Please try again.",
          502,
        ),
      );
    }

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    const errorMessage = String(error?.message || "");

    if (
      errorMessage.includes("401") ||
      errorMessage.toLowerCase().includes("invalid api key")
    ) {
      return next(new ErrorHandler("Groq API key is invalid.", 401));
    }
    if (
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("rate limit")
    ) {
      return next(
        new ErrorHandler("Too many requests. Please try again shortly.", 429),
      );
    }

    return next(
      new ErrorHandler("Remedy service is temporarily unavailable.", 502),
    );
  }
});
