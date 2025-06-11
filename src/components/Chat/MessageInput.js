import { createElement } from "../../component";
import { sendMessage } from "../../services/api";
import { store } from "../../store/store";

export function createMessageInput() {
  const inputContainer = createElement("div", {
    class: ["bg-[#f0f2f5]", "px-4", "py-3", "flex", "items-center", "gap-4"],
  });

  // Créer l'input en dehors pour y avoir accès dans l'événement onclick
  const input = createElement("input", {
    type: "text",
    placeholder: "Tapez un message",
    class: ["flex-1", "focus:outline-none", "text-[#111b21]"],
  });

  const sendButton = createElement(
    "button",
    {
      class: [
        "text-[#54656f]",
        "hover:text-[#00a884]",
        "transition-colors",
      ],
      onclick: async () => {
        const message = input.value.trim();
        if (message && store.state.currentChat) {
          try {
            await sendMessage(store.state.currentChat, message);
            input.value = "";
          } catch (error) {
            console.error("Failed to send message:", error);
          }
        }
      },
    },
    [
      createElement("i", {
        class: ["fas", "fa-paper-plane"],
      }),
    ]
  );

  // Wrapper pour l'input et le bouton
  const inputWrapper = createElement(
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
      ],
    },
    [input, sendButton]
  );

  // Ajout de tous les éléments
  inputContainer.append(
    createElement("i", {
      class: ["fas", "fa-smile", "text-[#54656f]", "text-xl", "cursor-pointer"],
    }),
    createElement("i", {
      class: ["fas", "fa-paperclip", "text-[#54656f]", "text-xl", "cursor-pointer"],
    }),
    inputWrapper,
    createElement("i", {
      class: ["fas", "fa-microphone", "text-[#54656f]", "text-xl", "cursor-pointer"],
    })
  );

  return inputContainer;
}
