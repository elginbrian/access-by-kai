import * as React from "react";
import { useTransfers } from "./useTransfers";

export function useTransferRequests(userId?: number | string | null) {
  const [data, setData] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const transfers = useTransfers();

  const load = React.useCallback(async () => {
    if (!userId) return setData([]);
    setLoading(true);
    try {
      const res = await fetch(`/api/transfers/list?userId=${encodeURIComponent(String(userId))}`);
      const j = await res.json();
      if (j?.ok) setData(j.data || []);
      else setData([]);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const accept = async (requestId: number, userId: number) => {
    const j = await transfers.accept(requestId, userId);
    await load();
    return j;
  };

  const finalize = async (requestId: number, userId?: number) => {
    const j = await transfers.finalize(requestId, userId);
    await load();
    return j;
  };

  return { data, loading, reload: load, accept, finalize };
}
