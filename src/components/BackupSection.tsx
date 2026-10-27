import { useState } from "react";
import { Alert, App, Button, Input, Popconfirm } from "antd";
import { useApp } from "../context/AppProvider";
import { exportJson, parseImport } from "../utils/storage";

/** Export copies the stored JSON to the clipboard; Import takes pasted JSON and replaces everything. */
export default function BackupSection() {
  const { data, settings, importAll } = useApp();
  const { message } = App.useApp();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  const copy = async () => {
    const text = exportJson(data, settings);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // navigator.clipboard needs a secure context; fall back over http://<lan-ip>.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    message.success("Copied!");
  };

  const doImport = () => {
    const parsed = parseImport(text);
    setError(!parsed);
    if (!parsed) return;
    importAll(parsed.data, parsed.settings);
    setText("");
  };

  return (
    <>
      <div>
        <span className="field-label">Export</span>
        <p style={{ margin: "0 0 8px", color: "var(--text2)" }}>
          Copies your prayers and settings as text to keep or move to another
          browser.
        </p>
        <Button onClick={copy}>Export</Button>
      </div>
      <div>
        <span className="field-label">Import</span>
        <p style={{ margin: "0 0 8px", color: "var(--text2)" }}>
          Paste exported text here. This replaces all current prayers and
          settings.
        </p>
        <Input.TextArea
          rows={3}
          value={text}
          placeholder="Paste exported data"
          aria-label="Data to import"
          onChange={(e) => {
            setText(e.target.value);
            setError(false);
          }}
        />
        {error && (
          <Alert
            style={{ marginTop: 8 }}
            type="error"
            showIcon
            title="That isn't valid exported data."
          />
        )}
        <Popconfirm
          title="Replace all current data?"
          description="This cannot be undone."
          okText="Import"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          disabled={!text.trim()}
          onConfirm={doImport}
        >
          <Button style={{ marginTop: 8 }} disabled={!text.trim()}>
            Import
          </Button>
        </Popconfirm>
      </div>
    </>
  );
}
