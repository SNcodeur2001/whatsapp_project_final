import { createElement } from "../../component";
import { store } from "../../store/store";
import { loadMessages, addContact } from "../../services/api";

export function createChatsSidebar() {
  const sidebar = createElement("div", {
    class: [
      "w-[400px]",
      "bg-white",
      "flex",
      "flex-col",
      "border-r",
      "border-[#d1d7db]",
      "relative", // Ajout pour le positionnement du bouton
    ],
  });

  function renderChats() {
    const chatsList = createElement("div", {
      class: ["flex-1", "overflow-y-auto"],
    });

    // Check if user is logged in first
    if (!store.state.currentUser) {
      console.log("No user logged in");
      return chatsList;
    }

    // Récupérer les contacts de l'utilisateur connecté
    const userContacts = store.state.currentUser.contacts || [];

    // Filtrer les chats
    const filteredChats = store.state.chats.filter((chat) => {
      if (chat.type === "group") {
        return chat.participants.includes(store.state.currentUser.id);
      } else {
        return chat.participants.some(
          (participantId) =>
            userContacts.includes(participantId) ||
            participantId === store.state.currentUser.id
        );
      }
    });

    console.log("Chats filtrés:", {
      userContacts,
      filteredChats,
    });

    // Afficher uniquement les chats filtrés
    filteredChats.forEach((chat) => {
      const chatItem = createChatItem(chat);
      chatItem.addEventListener("click", () => loadMessages(chat.id));
      chatsList.appendChild(chatItem);
    });

    return chatsList;
  }

  function updateSidebar() {
    sidebar.innerHTML = "";
    sidebar.append(
      createHeader(),
      createSearchSection(),
      createArchivedSection(),
      renderChats(),
      createAddContactButton() // 👈 Ajout du bouton ici
    );
  }

  store.subscribe(updateSidebar);
  updateSidebar();

  return sidebar;
}

function createHeader() {
  return createElement(
    "div",
    {
      class: ["bg-[#f0f2f5]", "pt-2", "pb-1"],
    },
    [
      createElement(
        "div",
        {
          class: ["px-4", "flex", "justify-between", "items-center", "mb-3"],
        },
        [
          createElement(
            "h1",
            {
              class: ["text-xl", "text-[#111b21]"],
            },
            "Chats"
          ),
          createElement(
            "div",
            {
              class: ["flex", "gap-5", "text-[#54656f]"],
            },
            [
              createElement("span", {
                class: ["cursor-pointer", "fas", "fa-images"],
              }),
              createElement("span", { class: ["cursor-pointer"] }, "⋮"),
            ]
          ),
        ]
      ),
      createFilterTabs(),
    ]
  );
}

function createFilterTabs() {
  const filters = [
    { name: "All", active: true },
    { name: "Unread", active: false },
    { name: "Favorites", active: false },
    { name: "Groups", active: false },
  ];

  return createElement(
    "div",
    {
      class: ["flex", "gap-2", "px-4", "overflow-x-auto", "hide-scrollbar"],
    },
    filters.map((filter) => createFilterButton(filter))
  );
}

function createFilterButton({ name, active }) {
  return createElement(
    "button",
    {
      class: [
        "px-3",
        "py-1",
        "rounded-full",
        "text-sm",
        "whitespace-nowrap",
        active
          ? "bg-[#e9edef] text-[#111b21]"
          : "text-[#54656f] hover:bg-[#e9edef]",
      ],
    },
    name
  );
}

function createSearchSection() {
  return createElement(
    "div",
    {
      class: ["px-3", "py-2", "bg-white"],
    },
    [
      createElement(
        "div",
        {
          class: [
            "bg-[#f0f2f5]",
            "flex",
            "items-center",
            "gap-4",
            "px-4",
            "rounded-lg",
            "h-[35px]",
          ],
        },
        [
          // Pour la recherche
          createElement("span", {
            class: ["text-[#54656f]", "fas", "fa-search"],
          }),
          createElement("input", {
            type: "text",
            placeholder: "Search",
            class: [
              "bg-transparent",
              "w-full",
              "text-sm",
              "focus:outline-none",
              "placeholder-[#54656f]",
            ],
          }),
        ]
      ),
    ]
  );
}

function createArchivedSection() {
  return createElement(
    "div",
    {
      class: [
        "flex",
        "items-center",
        "px-4",
        "py-3",
        "gap-3",
        "hover:bg-[#f5f6f6]",
        "cursor-pointer",
        "border-b",
        "border-[#e9edef]",
      ],
    },
    [
      createElement("span", {
        class: ["text-[#00a884]", "fas", "fa-archive"],
      }),
      createElement("span", { class: ["text-[#111b21]"] }, "Archived"),
      createElement(
        "span",
        {
          class: ["ml-auto", "text-xs", "text-[#667781]"],
        },
        "1"
      ),
    ]
  );
}

function createChatItem(chat) {
  const isActive = chat.id === store.state.currentChat;

  return createElement(
    "div",
    {
      class: [
        "flex",
        "items-center",
        "p-3",
        "hover:bg-[#f5f6f6]",
        "cursor-pointer",
        "transition-all",
        isActive ? "bg-[#f0f2f5]" : "",
        "border-b",
        "border-[#e9edef]",
      ],
    },
    [
      createElement(
        "div",
        {
          class: [
            "w-12",
            "h-12",
            "rounded-full",
            "bg-gradient-to-br",
            "from-[#00a884]",
            "to-[#008069]",
            "flex",
            "items-center",
            "justify-center",
            "text-white",
            "font-medium",
            "text-lg",
          ],
        },
        chat.name.charAt(0)
      ),
      // Info container
      createElement(
        "div",
        {
          class: ["ml-3", "flex-1", "min-w-0"],
        },
        [
          createElement(
            "div",
            {
              class: ["flex", "justify-between"],
            },
            [
              createElement(
                "span",
                {
                  class: ["font-medium", "text-[#111b21]"],
                },
                chat.name || "Sans nom"
              ),
              createElement(
                "span",
                {
                  class: ["text-xs", "text-[#667781]"],
                },
                ""
              ),
            ]
          ),
        ]
      ),
    ]
  );
}

function createAddContactButton() {
  return createElement(
    "button",
    {
      class: [
        "fixed",
        "bottom-4",
        "right-4",
        "bg-[#00a884]",
        "text-white",
        "rounded-full",
        "w-12",
        "h-12",
        "flex",
        "items-center",
        "justify-center",
        "shadow-lg",
        "hover:bg-[#008069]",
      ],
      onclick: () => {
        const phone = prompt("Entrez le numéro de téléphone du contact :");
        if (phone) {
          addContact(phone).catch((error) => {
            alert("Erreur : " + error.message);
          });
        }
      },
    },
    [
      createElement("i", {
        class: ["fas", "fa-user-plus"],
      }),
    ]
  );
}

