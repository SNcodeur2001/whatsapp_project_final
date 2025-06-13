import { createElement } from "../../component";
import { store } from "../../store/store";
import { createChatHeader } from "./ChatHeader";
import { createMessageInput } from "./MessageInput";
import { startMessagePolling, stopMessagePolling } from "../../services/api";

export function createChatArea() {
  const chatArea = createElement("div", {
    class: ["flex-1", "flex", "flex-col"],
  });

  function renderMessages() {
    // Guard clause for messages container
    if (!store.state.currentUser || !store.state.messages) {
      return createElement("div", {
        class: ["flex-1", "bg-[#efeae2]"],
      });
    }

    return createElement(
      "div",
      {
        class: ["flex-1", "bg-[#efeae2]", "overflow-y-auto", "p-4"],
      },
      store.state.messages
        .map((message) => createMessage(message))
        .filter(Boolean) // Filter out null messages
    );
  }

  function updateChatArea() {
    chatArea.innerHTML = "";

    if (store.state.currentChat) {
      // Trouvons le chat actuel
      const currentChat = store.state.chats.find(
        (c) => c.id === store.state.currentChat
      );

      chatArea.append(
        createChatHeader(currentChat), // Passer le chat actuel
        renderMessages(),
        createMessageInput()
      );

      // Start polling when chat is selected
      startMessagePolling();
    } else {
      stopMessagePolling(); // Stop polling when no chat is selected
      chatArea.append(
        createElement(
          "div",
          {
            class: [
              "flex-1",
              "flex",
              "items-center",
              "justify-center",
              "text-[#54656f]",
            ],
          },
          "Sélectionnez une discussion pour commencer"
        )
      );
    }
  }

  // Cleanup on unmount (if needed)
  window.addEventListener("beforeunload", stopMessagePolling);

  store.subscribe(updateChatArea);
  updateChatArea();

  return chatArea;
}

function createMessage(message) {
  // Guard clause for no currentUser
  if (!store.state.currentUser) {
    return null;
  }

  const isOwn = message.senderId === store.state.currentUser.id;

  return createElement(
    "div",
    {
      class: [
        "flex",
        isOwn ? "justify-end" : "justify-start",
        "mb-2",
        "message-animation",
      ],
    },
    [
      createElement(
        "div",
        {
          class: [
            "max-w-[65%]",
            "px-4",
            "py-2",
            "rounded-lg",
            isOwn ? "bg-[#dcf8c6]" : "bg-white",
            "shadow-sm",
            "hover:shadow-md",
            "transition-all",
          ],
        },
        [
          createElement(
            "p",
            {
              class: ["text-[#111b21]", "mb-1"],
            },
            message.content
          ),
          createElement(
            "span",
            {
              class: [
                "text-[11px]",
                "text-[#667781]",
                "block",
                "text-right",
              ],
            },
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          ),
        ]
      ),
    ]
  );
}
