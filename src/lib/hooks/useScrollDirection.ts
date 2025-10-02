"use client";

import { useState, useEffect, RefObject } from "react";

interface UseScrollDirectionOptions {
  threshold?: number;
  element?: RefObject<HTMLElement | null>;
}

export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const { threshold = 10, element } = options;
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = element?.current ? element.current.scrollTop : window.pageYOffset;

      setIsAtTop(scrollY < 10);

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? "down" : "up");
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    const scrollElement = element?.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", onScroll);
      return () => scrollElement.removeEventListener("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [threshold, element]);

  return { scrollDirection, isAtTop };
};
