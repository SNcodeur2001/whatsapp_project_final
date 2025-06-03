import { createElement } from '../component';
import { createSidebarHeader } from '../components/Sidebar/SidebarHeader';
import { createSearchBar } from '../components/Sidebar/SearchBar';
import { createChatItem } from '../components/Chat/ChatItem';
import { createChatHeader } from '../components/Chat/ChatHeader';
import { createMessageInput } from '../components/Chat/MessageInput';

export function createMainLayout() {
  const layout = createElement('div', {
    class: ['flex', 'h-screen', 'bg-[#f0f2f5]']
  }, [
    createSidebar(),
    createChatArea()
  ]);

  return layout;
}

function createSidebar() {
  return createElement('div', {
    class: ['w-[400px]', 'bg-white', 'border-r', 'border-[#d1d7db]', 'flex', 'flex-col']
  }, [
    createSidebarHeader(),
    createSearchBar(),
    createChatList()
  ]);
}

function createChatList() {
  const chats = [
    { name: 'John Doe', lastMessage: 'Hello!', time: '10:30', unread: 2 },
    { name: 'Jane Smith', lastMessage: 'How are you?', time: '09:45' }
  ];

  return createElement('div', {
    class: ['flex-1', 'overflow-y-auto', 'divide-y', 'divide-[#e9edef]']
  }, chats.map(chat => createChatItem(chat)));
}

function createChatArea() {
  return createElement('div', {
    class: ['flex-1', 'flex', 'flex-col']
  }, [
    createChatHeader(),
    createElement('div', {
      class: [
        'flex-1',
        'bg-[#efeae2]',
        'bg-[url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")]',
        'bg-repeat',
        'opacity-[0.4]'
      ]
    }),
    createMessageInput()
  ]);
}