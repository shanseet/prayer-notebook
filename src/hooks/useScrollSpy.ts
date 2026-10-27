import { useCallback, useEffect, useRef, useState } from "react";

const SUPPRESS_MS = 700;

/** Highlights the section nearest the top of the viewport; `jump` scrolls to one and mutes the spy briefly. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const mutedUntil = useRef(0);
  const key = ids.join("|");

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (Date.now() < mutedUntil.current) return;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 24) current = id;
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const jump = useCallback((id: string) => {
    mutedUntil.current = Date.now() + SUPPRESS_MS;
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { active, jump };
}
