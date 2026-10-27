import { Tabs } from "antd";
import { useApp } from "./context/AppProvider";
import type { TabKey } from "./types";
import AnsweredTab from "./tabs/AnsweredTab";
import DailyTab from "./tabs/DailyTab";
import MonthlyTab from "./tabs/MonthlyTab";
import TodayTab from "./tabs/TodayTab";
import WeeklyTab from "./tabs/WeeklyTab";

const PAGES: Record<TabKey, () => React.JSX.Element> = {
  today: TodayTab,
  daily: DailyTab,
  weekly: WeeklyTab,
  monthly: MonthlyTab,
  answered: AnsweredTab,
};
const LABELS: [TabKey, string][] = [
  ["today", "Today"],
  ["daily", "Daily"],
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
  ["answered", "Answered"],
];

export default function App() {
  const { tab, setTab, editing, data } = useApp();
  const Page = PAGES[tab];
  const items = LABELS.filter(
    ([k]) => k !== "answered" || data.answered.length > 0,
  )
    // While editing, every tab except the current one is disabled.
    .map(([key, label]) => ({ key, label, disabled: editing && key !== tab }));

  return (
    <div className="app">
      <div className="shell">
        <Tabs
          type="card"
          activeKey={tab}
          items={items}
          onChange={(k) => setTab(k as TabKey)}
        />
        <main className="panel">
          <Page />
        </main>
      </div>
    </div>
  );
}
