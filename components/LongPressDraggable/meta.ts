import { IMeta } from "@byted-apaas/client-sdk/component-editor";

const meta: IMeta = {
  props: [
    {
      name: "onLongPress",
      type: "Event",
      title: "长按时",
    },
    {
      name: "onDrag",
      type: "Event",
      title: "拖拽时",
    },
  ],
};

export default meta;
