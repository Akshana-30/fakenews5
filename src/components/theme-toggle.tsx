"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MoonIcon, SunIcon } from "lucide-react";

function readDOMTheme(): "dark" | "light" {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: "dark" | "light") {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* ignore */ }
}

function isMobile(): boolean {
    return typeof window !== "undefined" &&
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsDark(readDOMTheme() === "dark");
    }, []);

    function toggle() {
        const next = isDark ? "light" : "dark";

        if (
            typeof document === "undefined" ||
            !("startViewTransition" in document) ||
            isMobile()
        ) {
            flushSync(() => setIsDark(next === "dark"));
            applyTheme(next);
            return;
        }

        const rect = btnRef.current?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2;
        const y = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth  - x),
            Math.max(y, window.innerHeight - y),
        );

        try {
            (document as Document & {
                startViewTransition: (cb: () => void) => { ready: Promise<void> };
            }).startViewTransition(() => {
                flushSync(() => {
                    setIsDark(next === "dark");
                    applyTheme(next);
                });
            }).ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${endRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration: 400,
                        easing: "ease-in",
                        pseudoElement: "::view-transition-new(root)",
                    },
                );
            }).catch(() => {});
        } catch {
            flushSync(() => setIsDark(next === "dark"));
            applyTheme(next);
        }
    }

    return (
        <button
            ref={btnRef}
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            suppressHydrationWarning
            style={{
                display: "inline-flex",
                alignItems: "center",
                width: "44px",
                height: "26px",
                borderRadius: "999px",
                border: "1px solid rgba(200,168,75,0.4)",
                background: isDark ? "#cf9126" : "rgba(255,255,255,0.15)",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                position: "relative",
                transition: "background 0.25s, border-color 0.2s",
            }}
        >
            <span
                suppressHydrationWarning
                style={{
                    position: "absolute",
                    top: "3px",
                    left: isDark ? "calc(100% - 22px - 2px)" : "3px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#2d2d2d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "left 0.2s ease",
                    color: isDark ? "#c8a84b" : "#ffffff",
                    pointerEvents: "none",
                }}
            >
                {isDark
                    ? <MoonIcon style={{ width: "10px", height: "10px" }} />
                    : <SunIcon  style={{ width: "10px", height: "10px" }} />
                }
            </span>
        </button>
    );
}
