import { createElement } from "../../component";
import { store } from "../../store/store";
import { createChatHeader } from "./ChatHeader";
import { createMessageInput } from "./MessageInput";
import { startMessagePolling, stopMessagePolling } from "../../services/api";
import { formatTime } from "../../utils/dateUtils";

export function createChatArea() {
  const chatArea = createElement("div", {
    class: ["flex-1", "flex", "flex-col"],
  });

  function renderMessages() {
    // Guard clause for messages container
    if (!store.state.currentUser || !store.state.messages) {
      return createElement("div", {
        class: ["flex-1", "bg-[#efeae2]"],
      });
    }

    return createElement(
      "div",
      {
        class: ["flex-1", "bg-[#efeae2]", "overflow-y-auto", "p-4"],
      },
      store.state.messages
        .map((message) => createMessage(message))
        .filter(Boolean) // Filter out null messages
    );
  }

  function updateChatArea() {
    chatArea.innerHTML = "";

    if (store.state.currentChat) {
      // Trouvons le chat actuel
      const currentChat = store.state.chats.find(
        (c) => c.id === store.state.currentChat
      );

      chatArea.append(
        createChatHeader(currentChat), // Passer le chat actuel
        renderMessages(),
        createMessageInput()
      );

      // Start polling when chat is selected
      startMessagePolling();
    } else {
      stopMessagePolling(); // Stop polling when no chat is selected
      chatArea.append(
        createElement(
          "div",
          {
            class: [
              "flex-1",
              "flex",
              "items-center",
              "justify-center",
              "text-[#54656f]",
            ],
          },
          "Sélectionnez une discussion pour commencer"
        )
      );
    }
  }

  // Cleanup on unmount (if needed)
  window.addEventListener("beforeunload", stopMessagePolling);

  store.subscribe(updateChatArea);
  updateChatArea();

  return chatArea;
}

// Ajouter cette fonction pour créer un message audio
function createAudioMessage(message) {
  const audioElement = createElement('audio', {
    controls: true,
    class: ['max-w-xs', 'rounded-lg']
  });
  
  audioElement.src = message.content; // Le contenu base64
  
  return createElement('div', {
    class: [
      'flex',
      'items-center',
      'gap-2',
      'bg-[#e9edef]',
      'p-3',
      'rounded-lg',
      'max-w-xs'
    ]
  }, [
    createElement('i', {
      class: ['fas', 'fa-play', 'text-[#00a884]']
    }),
    audioElement
  ]);
}

// Modifier la fonction createMessage pour gérer les messages audio
function createMessage(message) {
  if (!message || !store.state.currentUser) return null;
  
  const isOwn = message.senderId === store.state.currentUser.id;
  
  let messageContent;
  if (message.type === 'audio') {
    messageContent = createAudioMessage(message);
  } else {
    messageContent = createElement('p', {
      class: ['text-sm', 'break-words']
    }, message.content || '');
  }

  return createElement('div', {
    class: [
      'flex',
      'mb-4',
      isOwn ? 'justify-end' : 'justify-start'
    ]
  }, [
    createElement('div', {
      class: [
        'max-w-xs',
        'lg:max-w-md',
        'px-4',
        'py-2',
        'rounded-lg',
        isOwn 
          ? 'bg-[#d9fdd3] text-[#111b21]' 
          : 'bg-white text-[#111b21]',
        'shadow-sm'
      ]
    }, [
      messageContent,
      createElement('div', {
        class: ['text-xs', 'text-[#667781]', 'mt-1', 'text-right']
      }, formatTime(message.timestamp))
    ])
  ]);
}
