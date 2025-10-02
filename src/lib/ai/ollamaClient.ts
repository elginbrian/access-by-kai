export type OllamaResponse = {
  content: string;
};

export async function callOllama(prompt: string) {
  const base = process.env.OLLAMA_URL || "http://localhost:11434";
  let model = process.env.OLLAMA_MODEL || "gemma:2b";
  if (!model.includes(":") && model.includes("-")) {
    model = model.replace(/-(\d+)b$/, ":$1b");
  }

  const res = await fetch(`${base}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: model, prompt, stream: false }),
  });
  if (!res.ok) {
    let bodyText = "";
    try {
      bodyText = await res.text();
    } catch (e) {
      bodyText = String(e);
    }
    console.error(`Ollama returned non-OK status ${res.status}:`, bodyText);
    throw new Error(`ollama error ${res.status}: ${bodyText}`);
  }
  const data = await res.json();
  const content = data?.response ?? data?.output ?? data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
  return { content } as OllamaResponse;
}
