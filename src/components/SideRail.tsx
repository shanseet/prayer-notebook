import { useEffect, useRef } from "react";

export interface RailEntry {
  id: string;
  label: string;
}

/** Sticky left nav. Keeps the active entry visible by scrolling the rail itself, not the page. */
export default function SideRail({
  entries,
  active,
  onPick,
  compact = false,
  label,
}: {
  entries: RailEntry[];
  active: string;
  onPick: (id: string) => void;
  compact?: boolean;
  label: string;
}) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const rail = nav.current;
    const item = rail?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!rail || !item) return;
    const top = item.offsetTop - rail.offsetTop;
    if (top < rail.scrollTop) rail.scrollTop = top;
    else if (top + item.offsetHeight > rail.scrollTop + rail.clientHeight)
      rail.scrollTop = top + item.offsetHeight - rail.clientHeight;
  }, [active]);

  return (
    <nav
      ref={nav}
      className={`rail${compact ? " compact" : ""}`}
      aria-label={label}
    >
      {entries.map((e) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          className={`rail-item${e.id === active ? " on" : ""}`}
          aria-current={e.id === active}
          onClick={(ev) => {
            ev.preventDefault();
            onPick(e.id);
          }}
        >
          {e.label}
        </a>
      ))}
    </nav>
  );
}
