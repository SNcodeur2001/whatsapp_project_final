import { store } from '../store/store';

async function fetchUsers() {
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.users;
}

async function fetchChats() {
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.chats;
}

async function fetchMessages(chatId) {
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.messages.filter(message => message.chatId === chatId);
}

async function login(phoneNumber) {
  const users = await fetchUsers();
  const user = users.find(u => u.phone === phoneNumber);
  
  if (user) {
    store.setState({ currentUser: user });
    return user;
  }
  
  throw new Error('Numéro de téléphone non trouvé');
}

export const api = {
  fetchUsers,
  fetchChats,
  fetchMessages,
  login
};

export async function initializeData() {
  try {
    const [users, chats] = await Promise.all([
      fetchUsers(),
      fetchChats()
    ]);
    
    store.setState({
      users,
      chats,
      currentUser: users[0] // Pour l'exemple
    });
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

export async function loadMessages(chatId) {
  try {
    const messages = await fetchMessages(chatId);
    store.setState({
      currentChat: chatId,
      messages
    });
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}