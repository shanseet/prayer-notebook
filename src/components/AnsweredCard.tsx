import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useApp } from "../context/AppProvider";
import type { PrayerItem } from "../types";
import DeleteConfirm from "./DeleteConfirm";

export default function AnsweredCard({ item }: { item: PrayerItem }) {
  const { deleteAnswered } = useApp();
  return (
    <article className="card view">
      <div className="card-main">
        <h3 className="item-title">{item.title}</h3>
        {item.note.trim() && <p className="item-note">{item.note}</p>}
        <p className="ans">
          <CheckOutlined aria-hidden />
          <span>{item.answeredNote || "Answered"}</span>
        </p>
      </div>
      <DeleteConfirm
        onConfirm={() => deleteAnswered(item.id)}
        placement="bottomRight"
      >
        <Button
          className="tick"
          type="text"
          size="small"
          aria-label="Delete answered prayer"
          icon={<DeleteOutlined />}
        />
      </DeleteConfirm>
    </article>
  );
}
