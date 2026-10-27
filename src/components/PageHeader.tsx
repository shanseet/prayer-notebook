import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { ReactNode } from "react";
import { useApp } from "../context/AppProvider";

/** Title and subtitle, plus Edit (view mode) or Cancel/Save (edit mode). */
export default function PageHeader({
  title,
  subtitle,
  showEdit = false,
  extra,
}: {
  title: string;
  subtitle: ReactNode;
  showEdit?: boolean;
  extra?: ReactNode;
}) {
  const { editing, startEdit, cancelEdit, saveEdit } = useApp();
  return (
    <div className={`head${extra ? " pinned" : ""}`}>
      <div className="head-text">
        <h1 className="h1">{title}</h1>
        <p className="sub">{subtitle}</p>
      </div>
      <div className="head-actions">
        {extra}
        {showEdit && !editing && (
          <Button icon={<EditOutlined />} onClick={() => startEdit()}>
            Edit
          </Button>
        )}
        {editing && (
          <>
            <Button onClick={cancelEdit}>Cancel</Button>
            <Button type="primary" onClick={saveEdit}>
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
