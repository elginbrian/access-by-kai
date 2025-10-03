import * as React from "react";

export function useTrustedContacts(userId?: number | string | null) {
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<any | null>(null);

  const load = React.useCallback(async () => {
    if (!userId) return setData(null);
    try {
      const res = await fetch(`/api/trusted-contacts/list?userId=${userId}`);
      const j = await res.json();
      if (j?.ok) setData(j.data || []);
      else setError(j?.error ?? "unknown");
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }, [userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const create = async (user_id: number, contact_user_id: number) => {
    const res = await fetch(`/api/trusted-contacts/create`, { method: "POST", body: JSON.stringify({ user_id, contact_user_id }), headers: { "Content-Type": "application/json" } });
    const j = await res.json();
    await load();
    return j;
  };

  const verify = async (user_id: number, contact_user_id: number) => {
    const res = await fetch(`/api/trusted-contacts/verify`, { method: "POST", body: JSON.stringify({ user_id, contact_user_id }), headers: { "Content-Type": "application/json" } });
    const j = await res.json();
    await load();
    return j;
  };

  const revoke = async (user_id: number, contact_user_id: number) => {
    const res = await fetch(`/api/trusted-contacts/revoke`, { method: "POST", body: JSON.stringify({ user_id, contact_user_id }), headers: { "Content-Type": "application/json" } });
    const j = await res.json();
    await load();
    return j;
  };

  return { data, error, create, verify, revoke, reload: load };
}
