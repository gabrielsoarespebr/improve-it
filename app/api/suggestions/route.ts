import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { sentence } = await req.json();

  if (!sentence || sentence.length < 3) {
    return NextResponse.json({ error: "Sentence too short" }, { status: 400 });
  }

  const prompt = `You are an English writing assistant. The user wrote this sentence (may be English or Portuguese — if Portuguese, translate it to English first, then analyze):

"${sentence}"

Return ONLY a valid JSON object. No markdown, no explanation, no code fences.

{
  "grammar_issues": [
    { "error": "the wrong word or phrase", "suggestion": "what to use instead and why" }
  ],
  "casual": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "formal": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "longer": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "shorter": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "creative": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "semantic_commit": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "pull_request_title": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "pull_request_description": ["rewrite 1", "rewrite 2", "rewrite 3"]
}

Rules:
- grammar_issues: list each grammar error found. If no errors, return empty array [].
- casual: relaxed, conversational English.
- formal: professional, polished English.
- longer: expanded with more detail, same meaning.
- shorter: condensed to the essential meaning.
- creative: vivid, interesting, memorable phrasing.
- semantic_commit: conventional commit format (feat/fix/chore/docs/refactor/test/style), each a valid git commit message based on the sentence.
- pull_request_title: concise, imperative PR titles based on the sentence.
- pull_request_description: a short markdown-friendly PR description based on the sentence.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const raw =
      completion.choices[0]?.message?.content
        ?.replace(/```json|```/g, "")
        .trim() ?? "{}";
    console.log("GROQ RAW:", raw);
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
