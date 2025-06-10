import { store } from "../store/store";

async function fetchUsers() {
  const response = await fetch("http://localhost:3000/users");
  const data = await response.json();
  return data;
}

async function fetchChats() {
  const response = await fetch("http://localhost:3000/chats");
  const data = await response.json();
  return data;
}

// Fonction utilitaire pour normaliser les IDs
function normalizeId(id) {
  return Number(id);
}

async function fetchMessages(chatId) {
  const response = await fetch("http://localhost:3000/messages");
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

    const response = await fetch("http://localhost:3000/messages");
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
