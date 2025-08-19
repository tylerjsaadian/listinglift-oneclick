import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { facts = {}, tone = "professional, upbeat" } = req.body || {};
    const sys = "You are an expert real estate copywriter. Keep content MLS-safe and concise.";
    const user = `Write a 150–220 word listing description. Facts: ${JSON.stringify(facts)}. Tone: ${tone}.
Also provide 5 short bullet highlights and 10 brief social captions. Return JSON with keys: description, bullets, captions.`;

    const out = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      temperature: 0.5
    });

    const text = out.choices?.[0]?.message?.content || "{}";
    let payload;
    try { payload = JSON.parse(text); } catch { payload = { description: text, bullets: [], captions: [] }; }
    return res.status(200).json(payload);
  } catch (err) {
    return res.status(500).json({
      error: "copy_generation_failed",
      detail: err?.response?.data?.error?.message || err?.message || "unknown_error"
    });
  }
}
