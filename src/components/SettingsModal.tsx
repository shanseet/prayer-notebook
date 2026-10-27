import { Button, Modal, Popconfirm, Radio, Select, Switch } from "antd";
import BackupSection from "./BackupSection";
import { useApp } from "../context/AppProvider";
import { FONT_FAMILIES, FONT_SIZES } from "../types";
import type { FontFamily, FontSize } from "../types";

const stack = (f: FontFamily) => `'${f}', system-ui, sans-serif`;

export default function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, updateSettings, clearAll } = useApp();
  return (
    <Modal
      open={open}
      title="Settings"
      footer={null}
      onCancel={onClose}
      style={{ top: "10vh" }}
      rootClassName="scroll-modal"
    >
      <div className="stack">
        <div>
          <label className="field-label" htmlFor="font-family">
            Font family
          </label>
          <Select<FontFamily>
            id="font-family"
            style={{ width: "100%" }}
            value={settings.fontFamily}
            onChange={(fontFamily) => updateSettings({ fontFamily })}
            options={FONT_FAMILIES.map((f) => ({
              value: f,
              label: <span style={{ fontFamily: stack(f) }}>{f}</span>,
            }))}
          />
        </div>
        <div>
          <span className="field-label" id="font-size-label">
            Font size
          </span>
          <Radio.Group
            aria-labelledby="font-size-label"
            optionType="button"
            value={settings.fontSize}
            onChange={(e) =>
              updateSettings({ fontSize: e.target.value as FontSize })
            }
            options={(Object.keys(FONT_SIZES) as FontSize[]).map((s) => ({
              value: s,
              label: s,
            }))}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            className="field-label"
            id="answered-label"
            style={{ margin: 0 }}
          >
            Enable Answered Prayers
          </span>
          <Switch
            aria-labelledby="answered-label"
            checked={settings.answeredEnabled}
            onChange={(answeredEnabled) => updateSettings({ answeredEnabled })}
          />
        </div>
        <BackupSection />
        <div>
          <span className="field-label">Clear all data</span>
          <p style={{ margin: "0 0 8px", color: "var(--text2)" }}>
            Clears all data from your local browser. This data is not
            retrievable.
          </p>
          <Popconfirm
            title="Clear all data?"
            okText="Clear"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              clearAll();
              onClose();
            }}
          >
            <Button danger>Clear All Data</Button>
          </Popconfirm>
        </div>
      </div>
    </Modal>
  );
}
