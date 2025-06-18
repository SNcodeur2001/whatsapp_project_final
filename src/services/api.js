import { store } from "../store/store";

const API_BASE_URL = 'https://whatsapp-json-server.onrender.com';
const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  CHATS: `${API_BASE_URL}/chats`,
  MESSAGES: `${API_BASE_URL}/messages`,
  STATUSES: `${API_BASE_URL}/statuses`
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
      name: nom, // Assurez-vous d'utiliser 'name' au lieu de 'nom' pour la cohérence
      phone,
      avatar: null,
      status: "Hey there! I am using WhatsApp",
      lastSeen: new Date().toISOString(),
      isOnline: true,
      contacts: [],
      statuses: [], // Ajout du tableau des statuts
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'inscription");
  }

  const data = await response.json();
  console.log("Utilisateur inscrit :", data);
}

export async function sendMessage(chatId, content, type = 'text') {
  if (!chatId || !content) return;

  try {
    const newMessage = {
      chatId: Number(chatId),
      senderId: store.state.currentUser.id,
      type: type,
      content: content,
      timestamp: new Date().toISOString(),
      status: "sent",
      reactions: [],
      replyTo: null,
      forwarded: false
    };

    // 1. Envoyer le message au serveur JSON Server
    const response = await fetch(API_ENDPOINTS.MESSAGES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du message');
    }

    const savedMessage = await response.json();

    // 2. Mettre à jour le store local avec le message sauvegardé
    const updatedMessages = [...store.state.messages, savedMessage];

    // 3. Mettre à jour le lastMessage du chat
    await updateChatLastMessage(chatId, savedMessage);

    // 4. Mettre à jour le store
    store.setState({
      messages: updatedMessages
    });

    console.log('Message envoyé et sauvegardé:', savedMessage);
    return savedMessage;

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
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

export async function toggleChatArchive(chatId) {
  try {
    const chat = store.state.chats.find(c => c.id === chatId);
    if (!chat) return;

    const response = await fetch(`${API_ENDPOINTS.CHATS}/${chatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        archived: !chat.archived
      })
    });

    const updatedChat = await response.json();
    
    // Mettre à jour le store
    store.setState({
      chats: store.state.chats.map(c => 
        c.id === chatId ? updatedChat : c
      )
    });

    return updatedChat;
  } catch (error) {
    console.error('Error toggling archive:', error);
  }
}

export async function createGroup(groupName, participants) {
  try {
    const currentUser = store.state.currentUser;
    const allParticipants = [currentUser.id, ...participants];

    const newGroup = {
      id: Date.now(),
      type: 'group',
      participants: allParticipants,
      name: groupName,
      avatar: null,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      lastMessage: null,
      unreadCount: 0,
      pinned: false,
      archived: false
    };

    const response = await fetch(`${API_ENDPOINTS.CHATS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGroup)
    });

    const savedGroup = await response.json();
    
    // Mettre à jour la liste des chats
    store.setState({
      chats: [...store.state.chats, savedGroup]
    });

    return savedGroup;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
}

// Ajouter cette fonction à votre fichier api.js existant

export async function sendAudioMessage(chatId, audioBlob) {
  if (!chatId || !audioBlob) return;

  try {
    // Convertir le blob en base64
    const audioBase64 = await blobToBase64(audioBlob);
    
    // Utiliser la fonction sendMessage avec le type audio
    return await sendMessage(chatId, audioBase64, 'audio');

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message audio:', error);
    throw error;
  }
}

// Fonction utilitaire pour convertir blob en base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Ajouter cette fonction pour mettre à jour le lastMessage du chat
async function updateChatLastMessage(chatId, message) {
  try {
    // Trouver le chat à mettre à jour
    const chat = store.state.chats.find(c => c.id === Number(chatId));
    if (!chat) return;

    // Préparer les données du lastMessage
    const lastMessageData = {
      messageId: message.id,
      content: message.type === 'audio' ? '🎵 Message vocal' : message.content,
      timestamp: message.timestamp,
      senderId: message.senderId
    };

    // Mettre à jour le chat sur le serveur
    const updatedChat = {
      ...chat,
      lastMessage: lastMessageData
    };

    const response = await fetch(`${API_ENDPOINTS.CHATS}/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedChat)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du chat');
    }

    const savedChat = await response.json();

    // Mettre à jour le store local
    const updatedChats = store.state.chats.map(c => 
      c.id === Number(chatId) ? savedChat : c
    );

    store.setState({
      chats: updatedChats
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du lastMessage:', error);
  }
}

// Fonction pour créer un statut texte
export async function createTextStatus(text, backgroundColor = '#00a884') {
  try {
    const currentUser = store.state.currentUser;
    const newStatus = {
      id: Date.now(),
      type: 'text',
      content: text,
      backgroundColor,
      createdAt: new Date().toISOString(),
      seenBy: [],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Mettre à jour les statuts de l'utilisateur
    const updatedUser = {
      ...currentUser,
      statuses: [...(currentUser.statuses || []), newStatus]
    };

    const response = await fetch(`${API_ENDPOINTS.USERS}/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });

    if (!response.ok) throw new Error('Erreur lors de la création du statut');

    const savedUser = await response.json();
    
    // Mettre à jour le store et localStorage
    store.setState({ 
      currentUser: savedUser,
      users: store.state.users.map(u => 
        u.id === savedUser.id ? savedUser : u
      )
    });
    localStorage.setItem('currentUser', JSON.stringify(savedUser));

    return newStatus;
  } catch (error) {
    console.error('Erreur lors de la création du statut texte:', error);
    throw error;
  }
}

// Fonction utilitaire pour convertir un fichier en base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Fonction pour créer un statut média (modifiée)
export async function createMediaStatus(file) {
  try {
    const currentUser = store.state.currentUser;
    const base64Data = await fileToBase64(file);
    
    const newStatus = {
      id: Date.now(),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      content: base64Data,
      createdAt: new Date().toISOString(),
      seenBy: [],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Mettre à jour les statuts de l'utilisateur
    const updatedUser = {
      ...currentUser,
      statuses: [...(currentUser.statuses || []), newStatus]
    };

    const response = await fetch(`${API_ENDPOINTS.USERS}/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });

    if (!response.ok) throw new Error('Erreur lors de la création du statut');

    const savedUser = await response.json();
    
    // Mettre à jour le store et localStorage
    store.setState({ 
      currentUser: savedUser,
      users: store.state.users.map(u => 
        u.id === savedUser.id ? savedUser : u
      )
    });
    localStorage.setItem('currentUser', JSON.stringify(savedUser));

    return newStatus;
  } catch (error) {
    console.error('Erreur lors de la création du statut média:', error);
    throw error;
  }
}

// Fonction pour obtenir tous les statuts
export async function fetchAllStatuses() {
  try {
    const users = await fetchUsers();
    const allStatuses = users.reduce((acc, user) => {
      if (user.statuses && user.statuses.length > 0) {
        // Ne garder que les statuts non expirés
        const validStatuses = user.statuses.filter(status => 
          new Date(status.expiresAt) > new Date()
        ).map(status => ({
          ...status,
          userId: user.id,
          userName: user.name
        }));
        return [...acc, ...validStatuses];
      }
      return acc;
    }, []);

    return allStatuses;
  } catch (error) {
    console.error('Erreur lors de la récupération des statuts:', error);
    throw error;
  }
}
