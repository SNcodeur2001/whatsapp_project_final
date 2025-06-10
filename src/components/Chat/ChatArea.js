import { createElement } from "../../component";
import { store } from "../../store/store";
import { createChatHeader } from "./ChatHeader";
import { createMessageInput } from "./MessageInput";

export function createChatArea() {
  const chatArea = createElement("div", {
    class: ["flex-1", "flex", "flex-col"],
  });

  function renderMessages() {
    return createElement(
      "div",
      {
        class: ["flex-1", "bg-[#efeae2]", "overflow-y-auto", "p-4"],
      },
      store.state.messages.map((message) => createMessage(message))
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
    } else {
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

  store.subscribe(updateChatArea);
  updateChatArea();

  return chatArea;
}

function createMessage(message) {
  const isOwn = message.senderId === store.state.currentUser.id;

  return createElement(
    "div",
    {
      class: ["flex", isOwn ? "justify-end" : "justify-start", "mb-2"],
    },
    [
      createElement(
        "div",
        {
          class: [
            "max-w-[65%]",
            "px-3",
            "py-2",
            "rounded-lg",
            isOwn ? "bg-[#d9fdd3]" : "bg-white",
          ],
        },
        [
          createElement(
            "p",
            {
              class: ["text-sm", "text-[#111b21]"],
            },
            message.content
          ),
          createElement(
            "span",
            {
              class: ["text-[10px]", "text-[#667781]", "float-right", "mt-1"],
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
