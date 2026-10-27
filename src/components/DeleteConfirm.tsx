import { Popconfirm } from "antd";
import type { ReactElement } from "react";

export default function DeleteConfirm({
  onConfirm,
  children,
  placement = "top",
}: {
  onConfirm: () => void;
  children: ReactElement;
  placement?: "top" | "topRight" | "bottomRight";
}) {
  return (
    <Popconfirm
      title="Confirm delete?"
      description="This data cannot be retrieved."
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
      placement={placement}
      onConfirm={onConfirm}
    >
      {children}
    </Popconfirm>
  );
}
