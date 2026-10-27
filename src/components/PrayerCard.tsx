import type { PrayerItem } from "../types";
import AnsweredPopover from "./AnsweredPopover";

/** Read-only card; the "mark as answered" tick is hidden when `answerable` is false (Today tab). */
export default function PrayerCard({
  item,
  answerable = true,
}: {
  item: PrayerItem;
  answerable?: boolean;
}) {
  return (
    <article className="card view">
      <div className="card-main">
        <h3 className="item-title">{item.title}</h3>
        {item.note.trim() && <p className="item-note">{item.note}</p>}
      </div>
      {answerable && <AnsweredPopover id={item.id} />}
    </article>
  );
}
