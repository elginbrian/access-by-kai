"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { useTrustedContacts } from "@/lib/hooks/useTrustedContacts";
import { useTransfers } from "@/lib/hooks/useTransfers";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketNumber: string;
  currentUserId: number;
};

export default function TransferFlowModal({ isOpen, onClose, ticketId, ticketNumber, currentUserId }: Props) {
  const router = useRouter();
  const { data: contacts, error: contactsErr, reload: reloadContacts } = useTrustedContacts(currentUserId);
  const transfers = useTransfers();

  const [selectedContact, setSelectedContact] = React.useState<number | null>(null);
  const [manualRecipientId, setManualRecipientId] = React.useState<string>("");
  const [waitingHours, setWaitingHours] = React.useState<number>(24);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [requestRow, setRequestRow] = React.useState<any | null>(null);
  const [remainingMs, setRemainingMs] = React.useState<number | null>(null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!requestRow) return;
    let interval: any = null;
    const updateRemaining = () => {
      if (!requestRow?.accepted_at) return setRemainingMs(null);
      const acceptedAt = new Date(requestRow.accepted_at).getTime();
      const readyAt = acceptedAt + (requestRow.waiting_period_seconds ?? 0) * 1000;
      const now = Date.now();
      setRemainingMs(Math.max(0, readyAt - now));
    };
    updateRemaining();
    interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [requestRow]);

  React.useEffect(() => {
    let poll: any = null;
    const loadExisting = async () => {
      if (!ticketId) return;
      try {
        const j = await transfers.getByTicket(ticketId);
        if (j?.ok) {
          if (j.data) setRequestRow(j.data);
        }
      } catch (e) {}
    };

    if (!isOpen) {
      setSelectedContact(null);
      setRequestRow(null);
      setRemainingMs(null);
      return;
    }

    loadExisting();
    poll = setInterval(loadExisting, 5000);
    return () => {
      if (poll) clearInterval(poll);
    };
  }, [isOpen]);

  React.useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const timer = setTimeout(() => {
      const el = containerRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      el?.focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);

      try {
        previouslyFocused.current?.focus();
      } catch (e) {}
    };
  }, [onClose]);

  const handleCreateRequest = async () => {
    // allow either a selected trusted contact OR a manual recipient id
    const recipientId = selectedContact ?? (manualRecipientId ? Number(manualRecipientId) : null);
    if (!recipientId) return toast.error("Pilih trusted contact atau masukkan ID penerima");
    setIsSubmitting(true);
    try {
      const payload = {
        from_user_id: currentUserId,
        to_user_id: recipientId,
        tiket_id: ticketId,
        waiting_period_seconds: waitingHours * 3600,
      };

      const j = await transfers.create(payload);
      if (!j?.ok) {
        toast.error(j?.error || "Gagal membuat permintaan transfer");
        setIsSubmitting(false);
        return;
      }

      const created = j.data;
      setRequestRow(created);

      try {
        const acc = await transfers.accept(created.id, currentUserId);
        if (acc?.ok && acc?.data) {
          // refresh server state
          const j2 = await transfers.getByTicket(ticketId);
          if (j2?.ok) setRequestRow(j2.data);
        }
      } catch (e) {
        // continue
      }

      toast.success("Permintaan transfer dibuat. Menunggu konfirmasi penerima.");
      reloadContacts();
    } catch (e: any) {
      toast.error(e?.message ?? String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccept = async () => {
    if (!requestRow) return;
    try {
      const acc = await transfers.accept(requestRow.id, currentUserId);
      if (acc?.ok) {
        const j2 = await transfers.getByTicket(ticketId);
        if (j2?.ok) setRequestRow(j2.data);
        toast.success("Anda telah menerima permintaan");
      } else {
        toast.error(acc?.error || "Gagal accept");
      }
    } catch (e: any) {
      toast.error(e?.message ?? String(e));
    }
  };

  const handleFinalize = async () => {
    if (!requestRow) return;
    setIsSubmitting(true);
    try {
      const res = await transfers.finalize(requestRow.id, currentUserId);
      if (!res?.ok) {
        if (res?.error === "waiting_period_not_elapsed") {
          toast.error("Masih dalam periode tunggu. Tunggu hingga countdown selesai.");
        } else {
          toast.error(res?.error || "Gagal memfinalisasi transfer");
        }
        setIsSubmitting(false);
        return;
      }

      const j2 = await transfers.getByTicket(ticketId);
      if (j2?.ok) setRequestRow(j2.data);
      toast.success("Transfer berhasil diselesaikan");
      onClose();

      setTimeout(() => router.push("/mytickets"), 700);
    } catch (e: any) {
      toast.error(e?.message ?? String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  // don't render anything when closed - keep hooks above this return
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={containerRef} role="dialog" aria-modal="true" aria-label="Transfer Tiket" className="relative mx-auto my-8 max-w-md sm:max-w-lg w-full bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ring-1 ring-black/5">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Transfer Tiket</h3>
            <div className="text-sm text-slate-500">
              No. Tiket: <span className="font-medium text-slate-700">{ticketNumber}</span>
            </div>
          </div>
          <div>
            <button type="button" onClick={onClose} aria-label="Tutup" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 transition">
              Tutup
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 gap-6">
          <div>
            <div className="mb-3">
              <h4 className="font-medium text-slate-900">Trusted Contacts</h4>
              <p className="text-sm text-slate-500">Pilih penerima dari daftar kontak tepercaya Anda (hanya kontak terverifikasi yang bisa dipilih).</p>
            </div>
            <div>
              <div className="space-y-3">
                {(contacts ?? []).length === 0 && <div className="text-sm text-slate-500">Belum ada trusted contact. Tambahkan melalui menu Trusted Contacts.</div>}
                {(contacts ?? []).map((c: any) => {
                  const contactId = Number(c.contact_user_id);
                  const isSelected = contactId === selectedContact;
                  return (
                    <button
                      key={`${c.user_id}-${c.contact_user_id}`}
                      type="button"
                      onClick={() => {
                        if (c.status === "VERIFIED") {
                          setSelectedContact(contactId);
                          setManualRecipientId("");
                        }
                      }}
                      disabled={c.status !== "VERIFIED"}
                      aria-pressed={isSelected}
                      className={`w-full text-left p-3 rounded-md border flex items-center justify-between ${isSelected ? "border-indigo-600 bg-indigo-50" : "border-slate-200 bg-white"} ${
                        c.status !== "VERIFIED" ? "opacity-60 cursor-not-allowed" : "hover:border-indigo-300"
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-800">{c.display_name ?? c.contact_user_id}</div>
                        <div className="text-xs text-slate-500">{c.status === "VERIFIED" ? "Terverifikasi" : c.status}</div>
                      </div>
                      <div className="ml-4">
                        <div className={`px-3 py-1 rounded-md text-sm ${isSelected ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
                          {isSelected ? "Terpilih" : c.status === "VERIFIED" ? "Pilih" : "Tidak terverifikasi"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="block text-sm text-slate-700 mb-2">Atau masukkan ID pengguna penerima</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={manualRecipientId}
                    onChange={(e) => {
                      setManualRecipientId(e.target.value);
                      setSelectedContact(null);
                    }}
                    placeholder="User ID penerima"
                    className="p-2 border rounded-md w-48"
                  />
                  <div className="text-sm text-slate-500">Masukkan user ID tujuan jika penerima tidak ada di trusted contacts.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!requestRow ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm text-slate-700 mb-2">Periode tunggu (jam)</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input
                      type="number"
                      name="waitingHours"
                      value={waitingHours}
                      onChange={(e) => setWaitingHours(Number(e.target.value))}
                      className="w-28 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min={0}
                    />
                    <div className="text-sm text-slate-600">Setel berapa lama setelah kedua pihak menerima sebelum transfer bisa difinalisasi.</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    // enable if user has selected a trusted contact or entered a manual recipient id
                    disabled={
                      isSubmitting ||
                      (!selectedContact && !manualRecipientId) ||
                      // prevent self-transfer
                      Number(manualRecipientId || selectedContact || 0) === currentUserId
                    }
                    onClick={handleCreateRequest}
                    className={`px-4 py-2 rounded-md text-white ${
                      isSubmitting || (!selectedContact && !manualRecipientId) || Number(manualRecipientId || selectedContact || 0) === currentUserId ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isSubmitting ? "Memproses..." : "Buat Permintaan Transfer"}
                  </button>
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white border text-slate-700">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">Status Permintaan</div>
                      <div className="font-medium text-slate-800">{(requestRow.status ?? "PENDING").replace("_", " ")}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${requestRow.from_accepted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          From: {requestRow.from_accepted ? "Accepted" : "Pending"}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${requestRow.to_accepted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>To: {requestRow.to_accepted ? "Accepted" : "Pending"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">Accepted At</div>
                      <div className="font-medium text-slate-700">{requestRow.accepted_at ?? "-"}</div>
                    </div>
                    <div className="text-right">
                      {requestRow.from_accepted && !requestRow.to_accepted && <div className="text-sm text-slate-600">Menunggu penerima untuk menerima</div>}
                      {requestRow.from_accepted && requestRow.to_accepted && (
                        <div>
                          <div className="text-sm text-slate-500">Countdown</div>
                          <div className="font-mono text-lg text-slate-800">
                            {remainingMs != null ? `${Math.floor(remainingMs / 1000 / 3600)}h ${Math.floor(((remainingMs / 1000) % 3600) / 60)}m ${Math.floor((remainingMs / 1000) % 60)}s` : "-"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  {!requestRow.from_accepted && (
                    <button type="button" onClick={handleAccept} className="px-4 py-2 rounded-md bg-indigo-600 text-white">
                      Saya Terima
                    </button>
                  )}

                  {!requestRow.to_accepted && (
                    <button type="button" disabled className="px-4 py-2 rounded-md bg-slate-200 text-slate-600">
                      Menunggu penerima
                    </button>
                  )}

                  {requestRow.from_accepted &&
                    requestRow.to_accepted &&
                    (remainingMs === 0 ? (
                      <button type="button" onClick={handleFinalize} disabled={isSubmitting} className="px-4 py-2 rounded-md bg-emerald-600 text-white">
                        Selesaikan Transfer
                      </button>
                    ) : (
                      <button type="button" disabled className="px-4 py-2 rounded-md bg-slate-100 text-slate-600">
                        Belum siap (tunggu countdown)
                      </button>
                    ))}

                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white border text-slate-700">
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
