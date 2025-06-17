import { createElement } from "../../component";
import { createGroup } from "../../services/api";
import { store } from "../../store/store";

export function createGroupForm(onCancel) {
  const availableContacts = store.state.users.filter(user => 
    user.id !== store.state.currentUser.id
  );

  const selectedParticipants = new Set();

  return createElement('div', {
    class: ['bg-white', 'h-full', 'flex', 'flex-col']
  }, [
    // Header avec style WhatsApp moderne
    createElement('div', {
      class: [
        'bg-[#f0f2f5]', 
        'px-4', 
        'py-5', 
        'flex', 
        'items-center', 
        'gap-6',
        'border-b',
        'border-[#e9edef]',
        'shadow-sm'
      ]
    }, [
      createElement('button', {
        class: [
          'text-[#54656f]',
          'hover:text-[#00a884]',
          'transition-colors',
          'duration-200',
          'p-2',
          'hover:bg-[#f5f6f6]',
          'rounded-full',
          'w-10',
          'h-10',
          'flex',
          'items-center',
          'justify-center'
        ],
        onclick: onCancel
      }, [
        createElement('i', {
          class: ['fas', 'fa-arrow-left', 'text-lg']
        })
      ]),
      createElement('div', {
        class: ['flex', 'flex-col']
      }, [
        createElement('h2', {
          class: ['text-[19px]', 'font-medium', 'text-[#111b21]', 'leading-tight']
        }, 'Nouveau groupe'),
        createElement('p', {
          class: ['text-sm', 'text-[#667781]', 'mt-1']
        }, `Ajouter des participants • ${availableContacts.length} contact${availableContacts.length > 1 ? 's' : ''} disponible${availableContacts.length > 1 ? 's' : ''}`)
      ])
    ]),

    // Contenu principal avec scroll
    createElement('div', {
      class: ['flex-1', 'overflow-y-auto', 'bg-white']
    }, [
      // Section nom du groupe
      createElement('div', {
        class: ['px-6', 'py-6', 'border-b', 'border-[#f0f2f5]']
      }, [
        createElement('div', {
          class: [
            'bg-[#e7f3ff]',
            'border-l-4',
            'border-[#00a884]',
            'p-4',
            'rounded-r-lg',
            'mb-6',
            'flex',
            'items-start',
            'gap-3'
          ]
        }, [
          createElement('i', {
            class: ['fas', 'fa-users', 'text-[#00a884]', 'mt-0.5', 'text-sm']
          }),
          createElement('div', {
            class: ['text-sm', 'text-[#111b21]', 'leading-relaxed']
          }, [
            createElement('p', {}, 'Donnez un nom à votre groupe et sélectionnez les participants.')
          ])
        ]),

        // Formulaire
        createElement('form', {
          class: ['space-y-6'],
          onsubmit: async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const groupName = formData.get('groupName');
            
            if (groupName && selectedParticipants.size > 0) {
              try {
                await createGroup(groupName, Array.from(selectedParticipants));
                onCancel();
              } catch (error) {
                alert(error.message);
              }
            }
          }
        }, [
          // Section nom du groupe
          createElement('div', {
            class: ['space-y-3']
          }, [
            createElement('label', {
              class: [
                'block',
                'text-sm',
                'font-medium',
                'text-[#111b21]',
                'mb-2'
              ]
            }, 'Nom du groupe'),
            
            createElement('div', {
              class: ['relative']
            }, [
              createElement('div', {
                class: [
                  'absolute',
                  'left-3',
                  'top-1/2',
                  'transform',
                  '-translate-y-1/2',
                  'text-[#667781]',
                  'pointer-events-none'
                ]
              }, [
                createElement('i', {
                  class: ['fas', 'fa-users', 'text-sm']
                })
              ]),
              
              createElement('input', {
                name: 'groupName',
                type: 'text',
                required: true,
                placeholder: 'Ex: Famille, Amis, Travail...',
                class: [
                  'w-full',
                  'pl-10',
                  'pr-4',
                  'py-3',
                  'border',
                  'border-[#e9edef]',
                  'rounded-lg',
                  'focus:outline-none',
                  'focus:ring-2',
                  'focus:ring-[#00a884]',
                  'focus:ring-opacity-20',
                  'focus:border-[#00a884]',
                  'bg-white',
                  'text-[#111b21]',
                  'text-sm',
                  'transition-all',
                  'duration-200',
                  'hover:border-[#d1d7db]',
                  'placeholder-[#667781]'
                ]
              })
            ])
          ]),

          // Section participants avec compteur
          createElement('div', {
            class: ['space-y-4']
          }, [
            createElement('div', {
              class: ['flex', 'items-center', 'justify-between']
            }, [
              createElement('label', {
                class: [
                  'block',
                  'text-sm',
                  'font-medium',
                  'text-[#111b21]'
                ]
              }, 'Participants'),
              createElement('div', {
                id: 'participants-counter',
                class: [
                  'px-3',
                  'py-1',
                  'bg-[#e7f3ff]',
                  'text-[#00a884]',
                  'text-xs',
                  'font-medium',
                  'rounded-full',
                  'border',
                  'border-[#00a884]',
                  'border-opacity-20'
                ]
              }, '0 sélectionné')
            ]),

            // Liste des contacts avec design moderne
            createElement('div', {
              class: [
                'bg-[#f8f9fa]',
                'rounded-lg',
                'border',
                'border-[#e9edef]',
                'max-h-80',
                'overflow-y-auto',
                'scrollbar-thin',
                'scrollbar-thumb-[#d1d7db]',
                'scrollbar-track-transparent'
              ]
            }, [
              ...availableContacts.map((contact, index) => 
                createElement('div', {
                  class: [
                    'flex',
                    'items-center',
                    'gap-4',
                    'p-4',
                    'hover:bg-white',
                    'transition-colors',
                    'duration-150',
                    'cursor-pointer',
                    index !== availableContacts.length - 1 ? 'border-b' : '',
                    index !== availableContacts.length - 1 ? 'border-[#e9edef]' : ''
                  ].filter(Boolean),
                  onclick: (e) => {
                    const checkbox = e.currentTarget.querySelector('input[type="checkbox"]');
                    if (e.target !== checkbox) {
                      checkbox.checked = !checkbox.checked;
                      checkbox.dispatchEvent(new Event('change'));
                    }
                  }
                }, [
                  // Checkbox personnalisé
                  createElement('div', {
                    class: ['relative', 'flex-shrink-0']
                  }, [
                    createElement('input', {
                      type: 'checkbox',
                      value: contact.id,
                      class: [
                        'w-5',
                        'h-5',
                        'text-[#00a884]',
                        'border-2',
                        'border-[#d1d7db]',
                        'rounded',
                        'focus:ring-[#00a884]',
                        'focus:ring-2',
                        'focus:ring-opacity-20',
                        'transition-colors',
                        'duration-200'
                      ],
                      onchange: (e) => {
                        if (e.target.checked) {
                          selectedParticipants.add(contact.id);
                        } else {
                          selectedParticipants.delete(contact.id);
                        }
                        
                        // Mettre à jour le compteur
                        const counter = document.getElementById('participants-counter');
                        if (counter) {
                          const count = selectedParticipants.size;
                          counter.textContent = `${count} sélectionné${count > 1 ? 's' : ''}`;
                          
                          if (count > 0) {
                            counter.classList.remove('bg-[#e7f3ff]', 'text-[#00a884]');
                            counter.classList.add('bg-[#00a884]', 'text-white');
                          } else {
                            counter.classList.remove('bg-[#00a884]', 'text-white');
                            counter.classList.add('bg-[#e7f3ff]', 'text-[#00a884]');
                          }
                        }
                      }
                    })
                  ]),
                  
                  // Avatar du contact
                  createElement('div', {
                    class: [
                      'w-12',
                      'h-12',
                      'rounded-full',
                      'bg-gradient-to-br',
                      'from-[#dfe5e7]',
                      'to-[#c5d1d4]',
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-[#54656f]',
                      'font-semibold',
                      'text-lg',
                      'shadow-sm',
                      'border-2',
                      'border-white',
                      'flex-shrink-0'
                    ]
                  }, contact.name.charAt(0).toUpperCase()),
                  
                  // Informations du contact
                  createElement('div', {
                    class: ['flex-1', 'min-w-0']
                  }, [
                    createElement('div', {
                      class: ['font-medium', 'text-[#111b21]', 'text-sm', 'truncate']
                    }, contact.name),
                    createElement('div', {
                      class: ['text-[#667781]', 'text-xs', 'mt-1', 'truncate']
                    }, contact.phone || 'Disponible')
                  ])
                ])
              )
            ])
          ]),

          // Section des boutons
          createElement('div', {
            class: ['flex', 'gap-3', 'pt-4']
          }, [
            // Bouton Annuler
            createElement('button', {
              type: 'button',
              onclick: onCancel,
              class: [
                'flex-1',
                'px-6',
                'py-3',
                'border',
                'border-[#e9edef]',
                'text-[#667781]',
                'rounded-lg',
                'font-medium',
                'text-sm',
                'hover:bg-[#f5f6f6]',
                'hover:border-[#d1d7db]',
                'transition-all',
                'duration-200',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-[#09edef]'
              ]
            }, 'Annuler'),
            
            // Bouton Créer le groupe
            createElement('button', {
              type: 'submit',
              class: [
                'flex-1',
                'px-6',
                'py-3',
                'bg-[#00a884]',
                'text-white',
                'rounded-lg',
                'font-medium',
                'text-sm',
                'hover:bg-[#008069]',
                'active:bg-[#006b5b]',
                'transition-all',
                'duration-200',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-[#00a884]',
                'focus:ring-opacity-30',
                'shadow-sm',
                'hover:shadow-md',
                'flex',
                'items-center',
                'justify-center',
                'gap-2'
              ]
            }, [
              createElement('i', {
                class: ['fas', 'fa-plus', 'text-xs']
              }),
              'Créer le groupe'
            ])
          ])
        ])
      ])
    ])
  ]);
}