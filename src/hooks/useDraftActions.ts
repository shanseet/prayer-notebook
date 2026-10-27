import { useApp } from "../context/AppProvider";
import type { ListKey, PrayerItem } from "../types";
import { blankItem, takeItem } from "../utils/lists";

/** Edits to the draft lists while a tab is in edit mode. */
export function useDraftActions() {
  const { setDraft } = useApp();
  return {
    add: (key: ListKey) =>
      setDraft((l) => ({ ...l, [key]: [...l[key], blankItem()] })),
    update: (key: ListKey, id: string, patch: Partial<PrayerItem>) =>
      setDraft((l) => ({
        ...l,
        [key]: l[key].map((i) => (i.id === id ? { ...i, ...patch } : i)),
      })),
    remove: (key: ListKey, id: string) =>
      setDraft((l) => ({ ...l, [key]: l[key].filter((i) => i.id !== id) })),
    move: (id: string, target: ListKey) =>
      setDraft((l) => {
        const { item, lists } = takeItem(l, id);
        return item ? { ...lists, [target]: [...lists[target], item] } : l;
      }),
    /** Keyboard reorder within one list. */
    shift: (key: ListKey, id: string, by: -1 | 1) =>
      setDraft((l) => {
        const arr = [...l[key]];
        const from = arr.findIndex((i) => i.id === id);
        const to = from + by;
        if (from < 0 || to < 0 || to >= arr.length) return l;
        [arr[from], arr[to]] = [arr[to], arr[from]];
        return { ...l, [key]: arr };
      }),
  };
}
