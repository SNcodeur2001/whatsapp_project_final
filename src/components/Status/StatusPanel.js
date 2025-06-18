import { createElement } from "../../component";
import { store } from "../../store/store";
import { createTextStatus, createMediaStatus } from "../../services/api";

export function createStatusPanel() {
  return createElement('div', {
    class: [
      'w-full',
      'h-full',
      'bg-white',
      'flex',
      'flex-col'
    ]
  }, [
    // Header
    createElement('div', {
      class: [
        'bg-[#f0f2f5]',
        'px-4',
        'py-6',
        'flex',
        'items-center',
        'gap-4',
        'border-b',
        'border-[#e9edef]'
      ]
    }, [
      createElement('h1', {
        class: ['text-xl', 'font-semibold', 'text-[#111b21]']
      }, 'Status'),
    ]),

    // Mon statut
    createElement('div', {
      class: ['p-4', 'border-b', 'border-[#e9edef]']
    }, [
      createElement('div', {
        class: ['flex', 'items-center', 'gap-4']
      }, [
        // Avatar avec bouton d'ajout
        createElement('div', {
          class: ['relative']
        }, [
          createElement('div', {
            class: [
              'w-12',
              'h-12',
              'rounded-full',
              'bg-[#e9edef]',
              'flex',
              'items-center',
              'justify-center'
            ]
          }, [
            createElement('i', {
              class: ['fas', 'fa-user', 'text-[#54656f]']
            })
          ]),
          createElement('button', {
            class: [
              'absolute',
              'bottom-0',
              'right-0',
              'w-5',
              'h-5',
              'bg-[#00a884]',
              'rounded-full',
              'flex',
              'items-center',
              'justify-center',
              'text-white',
              'text-xs',
              'shadow-lg'
            ],
            onclick: () => showStatusOptions()
          }, [
            createElement('i', {
              class: ['fas', 'fa-plus']
            })
          ])
        ]),
        createElement('div', {}, [
          createElement('h2', {
            class: ['font-medium', 'text-[#111b21]']
          }, 'Mon statut'),
          createElement('p', {
            class: ['text-sm', 'text-[#667781]']
          }, 'Appuyez pour ajouter un statut')
        ])
      ])
    ]),

    // Statuts récents
    createElement('div', {
      class: ['flex-1', 'overflow-y-auto', 'px-4', 'py-2']
    }, [
      createElement('h3', {
        class: ['text-sm', 'font-medium', 'text-[#667781]', 'mb-4']
      }, 'Statuts récents'),
      // Liste des statuts (à implémenter)
      renderStatusList()
    ])
  ]);
}

