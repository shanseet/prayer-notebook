import ListsDnd from "../components/ListsDnd";
import PageHeader from "../components/PageHeader";
import SectionedView from "../components/SectionedView";
import type { Section } from "../components/SectionedView";
import { useApp } from "../context/AppProvider";
import { WEEKDAYS } from "../types";
import {
  hasAny,
  toLists,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  weeklyKey,
} from "../utils/lists";

const sections: Section[] = WEEKDAYS.map((d) => ({
  key: weeklyKey(d),
  rail: WEEKDAY_SHORT[d],
  heading: WEEKDAY_NAMES[d],
}));

export default function WeeklyTab() {
  const { data, draft } = useApp();
  const lists = draft ?? toLists(data);
  return (
    <>
      <PageHeader
        title="Weekly Prayers"
        subtitle="For the people or things you want to pray for once a week."
        showEdit={hasAny(lists, "weekly:")}
      />
      <ListsDnd>
        <SectionedView
          sections={sections}
          lists={lists}
          label="Days of the week"
        />
      </ListsDnd>
    </>
  );
}
