import { createElement } from "../../component";
import { store } from "../../store/store";
import { createChatHeader } from "./ChatHeader";
import { createMessageInput } from "./MessageInput";
import { startMessagePolling, stopMessagePolling } from "../../services/api";
import { formatTime } from "../../utils/dateUtils";

export function createChatArea() {
  const chatArea = createElement("div", {
    class: ["flex-1", "flex", "flex-col", "bg-[#f0f2f5]", "relative"],
  });

  function renderMessages() {
    // Guard clause for messages container
    if (!store.state.currentUser || !store.state.messages) {
      return createElement("div", {
        class: ["flex-1", "bg-[#efeae2]", "bg-whatsapp-pattern"],
      });
    }

    const messagesContainer = createElement(
      "div",
      {
        class: [
          "flex-1", 
          "bg-[#efeae2]", 
          "overflow-y-auto", 
          "p-4", 
          "space-y-2",
          "scrollbar-thin", 
          "scrollbar-thumb-[#d1d7db]", 
          "scrollbar-track-transparent",
          "bg-whatsapp-pattern"
        ],
      },
      store.state.messages
        .map((message) => createMessage(message))
        .filter(Boolean) // Filter out null messages
    );

    // Auto-scroll to bottom
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);

    return messagesContainer;
  }

  function updateChatArea() {
    chatArea.innerHTML = "";

    if (store.state.currentChat) {
      const currentChat = store.state.chats.find(
        (c) => c.id === store.state.currentChat
      );

      chatArea.append(
        createChatHeader(currentChat),
        renderMessages(),
        createMessageInput()
      );

      startMessagePolling();
    } else {
      stopMessagePolling();
      chatArea.append(
        createElement("div", {
          class: [
            "flex-1",
            "flex",
            "flex-col",
            "items-center",
            "justify-center",
            "bg-[#f0f2f5]",
            "text-[#54656f]",
            "px-8",
            "py-16"
          ],
        }, [
          // Enhanced WhatsApp logo container
          createElement("div", {
            class: [
              "relative",
              "mb-8",
              "group",
              "cursor-pointer"
            ],
          }, [
            createElement("div", {
              class: [
                "w-[280px]",
                "h-[280px]",
                "bg-gradient-to-br",
                "from-[#00a884]",
                "to-[#008069]",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "shadow-2xl",
                "transition-all",
                "duration-500",
                "group-hover:scale-105",
                "group-hover:shadow-3xl",
                "relative",
                "overflow-hidden"
              ],
            }, [
              // WhatsApp icon
              createElement("i", {
                class: [
                  "fab",
                  "fa-whatsapp",
                  "text-white",
                  "text-8xl",
                  "group-hover:scale-110",
                  "transition-transform",
                  "duration-300"
                ],
              }),
              // Shine effect
              createElement("div", {
                class: [
                  "absolute",
                  "inset-0",
                  "bg-gradient-to-r",
                  "from-transparent",
                  "via-white/20",
                  "to-transparent",
                  "transform",
                  "-skew-x-12",
                  "-translate-x-full",
                  "group-hover:translate-x-full",
                  "transition-transform",
                  "duration-700"
                ]
              })
            ]),
          ]),
          
          // Enhanced title
          createElement("h1", {
            class: [
              "text-[36px]",
              "font-light",
              "text-[#41525d]",
              "mb-4",
              "tracking-wide",
              "text-center"
            ],
          }, "WhatsApp Web"),
          
          // Enhanced description with better styling
          createElement("div", {
            class: [
              "max-w-lg",
              "text-center",
              "space-y-4"
            ]
          }, [
            createElement("p", {
              class: [
                "text-[15px]",
                "text-[#667781]",
                "leading-relaxed",
                "font-normal"
              ],
            }, "Envoyez et recevez des messages sans avoir à garder votre téléphone connecté à Internet."),
            
            createElement("div", {
              class: [
                "flex",
                "items-center",
                "justify-center",
                "gap-3",
                "mt-6",
                "p-4",
                "bg-white/50",
                "rounded-xl",
                "backdrop-blur-sm",
                "border",
                "border-white/20"
              ]
            }, [
              createElement("div", {
                class: [
                  "w-2",
                  "h-2",
                  "bg-[#00a884]",
                  "rounded-full",
                  "animate-pulse"
                ]
              }),
              createElement("p", {
                class: [
                  "text-sm",
                  "text-[#667781]",
                  "font-medium"
                ],
              }, "Sélectionnez une discussion pour commencer")
            ])
          ]),

          // Feature highlights
          createElement("div", {
            class: [
              "grid",
              "grid-cols-3",
              "gap-6",
              "mt-12",
              "max-w-2xl"
            ]
          }, [
            createFeatureCard("fa-lock", "Chiffré", "Vos messages sont sécurisés"),
            createFeatureCard("fa-sync", "Synchronisé", "Accédez à vos chats partout"),
            createFeatureCard("fa-bolt", "Rapide", "Messages instantanés")
          ])
        ])
      );
    }
  }

  // Helper function for feature cards
  function createFeatureCard(icon, title, description) {
    return createElement("div", {
      class: [
        "text-center",
        "p-4",
        "bg-white/30",
        "rounded-xl",
        "backdrop-blur-sm",
        "border",
        "border-white/20",
        "hover:bg-white/40",
        "transition-all",
        "duration-300",
        "group"
      ]
    }, [
      createElement("div", {
        class: [
          "w-12",
          "h-12",
          "bg-[#00a884]",
          "rounded-full",
          "flex",
          "items-center",
          "justify-center",
          "mx-auto",
          "mb-3",
          "group-hover:scale-110",
          "transition-transform",
          "duration-200"
        ]
      }, [
        createElement("i", {
          class: ["fas", icon, "text-white"]
        })
      ]),
      createElement("h3", {
        class: ["text-sm", "font-medium", "text-[#41525d]", "mb-1"]
      }, title),
      createElement("p", {
        class: ["text-xs", "text-[#667781]"]
      }, description)
    ]);
  }

  // Cleanup on unmount (if needed)
  window.addEventListener("beforeunload", stopMessagePolling);

  store.subscribe(updateChatArea);
  updateChatArea();

  return chatArea;
}

