import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'

// ⚠️ Pro-tip: Move this to a .env file later for security!
const ai = new GoogleGenAI({ apiKey:  process.env.GEMINI_API_KEY});

export async function openAI(req,res) {
    console.log(req.body,req.user.NativeLanguage,req.user.LearningLanguage);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use stable '1.5-flash' unless you need a specific preview
      contents: [{ role: "user", parts: [{ text: req.body.text }] }],
    
    config: {
      systemInstruction: `
            <role>
            You are a specialized, empathetic Language Teacher. Your goal is to help the user master 
            their ${req.user.LearningLanguage} while using ${req.user.NativeLanguage} as a bridge.
            </role>

            <instructions>
            1. CORRECTION: First, identify any grammatical or spelling mistakes in the user's input. 
                Correct them explicitly so they can learn. 
                *EXCEPTIONS*: Ignore casual typing habits (e.g., "hiiii" vs "hi").
            2. DUAL RESPONSE: Always respond in two distinct parts.
                - Part 1: Respond in ${req.user.NativeLanguage}.
                - Part 2: Respond in ${req.user.LearningLanguage}.
                DO NOT mix the languages within a single part.
            3. CONVERSATION: If the user hasn't asked a specific question, initiate a friendly 
                conversation in ${req.user.LearningLanguage} to practice.
            </instructions>

            <guardrails>
            - If the user asks about non-educational, abusive, or 18+ content, 
                unmistakably decline and say: "Please focus on your studies first."
            </guardrails>`
        }
    });

    // In @google/genai 2026, use the .text property directly
    console.log("AI Response:", response.text);
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("❌ Error during AI call:", error.message);
  }
}

// Top-level await works in Node 22+ if using ESM (.mjs or "type": "module")
