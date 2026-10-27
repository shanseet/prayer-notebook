import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useApp } from "../context/AppProvider";
import { useDraftActions } from "../hooks/useDraftActions";
import type { ListKey, PrayerItem } from "../types";
import PrayerCard from "./PrayerCard";
import PrayerCardEditor from "./PrayerCardEditor";

/**
 * One list of prayer items. View mode shows cards (or a lone "Add Prayer Item" when empty);
 * edit mode shows sortable editors, a drop target for empty lists, and a dashed add button.
 */
export default function PrayerList({
  listKey,
  items,
  readOnly = false,
}: {
  listKey: ListKey;
  items: PrayerItem[];
  /** Today tab: view only, never offers to add. */
  readOnly?: boolean;
}) {
  const { editing, startEdit } = useApp();
  const { add } = useDraftActions();
  const { ref, isDropTarget } = useDroppable({
    id: listKey,
    type: "list",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
    disabled: !editing,
  });

  if (!editing) {
    return (
      <div className="list">
        {items.map((i) => (
          <PrayerCard key={i.id} item={i} answerable={!readOnly} />
        ))}
        {!readOnly && items.length === 0 && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => startEdit(listKey)}
          >
            Add Prayer Item
          </Button>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`list${isDropTarget ? " sec drop" : ""}`}>
      {items.map((i, idx) => (
        <PrayerCardEditor key={i.id} item={i} listKey={listKey} index={idx} />
      ))}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => add(listKey)}
      >
        Add Prayer Item
      </Button>
    </div>
  );
}
