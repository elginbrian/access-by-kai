"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "logistic.flow.v1";

export type LogisticFlow = {
  simulation?: {
    origin?: number | string | null;
    destination?: number | string | null;
    estimate?: any;
  };
  booking?: {
    sender?: { name?: string; phone?: string; address?: string };
    receiver?: { name?: string; phone?: string; address?: string };
  };
  order?: { orderId?: string };
};

function readFlow(): LogisticFlow {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LogisticFlow;
  } catch (e) {
    console.error("Failed to read logistic flow from localStorage", e);
    return {};
  }
}

function writeFlow(flow: LogisticFlow) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));

    window.dispatchEvent(new Event("logisticFlowUpdated"));
  } catch (e) {
    console.error("Failed to write logistic flow to localStorage", e);
  }
}

export function useLogisticFlow() {
  const [flow, setFlow] = useState<LogisticFlow>(() => {
    if (typeof window === "undefined") return {};
    return readFlow();
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key !== STORAGE_KEY) return;
      setFlow(readFlow());
    };
    const onCustom = () => setFlow(readFlow());

    window.addEventListener("storage", onStorage);
    window.addEventListener("logisticFlowUpdated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("logisticFlowUpdated", onCustom);
    };
  }, []);

  const setSimulation = useCallback((sim: Partial<NonNullable<LogisticFlow["simulation"]>>) => {
    const next = { ...readFlow(), simulation: { ...(readFlow().simulation || {}), ...(sim || {}) } } as LogisticFlow;
    writeFlow(next);
    setFlow(next);
  }, []);

  const updateBooking = useCallback((booking: Partial<NonNullable<LogisticFlow["booking"]>>) => {
    const next = { ...readFlow(), booking: { ...(readFlow().booking || {}), ...(booking || {}) } } as LogisticFlow;
    writeFlow(next);
    setFlow(next);
  }, []);

  const setOrder = useCallback((order: Partial<NonNullable<LogisticFlow["order"]>>) => {
    const next = { ...readFlow(), order: { ...(readFlow().order || {}), ...(order || {}) } } as LogisticFlow;
    writeFlow(next);
    setFlow(next);
  }, []);

  const clearFlow = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("logisticFlowUpdated"));
      setFlow({});
    } catch (e) {
      console.error("Failed to clear logistic flow", e);
    }
  }, []);

  return {
    flow,
    setSimulation,
    updateBooking,
    setOrder,
    clearFlow,
    readFlow,
  } as const;
}

export default useLogisticFlow;