function showStatusOptions() {
  const modal = createElement('div', {
    class: [
      'fixed',
      'inset-0',
      'bg-black/50',
      'flex',
      'items-end',
      'justify-center',
      'z-50'
    ]
  }, [
    createElement('div', {
      class: [
        'bg-white',
        'w-full',
        'max-w-md',
        'rounded-t-xl',
        'p-4',
        'space-y-4'
      ]
    }, [
      createElement('button', {
        class: [
          'w-full',
          'flex',
          'items-center',
          'gap-4',
          'p-3',
          'hover:bg-[#f0f2f5]',
          'rounded-lg',
          'transition-colors'
        ],
        onclick: () => handleTextStatus()
      }, [
        createElement('i', {
          class: ['fas', 'fa-pen', 'text-[#00a884]']
        }),
        'Statut texte'
      ]),
      createElement('button', {
        class: [
          'w-full',
          'flex',
          'items-center',
          'gap-4',
          'p-3',
          'hover:bg-[#f0f2f5]',
          'rounded-lg',
          'transition-colors'
        ],
        onclick: () => handlePhotoStatus()
      }, [
        createElement('i', {
          class: ['fas', 'fa-camera', 'text-[#00a884]']
        }),
        'Photo/Vidéo'
      ])
    ])
  ]);

  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

let selectedColor = '#00a884';

function handleTextStatus() {
  const modal = createElement('div', {
    class: [
      'fixed',
      'inset-0',
      'bg-black/50',
      'flex',
      'items-center',
      'justify-center',
      'z-50'
    ]
  }, [
    createElement('div', {
      class: [
        'bg-white',
        'w-full',
        'max-w-md',
        'rounded-xl',
        'p-6',
        'space-y-4'
      ]
    }, [
      createElement('h2', {
        class: ['text-lg', 'font-semibold', 'text-[#111b21]']
      }, 'Créer un statut texte'),
      
      // Zone de texte
      createElement('textarea', {
        class: [
          'w-full',
          'h-32',
          'p-4',
          'rounded-lg',
          'border',
          'border-[#e9edef]',
          'focus:outline-none',
          'focus:border-[#00a884]',
          'resize-none'
        ],
        placeholder: 'Écrivez quelque chose...'
      }),
      
      // Sélecteur de couleur de fond
      createElement('div', {
        class: ['flex', 'gap-2', 'justify-center']
      }, [
        '#00a884', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'
      ].map(color => 
        createElement('button', {
          class: [
            'w-8',
            'h-8',
            'rounded-full',
            'border-2',
            'border-white',
            'shadow-sm',
            'hover:scale-110',
            'transition-transform'
          ],
          style: `background-color: ${color}`,
          onclick: () => {
            // Mettre à jour la couleur sélectionnée
            selectedColor = color;
            // Mettre à jour visuellement la sélection
          }
        })
      )),
      
      // Boutons d'action
      createElement('div', {
        class: ['flex', 'justify-end', 'gap-4', 'mt-4']
      }, [
        createElement('button', {
          class: [
            'px-4',
            'py-2',
            'rounded-lg',
            'text-[#54656f]',
            'hover:bg-[#f0f2f5]',
            'transition-colors'
          ],
          onclick: () => modal.remove()
        }, 'Annuler'),
        createElement('button', {
          class: [
            'px-4',
            'py-2',
            'rounded-lg',
            'bg-[#00a884]',
            'text-white',
            'hover:bg-[#008069]',
            'transition-colors'
          ],
          onclick: async () => {
            const text = modal.querySelector('textarea').value.trim();
            if (text) {
              try {
                await createTextStatus(text, selectedColor);
                modal.remove();
                showNotification('Statut créé avec succès');
              } catch (error) {
                showNotification('Erreur lors de la création du statut', 'error');
              }
            }
          }
        }, 'Publier')
      ])
    ])
  ]);

  document.body.appendChild(modal);
}

function handlePhotoStatus() {
  const input = createElement('input', {
    type: 'file',
    accept: 'image/*,video/*',
    style: 'display: none',
    onchange: async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const maxSize = 16 * 1024 * 1024; // 16MB
          if (file.size > maxSize) {
            showNotification('Le fichier est trop volumineux (max 16MB)', 'error');
            return;
          }

          // Afficher un indicateur de chargement
          const loadingToast = showNotification('Envoi en cours...', 'info', false);
          
          await createMediaStatus(file);
          loadingToast.remove();
          showNotification('Statut créé avec succès');
        } catch (error) {
          showNotification('Erreur lors de la création du statut', 'error');
        }
      }
    }
  });

  document.body.appendChild(input);
  input.click();
  input.remove();
}