// Enhanced audio message with modern design
function createAudioMessage(message) {
  const audioElement = createElement('audio', {
    controls: false,
    class: ['hidden'] // Hide default controls
  });
  
  audioElement.src = message.content; // Le contenu base64
  
  let isPlaying = false;
  let duration = 0;
  let currentTime = 0;
  
  // Get audio duration when loaded
  audioElement.addEventListener('loadedmetadata', () => {
    duration = audioElement.duration;
    updateProgressBar();
  });
  
  audioElement.addEventListener('timeupdate', () => {
    currentTime = audioElement.currentTime;
    updateProgressBar();
  });
  
  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
  });
  
  const playButton = createElement('button', {
    class: [
      'w-10',
      'h-10',
      'bg-[#00a884]',
      'hover:bg-[#008069]',
      'text-white',
      'rounded-full',
      'flex',
      'items-center',
      'justify-center',
      'transition-all',
      'duration-200',
      'active:scale-95',
      'shadow-md'
    ],
    onclick: () => {
      if (isPlaying) {
        audioElement.pause();
        // Remplacer innerHTML par appendChild
        playButton.innerHTML = '';
        playButton.appendChild(createElement('i', {
          class: ['fas', 'fa-play']
        }));
      } else {
        audioElement.play();
        // Remplacer innerHTML par appendChild
        playButton.innerHTML = '';
        playButton.appendChild(createElement('i', {
          class: ['fas', 'fa-pause']
        }));
      }
      isPlaying = !isPlaying;
    }
  }, [
    // Utiliser createElement au lieu de string HTML
    createElement('i', {
      class: ['fas', 'fa-play']
    })
]);
  
  const progressBar = createElement('div', {
    class: [
      'flex-1',
      'bg-[#e9edef]',
      'rounded-full',
      'h-1',
      'cursor-pointer',
      'relative',
      'overflow-hidden'
    ]
  });
  
  const progressFill = createElement('div', {
    class: [
      'h-full',
      'bg-[#00a884]',
      'rounded-full',
      'transition-all',
      'duration-100',
      'w-0'
    ]
  });
  
  progressBar.appendChild(progressFill);
  
  const timeDisplay = createElement('span', {
    class: ['text-xs', 'text-[#667781]', 'font-mono', 'min-w-[40px]']
  }, '0:00');
  
  function updateProgressBar() {
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      progressFill.style.width = `${progress}%`;
      
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  // Click on progress bar to seek
  progressBar.addEventListener('click', (e) => {
    if (duration > 0) {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekTime = (clickX / rect.width) * duration;
      audioElement.currentTime = seekTime;
    }
  });
  
  return createElement('div', {
    class: [
      'flex',
      'items-center',
      'gap-3',
      'bg-white/80',
      'p-3',
      'rounded-xl',
      'min-w-[200px]',
      'backdrop-blur-sm',
      'border',
      'border-white/30',
      'shadow-sm'
    ]
  }, [
    playButton,
    createElement('div', {
      class: ['flex', 'items-center', 'gap-2', 'flex-1']
    }, [
      createElement('i', {
        class: ['fas', 'fa-microphone', 'text-[#00a884]', 'text-sm']
      }),
      progressBar,
      timeDisplay
    ])
  ]);
}

