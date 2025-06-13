import { createElement } from "../../component";
import { store } from "../../store/store";

export function createChatHeader(currentChat) {
  if (!currentChat) return null;

  // Déterminer le nom à afficher
  let displayName;
  if (currentChat.type === "group") {
    displayName = currentChat.name;
  } else {
    // Pour les chats individuels, trouver l'autre participant
    const currentUserId = store.state.currentUser.id;
    const otherParticipantId = currentChat.participants.find(
      id => id !== currentUserId
    );
    
    // Trouver l'utilisateur correspondant
    const otherParticipant = store.state.users.find(
      user => user.id === otherParticipantId
    );
    
    displayName = otherParticipant ? otherParticipant.name : "Utilisateur inconnu";
  }

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
        "border-l",
        "border-[#d1d7db]",
      ],
    },
    [
      createElement(
        "div",
        {
          class: ["flex", "items-center", "gap-4"],
        },
        [
          createElement("div", {
            class: ["w-10", "h-10", "rounded-full", "bg-[#dfe5e7]"],
          }),
          createElement(
            "span",
            {
              class: ["text-[#111b21]", "font-medium"],
            },
            displayName
          ),
        ]
      ),
      createElement(
        "div",
        {
          class: ["flex", "gap-6", "text-[#54656f]"],
        },
        [
          createElement("i", {
            class: ["fas", "fa-search", "cursor-pointer"],
          }),
          createElement("i", {
            class: ["fas", "fa-ellipsis-v", "cursor-pointer"],
          }),
        ]
      ),
    ]
  );
}
