import ListsDnd from "../components/ListsDnd";
import PageHeader from "../components/PageHeader";
import SectionedView from "../components/SectionedView";
import type { Section } from "../components/SectionedView";
import { useApp } from "../context/AppProvider";
import { DATES, hasAny, monthlyKey, ordinal, toLists } from "../utils/lists";

const sections: Section[] = DATES.map((n) => ({
  key: monthlyKey(n),
  rail: String(n),
  heading: ordinal(n),
}));

export default function MonthlyTab() {
  const { data, draft } = useApp();
  const lists = draft ?? toLists(data);
  return (
    <>
      <PageHeader
        title="Monthly Prayers"
        subtitle="For the people or things you want to pray for once a month."
        showEdit={hasAny(lists, "monthly:")}
      />
      <ListsDnd>
        <SectionedView
          sections={sections}
          lists={lists}
          compact
          label="Dates of the month"
        />
      </ListsDnd>
    </>
  );
}
