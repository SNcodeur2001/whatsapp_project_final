import { store } from '../store/store';

async function fetchUsers() {
  const response = await fetch('http://localhost:3000/users');
  const data = await response.json();
  return data;
}

async function fetchChats() {
  const response = await fetch('http://localhost:3000/chats');
  const data = await response.json();
  return data;
}

async function fetchMessages(chatId) {
  const response = await fetch('http://localhost:3000/messages');
  const data = await response.json();

  return data.filter(message => message.chatId === chatId);
}

export async function initializeData() {
  try {
    // Récupérer toutes les données en parallèle
    const [users, chats, messages] = await Promise.all([
      fetchUsers(),
      fetchChats(), 
      fetchMessages()
    ]);

    // Mettre à jour le store avec les données
    store.setState({
      users,
      chats,
      messages
    });

    console.log('Data initialized:', store.state);
    return { users, chats, messages };
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}

async function login(phoneNumber) {
  try {
    const users = await fetchUsers();
    const user = users.find(u => u.phone === phoneNumber);
    
    if (user) {
      // Sauvegarde dans localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      store.setState({ currentUser: user });
      console.log('User logged in:', user);
      return user;
    }
    
    throw new Error('User not found');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Nouvelle fonction pour vérifier l'état de connexion
export function checkAuthState() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    store.setState({ currentUser: user });
    return user;
  }
  return null;
}

// Fonction de déconnexion
export function logout() {
  localStorage.removeItem('currentUser');
  store.setState({ currentUser: null });
}

export const api = {
  fetchUsers,
  fetchChats,
  fetchMessages,
  login
};

export async function loadMessages(chatId) {
  try {
    console.log('Loading messages for chat:', chatId);
    
    // Récupérer tous les messages
    const response = await fetch('http://localhost:3000/messages');
    const allMessages = await response.json();
    
    // Filtrer les messages pour ce chat
    const chatMessages = allMessages.filter(message => message.chatId === chatId);
    
    // Mettre à jour le store
    store.setState({
      currentChat: chatId,
      messages: chatMessages // Uniquement les messages de ce chat
    });

    console.log('Chat messages loaded:', chatMessages);
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}