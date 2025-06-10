import { createElement } from "../../component";
import { store } from "../../store/store";
import { loadMessages } from "../../services/api";

export function createChatsSidebar() {
  const sidebar = createElement("div", {
    class: [
      "w-[400px]",
      "bg-white",
      "flex",
      "flex-col",
      "border-r",
      "border-[#d1d7db]",
    ],
  });

  function renderChats() {
    const chatsList = createElement("div", {
      class: ["flex-1", "overflow-y-auto"],
    });
    //    console.log('Rendering chats with state:', {
    //   currentUser: store.state.currentUser,
    //   chats: store.state.chats,
    //   messages: store.state.messages
    // });

    store.state.chats.forEach((chat) => {
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
      renderChats()
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
        "px-4",
        "py-3",
        "hover:bg-[#f5f6f6]",
        "cursor-pointer",
        isActive ? "bg-[#f0f2f5]" : "", // Ajout classe active
      ],
      onclick: () => loadMessages(chat.id),
    },
    [
      // Avatar
      createElement("div", {
        class: [
          "w-12",
          "h-12",
          "rounded-full",
          "bg-[#dfe5e7]",
          "flex-shrink-0",
        ],
      }),
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

async function fetchUsers() {
  const response = await fetch("http://localhost:3000/users");
  const data = await response.json();

  // Convertir les IDs en nombres
  return data.map((user) => ({
    ...user,
    id: Number(user.id), // Force la conversion en nombre
  }));
}
