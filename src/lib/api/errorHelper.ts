export type ErrorInfo = {
  status: number;
  code: string;
  message: string;
  hint?: string;
};

export function mapErrorToInfo(err: any): ErrorInfo {
  if (!err) return { status: 500, code: "internal_error", message: "An unknown error occurred." };

  if (err.name === "ModelUnavailable") {
    return {
      status: 502,
      code: "model_unavailable",
      message: "The primary AI model is currently unavailable.",
      hint: "Primary model failed and no fallback configured. Set GEMINI_API_KEY or fix OLLAMA_URL.",
    };
  }

  if (err.name === "ModelFallbackFailed") {
    return {
      status: 502,
      code: "model_fallback_failed",
      message: "Both primary and fallback AI models failed.",
      hint: "Check OLLAMA_URL and GEMINI_API_KEY, and ensure the services are reachable.",
    };
  }

  const msg = err?.message ?? String(err);
  if (msg?.toLowerCase().includes("ollama error")) {
    return {
      status: 502,
      code: "model_error",
      message: "AI model returned an error.",
      hint: "Check your Ollama instance (OLLAMA_URL) or fallback configuration.",
    };
  }

  return { status: 500, code: "internal_error", message: msg || "Internal server error" };
}
