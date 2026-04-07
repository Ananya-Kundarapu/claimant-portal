import { VertexAI } from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
  project: "se-asset-build-dev",
  location: "us-central1",
});

const model = vertex_ai.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export const generateNextQuestion = async (req, res) => {
  console.log("🔥 AI ROUTE HIT");

  try {

    const { answers = {}, formData = {}, employers = [] } = req.body;

    const latestEmployer = employers?.[0] || {};
    const reason = latestEmployer?.reason || "unknown";

    const prompt = `
You are an intelligent unemployment claim investigator.
============================
User Data:
${JSON.stringify(formData, null, 2)}

Latest Employer:
${JSON.stringify(latestEmployer, null, 2)}

Conversation So Far:
${JSON.stringify(answers, null, 2)}
============================

🎯 YOUR ROLE:
- Ask ONLY ONE question at a time
- Act like a real investigator
- Ask deep follow-up questions
- Try to uncover the truth behind job loss
- Be conversational but professional

============================

📌 FLOW:

STEP 1:
If no answers → ask first question based on reason

STEP 2:
If answers exist → ask deeper follow-up questions

STEP 3:
Ask 3–5 investigation questions MAX

STEP 4:
Then ask eligibility questions (ONE by ONE):
- Are you currently working?
- Are you able to work physically and mentally?
- Are you actively looking for work?
- Any additional details?

STEP 5:
When everything is complete → STOP and return:

{
  "done": true,
  "message": "Thank you for providing all the details.",
  "documents": [...]
}

============================

📌 DOCUMENT RULES (VERY IMPORTANT)

- DO NOT include base documents:
  - Identity Proof
  - SSN
  - Employment Proof
  - Separation Proof

- ONLY return additional documents based on:
  - Reason
  - User answers
  - Context

- Think like a real claim officer

Examples:

If user says:
- "I was laid off" → Layoff notice
- "I was sick" → Medical certificate
- "I refused job" → Job offer proof
- "Still working part-time" → Current employment proof
- "Not able to work" → Medical ability proof

============================

📌 RESPONSE FORMAT (STRICT JSON)

IF asking question:

{
  "question": "Your question",
  "field": "unique_field_name",
  "type": "text"
}

OR

{
  "question": "Your question",
  "field": "unique_field_name",
  "type": "boolean"
}

IF DONE:

{
  "done": true,
  "message": "Thank you for providing all the details.",
  "documents": [
    {
      "id": "doc_id",
      "label": "Document Name",
      "required": true
    }
  ]
}

============================
`;

    const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
});

const response = result.response;

let text =
  response.candidates?.[0]?.content?.parts?.[0]?.text || "";

text = text.trim();

    text = text.replace(/```json|```/g, "");

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      parsed = {
        question: "Can you explain more about why you lost your job?",
        field: "reason_detail",
        type: "text",
      };
    }

    res.json(parsed);

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
};

export const aiHelpChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const chatHistory = history
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
      .join('\n');

    const prompt = `
You are a helpful AI assistant for unemployment claims.

- Be conversational
- Help users understand forms
- Guide them step-by-step
- Keep answers simple and clear

Conversation:
${chatHistory}

User: ${message}

Respond like a helpful assistant:
`;

    const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
});

const response = result.response;

const text =
  response.candidates?.[0]?.content?.parts?.[0]?.text || "";

res.json({ reply: text });
  } catch (err) {
    console.error("AI HELP ERROR:", err);
    res.status(500).json({ reply: "Something went wrong" });
  }
};