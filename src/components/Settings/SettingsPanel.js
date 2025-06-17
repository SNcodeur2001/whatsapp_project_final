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
      'flex-col'
    ]
  }, [
    // Header
    createElement('div', {
      class: [
        'bg-[#f0f2f5]',
        'py-4',
        'px-6',
        'flex',
        'items-center',
        'gap-6'
      ]
    }, [
      createElement('h1', {
        class: ['text-[#111b21]', 'text-xl']
      }, 'Paramètres'),
    ]),

    // Profile Section
    createElement('div', {
      class: [
        'p-4',
        'flex',
        'items-center',
        'gap-4',
        'border-b',
        'border-[#e9edef]',
        'hover:bg-[#f5f6f6]',
        'cursor-pointer',
        'transition-all'
      ]
    }, [
      // Avatar avec l'initiale dynamique
      createElement('div', {
        class: [
          'w-14',
          'h-14',
          'rounded-full',
          'bg-gradient-to-br',
          'from-[#00a884]',
          'to-[#008069]',
          'flex',
          'items-center',
          'justify-center',
          'text-white',
          'text-xl',
          'font-medium'
        ]
      }, userInitial),
      
      // Informations utilisateur
      createElement('div', {
        class: ['flex-1']
      }, [
        createElement('h2', {
          class: ['text-[#111b21]', 'font-medium']
        }, userName),
        createElement('p', {
          class: ['text-sm', 'text-[#667781]', 'mt-1']
        }, userStatus)
      ])
    ]),

    // Settings Options
    createElement('div', {
      class: ['flex-1', 'overflow-y-auto']
    }, [
      createSettingItem('Compte', 'fa-user'),
      createSettingItem('Confidentialité', 'fa-lock'),
      createSettingItem('Discussions', 'fa-comment'),
      createSettingItem('Notifications', 'fa-bell'),
      createSettingItem('Raccourcis', 'fa-keyboard'),
      createSettingItem('Aide', 'fa-question-circle'),
    ]),

    // Bouton de déconnexion
    createElement('button', {
      class: [
        'mx-4',
        'mb-4',
        'p-4',
        'flex',
        'items-center',
        'gap-4',
        'text-red-500',
        'hover:bg-red-50',
        'rounded-lg',
        'transition-colors'
      ],
      onclick: () => {
        store.setState({ currentUser: null });
        router.navigate('/');
      }
    }, [
      createElement('i', {
        class: ['fas', 'fa-sign-out-alt']
      }),
      'Déconnexion'
    ])
  ]);
}

function createSettingItem(label, icon) {
  return createElement('div', {
    class: [
      'px-6',
      'py-4',
      'flex',
      'items-center',
      'gap-6',
      'hover:bg-[#f5f6f6]',
      'cursor-pointer',
      'transition-colors'
    ]
  }, [
    createElement('i', {
      class: ['fas', icon, 'text-[#54656f]', 'w-5']
    }),
    createElement('span', {
      class: ['text-[#111b21]']
    }, label)
  ]);
}