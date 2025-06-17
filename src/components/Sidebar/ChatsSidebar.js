import { createElement } from "../../component";
import { store } from "../../store/store";
import { loadMessages, addContact } from "../../services/api";
import { createAddContactForm } from '../Contact/AddContactForm';
import { toggleChatArchive } from "../../services/api";
import { createGroupForm } from '../Group/CreateGroupForm';
import { createSettingsPanel } from '../Settings/SettingsPanel';

export function createChatsSidebar() {
  // Declare state variables
  let showingContactForm = false;
  let showingGroupForm = false;
  let showingSettings = false;

  // Create sidebar element with enhanced styling
  const sidebar = createElement('div', {
    class: [
      'w-[400px]',
      'bg-white',
      'flex',
      'flex-col',
      'border-r',
      'border-[#e9edef]',
      'relative',
      'h-screen',
      'shadow-sm'
    ]
  });

  // Toggle functions
  function toggleGroupForm() {
    showingGroupForm = !showingGroupForm;
    showingContactForm = false;
    showingSettings = false;
    updateSidebar();
  }

  function toggleContactForm() {
    showingContactForm = !showingContactForm;
    showingGroupForm = false;
    showingSettings = false;
    updateSidebar();
  }

  // New toggle function for settings
  function toggleSettings() {
    showingSettings = !showingSettings;
    showingContactForm = false;
    showingGroupForm = false;
    updateSidebar();
  }

  // Enhanced header with modern WhatsApp styling
  function createHeader() {
    return createElement(
      "div",
      {
        class: ["bg-[#f0f2f5]", "pt-5", "pb-3", "px-4", "border-b", "border-[#e9edef]"],
      },
      [
        createElement(
          "div",
          {
            class: ["flex", "justify-between", "items-center", "mb-4"],
          },
          [
            createElement(
              "h1",
              {
                class: ["text-2xl", "font-semibold", "text-[#111b21]"],
              },
              "Chats"
            ),
            createElement(
              "div",
              {
                class: ["flex", "gap-6", "text-[#54656f]"],
              },
              [
                createElement('button', {
                  class: [
                    'p-2',
                    'rounded-full',
                    'hover:bg-[#e5e7eb]',
                    'transition-all',
                    'duration-200',
                    'hover:text-[#00a884]',
                    'active:scale-95'
                  ],
                  onclick: () => toggleGroupForm()
                }, [
                  createElement('i', {
                    class: ['fas', 'fa-users-gear', 'text-lg']
                  })
                ]),
                createElement("button", {
                  class: [
                    'p-2',
                    'rounded-full',
                    'hover:bg-[#e5e7eb]',
                    'transition-all',
                    'duration-200',
                    'hover:text-[#00a884]',
                    'active:scale-95'
                  ],
                }, [
                  createElement('i', {
                    class: ['fas', 'fa-images', 'text-lg']
                  })
                ]),
                createElement("button", {
                  class: [
                    'p-2',
                    'rounded-full',
                    'hover:bg-[#e5e7eb]',
                    'transition-all',
                    'duration-200',
                    'hover:text-[#00a884]',
                    'active:scale-95',
                    'text-xl',
                    'font-bold'
                  ],
                }, "⋮"),
              ]
            ),
          ]
        ),
        createFilterTabs(),
      ]
    );
  }

  // Enhanced floating action button
  function createAddContactButton() {
    return createElement('button', {
      class: [
        'fixed',
        'bottom-6',
        'left-[400px]',
        'bg-[#00a884]',
        'text-white',
        'rounded-full',
        'w-14',
        'h-14',
        'flex',
        'items-center',
        'justify-center',
        'shadow-xl',
        'hover:bg-[#008069]',
        'hover:shadow-2xl',
        'active:scale-95',
        'transition-all',
        'duration-200',
        'z-20',
        'border-4',
        'border-white'
      ],
      onclick: toggleContactForm
    }, [
      createElement('i', {
        class: ['fas', 'fa-user-plus', 'text-lg']
      })
    ]);
  }

  function renderChats() {
    const chatsList = createElement("div", {
      class: ["flex-1", "overflow-y-auto", "scrollbar-thin", "scrollbar-thumb-[#d1d7db]", "scrollbar-track-transparent"]
    });

    if (!store.state.currentUser) return chatsList;

    const userContacts = store.state.currentUser.contacts || [];
    let filteredChats = store.state.chats;

    // Appliquer d'abord la recherche
    const searchQuery = store.state.filters.searchQuery;
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
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

    // Ensuite appliquer les autres filtres
    filteredChats = filteredChats.filter(chat => {
      const isContactChat = chat.participants.some(
        participantId => userContacts.includes(participantId) || 
        participantId === store.state.currentUser.id
      );

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

  // Modify updateSidebar
  function updateSidebar() {
    sidebar.innerHTML = '';
    if (showingContactForm) {
      sidebar.appendChild(createAddContactForm(() => toggleContactForm()));
    } else if (showingGroupForm) {
      sidebar.appendChild(createGroupForm(() => toggleGroupForm()));
    } else if (showingSettings) {
      sidebar.appendChild(createSettingsPanel());
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

  // Initialize sidebar
  store.subscribe(updateSidebar);
  updateSidebar();

  return {
    element: sidebar,
    toggleSettings
  };
}

// Enhanced filter tabs with modern styling
function createFilterTabs() {
  const filters = [
    { id: 'all', name: 'Tous', icon: 'fa-comments' },
    { id: 'unread', name: 'Non lus', icon: 'fa-circle' },
    { id: 'groups', name: 'Groupes', icon: 'fa-users' },
    { id: 'archived', name: 'Archivés', icon: 'fa-archive' }
  ];

  return createElement('div', {
    class: ['flex', 'gap-2', 'overflow-x-auto', 'hide-scrollbar', 'pb-1']
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
        "px-4",
        "py-2",
        "rounded-full",
        "text-sm",
        "font-medium",
        "whitespace-nowrap",
        "transition-all",
        "duration-200",
        "flex",
        "items-center",
        "gap-2",
        "border",
        active
          ? "bg-[#00a884] text-white border-[#00a884] shadow-sm"
          : "text-[#54656f] hover:bg-[#f0f2f5] border-[#e9edef] hover:border-[#00a884] hover:text-[#00a884]",
      ],
      onclick: onClick,
    },
    [
      createElement("i", {
        class: ["fas", icon, "text-xs"],
      }),
      name,
    ]
  );
}

// Enhanced search section
function createSearchSection() {
  let inputValue = store.state.filters?.searchQuery || '';

  const input = createElement('input', {
    type: 'text',
    placeholder: 'Rechercher une discussion',
    value: inputValue,
    class: [
      'w-full',
      'text-sm',
      'focus:outline-none',
      'text-[#111b21]',
      'placeholder-[#8696a0]',
      'bg-transparent',
      'font-normal'
    ],
    oninput: (e) => {
      const newValue = e.target.value;
      
      requestAnimationFrame(() => {
        store.setState({
          filters: {
            ...store.state.filters,
            searchQuery: newValue
          }
        });
      });
    },
    onclick: (e) => {
      e.stopPropagation();
    }
  });

  const searchContainer = createElement('div', {
    class: ['px-4', 'py-3', 'bg-white'],
    onclick: (e) => e.stopPropagation()
  });

  const searchBox = createElement('div', {
    class: [
      'bg-[#f0f2f5]',
      'flex',
      'items-center',
      'gap-4',
      'px-4',
      'py-2',
      'rounded-lg',
      'h-[40px]',
      'border',
      'border-transparent',
      'focus-within:border-[#00a884]',
      'focus-within:bg-white',
      'transition-all',
      'duration-200',
      'hover:bg-[#e9edef]',
      'focus-within:shadow-sm'
    ]
  }, [
    createElement('i', {
      class: ['fas', 'fa-search', 'text-[#8696a0]', 'text-sm']
    }),
    input
  ]);

  searchContainer.appendChild(searchBox);
  return searchContainer;
}

// Enhanced archived section
function createArchivedSection() {
  return createElement(
    "div",
    {
      class: [
        "flex",
        "items-center",
        "px-4",
        "py-4",
        "gap-4",
        "hover:bg-[#f5f6f6]",
        "cursor-pointer",
        "border-b",
        "border-[#e9edef]",
        "transition-all",
        "duration-200",
        "active:bg-[#e9edef]"
      ],
    },
    [
      createElement("div", {
        class: [
          "w-12",
          "h-12",
          "bg-[#00a884]",
          "rounded-full",
          "flex",
          "items-center",
          "justify-center",
          "text-white"
        ]
      }, [
        createElement("i", {
          class: ["fas", "fa-archive", "text-lg"],
        })
      ]),
      createElement(
        "div",
        {
          class: ["flex-1", "flex", "justify-between", "items-center"]
        },
        [
          createElement("span", { 
            class: ["text-[#111b21]", "font-medium"] 
          }, "Archived"),
          createElement(
            "span",
            {
              class: [
                "bg-[#00a884]",
                "text-white",
                "text-xs",
                "px-2",
                "py-1",
                "rounded-full",
                "font-medium",
                "min-w-[20px]",
                "text-center"
              ],
            },
            "1"
          ),
        ]
      ),
    ]
  );
}

// Enhanced chat item with modern WhatsApp styling
function createChatItem(chat) {
  const isActive = chat.id === store.state.currentChat;
  const currentUserId = store.state.currentUser?.id;
  
  // Get display name for the chat with fallback
  let displayName = "Sans nom"; // Valeur par défaut
  
  if (chat.type === 'group') {
    displayName = chat.name || "Groupe sans nom";
  } else {
    // Find the other participant
    const otherParticipantId = chat.participants?.find(id => id !== currentUserId);
    const otherParticipant = store.state.users?.find(user => user.id === otherParticipantId);
    displayName = otherParticipant?.name || "Contact sans nom";
  }

  // Generate avatar colors based on name with safe access
  const avatarColors = [
    'from-[#00a884] to-[#008069]',
    'from-[#7c3aed] to-[#5b21b6]',
    'from-[#dc2626] to-[#991b1b]',
    'from-[#ea580c] to-[#c2410c]',
    'from-[#0891b2] to-[#0e7490]',
    'from-[#16a34a] to-[#15803d]',
    'from-[#c026d3] to-[#a21caf]',
    'from-[#2563eb] to-[#1d4ed8]'
  ];
  
  const colorIndex = Math.abs(displayName.charCodeAt(0) || 0) % avatarColors.length;
  const avatarGradient = avatarColors[colorIndex];

  // Enhanced context menu
  function showContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const menu = createElement('div', {
      class: [
        'absolute',
        'bg-white',
        'shadow-2xl',
        'rounded-xl',
        'py-2',
        'z-50',
        'w-[200px]',
        'border',
        'border-[#e9edef]',
        'backdrop-blur-sm'
      ]
    }, [
      createElement('button', {
        class: [
          'w-full',
          'px-4',
          'py-3',
          'text-left',
          'hover:bg-[#f0f2f5]',
          'flex',
          'items-center',
          'gap-3',
          'text-sm',
          'font-medium',
          'text-[#111b21]',
          'transition-all',
          'duration-150',
          'active:bg-[#e9edef]'
        ],
        onclick: async () => {
          await toggleChatArchive(chat.id);
          menu.remove();
        }
      }, [
        createElement('div', {
          class: [
            'w-8',
            'h-8',
            'rounded-full',
            'bg-[#f0f2f5]',
            'flex',
            'items-center',
            'justify-center'
          ]
        }, [
          createElement('i', {
            class: ['fas', chat.archived ? 'fa-inbox' : 'fa-archive', 'text-[#54656f]', 'text-sm']
          })
        ]),
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
      'px-4',
      'py-3',
      'hover:bg-[#f5f6f6]',
      'cursor-pointer',
      'transition-all',
      'duration-150',
      isActive ? 'bg-[#e9edef] border-r-4 border-[#00a884]' : '',
      'relative',
      'group',
      'active:bg-[#e9edef]'
    ],
    onclick: () => loadMessages(chat.id),
    oncontextmenu: showContextMenu
  }, [
    // Enhanced Avatar
    createElement('div', {
      class: [
        'w-12',
        'h-12',
        'rounded-full',
        'bg-gradient-to-br',
        avatarGradient,
        'flex',
        'items-center',
        'justify-center',
        'text-white',
        'font-semibold',
        'text-lg',
        'shadow-sm',
        'ring-2',
        'ring-white',
        'relative',
        'overflow-hidden'
      ]
    }, [
      displayName.charAt(0).toUpperCase(),
      // Online indicator (could be conditional)
      createElement('div', {
        class: [
          'absolute',
          '-bottom-0.5',
          '-right-0.5',
          'w-3',
          'h-3',
          'bg-[#06d6a0]',
          'rounded-full',
          'border-2',
          'border-white',
          'hidden' // Show conditionally based on online status
        ]
      })
    ]),
    
    // Enhanced Info container
    createElement(
      "div",
      {
        class: ["ml-4", "flex-1", "min-w-0"],
      },
      [
        createElement(
          "div",
          {
            class: ["flex", "justify-between", "items-start", "mb-1"],
          },
          [
            createElement(
              "span",
              {
                class: [
                  "font-medium", 
                  "text-[#111b21]", 
                  "truncate",
                  "text-[15px]"
                ],
              },
              displayName || "Sans nom"
            ),
            createElement(
              "span",
              {
                class: ["text-xs", "text-[#667781]", "ml-2", "flex-shrink-0"],
              },
              "12:30" // Could be dynamic
            ),
          ]
        ),
        createElement(
          "div",
          {
            class: ["flex", "justify-between", "items-center"],
          },
          [
            createElement(
              "p",
              {
                class: [
                  "text-sm", 
                  "text-[#667781]", 
                  "truncate",
                  "flex-1",
                  "mr-2"
                ],
              },
              chat.lastMessage?.content || "Nouveau chat"
            ),
            // Unread badge
            chat.unreadCount > 0 ? createElement(
              "span",
              {
                class: [
                  "bg-[#00a884]",
                  "text-white",
                  "text-xs",
                  "px-2",
                  "py-0.5",
                  "rounded-full",
                  "font-medium",
                  "min-w-[20px]",
                  "text-center",
                  "flex-shrink-0"
                ],
              },
              chat.unreadCount.toString()
            ) : null,
          ]
        ),
      ]
    ),
    
    // Enhanced context menu button
    createElement('button', {
      class: [
        'absolute',
        'right-4',
        'top-1/2',
        '-translate-y-1/2',
        'opacity-0',
        'group-hover:opacity-100',
        'transition-all',
        'duration-200',
        'text-[#8696a0]',
        'hover:text-[#54656f]',
        'p-2',
        'rounded-full',
        'hover:bg-[#e9edef]',
        'active:scale-95'
      ],
      onclick: (e) => {
        e.stopPropagation();
        showContextMenu(e);
      }
    }, [
      createElement('i', {
        class: ['fas', 'fa-chevron-down', 'text-sm']
      })
    ])
  ].filter(Boolean)); // Filter out null elements
}