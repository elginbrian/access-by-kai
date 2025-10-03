import * as React from "react";

export function useTransfers() {
  const create = async (payload: any) => {
    const res = await fetch(`/api/transfers/request`, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
    return res.json();
  };

  const accept = async (requestId: number, userId: number) => {
    const res = await fetch(`/api/transfers/accept`, { method: "POST", body: JSON.stringify({ requestId, userId }), headers: { "Content-Type": "application/json" } });
    return res.json();
  };

  const finalize = async (requestId: number, performedBy?: number) => {
    const res = await fetch(`/api/transfers/finalize`, { method: "POST", body: JSON.stringify({ requestId, performedBy }), headers: { "Content-Type": "application/json" } });
    return res.json();
  };

  const getByTicket = async (ticketId: string) => {
    const res = await fetch(`/api/transfers/get?ticketId=${encodeURIComponent(ticketId)}`);
    return res.json();
  };

  return { create, accept, finalize, getByTicket };
}
