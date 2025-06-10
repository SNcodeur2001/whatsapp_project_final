import { createElement } from '../component';
import { createMiniSidebar } from '../components/Sidebar/MiniSidebar';
import { createChatsSidebar } from '../components/Sidebar/ChatsSidebar';
import { createChatArea } from '../components/Chat/ChatArea';
import { logout } from '../services/api';
import { router } from '../utils/router';

export function createMainLayout() {
  const logoutButton = createElement('button', {
    class: [
      'absolute',
      'top-4',
      'right-4',
      'px-4',
      'py-2',
      'bg-red-500',
      'text-white',
      'rounded',
      'hover:bg-red-600',
      'transition-colors',
      'z-50'
    ],
    onclick: () => {
      logout();
      router.navigate('/');
    }
  }, 'Déconnexion');

  const layout = createElement('div', {
    class: ['flex', 'h-screen', 'bg-[#efeae2]', 'fixed', 'inset-0']
  }, [
    createMiniSidebar(),
    createElement('div', {
      class: ['flex', 'flex-1']
    }, [
      createChatsSidebar(),
      createChatArea()
    ]),
    logoutButton
  ]);

  return layout;
}