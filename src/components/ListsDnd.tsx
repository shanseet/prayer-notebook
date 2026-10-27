import { useRef } from "react";
import type { ReactNode } from "react";
import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { useApp } from "../context/AppProvider";
import type { Lists } from "../types";

// dnd-kit's default for touch is a 250ms press-and-hold, which a quick drag (or Chrome's
// mobile emulation) never satisfies. The handle has touch-action: none, so start at once.
const sensors = [
  PointerSensor.configure({
    activationConstraints(event, source) {
      const target = event.target as Node | null;
      if (target && source.handle?.contains(target)) return undefined;
    },
  }),
  KeyboardSensor,
];

/** Drag-and-drop context for edit mode: reorder within a list or drop onto another list. */
export default function ListsDnd({ children }: { children: ReactNode }) {
  const { draft, setDraft } = useApp();
  const snapshot = useRef<Lists | null>(null);

  return (
    <DragDropProvider
      sensors={sensors}
      onDragStart={() => {
        snapshot.current = draft;
      }}
      onDragOver={(event) => setDraft((l) => move(l, event))}
      onDragEnd={(event) => {
        if (event.canceled && snapshot.current) {
          const restore = snapshot.current;
          setDraft(() => restore);
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
}
