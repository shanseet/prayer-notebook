import { useState } from "react";
import { Modal, Radio, Select } from "antd";
import type { ListKey, PrayerItem, Weekday } from "../types";
import { WEEKDAYS } from "../types";
import {
  DATES,
  monthlyKey,
  ordinal,
  weeklyKey,
  WEEKDAY_NAMES,
} from "../utils/lists";

type Scope = "daily" | "weekly" | "monthly";

export default function MoveModal({
  item,
  from,
  onClose,
  onMove,
}: {
  item: PrayerItem | null;
  from: ListKey;
  onClose: () => void;
  onMove: (target: ListKey) => void;
}) {
  const current = from.split(":")[0] as Scope;
  const scopes = (["daily", "weekly", "monthly"] as Scope[]).filter(
    (s) => s !== current,
  );
  const [scope, setScope] = useState<Scope>(scopes[0]);
  const [day, setDay] = useState<Weekday>("mon");
  const [date, setDate] = useState(1);

  const target = (): ListKey =>
    scope === "daily"
      ? "daily"
      : scope === "weekly"
        ? weeklyKey(day)
        : monthlyKey(date);

  return (
    <Modal
      open={!!item}
      title="Move Prayer Item"
      okText="Move"
      cancelText="Cancel"
      onCancel={onClose}
      onOk={() => {
        onMove(target());
        onClose();
      }}
      destroyOnHidden
      afterOpenChange={(open) => open && setScope(scopes[0])}
    >
      <div className="stack">
        <div>
          <span className="field-label">Move "{item?.title}" to</span>
          <Radio.Group value={scope} onChange={(e) => setScope(e.target.value)}>
            {scopes.map((s) => (
              <Radio key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        {scope === "weekly" && (
          <div>
            <label className="field-label" htmlFor="move-day">
              Day
            </label>
            <Select
              id="move-day"
              style={{ width: "100%" }}
              value={day}
              onChange={setDay}
              options={WEEKDAYS.map((d) => ({
                value: d,
                label: WEEKDAY_NAMES[d],
              }))}
            />
          </div>
        )}
        {scope === "monthly" && (
          <div>
            <label className="field-label" htmlFor="move-date">
              Date
            </label>
            <Select
              id="move-date"
              style={{ width: "100%" }}
              value={date}
              onChange={setDate}
              options={DATES.map((n) => ({ value: n, label: ordinal(n) }))}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
