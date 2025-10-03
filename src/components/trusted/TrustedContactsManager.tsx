"use client";

import * as React from "react";
import { useTrustedContacts } from "@/lib/hooks/useTrustedContacts";

type Props = { userId: number };

export default function TrustedContactsManager({ userId }: Props) {
  const { data, error, create, verify, revoke, reload } = useTrustedContacts(userId);
  const [newId, setNewId] = React.useState<string>("");

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2">Trusted Contacts</h3>
      {error && <div className="text-sm text-red-500">{String(error)}</div>}
      <div className="space-y-2">
        {(data ?? []).map((c: any) => (
          <div key={`${c.user_id}-${c.contact_user_id}`} className="flex items-center justify-between">
            <div>
              <div className="text-sm">{c.contact_user_id}</div>
              <div className="text-xs text-gray-500">{c.status}</div>
            </div>
            <div className="flex items-center gap-2">
              {c.status !== "VERIFIED" && (
                <button className="px-2 py-1 bg-green-50 text-green-700 rounded" onClick={() => verify(c.user_id, c.contact_user_id)}>
                  Verify
                </button>
              )}
              <button className="px-2 py-1 bg-red-50 text-red-700 rounded" onClick={() => revoke(c.user_id, c.contact_user_id)}>
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input value={newId} onChange={(e) => setNewId(e.target.value)} className="border p-2 rounded mr-2" placeholder="Contact user id" />
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => create(userId, Number(newId))}>
          Invite
        </button>
        <button className="ml-2 px-3 py-1 bg-gray-100 rounded" onClick={() => reload()}>
          Refresh
        </button>
      </div>
    </div>
  );
}
