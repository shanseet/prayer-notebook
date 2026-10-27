import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm } from "antd";
import { useApp } from "../context/AppProvider";

export default function AnsweredPopover({ id }: { id: string }) {
  const { markAnswered, settings } = useApp();
  const [note, setNote] = useState("");
  if (!settings.answeredEnabled) return null;
  return (
    <Popconfirm
      icon={null}
      title="Mark prayer as answered?"
      okText="Ok"
      cancelText="Cancel"
      placement="bottomRight"
      onOpenChange={(open) => open && setNote("")}
      onConfirm={() => markAnswered(id, note)}
      description={
        <label className="pop-field">
          <span>Add a note (optional)</span>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. 26 Jun 2026, Eph 6:18"
          />
        </label>
      }
    >
      <Button
        className="tick"
        type="text"
        size="small"
        aria-label="Mark as answered"
        icon={<CheckOutlined />}
      />
    </Popconfirm>
  );
}
