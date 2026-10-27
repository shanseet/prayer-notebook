import { useState } from "react";
import { InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import AboutModal from "../components/AboutModal";
import PageHeader from "../components/PageHeader";
import PrayerList from "../components/PrayerList";
import SettingsModal from "../components/SettingsModal";
import { useApp } from "../context/AppProvider";
import { hasSeenAbout, markAboutSeen } from "../utils/storage";
import {
  ordinal,
  toLists,
  todayMonthlyKeys,
  WEEKDAY_NAMES,
  weekdayOf,
  weeklyKey,
} from "../utils/lists";

export default function TodayTab() {
  const { data } = useApp();
  // First visit: open About until it has been dismissed once.
  const [modal, setModal] = useState<"settings" | "about" | null>(() =>
    hasSeenAbout() ? null : "about",
  );
  const now = new Date();
  const lists = toLists(data);
  const weekday = weekdayOf(now);
  const weeklyList = weeklyKey(weekday);
  const monthlyKeys = todayMonthlyKeys(now);
  // On the last day of a short month this covers 29th-31st too, so show the range.
  const dates = monthlyKeys.map((k) => ordinal(Number(k.split(":")[1])));
  const monthLabel =
    dates.length > 1 ? `${dates[0]}–${dates[dates.length - 1]}` : dates[0];

  const sections = [
    { heading: "Daily", key: "daily" as const, items: lists.daily },
    {
      heading: `Weekly (${WEEKDAY_NAMES[weekday]})`,
      key: weeklyList,
      items: lists[weeklyList],
    },
    {
      heading: `Monthly (${monthLabel})`,
      key: monthlyKeys[0],
      items: monthlyKeys.flatMap((k) => lists[k]),
    },
  ];

  return (
    <>
      <PageHeader
        title="Today’s Prayer List"
        subtitle={dayjs(now).format("dddd, D MMMM YYYY")}
        extra={
          <>
            <Button
              type="text"
              aria-label="Settings"
              icon={<SettingOutlined />}
              onClick={() => setModal("settings")}
            />
            <Button
              type="text"
              aria-label="About this notebook"
              icon={<InfoCircleOutlined />}
              onClick={() => setModal("about")}
            />
          </>
        }
      />
      <div className="content">
        {sections.map((s) => (
          <section key={s.key} className="sec">
            <h2 className="label">{s.heading}</h2>
            <PrayerList listKey={s.key} items={s.items} readOnly />
          </section>
        ))}
      </div>
      <SettingsModal
        open={modal === "settings"}
        onClose={() => setModal(null)}
      />
      <AboutModal
        open={modal === "about"}
        onClose={() => {
          markAboutSeen();
          setModal(null);
        }}
      />
    </>
  );
}