// Enhanced message creation with modern styling
function createMessage(message) {
  if (!message || !store.state.currentUser) return null;
  
  const isOwn = message.senderId === store.state.currentUser.id;
  
  let messageContent;
  if (message.type === 'audio') {
    messageContent = createAudioMessage(message);
  } else {
    messageContent = createElement('p', {
      class: [
        'text-[14px]', 
        'break-words', 
        'leading-relaxed',
        'text-[#111b21]'
      ]
    }, message.content || '');
  }

  const messageTime = createElement('div', {
    class: [
      'flex', 
      'items-center', 
      'justify-end', 
      'gap-1', 
      'mt-1',
      'text-[11px]', 
      'text-[#667781]',
      'font-medium'
    ]
  }, [
    createElement('span', {}, formatTime(message.timestamp)),
    // Read status for own messages
    isOwn ? createElement('i', {
      class: [
        'fas', 
        message.read ? 'fa-check-double text-[#53bdeb]' : 'fa-check text-[#667781]',
        'text-xs'
      ]
    }) : null
  ].filter(Boolean));

  return createElement('div', {
    class: [
      'flex',
      'mb-2',
      isOwn ? 'justify-end' : 'justify-start',
      'px-2'
    ]
  }, [
    createElement('div', {
      class: [
        'max-w-xs',
        'lg:max-w-md',
        'relative',
        'group'
      ]
    }, [
      createElement('div', {
        class: [
          'px-3',
          'py-2',
          'rounded-lg',
          'relative',
          'shadow-sm',
          'backdrop-blur-sm',
          isOwn 
            ? 'bg-[#d9fdd3] text-[#111b21] rounded-br-none' 
            : 'bg-white text-[#111b21] rounded-bl-none',
          'border',
          isOwn ? 'border-[#d9fdd3]' : 'border-white/50',
          'hover:shadow-md',
          'transition-all',
          'duration-200'
        ]
      }, [
        messageContent,
        messageTime,
        // Message tail
        createElement('div', {
          class: [
            'absolute',
            'bottom-0',
            'w-0',
            'h-0',
            isOwn 
              ? 'right-[-8px] border-l-[8px] border-l-[#d9fdd3] border-b-[8px] border-b-transparent' 
              : 'left-[-8px] border-r-[8px] border-r-white border-b-[8px] border-b-transparent'
          ]
        })
      ]),
      // Message reactions (placeholder for future feature)
      createElement('div', {
        class: [
          'absolute',
          'top-0',
          isOwn ? 'left-0' : 'right-0',
          'transform',
          isOwn ? '-translate-x-full' : 'translate-x-full',
          'opacity-0',
          'group-hover:opacity-100',
          'transition-opacity',
          'duration-200',
          'flex',
          'gap-1',
          'p-1'
        ]
      }, [
        createElement('button', {
          class: [
            'w-6',
            'h-6',
            'bg-white',
            'rounded-full',
            'shadow-md',
            'flex',
            'items-center',
            'justify-center',
            'hover:bg-[#f0f2f5]',
            'transition-colors',
            'text-xs'
          ]
        }, '❤️'),
        createElement('button', {
          class: [
            'w-6',
            'h-6',
            'bg-white',
            'rounded-full',
            'shadow-md',
            'flex',
            'items-center',
            'justify-center',
            'hover:bg-[#f0f2f5]',
            'transition-colors',
            'text-xs'
          ]
        }, '👍')
      ])
    ])
  ]);
}