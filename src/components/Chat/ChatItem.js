import { createElement } from "../../component";

export function createChatItem(chat) {
  return createElement(
    "div",
    {
      class: [
        "flex",
        "items-center",
        "gap-4",
        "px-4",
        "py-4",
        "hover:bg-[#f0f2f5]",
        "cursor-pointer",
        "transition-colors",
        "duration-150",
        "border-b",
        "border-[#e9edef]",
        "last:border-b-0",
      ],
    },
    [
      createElement("div", {
        class: [
          "w-12",
          "h-12",
          "rounded-full",
          "bg-gradient-to-br",
          "from-[#dfe5e7]",
          "to-[#c6cbd3]",
          "flex-shrink-0",
          "shadow-sm",
          "border",
          "border-[#e9edef]",
        ],
      }),
      createElement(
        "div",
        {
          class: ["flex-1", "min-w-0", "overflow-hidden"],
        },
        [
          createElement(
            "div",
            {
              class: ["flex", "justify-between", "items-baseline", "mb-1"],
            },
            [
              createElement(
                "span",
                {
                  class: [
                    "font-medium", 
                    "text-[#111b21]", 
                    "text-base",
                    "leading-tight",
                    "truncate",
                    "pr-2"
                  ],
                },
                chat.name
              ),
              createElement(
                "span",
                {
                  class: [
                    "text-xs", 
                    "text-[#667781]", 
                    "flex-shrink-0",
                    "font-normal"
                  ],
                },
                chat.time
              ),
            ]
          ),
          createElement(
            "div",
            {
              class: ["flex", "justify-between", "items-center", "gap-2"],
            },
            [
              createElement(
                "span",
                {
                  class: [
                    "text-sm", 
                    "text-[#667781]", 
                    "truncate",
                    "leading-relaxed",
                    "flex-1"
                  ],
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
                      "min-w-[20px]",
                      "h-[20px]",
                      "px-1.5",
                      "flex",
                      "items-center",
                      "justify-center",
                      "text-xs",
                      "font-medium",
                      "shadow-sm",
                      "flex-shrink-0",
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