function showNotification(message, type = 'success', autoClose = true) {
  const notification = createElement('div', {
    class: [
      'fixed',
      'top-4',
      'right-4',
      'px-4',
      'py-2',
      'rounded-lg',
      'text-white',
      'font-medium',
      'shadow-lg',
      'z-50',
      'animate-fade-in',
      type === 'error' ? 'bg-red-500' : 
      type === 'info' ? 'bg-blue-500' : 'bg-[#00a884]'
    ]
  }, message);

  document.body.appendChild(notification);

  if (autoClose) {
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  return notification;
}

function renderStatusList() {
  const currentUser = store.state.currentUser;
  const users = store.state.users || [];
  
  // Créer un conteneur pour "Mes statuts"
  const myStatusContainer = createElement('div', {
    class: ['mb-6']
  }, [
    createElement('h3', {
      class: ['text-sm', 'font-medium', 'text-[#667781]', 'mb-2']
    }, 'Mes statuts'),
    
    // Afficher mes statuts s'ils existent
    currentUser.statuses && currentUser.statuses.length > 0 ? 
      createElement('div', {
        class: [
          'flex',
          'items-center',
          'gap-4',
          'p-4',
          'hover:bg-[#f5f6f6]',
          'cursor-pointer',
          'rounded-lg'
        ],
        onclick: () => viewUserStatuses(currentUser, currentUser.statuses)
      }, [
        // Avatar avec indicateur de statut
        createElement('div', {
          class: ['relative']
        }, [
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
              'font-medium'
            ]
          }, currentUser.name.charAt(0).toUpperCase())
        ]),
        createElement('div', {
          class: ['flex-1']
        }, [
          createElement('h3', {
            class: ['font-medium', 'text-[#111b21]']
          }, 'Mes statuts'),
          createElement('p', {
            class: ['text-sm', 'text-[#667781]']
          }, `${currentUser.statuses.length} récent${currentUser.statuses.length > 1 ? 's' : ''}`)
        ])
      ]) : null
  ]);

  // Filtrer et afficher les statuts des autres utilisateurs
  const otherStatusesContainer = createElement('div', {
    class: ['mt-6']
  }, [
    createElement('h3', {
      class: ['text-sm', 'font-medium', 'text-[#667781]', 'mb-2']
    }, 'Statuts récents'),
    ...Object.values(users)
      .filter(user => user.id !== currentUser.id && user.statuses?.length > 0)
      .map(user => {
        const validStatuses = user.statuses.filter(status => 
          new Date(status.expiresAt) > new Date()
        );

        if (validStatuses.length === 0) return null;

        return createElement('div', {
          class: [
            'flex',
            'items-center',
            'gap-4',
            'p-4',
            'hover:bg-[#f5f6f6]',
            'cursor-pointer',
            'rounded-lg'
          ],
          onclick: () => viewUserStatuses(user, validStatuses)
        }, [
          // Avatar avec anneau de statut
          createElement('div', {
            class: ['relative']
          }, [
            createElement('div', {
              class: [
                'absolute',
                'inset-0',
                'rounded-full',
                'border-2',
                'border-[#00a884]',
                validStatuses.some(s => !s.seenBy?.includes(currentUser.id)) ?
                'animate-pulse' : ''
              ]
            }),
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
                'font-medium'
              ]
            }, user.name.charAt(0).toUpperCase())
          ]),
          createElement('div', {
            class: ['flex-1']
          }, [
            createElement('h3', {
              class: ['font-medium', 'text-[#111b21]']
            }, user.name),
            createElement('p', {
              class: ['text-sm', 'text-[#667781]']
            }, formatStatusTime(validStatuses[validStatuses.length - 1].createdAt))
          ])
        ]);
      }).filter(Boolean)
  ]);

  return createElement('div', {
    class: ['space-y-4']
  }, [myStatusContainer, otherStatusesContainer]);
}

function formatStatusTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'À l\'instant';
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
  return date.toLocaleDateString();
}

