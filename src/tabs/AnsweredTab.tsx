import AnsweredCard from "../components/AnsweredCard";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppProvider";

export default function AnsweredTab() {
  const { data } = useApp();
  return (
    <>
      <PageHeader
        title="Answered Prayers"
        subtitle="A record of God’s faithfulness"
      />
      <div className="content">
        <div className="list">
          {data.answered.map((i) => (
            <AnsweredCard key={i.id} item={i} />
          ))}
        </div>
      </div>
    </>
  );
}
