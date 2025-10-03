"use client";

import React, { useEffect, useState } from "react";

function formatInlineBold(text: string | null | undefined) {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) parts.push(text.substring(lastIndex, idx));
    parts.push(React.createElement("strong", { key: idx }, match[1]));
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts.length === 1 ? parts[0] : parts;
}

type Metrics = {
  ticketsSold?: number;
  revenue?: number;
  activeSchedules?: number;
  otpPercent?: number;
};

type Props = {
  className?: string;
  metrics?: Metrics | null;
  overrideStructured?: any | null;
  skipFetch?: boolean;
};

export default function SummarizerLarge({ className = "", metrics = null, overrideStructured = null, skipFetch = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [structured, setStructured] = useState<any | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skipFetch) return;
    let mounted = true;
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const q: string[] = [];
        if (metrics?.ticketsSold !== undefined) q.push(`ticketsSold=${metrics.ticketsSold}`);
        if (metrics?.revenue !== undefined) q.push(`revenue=${metrics.revenue}`);
        if (metrics?.activeSchedules !== undefined) q.push(`activeSchedules=${metrics.activeSchedules}`);
        if (metrics?.otpPercent !== undefined) q.push(`otpPercent=${metrics.otpPercent}`);

        const url = `/api/admin/dashboard/summarize${q.length ? `?${q.join("&")}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        if (data.ok) {
          if (data.structured) {
            setStructured(data.data ?? null);
            setSummary(null);
            setLines(null);
          } else {
            setSummary(data.summary ?? null);
            setLines(data.lines ?? null);
            setStructured(null);
          }
        } else {
          setError(data.error ?? "Unknown error");
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, [metrics && JSON.stringify(metrics)]);

  useEffect(() => {
    if (overrideStructured) {
      setStructured(overrideStructured);
      setSummary(null);
      setLines(null);
      setError(null);
      setLoading(false);
    }
  }, [overrideStructured]);

  useEffect(() => {
    const override = (arguments && arguments.length && (arguments as any)[0]) || null;
  }, []);

  return (
    <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Ringkasan & Rekomendasi AI</h3>
      <p className="text-sm text-gray-500 mb-4">Ringkasan otomatis dari kondisi operasional hari ini dan rekomendasi prioritas.</p>

      {loading && <div className="text-gray-600">Memuat ringkasan AI…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      {!loading && !error && (
        <div>
          {structured ? (
            <div>
              <div className="space-y-3 text-gray-700">
                {(structured.summary_lines ?? []).map((s: string, idx: number) => (
                  <p key={idx} className="text-sm leading-relaxed">
                    {formatInlineBold(s)}
                  </p>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {(structured.recommendations ?? []).map((r: string, idx: number) => (
                  <div key={idx} className="p-4 border rounded-md bg-gray-50">
                    <div className="text-sm text-gray-800">{formatInlineBold(r)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => navigator.clipboard?.writeText(JSON.stringify(structured, null, 2))}>
                  Salin Ringkasan
                </button>
                <button className="px-4 py-2 border-gray-800 text-gray-800 border rounded-md" onClick={() => location.reload()}>
                  Perbarui
                </button>
              </div>
            </div>
          ) : summary ? (
            <div>
              <div className="space-y-3 text-gray-700 mb-4">
                {lines && lines.length > 0 ? (
                  lines.map((ln, i) => (
                    <p key={i} className="text-sm leading-relaxed">
                      {formatInlineBold(ln)}
                    </p>
                  ))
                ) : (
                  <div className="text-base">{String(summary)}</div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => navigator.clipboard?.writeText(String(summary) ?? "")}>
                  Salin Ringkasan
                </button>
                <button className="px-4 py-2 border rounded-md" onClick={() => location.reload()}>
                  Perbarui
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">Tidak ada ringkasan tersedia.</div>
          )}
        </div>
      )}
    </div>
  );
}
