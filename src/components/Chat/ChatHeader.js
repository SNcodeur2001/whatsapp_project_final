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
        "h-[70px]",
        "bg-[#f0f2f5]",
        "flex",
        "items-center",
        "justify-between",
        "px-4",
        "border-l",
        "border-[#d1d7db]",
        "shadow-sm",
        "relative",
        "z-10"
      ],
    },
    [
      createElement(
        "div",
        {
          class: ["flex", "items-center", "gap-3", "flex-1", "min-w-0"],
        },
        [
          // Avatar avec indicateur de statut
          createElement(
            "div", 
            {
              class: ["relative", "flex-shrink-0"]
            },
            [
              createElement("div", {
                class: [
                  "w-12", 
                  "h-12", 
                  "rounded-full", 
                  "bg-gradient-to-br",
                  "from-[#dfe5e7]",
                  "to-[#c5d1d4]",
                  "flex",
                  "items-center",
                  "justify-center",
                  "text-[#54656f]",
                  "font-semibold",
                  "text-lg",
                  "shadow-inner",
                  "border-2",
                  "border-white"
                ],
              }, 
              // Première lettre du nom comme avatar
              displayName.charAt(0).toUpperCase()
              ),
              // Indicateur de statut en ligne
              createElement("div", {
                class: [
                  "absolute",
                  "bottom-0",
                  "right-0",
                  "w-3",
                  "h-3",
                  "bg-[#00d876]",
                  "rounded-full",
                  "border-2",
                  "border-[#f0f2f5]"
                ]
              })
            ]
          ),
          // Informations utilisateur
          createElement(
            "div",
            {
              class: ["flex", "flex-col", "min-w-0", "flex-1"],
            },
            [
              createElement(
                "span",
                {
                  class: [
                    "text-[#111b21]", 
                    "font-medium", 
                    "text-base",
                    "truncate",
                    "leading-tight"
                  ],
                },
                displayName
              ),
              createElement(
                "span",
                {
                  class: [
                    "text-[#667781]", 
                    "text-sm",
                    "leading-tight"
                  ],
                },
                "En ligne"
              )
            ]
          ),
        ]
      ),
      // Actions du header
      createElement(
        "div",
        {
          class: ["flex", "items-center", "gap-2", "flex-shrink-0"],
        },
        [
          // Bouton de recherche
          createElement(
            "button",
            {
              class: [
                "w-10",
                "h-10",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "text-[#54656f]",
                "hover:bg-[#e5eaec]",
                "transition-colors",
                "duration-200",
                "cursor-pointer"
              ],
            },
            [
              createElement("i", {
                class: ["fas", "fa-search", "text-lg"],
              })
            ]
          ),
          // Bouton appel vidéo
          createElement(
            "button",
            {
              class: [
                "w-10",
                "h-10",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "text-[#54656f]",
                "hover:bg-[#e5eaec]",
                "transition-colors",
                "duration-200",
                "cursor-pointer"
              ],
            },
            [
              createElement("i", {
                class: ["fas", "fa-video", "text-lg"],
              })
            ]
          ),
          // Bouton appel audio
          createElement(
            "button",
            {
              class: [
                "w-10",
                "h-10",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "text-[#54656f]",
                "hover:bg-[#e5eaec]",
                "transition-colors",
                "duration-200",
                "cursor-pointer"
              ],
            },
            [
              createElement("i", {
                class: ["fas", "fa-phone", "text-lg"],
              })
            ]
          ),
          // Menu options
          createElement(
            "button",
            {
              class: [
                "w-10",
                "h-10",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "text-[#54656f]",
                "hover:bg-[#e5eaec]",
                "transition-colors",
                "duration-200",
                "cursor-pointer"
              ],
            },
            [
              createElement("i", {
                class: ["fas", "fa-ellipsis-v", "text-lg"],
              })
            ]
          ),
        ]
      ),
    ]
  );
}