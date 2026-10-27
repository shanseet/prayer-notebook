export interface PrayerItem {
  id: string;
  title: string;
  note: string;
  answeredNote?: string;
}

export const WEEKDAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface PrayerData {
  daily: PrayerItem[];
  weekly: Record<Weekday, PrayerItem[]>;
  monthly: Record<number, PrayerItem[]>; // 1..31
  answered: PrayerItem[]; // newest first
}

export const FONT_FAMILIES = [
  "Roboto",
  "Nunito",
  "Lora",
  "Kalam",
  "Shadows Into Light",
  "Nanum Pen Script",
] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

export const FONT_SIZES = { S: 14, M: 16, L: 18, XL: 20 } as const;
export type FontSize = keyof typeof FONT_SIZES;

export interface Settings {
  fontFamily: FontFamily;
  fontSize: FontSize;
  answeredEnabled: boolean;
}

/** Identifies one editable list: 'daily', 'weekly:mon', 'monthly:5'. */
export type ListKey = "daily" | `weekly:${Weekday}` | `monthly:${number}`;
export type Lists = Record<ListKey, PrayerItem[]>;

export type TabKey = "today" | "daily" | "weekly" | "monthly" | "answered";
