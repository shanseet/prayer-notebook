import { FONT_FAMILIES, FONT_SIZES, WEEKDAYS } from "../types";
import type { PrayerData, PrayerItem, Settings } from "../types";

const DATA_KEY = "prayer-notebook:data";
const SETTINGS_KEY = "prayer-notebook:settings";
const ABOUT_KEY = "prayer-notebook:about-seen";

export const defaultSettings = (): Settings => ({
  fontFamily: "Roboto",
  fontSize: "M",
});

export const emptyData = (): PrayerData => ({
  daily: [],
  weekly: Object.fromEntries(
    WEEKDAYS.map((d) => [d, []]),
  ) as unknown as PrayerData["weekly"],
  monthly: Object.fromEntries(
    Array.from({ length: 31 }, (_, i) => [i + 1, []]),
  ),
  answered: [],
});

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // blocked storage or corrupt JSON: fall back to defaults
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or storage blocked: keep working in memory
  }
}

const items = (v: unknown): PrayerItem[] =>
  Array.isArray(v)
    ? v
        .filter((i) => i && typeof i.id === "string")
        .map((i) => ({
          id: i.id,
          title: String(i.title ?? ""),
          note: String(i.note ?? ""),
          ...(i.answeredNote ? { answeredNote: String(i.answeredNote) } : {}),
        }))
    : [];

function normalizeData(raw: Partial<PrayerData> | null): PrayerData {
  const data = emptyData();
  if (!raw) return data;
  data.daily = items(raw.daily);
  data.answered = items(raw.answered);
  WEEKDAYS.forEach((d) => (data.weekly[d] = items(raw.weekly?.[d])));
  for (let i = 1; i <= 31; i++) data.monthly[i] = items(raw.monthly?.[i]);
  return data;
}

export const loadData = () =>
  normalizeData(read(DATA_KEY) as Partial<PrayerData> | null);

export const saveData = (data: PrayerData) => write(DATA_KEY, data);

function normalizeSettings(raw: Partial<Settings> | null): Settings {
  const d = defaultSettings();
  return {
    fontFamily: FONT_FAMILIES.includes(raw?.fontFamily as never)
      ? raw!.fontFamily!
      : d.fontFamily,
    fontSize:
      raw?.fontSize && raw.fontSize in FONT_SIZES ? raw.fontSize : d.fontSize,
  };
}

export const loadSettings = () =>
  normalizeSettings(read(SETTINGS_KEY) as Partial<Settings> | null);

export const saveSettings = (s: Settings) => write(SETTINGS_KEY, s);

export function hasSeenAbout(): boolean {
  try {
    return localStorage.getItem(ABOUT_KEY) === "1";
  } catch {
    return true; // storage blocked: don't nag on every load
  }
}

export function markAboutSeen() {
  try {
    localStorage.setItem(ABOUT_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearStorage() {
  try {
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(ABOUT_KEY);
  } catch {
    // ignore
  }
}

/** Backup text: the two localStorage values, keyed by their storage keys. */
export const exportJson = (data: PrayerData, settings: Settings) =>
  JSON.stringify({ [DATA_KEY]: data, [SETTINGS_KEY]: settings }, null, 2);

/** Parses backup text; returns null when it isn't a backup. Unknown or bad fields fall back to defaults. */
export function parseImport(
  text: string,
): { data: PrayerData; settings: Settings } | null {
  try {
    const raw = JSON.parse(text);
    if (
      !raw ||
      typeof raw !== "object" ||
      typeof raw[DATA_KEY] !== "object" ||
      !raw[DATA_KEY]
    )
      return null;
    return {
      data: normalizeData(raw[DATA_KEY]),
      settings: normalizeSettings(raw[SETTINGS_KEY] ?? null),
    };
  } catch {
    return null;
  }
}
