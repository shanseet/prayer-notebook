import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { App as AntApp, ConfigProvider } from "antd";
import { FONT_SIZES } from "../types";
import type { ListKey, Lists, PrayerData, Settings, TabKey } from "../types";
import {
  clearStorage,
  defaultSettings,
  emptyData,
  loadData,
  loadSettings,
  saveData,
  saveSettings,
} from "../utils/storage";
import {
  blankItem,
  dropBlanks,
  fromLists,
  takeItem,
  toLists,
} from "../utils/lists";

interface AppState {
  data: PrayerData;
  settings: Settings;
  tab: TabKey;
  setTab: (t: TabKey) => void;
  /** Draft lists while a tab is in edit mode, otherwise null. */
  draft: Lists | null;
  editing: boolean;
  startEdit: (addTo?: ListKey) => void;
  setDraft: (fn: (l: Lists) => Lists) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  markAnswered: (id: string, note: string) => void;
  deleteAnswered: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  clearAll: () => void;
  importAll: (data: PrayerData, settings: Settings) => void;
}

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}

function Inner({
  children,
  settings,
  setSettings,
}: {
  children: ReactNode;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}) {
  const { message } = AntApp.useApp();
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState<TabKey>("today");
  const [draft, setDraftState] = useState<Lists | null>(null);

  useEffect(() => saveData(data), [data]);

  const startEdit = useCallback(
    (addTo?: ListKey) => {
      const lists = toLists(data);
      if (addTo) lists[addTo] = [...lists[addTo], blankItem()];
      setDraftState(lists);
    },
    [data],
  );

  const saveEdit = useCallback(() => {
    if (!draft) return;
    setData((d) => fromLists(dropBlanks(draft), d.answered));
    setDraftState(null);
    message.success("Saved");
  }, [draft, message]);

  const markAnswered = useCallback(
    (id: string, note: string) => {
      setData((d) => {
        const { item, lists } = takeItem(toLists(d), id);
        if (!item) return d;
        const answered = [
          { ...item, answeredNote: note.trim() || undefined },
          ...d.answered,
        ];
        return fromLists(lists, answered);
      });
      message.success("Marked as answered");
    },
    [message],
  );

  const deleteAnswered = useCallback((id: string) => {
    setData((d) => ({ ...d, answered: d.answered.filter((i) => i.id !== id) }));
  }, []);

  // The Answered tab disappears with its last item; fall back to Today.
  useEffect(() => {
    if (tab === "answered" && data.answered.length === 0) setTab("today");
  }, [tab, data.answered.length]);

  const clearAll = useCallback(() => {
    clearStorage();
    setData(emptyData());
    setSettings(defaultSettings());
    setDraftState(null);
    setTab("today");
    message.success("All data cleared");
  }, [message]);

  const importAll = useCallback(
    (d: PrayerData, s: Settings) => {
      setData(d);
      setSettings(s);
      setDraftState(null);
      message.success("Imported");
    },
    [message, setSettings],
  );

  const value = useMemo<AppState>(
    () => ({
      data,
      settings,
      tab,
      setTab,
      draft,
      editing: draft !== null,
      startEdit,
      setDraft: (fn) => setDraftState((l) => (l ? fn(l) : l)),
      cancelEdit: () => setDraftState(null),
      saveEdit,
      markAnswered,
      deleteAnswered,
      clearAll,
      importAll,
      updateSettings: (p) => setSettings((s) => ({ ...s, ...p })),
    }),
    [
      data,
      settings,
      tab,
      draft,
      startEdit,
      saveEdit,
      markAnswered,
      deleteAnswered,
      clearAll,
      importAll,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);
  const base = FONT_SIZES[settings.fontSize];
  const stack = `'${settings.fontFamily}', system-ui, sans-serif`;

  useEffect(() => saveSettings(settings), [settings]);
  useEffect(() => {
    document.body.style.setProperty("--fs", `${base}px`);
    document.body.style.fontFamily = stack;
  }, [base, stack]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#096dd9",
          borderRadius: 6,
          fontFamily: stack,
          fontSize: base,
        },
        components: {
          Button: { controlHeight: 40 },
          Input: { controlHeight: 40 },
        },
      }}
    >
      <AntApp>
        <Inner settings={settings} setSettings={setSettings}>
          {children}
        </Inner>
      </AntApp>
    </ConfigProvider>
  );
}
