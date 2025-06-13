import { createElement } from "../../component";
import { store } from "../../store/store";
import { loadMessages, addContact } from "../../services/api";
import { createAddContactForm } from '../Contact/AddContactForm';
import { toggleChatArchive } from "../../services/api";

export function createChatsSidebar() {
  let showingContactForm = false;

  const sidebar = createElement('div', {
    class: [
      'w-[400px]',
      'bg-white',
      'flex',
      'flex-col',
      'border-r',
      'border-[#d1d7db]',
      'relative'
    ]
  });

  function toggleContactForm() {
    showingContactForm = !showingContactForm;
    updateSidebar();
  }

  function createAddContactButton() {
    return createElement('button', {
      class: [
        'fixed',
        'bottom-4',
        'left-[21%]',
        'bg-[#00a884]',
        'text-white',
        'rounded-full',
        'w-12',
        'h-12',
        'flex',
        'items-center',
        'justify-center',
        'shadow-lg',
        'hover:bg-[#008069]',
        'z-10'
      ],
      onclick: toggleContactForm // Now accessible
    }, [
      createElement('i', {
        class: ['fas', 'fa-user-plus']
      })
    ]);
  }

  function renderChats() {
    const chatsList = createElement("div", {
      class: ["flex-1", "overflow-y-auto"]
    });

    if (!store.state.currentUser) return chatsList;

    const userContacts = store.state.currentUser.contacts || [];
    let filteredChats = store.state.chats.filter(chat => {
      // Filtre de base pour les contacts
      const isContactChat = chat.participants.some(
        participantId => userContacts.includes(participantId) || 
        participantId === store.state.currentUser.id
      );

      // Appliquer les filtres actifs
      switch (store.state.filters.activeFilter) {
        case 'unread':
          return isContactChat && chat.unreadCount > 0;
        case 'groups':
          return chat.type === 'group';
        case 'archived':
          return chat.archived;
        default:
          return isContactChat && !chat.archived;
      }
    });

    // Appliquer la recherche
    if (store.state.filters.searchQuery) {
      const query = store.state.filters.searchQuery.toLowerCase();
      filteredChats = filteredChats.filter(chat => {
        if (chat.type === 'group') {
          return chat.name.toLowerCase().includes(query);
        } else {
          const otherParticipant = store.state.users.find(
            u => u.id !== store.state.currentUser.id && 
            chat.participants.includes(u.id)
          );
          return otherParticipant && 
                 otherParticipant.name.toLowerCase().includes(query);
        }
      });
    }

    // Trier les chats
    filteredChats.sort((a, b) => {
      // Épinglés en premier
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Puis par date du dernier message
      const aTime = new Date(a.lastMessage?.timestamp || a.createdAt);
      const bTime = new Date(b.lastMessage?.timestamp || b.createdAt);
      return bTime - aTime;
    });

    filteredChats.forEach(chat => {
      const chatItem = createChatItem(chat);
      chatItem.addEventListener("click", () => loadMessages(chat.id));
      chatsList.appendChild(chatItem);
    });

    return chatsList;
  }

  function updateSidebar() {
    sidebar.innerHTML = '';
    if (showingContactForm) {
      sidebar.appendChild(createAddContactForm(() => toggleContactForm()));
    } else {
      sidebar.append(
        createHeader(),
        createSearchSection(),
        createArchivedSection(),
        renderChats(),
        createAddContactButton()
      );
    }
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
    { id: 'all', name: 'Tous', icon: 'fa-comments' },
    { id: 'unread', name: 'Non lus', icon: 'fa-circle' },
    { id: 'groups', name: 'Groupes', icon: 'fa-users' },
    { id: 'archived', name: 'Archivés', icon: 'fa-archive' }
  ];

  return createElement('div', {
    class: ['flex', 'gap-2', 'px-4', 'overflow-x-auto', 'hide-scrollbar']
  }, filters.map(filter => createFilterButton({
    ...filter,
    active: store.state.filters.activeFilter === filter.id,
    onClick: () => {
      store.setState({
        filters: {
          ...store.state.filters,
          activeFilter: filter.id
        }
      });
    }
  })));
}

