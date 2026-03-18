export async function POST(req) {
  const body = await req.json();

  const messages = [
    { role: "system", content: body.system },
    ...body.messages
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  return Response.json({ content: [{ text }] });
}
