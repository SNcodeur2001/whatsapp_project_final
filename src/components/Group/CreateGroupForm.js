import { createElement } from "../../component";
import { createGroup } from "../../services/api";
import { store } from "../../store/store";

export function createGroupForm(onCancel) {
  const availableContacts = store.state.users.filter(user => 
    user.id !== store.state.currentUser.id
  );

  const selectedParticipants = new Set();

  return createElement('div', {
    class: ['bg-white', 'p-6', 'h-full', 'flex', 'flex-col']
  }, [
    // Header
    createElement('div', {
      class: ['flex', 'items-center', 'mb-6', 'gap-4']
    }, [
      createElement('button', {
        class: ['text-[#54656f]'],
        onclick: onCancel
      }, [
        createElement('i', {
          class: ['fas', 'fa-arrow-left']
        })
      ]),
      createElement('h2', {
        class: ['text-xl', 'font-medium']
      }, 'Nouveau groupe')
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
      // Nom du groupe
      createElement('div', {
        class: ['space-y-2']
      }, [
        createElement('label', {
          class: ['text-sm', 'text-[#667781]']
        }, 'Nom du groupe'),
        createElement('input', {
          name: 'groupName',
          type: 'text',
          required: true,
          placeholder: 'Ex: Famille, Amis...',
          class: [
            'w-full',
            'p-2',
            'border',
            'border-[#d1d7db]',
            'rounded',
            'focus:outline-none',
            'focus:border-[#00a884]'
          ]
        })
      ]),

      // Liste des contacts
      createElement('div', {
        class: ['space-y-2']
      }, [
        createElement('label', {
          class: ['text-sm', 'text-[#667781]']
        }, 'Participants'),
        ...availableContacts.map(contact => 
          createElement('div', {
            class: ['flex', 'items-center', 'gap-3', 'p-2', 'hover:bg-[#f0f2f5]', 'rounded']
          }, [
            createElement('input', {
              type: 'checkbox',
              value: contact.id,
              onchange: (e) => {
                if (e.target.checked) {
                  selectedParticipants.add(contact.id);
                } else {
                  selectedParticipants.delete(contact.id);
                }
              }
            }),
            createElement('span', {}, contact.name)
          ])
        )
      ]),

      // Bouton de création
      createElement('button', {
        type: 'submit',
        class: [
          'w-full',
          'bg-[#00a884]',
          'text-white',
          'p-2',
          'rounded',
          'font-medium',
          'hover:bg-[#008069]',
          'transition-colors'
        ]
      }, 'Créer le groupe')
    ])
  ]);
}