function createFilterButton({ id, name, icon, active, onClick }) {
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
      onclick: onClick,
    },
    [
      createElement("i", {
        class: ["fas", icon, "mr-1"],
      }),
      name,
    ]
  );
}

function createSearchSection() {
  const input = createElement('input', {
    type: 'text',
    placeholder: 'Rechercher une discussion',
    class: [
      'bg-transparent',
      'w-full',
      'text-sm',
      'focus:outline-none',
      'placeholder-[#54656f]'
    ],
    oninput: (e) => {
      store.setState({
        filters: {
          ...store.state.filters,
          searchQuery: e.target.value
        }
      });
    }
  });

  return createElement('div', {
    class: ['px-3', 'py-2', 'bg-white']
  }, [
    createElement('div', {
      class: [
        'bg-[#f0f2f5]',
        'flex',
        'items-center',
        'gap-4',
        'px-4',
        'rounded-lg',
        'h-[35px]'
      ]
    }, [
      createElement('i', {
        class: ['fas', 'fa-search', 'text-[#54656f]']
      }),
      input
    ])
  ]);
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
  const currentUserId = store.state.currentUser.id;
  
  // Get display name for the chat
  let displayName;
  if (chat.type === 'group') {
    displayName = chat.name;
  } else {
    // Find the other participant
    const otherParticipantId = chat.participants.find(id => id !== currentUserId);
    const otherParticipant = store.state.users.find(user => user.id === otherParticipantId);
    displayName = otherParticipant ? otherParticipant.name : 'Sans nom';
  }

  // Menu contextuel
  function showContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const menu = createElement('div', {
      class: [
        'absolute',
        'bg-white',
        'shadow-lg',
        'rounded-lg',
        'py-2',
        'z-50',
        'w-[180px]',  // Ajout d'une largeur fixe
        'right-4',
        'mt-2'
      ]
    }, [
      createElement('button', {
        class: [
          'w-full',
          'px-3',  // Réduction du padding horizontal
          'py-2',
          'text-left',
          'hover:bg-[#f0f2f5]',
          'flex',
          'items-center',
          'gap-2',  // Réduction de l'espace entre l'icône et le texte
          'text-sm'  // Texte plus petit
        ],
        onclick: async () => {
          await toggleChatArchive(chat.id);
          menu.remove();
        }
      }, [
        createElement('i', {
          class: ['fas', chat.archived ? 'fa-inbox' : 'fa-archive']
        }),
        chat.archived ? 'Désarchiver' : 'Archiver'
      ])
    ]);

    // Positionner le menu
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    
    // Fermer le menu au clic ailleurs
    function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    }
    
    document.addEventListener('click', closeMenu);
    document.body.appendChild(menu);
  }

  return createElement('div', {
    class: [
      'flex',
      'items-center',
      'p-3',
      'hover:bg-[#f5f6f6]',
      'cursor-pointer',
      'transition-all',
      isActive ? 'bg-[#f0f2f5]' : '',
      'border-b',
      'border-[#e9edef]',
      'relative',
      'group'
    ],
    onclick: () => loadMessages(chat.id),
    oncontextmenu: showContextMenu
  }, [
    // Avatar
    createElement('div', {
      class: [
        'w-12',
        'h-12',
        'rounded-full',
        'bg-gradient-to-br',
        'from-[#00a884]',
        'to-[#008069]',
        'flex',
        'items-center',
        'justify-center',
        'text-white',
        'font-medium',
        'text-lg'
      ]
    }, displayName.charAt(0)),
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
              displayName || "Sans nom"
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
    createElement('button', {
      class: [
        'absolute',
        'right-2',
        'opacity-0',
        'group-hover:opacity-100',
        'transition-opacity',
        'text-[#54656f]'
      ],
      onclick: showContextMenu
    }, [
      createElement('i', {
        class: ['fas', 'fa-ellipsis-v']
      })
    ])
  ]);
}

