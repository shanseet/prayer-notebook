import { Modal } from "antd";

export default function AboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      closable={true}
      title={"Prayer Notebook"}
      style={{ top: "10vh" }}
      rootClassName="scroll-modal"
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      onOk={onClose}
      onCancel={onClose}
    >
      <div className="stack">
        <div>
          <blockquote className="quote">
            <p>
              “And pray in the Spirit on all occasions with all kinds of prayers
              and requests.”
            </p>
            <cite>Ephesians 6:18</cite>
          </blockquote>
        </div>
        <div>
          <h3 className="info-label">Inspiration</h3>
          <p style={{ margin: 0 }}>
            This prayer notebook is inspired by MasterLife Together by Matt
            &amp; Allison Willis.
          </p>
        </div>
        <div>
          <h3 className="info-label">Privacy</h3>
          <p style={{ margin: 0 }}>
            All data is saved in your local browser. No data is sent to a
            server.
          </p>
        </div>
        <div>
          <h3 className="info-label">Tips</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              This tool is intended for daily use. You can be in any position
              when praying: kneeling, laying, sitting, standing, walking.
            </li>
            <li>
              Make time to ask people you pray for daily what they would like
              you to be praying about.
            </li>
            <li>Ask God what He wants you to pray for.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
