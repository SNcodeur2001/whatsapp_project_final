import { createElement } from "../../component";

export function createMessageInput() {
  const inputContainer = createElement(
    "div",
    {
      class: ["bg-[#f0f2f5]", "px-4", "py-3", "flex", "items-center", "gap-4"],
    },
    [
      // Emoji button
      createElement("i", {
        class: [
          "fas",
          "fa-smile",
          "text-[#54656f]",
          "text-xl",
          "cursor-pointer",
        ],
      }),

      // Attachment button
      createElement("i", {
        class: [
          "fas",
          "fa-paperclip",
          "text-[#54656f]",
          "text-xl",
          "cursor-pointer",
        ],
      }),

      // Input field wrapper
      createElement(
        "div",
        {
          class: [
            "flex-1",
            "bg-white",
            "rounded-full",
            "px-4",
            "py-2",
            "flex",
            "items-center",
            "gap-4",
            "shadow-sm",
            "hover:shadow-md",
            "transition-all",
          ],
        },
        [
          createElement("input", {
            type: "text",
            placeholder: "Tapez un message",
            class: ["flex-1", "focus:outline-none", "text-[#111b21]"],
          }),
          // Send button
          createElement(
            "button",
            {
              class: [
                "text-[#54656f]",
                "hover:text-[#00a884]",
                "transition-colors",
              ],
              onclick: () => {
                const input = inputContainer.querySelector("input");
                if (input.value.trim()) {
                  // TODO: Implement send message
                  console.log("Sending message:", input.value);
                  input.value = "";
                }
              },
            },
            [
              createElement("i", {
                class: ["fas", "fa-paper-plane"],
              }),
            ]
          ),
        ]
      ),

      // Voice message button
      createElement("i", {
        class: [
          "fas",
          "fa-microphone",
          "text-[#54656f]",
          "text-xl",
          "cursor-pointer",
        ],
      }),
    ]
  );

  return inputContainer;
}
