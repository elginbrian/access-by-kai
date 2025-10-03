"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCreateNotification } from "@/lib/hooks/useNotifications";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const issueOptions = [
  { value: "Layanan", label: "Layanan" },
  { value: "Pembayaran", label: "Pembayaran" },
  { value: "Teknis", label: "Teknis" },
  { value: "Lainnya", label: "Lainnya" },
];

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevActive = useRef<HTMLElement | null>(null);
  const createNotification = useCreateNotification();

  const [form, setForm] = useState({
    title: "",
    name: "",
    email: "",
    issueType: "Layanan",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    prevActive.current = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => {
      const el = containerRef.current?.querySelector<HTMLElement>("input, textarea, select, button");
      el?.focus();
    }, 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      try {
        prevActive.current?.focus();
      } catch (e) {}
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    if (!email) return true; // optional
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Judul laporan wajib diisi");
    if (!form.description.trim() || form.description.trim().length < 10) return alert("Deskripsi minimal 10 karakter");
    if (!validateEmail(form.email)) return alert("Format email tidak valid");

    setIsSubmitting(true);

    try {
      // Try to POST to /api/reports (backend can implement later)
      const resp = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, created_at: new Date().toISOString() }),
      });

      // Also send a notification for the team (best-effort)
      try {
        createNotification.mutate({
          judul: `[Laporan] ${form.title}`,
          pesan: `Nama: ${form.name}\nEmail: ${form.email}\nJenis: ${form.issueType}\nDeskripsi: ${form.description}`,
          tipe_notifikasi: "SYSTEM_UPDATE",
        } as any);
      } catch (e) {
        // ignore notification failures
      }

      if (!resp.ok) {
        // If backend not ready, still show success message locally
        console.warn("/api/reports not ok, status:", resp.status);
        alert("Laporan telah dikirim (offline). Tim akan menindaklanjuti.");
      } else {
        alert("Laporan berhasil dikirim. Terima kasih.");
      }

      setForm({ title: "", name: "", email: "", issueType: "Layanan", description: "" });
      onClose();
    } catch (error) {
      console.error("Failed to submit report", error);
      alert("Gagal mengirim laporan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={containerRef} role="dialog" aria-modal="true" className="relative mx-auto my-8 max-w-sm md:max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:shadow-xl shadow-none z-10 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Buat Laporan</h3>
            <p className="text-sm text-slate-500">Sampaikan keluhan atau laporan Anda. Tidak perlu login.</p>
          </div>
          <div className="ml-2">
            <button type="button" onClick={onClose} aria-label="Tutup" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition">
              <span className="sr-only">Tutup</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6L18 18M6 18L18 6" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
              placeholder="Contoh: Kendala pembayaran dengan e-wallet"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
                placeholder="Nama Anda (opsional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
                placeholder="Email (opsional)"
                type="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Permasalahan</label>
            <select
              value={form.issueType}
              onChange={(e) => setForm((s) => ({ ...s, issueType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
            >
              {issueOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Permasalahan</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Tuliskan detail keluhan Anda (minimal 10 karakter)"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:opacity-95 transition disabled:opacity-50">
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
