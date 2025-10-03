"use client";

import * as React from "react";
import NavBarServices from "@/components/navbar/NavBarServices";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTrustedContacts } from "@/lib/hooks/useTrustedContacts";
import toast from "react-hot-toast";
import Icon from "@/components/ui/Icon";
import { useRouter } from "next/navigation";

export default function TrustedContactsPage() {
  const { user } = useAuth();
  const userId = user?.profile?.user_id ?? null;
  const { data: contacts, error, create, verify, revoke, reload } = useTrustedContacts(userId ?? undefined);
  const [newContactId, setNewContactId] = React.useState<number | string>("");
  const router = useRouter();

  const handleAdd = async () => {
    if (!userId) return toast.error("User tidak ditemukan");
    const id = Number(newContactId);
    if (!id) return toast.error("Masukkan ID pengguna yang valid");
    const res = await create(Number(userId), id);
    if (res?.ok) {
      toast.success("Permintaan trusted contact terkirim");
      setNewContactId("");
      reload();
    } else {
      toast.error(res?.error || "Gagal menambahkan trusted contact");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBarServices service="" />
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Trusted Contacts</h1>
            <p className="text-sm text-slate-600">Kelola kontak tepercaya untuk transfer tiket</p>
          </div>
          <div>
            <button onClick={() => router.push("/mytickets")} className="px-3 py-2 rounded-md bg-white border">
              Kembali
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="mb-4">
            <label className="block text-sm text-slate-700 mb-2">Tambahkan trusted contact berdasarkan user ID</label>
            <div className="flex gap-2">
              <input value={newContactId} onChange={(e) => setNewContactId(e.target.value)} className="p-2 border rounded w-48" placeholder="Contact user id" />
              <button onClick={handleAdd} className="px-3 py-2 rounded bg-indigo-600 text-white">
                Tambah
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Daftar Trusted Contacts</h3>
            {(!contacts || contacts.length === 0) && <div className="text-sm text-slate-500">Belum ada trusted contacts.</div>}
            <div className="space-y-2">
              {(contacts ?? []).map((c: any) => (
                <div key={`${c.user_id}-${c.contact_user_id}`} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.display_name ?? c.contact_user_id}</div>
                    <div className="text-xs text-slate-500">{c.status}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status !== "VERIFIED" && (
                      <button
                        onClick={async () => {
                          const r = await verify(Number(userId), Number(c.contact_user_id));
                          if (r?.ok) {
                            toast.success("Terverifikasi");
                            reload();
                          } else toast.error(r?.error || "Gagal verify");
                        }}
                        className="px-2 py-1 rounded bg-emerald-600 text-white text-sm"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const r = await revoke(Number(userId), Number(c.contact_user_id));
                        if (r?.ok) {
                          toast.success("Dibatalkan");
                          reload();
                        } else toast.error(r?.error || "Gagal revoke");
                      }}
                      className="px-2 py-1 rounded bg-red-100 text-red-700 text-sm"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
