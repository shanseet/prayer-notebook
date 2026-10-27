import ListsDnd from "../components/ListsDnd";
import PageHeader from "../components/PageHeader";
import PrayerList from "../components/PrayerList";
import { useApp } from "../context/AppProvider";
import { toLists } from "../utils/lists";

export default function DailyTab() {
  const { data, draft } = useApp();
  const lists = draft ?? toLists(data);
  return (
    <>
      <PageHeader
        title="Daily Prayers"
        subtitle={
          <>
            For the people or things closest to your heart. <br />
            Tip: Put your own name as the first item in this list.
          </>
        }
        showEdit={lists.daily.length > 0}
      />
      <ListsDnd>
        <div className="content">
          <PrayerList listKey="daily" items={lists.daily} />
        </div>
      </ListsDnd>
    </>
  );
}
