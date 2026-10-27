import { WEEKDAYS } from "../types";
import type { ListKey, Lists, PrayerData, PrayerItem, Weekday } from "../types";

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
export const WEEKDAY_SHORT: Record<Weekday, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export const ordinal = (n: number) => {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return n + ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");
};

export const DATES = Array.from({ length: 31 }, (_, i) => i + 1);

export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
export const blankItem = (): PrayerItem => ({
  id: newId(),
  title: "",
  note: "",
});

export const weeklyKey = (d: Weekday): ListKey => `weekly:${d}`;
export const monthlyKey = (n: number): ListKey => `monthly:${n}`;

export function toLists(data: PrayerData): Lists {
  const lists = { daily: data.daily } as Lists;
  WEEKDAYS.forEach((d) => (lists[weeklyKey(d)] = data.weekly[d]));
  DATES.forEach((n) => (lists[monthlyKey(n)] = data.monthly[n]));
  return lists;
}

export function fromLists(lists: Lists, answered: PrayerItem[]): PrayerData {
  const data = { daily: lists.daily, answered } as PrayerData;
  data.weekly = Object.fromEntries(
    WEEKDAYS.map((d) => [d, lists[weeklyKey(d)]]),
  ) as PrayerData["weekly"];
  data.monthly = Object.fromEntries(
    DATES.map((n) => [n, lists[monthlyKey(n)]]),
  );
  return data;
}

/** Returns the lists with blank items (no title and no note) removed. */
export function dropBlanks(lists: Lists): Lists {
  const out = {} as Lists;
  (Object.keys(lists) as ListKey[]).forEach((k) => {
    out[k] = lists[k].filter((i) => i.title.trim() || i.note.trim());
  });
  return out;
}

export const listsWhere = (lists: Lists, prefix: string): ListKey[] =>
  (Object.keys(lists) as ListKey[]).filter((k) => k.startsWith(prefix));

export const hasAny = (lists: Lists, prefix: string) =>
  listsWhere(lists, prefix).some((k) => lists[k].length > 0);

/** Removes an item from whichever list holds it; returns the item and the new lists. */
export function takeItem(
  lists: Lists,
  id: string,
): { item?: PrayerItem; lists: Lists } {
  let item: PrayerItem | undefined;
  const out = { ...lists };
  (Object.keys(out) as ListKey[]).forEach((k) => {
    const found = out[k].find((i) => i.id === id);
    if (found) {
      item = found;
      out[k] = out[k].filter((i) => i.id !== id);
    }
  });
  return { item, lists: out };
}

export const daysInMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

/** Monday-first weekday key for a date. */
export const weekdayOf = (d: Date): Weekday => WEEKDAYS[(d.getDay() + 6) % 7];

/** Today's monthly keys: its date, plus 29-31 overflow on the last day of a shorter month. */
export function todayMonthlyKeys(d: Date): ListKey[] {
  const last = daysInMonth(d);
  const end = d.getDate() === last ? 31 : d.getDate();
  return DATES.filter((n) => n >= d.getDate() && n <= end).map(monthlyKey);
}
