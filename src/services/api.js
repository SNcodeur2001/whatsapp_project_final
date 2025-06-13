import { store } from "../store/store";

const API_BASE_URL = 'https://whatsapp-json-server.onrender.com';
const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  CHATS: `${API_BASE_URL}/chats`,
  MESSAGES: `${API_BASE_URL}/messages`
};

async function fetchUsers() {
  const response = await fetch(API_ENDPOINTS.USERS);
  const data = await response.json();
  return data;
}

async function fetchChats() {
  const response = await fetch(API_ENDPOINTS.CHATS);
  const data = await response.json();
  return data;
}

// Fonction utilitaire pour normaliser les IDs
function normalizeId(id) {
  return Number(id);
}

async function fetchMessages(chatId) {
  const response = await fetch(API_ENDPOINTS.MESSAGES);
  const data = await response.json();

  return data.filter(
    (message) => normalizeId(message.chatId) === normalizeId(chatId)
  );
}

export async function initializeData() {
  try {
    // Récupérer toutes les données en parallèle
    const [users, chats, messages] = await Promise.all([
      fetchUsers(),
      fetchChats(),
      fetchMessages(),
    ]);

    // Mettre à jour le store avec les données
    store.setState({
      users,
      chats,
      messages,
    });

    console.log("Data initialized:", store.state);
    return { users, chats, messages };
  } catch (error) {
    console.error("Error initializing data:", error);
    throw error;
  }
}

async function login(phoneNumber) {
  try {
    const users = await fetchUsers();
    const user = users.find((u) => u.phone === phoneNumber);

    if (user) {
      // Sauvegarde dans localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      store.setState({ currentUser: user });
            await initializeData();  // 👈 Ajout ici

      console.log("User logged in:", user);
      return user;
    }

    throw new Error("User not found");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Nouvelle fonction pour vérifier l'état de connexion
export function checkAuthState() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    store.setState({ currentUser: user });
    return user;
  }
  return null;
}

// Fonction de déconnexion
export function logout() {
  localStorage.removeItem("currentUser");
  store.setState({ currentUser: null });
}

export const api = {
  fetchUsers,
  fetchChats,
  fetchMessages,
  login,
};

export async function loadMessages(chatId) {
  try {
    console.log("Loading messages for chat:", chatId);
    const normalizedChatId = normalizeId(chatId);

    const response = await fetch(API_ENDPOINTS.MESSAGES);
    const allMessages = await response.json();

    const chatMessages = allMessages.filter(
      (message) => normalizeId(message.chatId) === normalizedChatId
    );

    store.setState({
      currentChat: normalizedChatId,
      messages: chatMessages,
    });

    console.log("Messages chargés:", chatMessages.length);
  } catch (error) {
    console.error("Error:", error);
  }
}


export async function register(nom, phone) {
  const response = await fetch(API_ENDPOINTS.USERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: Date.now(),
      nom,
      phone,
      avatar: null, 
      status: "Hey there! I am using WhatsApp", 
      lastSeen: new Date().toISOString(), 
      isOnline: true, 
      contacts: [], 
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'inscription");
  }

  const data = await response.json();
  console.log("Utilisateur inscrit :", data);
}

export async function sendMessage(chatId, content) {
  try {
    const newMessage = {
      id: Date.now(),
      chatId: Number(chatId),
      senderId: store.state.currentUser.id,
      type: "text",
      content,
      timestamp: new Date().toISOString(),
      status: "sent",
      reactions: [],
      replyTo: null,
      forwarded: false
    };

    const response = await fetch(`${API_ENDPOINTS.MESSAGES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });

    const savedMessage = await response.json();

    // Mise à jour du lastMessage du chat
    await fetch(`${API_ENDPOINTS.CHATS}/${chatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastMessage: {
          messageId: savedMessage.id,
          content: content,
          timestamp: savedMessage.timestamp,
          senderId: store.state.currentUser.id
        }
      })
    });

    // Mettre à jour le store
    store.setState({
      messages: [...store.state.messages, savedMessage]
    });

    return savedMessage;
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

let messagePollingInterval;

export function startMessagePolling() {
  // Clear any existing interval
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval);
  }

  messagePollingInterval = setInterval(async () => {
    try {
      if (store.state.currentChat) {
        const response = await fetch(`${API_ENDPOINTS.MESSAGES}`);
        const allMessages = await response.json();
        
        // Filter messages for current chat
        const chatMessages = allMessages.filter(
          message => normalizeId(message.chatId) === normalizeId(store.state.currentChat)
        );

        // Only update if messages have changed
        if (JSON.stringify(chatMessages) !== JSON.stringify(store.state.messages)) {
          store.setState({ messages: chatMessages });
          console.log('Messages updated:', chatMessages.length);
        }
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }, 3000); // Poll every second

  return () => clearInterval(messagePollingInterval);
}

export function stopMessagePolling() {
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval);
  }
}

export async function addContact(contactPhone) {
  try {
    const users = await fetchUsers();
    const contactToAdd = users.find(u => u.phone === contactPhone);
    
    if (!contactToAdd) {
      throw new Error('Utilisateur non trouvé');
    }

    const currentUser = store.state.currentUser;
    const updatedContacts = [...(currentUser.contacts || []), contactToAdd.id];

    // Mettre à jour les contacts de l'utilisateur
    const response = await fetch(`${API_ENDPOINTS.USERS}/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contacts: updatedContacts
      })
    });

    const updatedUser = await response.json();
    
    // Mettre à jour le store et localStorage
    store.setState({ 
      currentUser: updatedUser
    });
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Créer un nouveau chat avec le contact
    const newChat = {
      id: Date.now(),
      type: 'individual',
      participants: [currentUser.id, contactToAdd.id],
      name: contactToAdd.name,
      avatar: null,
      createdAt: new Date().toISOString(),
      lastMessage: null,
      unreadCount: 0,
      pinned: false,
      archived: false
    };

    await fetch(`${API_ENDPOINTS.CHATS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChat)
    });

    // Recharger les chats
    const chats = await fetchChats();
    store.setState({ chats });

    return updatedUser;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
}
