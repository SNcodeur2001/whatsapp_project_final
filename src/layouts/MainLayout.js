import { createElement } from '../component';
import { createMiniSidebar } from '../components/Sidebar/MiniSidebar';
import { createChatsSidebar } from '../components/Sidebar/ChatsSidebar';
import { createChatArea } from '../components/Chat/ChatArea';

export function createMainLayout() {
  return createElement('div', {
    class: ['flex', 'h-screen']
  }, [
    createMiniSidebar(),
    createElement('div', {
      class: ['flex', 'flex-1']
    }, [
      createChatsSidebar(),
      createChatArea()
    ])
  ]);
}