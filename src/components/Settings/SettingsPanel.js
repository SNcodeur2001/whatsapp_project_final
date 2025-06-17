import { createElement } from "../../component";
import { router } from "../../utils/router";
import { store } from "../../store/store";

export function createSettingsPanel() {
  // Récupérer les informations de l'utilisateur courant
  const currentUser = store.state.currentUser;
  const userInitial = currentUser?.name?.charAt(0)?.toUpperCase() || '?';
  const userName = currentUser?.name || 'Utilisateur';
  const userStatus = currentUser?.status || 'Hey there! I am using WhatsApp.';

  return createElement('div', {
    class: [
      'w-full',
      'h-full',
      'bg-white',
      'flex',
      'flex-col',
      'overflow-hidden'
    ]
  }, [
    // Header moderne avec gradient subtil
    createElement('div', {
      class: [
        'bg-gradient-to-r',
        'from-[#f0f2f5]',
        'to-[#e9edef]',
        'px-6',
        'py-6',
        'flex',
        'items-center',
        'gap-6',
        'border-b',
        'border-[#e9edef]',
        'shadow-sm'
      ]
    }, [
      createElement('div', {
        class: ['flex', 'items-center', 'gap-4']
      }, [
        createElement('div', {
          class: [
            'w-12',
            'h-12',
            'rounded-full',
            'bg-[#00a884]',
            'flex',
            'items-center',
            'justify-center',
            'text-white',
            'shadow-lg'
          ]
        }, [
          createElement('i', {
            class: ['fas', 'fa-cog', 'text-lg']
          })
        ]),
        createElement('div', {
          class: ['flex', 'flex-col']
        }, [
          createElement('h1', {
            class: ['text-[#111b21]', 'text-xl', 'font-semibold', 'leading-tight']
          }, 'Paramètres'),
          createElement('p', {
            class: ['text-[#667781]', 'text-sm', 'mt-1']
          }, 'Gérez votre compte et vos préférences')
        ])
      ])
    ]),

    // Section Profil avec design moderne
    createElement('div', {
      class: [
        'mx-4',
        'mt-4',
        'mb-2',
        'bg-white',
        'rounded-xl',
        'border',
        'border-[#e9edef]',
        'shadow-sm',
        'overflow-hidden',
        'hover:shadow-md',
        'transition-all',
        'duration-200',
        'cursor-pointer',
        'group'
      ]
    }, [
      createElement('div', {
        class: [
          'p-5',
          'flex',
          'items-center',
          'gap-4',
          'group-hover:bg-[#f8f9fa]',
          'transition-colors',
          'duration-200'
        ]
      }, [
        // Avatar avec effet de hover
        createElement('div', {
          class: [
            'relative',
            'flex-shrink-0'
          ]
        }, [
          createElement('div', {
            class: [
              'w-16',
              'h-16',
              'rounded-full',
              'bg-gradient-to-br',
              'from-[#00a884]',
              'to-[#008069]',
              'flex',
              'items-center',
              'justify-center',
              'text-white',
              'text-xl',
              'font-semibold',
              'shadow-lg',
              'group-hover:shadow-xl',
              'transition-all',
              'duration-200',
              'group-hover:scale-105'
            ]
          }, userInitial),
          
          // Indicateur de statut en ligne
          createElement('div', {
            class: [
              'absolute',
              'bottom-1',
              'right-1',
              'w-4',
              'h-4',
              'bg-[#00d856]',
              'rounded-full',
              'border-2',
              'border-white',
              'shadow-sm'
            ]
          })
        ]),
        
        // Informations utilisateur
        createElement('div', {
          class: ['flex-1', 'min-w-0']
        }, [
          createElement('div', {
            class: ['flex', 'items-center', 'gap-2', 'mb-1']
          }, [
            createElement('h2', {
              class: ['text-[#111b21]', 'font-semibold', 'text-lg', 'truncate']
            }, userName),
            createElement('i', {
              class: ['fas', 'fa-edit', 'text-[#667781]', 'text-xs', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity']
            })
          ]),
          createElement('p', {
            class: ['text-sm', 'text-[#667781]', 'truncate', 'leading-relaxed']
          }, userStatus),
          createElement('p', {
            class: ['text-xs', 'text-[#00a884]', 'mt-1', 'font-medium']
          }, 'En ligne')
        ]),
        
        // Icône de navigation
        createElement('div', {
          class: [
            'text-[#667781]',
            'group-hover:text-[#00a884]',
            'transition-colors',
            'duration-200'
          ]
        }, [
          createElement('i', {
            class: ['fas', 'fa-chevron-right', 'text-sm']
          })
        ])
      ])
    ]),

    // Section des options avec design en cartes
    createElement('div', {
      class: ['flex-1', 'overflow-y-auto', 'px-4', 'pb-4', 'space-y-2']
    }, [
      // Groupe Compte & Sécurité
      createElement('div', {
        class: ['mb-4']
      }, [
        createElement('h3', {
          class: ['text-[#667781]', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider', 'mb-3', 'px-2']
        }, 'Compte & Sécurité'),
        createElement('div', {
          class: [
            'bg-white',
            'rounded-xl',
            'border',
            'border-[#e9edef]',
            'shadow-sm',
            'overflow-hidden'
          ]
        }, [
          createModernSettingItem('Compte', 'fa-user', 'Confidentialité, sécurité, changer de numéro'),
          createDivider(),
          createModernSettingItem('Confidentialité', 'fa-lock', 'Blocage, dernière vue, photo de profil'),
          createDivider(),
          createModernSettingItem('Avatar', 'fa-camera', 'Créer, modifier, historique des profils')
        ])
      ]),

      // Groupe Préférences
      createElement('div', {
        class: ['mb-4']
      }, [
        createElement('h3', {
          class: ['text-[#667781]', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider', 'mb-3', 'px-2']
        }, 'Préférences'),
        createElement('div', {
          class: [
            'bg-white',
            'rounded-xl',
            'border',
            'border-[#e9edef]',
            'shadow-sm',
            'overflow-hidden'
          ]
        }, [
          createModernSettingItem('Discussions', 'fa-comment', 'Thème, fonds d\'écran, historique des chats'),
          createDivider(),
          createModernSettingItem('Notifications', 'fa-bell', 'Sons de messages, groupes et appels'),
          createDivider(),
          createModernSettingItem('Stockage et données', 'fa-database', 'Utilisation du réseau et stockage')
        ])
      ]),

      // Groupe Support
      createElement('div', {
        class: ['mb-4']
      }, [
        createElement('h3', {
          class: ['text-[#667781]', 'text-xs', 'font-semibold', 'uppercase', 'tracking-wider', 'mb-3', 'px-2']
        }, 'Support'),
        createElement('div', {
          class: [
            'bg-white',
            'rounded-xl',
            'border',
            'border-[#e9edef]',
            'shadow-sm',
            'overflow-hidden'
          ]
        }, [
          createModernSettingItem('Aide', 'fa-question-circle', 'Centre d\'aide, nous contacter, conditions'),
          createDivider(),
          createModernSettingItem('Raccourcis clavier', 'fa-keyboard', 'Voir tous les raccourcis disponibles')
        ])
      ])
    ]),

    // Bouton de déconnexion moderne
    createElement('div', {
      class: ['px-4', 'pb-4', 'bg-[#f8f9fa]', 'border-t', 'border-[#e9edef]']
    }, [
      createElement('button', {
        class: [
          'w-full',
          'p-4',
          'flex',
          'items-center',
          'justify-center',
          'gap-3',
          'text-[#ff4444]',
          'hover:text-white',
          'bg-white',
          'hover:bg-[#ff4444]',
          'border',
          'border-[#ff4444]',
          'rounded-xl',
          'transition-all',
          'duration-200',
          'font-medium',
          'text-sm',
          'shadow-sm',
          'hover:shadow-md',
          'group'
        ],
        onclick: () => {
          // Confirmation moderne
          if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            store.setState({ currentUser: null });
            router.navigate('/');
          }
        }
      }, [
        createElement('i', {
          class: [
            'fas', 
            'fa-sign-out-alt',
            'group-hover:rotate-12',
            'transition-transform',
            'duration-200'
          ]
        }),
        'Se déconnecter'
      ])
    ])
  ]);
}

function createModernSettingItem(label, icon, description) {
  return createElement('div', {
    class: [
      'px-5',
      'py-4',
      'flex',
      'items-center',
      'gap-4',
      'hover:bg-[#f8f9fa]',
      'cursor-pointer',
      'transition-all',
      'duration-200',
      'group'
    ]
  }, [
    // Icône avec background coloré
    createElement('div', {
      class: [
        'w-10',
        'h-10',
        'rounded-full',
        'bg-[#e7f3ff]',
        'flex',
        'items-center',
        'justify-center',
        'text-[#00a884]',
        'group-hover:bg-[#00a884]',
        'group-hover:text-white',
        'transition-all',
        'duration-200',
        'flex-shrink-0'
      ]
    }, [
      createElement('i', {
        class: ['fas', icon, 'text-sm']
      })
    ]),
    
    // Contenu textuel
    createElement('div', {
      class: ['flex-1', 'min-w-0']
    }, [
      createElement('div', {
        class: ['text-[#111b21]', 'font-medium', 'text-sm', 'mb-1']
      }, label),
      createElement('div', {
        class: ['text-[#667781]', 'text-xs', 'leading-relaxed', 'truncate']
      }, description)
    ]),
    
    // Icône de navigation
    createElement('div', {
      class: [
        'text-[#667781]',
        'group-hover:text-[#00a884]',
        'group-hover:translate-x-1',
        'transition-all',
        'duration-200'
      ]
    }, [
      createElement('i', {
        class: ['fas', 'fa-chevron-right', 'text-xs']
      })
    ])
  ]);
}

function createDivider() {
  return createElement('div', {
    class: ['h-px', 'bg-[#f0f2f5]', 'mx-5']
  });
}