import { useScrollSpy } from "../hooks/useScrollSpy";
import type { ListKey, Lists } from "../types";
import PrayerList from "./PrayerList";
import SideRail from "./SideRail";

export interface Section {
  key: ListKey;
  rail: string;
  heading: string;
}

/** Weekly/Monthly body: sticky nav rail on the left, one labelled PrayerList per section. */
export default function SectionedView({
  sections,
  lists,
  compact = false,
  label,
}: {
  sections: Section[];
  lists: Lists;
  compact?: boolean;
  label: string;
}) {
  const ids = sections.map((s) => s.key);
  const { active, jump } = useScrollSpy(ids);

  return (
    <div className="body">
      <SideRail
        label={label}
        compact={compact}
        active={active}
        onPick={jump}
        entries={sections.map((s) => ({ id: s.key, label: s.rail }))}
      />
      <div className="content">
        {sections.map((s) => (
          <section key={s.key} id={s.key} className="sec">
            <h2 className="label">{s.heading}</h2>
            <PrayerList listKey={s.key} items={lists[s.key]} />
          </section>
        ))}
      </div>
    </div>
  );
}
