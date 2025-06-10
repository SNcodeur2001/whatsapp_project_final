import { createElement } from "../../component";

export function createChatItem(chat) {
  return createElement(
    "div",
    {
      class: [
        "flex",
        "items-center",
        "gap-3",
        "px-3",
        "py-3",
        "hover:bg-[#f5f6f6]",
        "cursor-pointer",
      ],
    },
    [
      createElement("div", {
        class: [
          "w-12",
          "h-12",
          "rounded-full",
          "bg-[#dfe5e7]",
          "flex-shrink-0",
        ],
      }),
      createElement(
        "div",
        {
          class: ["flex-1", "min-w-0"],
        },
        [
          createElement(
            "div",
            {
              class: ["flex", "justify-between", "items-center"],
            },
            [
              createElement(
                "span",
                {
                  class: ["font-medium", "text-[#111b21]"],
                },
                chat.name
              ),
              createElement(
                "span",
                {
                  class: ["text-xs", "text-[#667781]"],
                },
                chat.time
              ),
            ]
          ),
          createElement(
            "div",
            {
              class: ["flex", "justify-between", "items-center", "mt-1"],
            },
            [
              createElement(
                "span",
                {
                  class: ["text-sm", "text-[#667781]", "truncate"],
                },
                chat.lastMessage
              ),
              chat.unread &&
                createElement(
                  "div",
                  {
                    class: [
                      "bg-[#25d366]",
                      "text-white",
                      "rounded-full",
                      "w-[20px]",
                      "h-[20px]",
                      "flex",
                      "items-center",
                      "justify-center",
                      "text-xs",
                    ],
                  },
                  chat.unread.toString()
                ),
            ]
          ),
        ]
      ),
    ]
  );
}