// Ajouter cette fonction après formatStatusTime
function viewUserStatuses(user, statuses) {
  let currentIndex = 0;
  let timer = null;

  const modal = createElement('div', {
    class: [
      'fixed',
      'inset-0',
      'bg-black',
      'z-50',
      'flex',
      'flex-col'
    ]
  }, [
    // Header
    createElement('div', {
      class: [
        'p-4',
        'flex',
        'items-center',
        'gap-4',
        'text-white',
        'bg-black/30',
        'backdrop-blur-sm'
      ]
    }, [
      createElement('button', {
        class: [
          'w-8',
          'h-8',
          'flex',
          'items-center',
          'justify-center',
          'rounded-full',
          'hover:bg-white/10',
          'transition-colors'
        ],
        onclick: () => {
          clearInterval(timer);
          modal.remove();
        }
      }, [
        createElement('i', {
          class: ['fas', 'fa-arrow-left']
        })
      ]),
      createElement('div', {
        class: [
          'w-10',
          'h-10',
          'rounded-full',
          'bg-gradient-to-br',
          'from-[#00a884]',
          'to-[#008069]',
          'flex',
          'items-center',
          'justify-center',
          'text-white',
          'font-medium'
        ]
      }, user.name.charAt(0).toUpperCase()),
      createElement('div', {
        class: ['flex-1']
      }, [
        createElement('h3', {
          class: ['font-medium']
        }, user.name),
        createElement('p', {
          class: ['text-sm', 'text-white/70']
        }, formatStatusTime(statuses[currentIndex].createdAt))
      ])
    ]),

    // Progress bars
    createElement('div', {
      class: ['flex', 'gap-1', 'px-4', 'pt-2']
    }, statuses.map((_, index) => 
      createElement('div', {
        class: [
          'h-1',
          'flex-1',
          'rounded-full',
          'bg-white/30',
          'overflow-hidden'
        ]
      }, [
        createElement('div', {
          class: [
            'h-full',
            'bg-white',
            'transition-all',
            'duration-[5000ms]',
            'ease-linear',
            index < currentIndex ? 'w-full' : 
            index === currentIndex ? 'w-0' : 'w-0'
          ]
        })
      ])
    )),

    // Content
    createElement('div', {
      class: [
        'flex-1',
        'flex',
        'items-center',
        'justify-center',
        'p-4'
      ]
    }, [
      // Previous button
      createElement('button', {
        class: [
          'absolute',
          'left-4',
          'w-12',
          'h-12',
          'flex',
          'items-center',
          'justify-center',
          'text-white/70',
          'hover:text-white',
          'transition-colors'
        ],
        onclick: () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateStatus();
          }
        }
      }, [
        createElement('i', {
          class: ['fas', 'fa-chevron-left', 'text-2xl']
        })
      ]),

      // Status content
      renderStatusContent(statuses[currentIndex]),

      // Next button
      createElement('button', {
        class: [
          'absolute',
          'right-4',
          'w-12',
          'h-12',
          'flex',
          'items-center',
          'justify-center',
          'text-white/70',
          'hover:text-white',
          'transition-colors'
        ],
        onclick: () => {
          if (currentIndex < statuses.length - 1) {
            currentIndex++;
            updateStatus();
          } else {
            modal.remove();
          }
        }
      }, [
        createElement('i', {
          class: ['fas', 'fa-chevron-right', 'text-2xl']
        })
      ])
    ])
  ]);

  function renderStatusContent(status) {
    if (status.type === 'text') {
      return createElement('div', {
        class: [
          'max-w-lg',
          'w-full',
          'p-8',
          'rounded-xl',
          'text-white',
          'text-xl',
          'font-medium',
          'text-center'
        ],
        style: `background-color: ${status.backgroundColor}`
      }, status.content);
    } else if (status.type === 'image') {
      return createElement('img', {
        src: status.content,
        class: [
          'max-w-full',
          'max-h-[70vh]',
          'rounded-xl',
          'object-contain'
        ]
      });
    } else if (status.type === 'video') {
      return createElement('video', {
        src: status.content,
        controls: true,
        autoplay: true,
        class: [
          'max-w-full',
          'max-h-[70vh]',
          'rounded-xl'
        ]
      });
    }
  }

  function updateStatus() {
    // Update progress bars
    const progressBars = modal.querySelectorAll('.bg-white');
    progressBars.forEach((bar, index) => {
      bar.style.width = index < currentIndex ? '100%' : 
                       index === currentIndex ? '0%' : '0%';
    });

    // Update content
    const contentContainer = modal.querySelector('.flex-1.flex');
    contentContainer.children[1].remove();
    contentContainer.insertBefore(
      renderStatusContent(statuses[currentIndex]),
      contentContainer.lastElementChild
    );

    // Update timestamp
    modal.querySelector('.text-white/70').textContent = 
      formatStatusTime(statuses[currentIndex].createdAt);

    // Reset and start timer
    clearInterval(timer);
    startTimer();

    // Mark as seen
    if (!statuses[currentIndex].seenBy?.includes(store.state.currentUser.id)) {
      markAsSeen(user.id, statuses[currentIndex].id);
    }
  }

  function startTimer() {
    const progressBar = modal.querySelectorAll('.bg-white')[currentIndex];
    progressBar.style.width = '100%';

    timer = setTimeout(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        updateStatus();
      } else {
        modal.remove();
      }
    }, 5000);
  }

  document.body.appendChild(modal);
  startTimer();
}

// Fonction pour marquer un statut comme vu
async function markAsSeen(userId, statusId) {
  try {
    const user = store.state.users.find(u => u.id === userId);
    if (!user) return;

    const updatedStatuses = user.statuses.map(status => {
      if (status.id === statusId) {
        return {
          ...status,
          seenBy: [...(status.seenBy || []), store.state.currentUser.id]
        };
      }
      return status;
    });

    const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statuses: updatedStatuses })
    });

    if (response.ok) {
      store.setState({
        users: store.state.users.map(u => 
          u.id === userId ? { ...u, statuses: updatedStatuses } : u
        )
      });
    }
  } catch (error) {
    console.error('Erreur lors du marquage du statut comme vu:', error);
  }
}