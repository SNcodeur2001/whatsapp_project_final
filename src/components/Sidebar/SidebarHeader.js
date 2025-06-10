import { createElement } from "../../component";

export function createSidebarHeader() {
  return createElement(
    "div",
    {
      class: [
        "h-[59px]",
        "bg-[#f0f2f5]",
        "flex",
        "items-center",
        "justify-between",
        "px-4",
      ],
    },
    [
      createElement("div", {
        class: ["w-10", "h-10", "rounded-full", "bg-[#dfe5e7]"],
      }),
      createElement(
        "div",
        {
          class: ["flex", "gap-6", "text-[#54656f]"],
        },
        [
          createElement("span", { class: ["cursor-pointer"] }, "🔄"),
          createElement("span", { class: ["cursor-pointer"] }, "💬"),
          createElement("span", { class: ["cursor-pointer"] }, "⋮"),
        ]
      ),
    ]
  );
}
