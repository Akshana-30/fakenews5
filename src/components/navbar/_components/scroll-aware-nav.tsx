"use client";
import { useState, useEffect, useRef } from "react";

export default function ScrollAwareNav({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) setHidden(false);            // at top → show
      else if (y > lastY.current) setHidden(true);  // down → hide
      else setHidden(false);                   // up → show
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`relative z-10 transition-transform duration-300 ease-in-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}