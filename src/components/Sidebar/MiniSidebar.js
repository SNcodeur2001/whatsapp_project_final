import { createElement } from "../../component";
import { store } from "../../store/store";
import { createStatusPanel } from "../Status/StatusPanel"; // Nouveau composant à créer

export function createMiniSidebar(onSettingsClick) {
  const currentUser = store.state.currentUser;
  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || "?";

  // Fonction pour obtenir le nombre total de messages non lus
  function getTotalUnreadCount() {
    return store.state.chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }

  // Fonction pour obtenir le nombre de statuts non vus
  function getUnseenStatusCount() {
    return store.state.statuses?.filter(status => 
      !status.seenBy?.includes(currentUser?.id)
    ).length || 0;
  }

  // Fonction pour gérer le clic sur le statut
  function handleStatusClick() {
    store.setState({
      activeView: 'status'
    });
  }

  return createElement(
    "div",
    {
      class: [
        "w-[75px]",
        "bg-[#f0f2f5]",
        "flex",
        "flex-col",
        "py-4",
        "border-r",
        "border-[#e9edef]",
        "shadow-sm",
      ],
    },
    [
      // Logo WhatsApp en haut
      createElement("div", {
        class: [
          "w-10",
          "h-10",
          "mx-auto",
          "mb-6",
          "opacity-75",
          "hover:opacity-100",
          "transition-opacity",
        ],
      },
      [
        createElement("img", {
          src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
          alt: "WhatsApp",
          class: ["w-full", "h-full"],
        }),
      ]),

      // Navigation Icons Container
      createElement("div", {
        class: ["flex", "flex-col", "gap-1"],
      },
      [
        createNavButton(
          "Discussions", 
          "fa-comments", 
          store.state.activeView === 'chats',
          getTotalUnreadCount() || null,
          false,
          () => store.setState({ activeView: 'chats' })
        ),
        createNavButton(
          "Statut", 
          "fa-circle", 
          store.state.activeView === 'status',
          getUnseenStatusCount() || null,
          true,
          handleStatusClick
        ),
        createNavButton(
          "Communautés",
          "fa-users",
          store.state.activeView === 'communities',
          null,
          false,
          () => store.setState({ activeView: 'communities' })
        ),
        createNavButton(
          "Chaînes",
          "fa-broadcast-tower",
          store.state.activeView === 'channels'
        ),
      ]),

      // Separator
      createElement("div", {
        class: ["h-[1px]", "bg-[#e9edef]", "mx-4", "my-4"],
      }),

      // Settings and Profile Section
      createElement("div", {
        class: ["mt-auto", "flex", "flex-col", "gap-4"],
      },
      [
        createNavButton(
          "Paramètres",
          "fa-cog",
          false,
          null,
          false,
          onSettingsClick
        ),
        createElement("div", {
          class: [
            "w-[45px]",
            "h-[45px]",
            "rounded-full",
            "bg-gradient-to-br",
            "from-[#00a884]",
            "to-[#008069]",
            "flex",
            "items-center",
            "justify-center",
            "text-white",
            "font-medium",
            "mx-auto",
            "cursor-pointer",
            "hover:shadow-md",
            "transition-shadow",
            "text-sm",
          ],
        }, userInitial),
      ]),
    ]
  );
}

function createNavButton(name, icon, isActive = false, badge = null, hasStatus = false, onClick = null) {
  const button = createElement("div", {
    class: [
      "relative",
      "group",
      "px-4",
      "py-3",
      "flex",
      "justify-center",
      "cursor-pointer",
      "transition-all",
      "duration-200",
      isActive ? "bg-[#e9edef]" : "hover:bg-[#e9edef]",
    ],
    onclick: onClick,
  },
  [
    createElement("div", {
      class: [
        "relative",
        "flex",
        "items-center",
        "justify-center",
        "w-10",
        "h-10",
        "rounded-xl",
        "transition-transform",
        "group-hover:scale-105",
      ],
    },
    [
      createElement("i", {
        class: [
          "fas",
          icon,
          "text-xl",
          isActive ? "text-[#00a884]" : "text-[#54656f]",
          "group-hover:text-[#00a884]",
          "transition-colors",
        ],
      }),
    ]),
  ]);

  // Add notification badge
  if (badge) {
    button.appendChild(
      createElement("span", {
        class: [
          "absolute",
          "top-3",
          "right-3",
          "bg-[#00a884]",
          "text-white",
          "text-xs",
          "font-medium",
          "rounded-full",
          "px-[6px]",
          "py-[2px]",
          "min-w-[20px]",
          "text-center",
          "shadow-sm",
        ],
      }, badge)
    );
  }

  // Add status indicator
  if (hasStatus) {
    button.appendChild(
      createElement("span", {
        class: [
          "absolute",
          "w-[8px]",
          "h-[8px]",
          "bg-[#00a884]",
          "rounded-full",
          "top-3",
          "right-3",
          "shadow-sm",
          "animate-pulse",
        ],
      })
    );
  }

  // Add tooltip
  button.appendChild(
    createElement("div", {
      class: [
        "absolute",
        "left-full",
        "ml-2",
        "px-2",
        "py-1",
        "bg-[#111b21]",
        "text-white",
        "text-xs",
        "rounded",
        "opacity-0",
        "invisible",
        "group-hover:opacity-100",
        "group-hover:visible",
        "transition-all",
        "whitespace-nowrap",
        "z-50",
      ],
    }, name)
  );

  return button;
}
