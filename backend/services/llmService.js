import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Send a prompt to Groq LLaMA and return the text response.
 * @param {string} prompt
 * @param {object} [opts]  - { json: true } to parse response as JSON
 */
export async function ask(prompt, opts = {}) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not set");

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content;

  if (opts.json) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("AI did not return valid JSON");
    return JSON.parse(text.slice(start, end + 1));
  }

  return text;
}
