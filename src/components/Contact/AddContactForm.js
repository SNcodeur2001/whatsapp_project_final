import { createElement } from "../../component";
import { addContact } from "../../services/api";
import { store } from "../../store/store";

export function createAddContactForm(onCancel) {
  // Fonction pour obtenir les contacts non ajoutés
  function getAvailableContacts() {
    const currentUser = store.state.currentUser;
    const userContacts = currentUser.contacts || [];
    
    return store.state.users.filter(user => 
      user.id !== currentUser.id && !userContacts.includes(user.id)
    );
  }

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
      }, 'Ajouter un contact')
    ]),

    // Form
    createElement('form', {
      class: ['space-y-4'],
      onsubmit: async (e) => {
        e.preventDefault();
        const select = e.target.querySelector('select');
        const selectedUserId = select.value;
        
        if (selectedUserId) {
          try {
            const selectedUser = store.state.users.find(u => u.id === Number(selectedUserId));
            await addContact(selectedUser.phone);
            onCancel();
          } catch (error) {
            alert(error.message);
          }
        }
      }
    }, [
      // Select des contacts disponibles
      createElement('div', {
        class: ['space-y-2']
      }, [
        createElement('label', {
          class: ['text-sm', 'text-[#667781]']
        }, 'Sélectionnez un contact'),
        createElement('select', {
          required: true,
          class: [
            'w-full',
            'p-2',
            'border',
            'border-[#d1d7db]',
            'rounded',
            'focus:outline-none',
            'focus:border-[#00a884]',
            'bg-white'
          ]
        }, [
          createElement('option', {
            value: ''
          }, 'Choisir un contact...'),
          ...getAvailableContacts().map(user => 
            createElement('option', {
              value: user.id
            }, `${user.name} (${user.phone})`)
          )
        ])
      ]),

      // Bouton d'ajout
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
      }, 'Ajouter le contact')
    ])
  ]);
}