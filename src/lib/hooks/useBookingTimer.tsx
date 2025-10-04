"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface UseBookingTimerProps {
  totalMinutes?: number;
  redirectPath?: string;
  onTimeUp?: () => void;
}

export function useBookingTimer({ totalMinutes = 6, redirectPath = "/trains", onTimeUp }: UseBookingTimerProps = {}) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timeLeftRef = useRef<number>(timeLeft);

  const startTimer = useCallback(() => {
    const startTime = Date.now();
    const endTime = startTime + totalMinutes * 60 * 1000;

    localStorage.setItem("bookingTimerStart", startTime.toString());
    localStorage.setItem("bookingTimerEnd", endTime.toString());

    setIsActive(true);
    setIsTimeUp(false);
  }, [totalMinutes]);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    localStorage.removeItem("bookingTimerStart");
    localStorage.removeItem("bookingTimerEnd");
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(totalMinutes * 60);
    setIsActive(false);
    setIsTimeUp(false);
    localStorage.removeItem("bookingTimerStart");
    localStorage.removeItem("bookingTimerEnd");
  }, [totalMinutes]);

  const resetAndStartTimer = useCallback(() => {
    resetTimer();
    // Start timer setelah reset
    setTimeout(() => {
      startTimer();
    }, 100);
  }, [resetTimer, startTimer]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const getTimePercentage = useCallback(() => {
    const totalSeconds = totalMinutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }, [timeLeft, totalMinutes]);

  useEffect(() => {
    const savedStartTime = localStorage.getItem("bookingTimerStart");
    const savedEndTime = localStorage.getItem("bookingTimerEnd");

    if (savedStartTime && savedEndTime) {
      const now = Date.now();
      const endTime = parseInt(savedEndTime);
      const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setIsActive(true);
      } else {
        setIsTimeUp(true);
        setTimeLeft(0);
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        // safely decrement using ref to avoid recreating effect when timeLeft changes
        const current = timeLeftRef.current;
        if (current <= 1) {
          setIsActive(false);
          setIsTimeUp(true);
          setTimeLeft(0);
          timeLeftRef.current = 0;
        } else {
          const next = current - 1;
          setTimeLeft(next);
          timeLeftRef.current = next;
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (isTimeUp) {
      stopTimer();
      onTimeUp?.();

      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);
    }
  }, [isTimeUp, onTimeUp, router, redirectPath, stopTimer]);

  return {
    timeLeft,
    isActive,
    isTimeUp,
    formattedTime: formatTime(timeLeft),
    timePercentage: getTimePercentage(),
    startTimer,
    stopTimer,
    resetTimer,
    resetAndStartTimer,
  };
}
