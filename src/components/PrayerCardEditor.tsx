import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  DeleteOutlined,
  DragOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import { useDraftActions } from "../hooks/useDraftActions";
import type { ListKey, PrayerItem } from "../types";
import DeleteConfirm from "./DeleteConfirm";
import MoveModal from "./MoveModal";

export default function PrayerCardEditor({
  item,
  listKey,
  index,
}: {
  item: PrayerItem;
  listKey: ListKey;
  index: number;
}) {
  const { update, remove, move, shift } = useDraftActions();
  const [moving, setMoving] = useState(false);
  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
    group: listKey,
    type: "item",
    accept: "item",
  });

  return (
    <article ref={ref} className={`card edit${isDragging ? " dragging" : ""}`}>
      <div className="fields">
        <Input
          aria-label="Prayer item"
          placeholder="Enter prayer item"
          value={item.title}
          onChange={(e) => update(listKey, item.id, { title: e.target.value })}
        />
        <Input.TextArea
          aria-label="Prayer request"
          placeholder="Enter prayer request (optional)"
          autoSize={{ minRows: 2 }}
          value={item.note}
          onChange={(e) => update(listKey, item.id, { note: e.target.value })}
        />
      </div>
      <div className="actions">
        <Button
          ref={handleRef}
          className="handle"
          type="text"
          aria-label="Drag to reorder, or press arrow up or down"
          icon={<DragOutlined />}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              shift(listKey, item.id, e.key === "ArrowUp" ? -1 : 1);
            }
          }}
        />
        <Button
          type="text"
          aria-label="Move to another list"
          disabled={!item.title.trim()}
          icon={<FolderOutlined />}
          onClick={() => setMoving(true)}
        />
        <DeleteConfirm onConfirm={() => remove(listKey, item.id)}>
          <Button
            type="text"
            aria-label="Delete prayer item"
            icon={<DeleteOutlined />}
          />
        </DeleteConfirm>
      </div>
      <MoveModal
        item={moving ? item : null}
        from={listKey}
        onClose={() => setMoving(false)}
        onMove={(target) => move(item.id, target)}
      />
    </article>
  );
}
