class Store {
  constructor() {
    this.state = {
      users: [],
      chats: [],
      currentChat: null,
      messages: [],
      currentUser: null,
      filters: {
        activeFilter: 'all', // 'all', 'unread', 'groups', 'archived'
        searchQuery: ''
      }
    };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
}

export const store = new Store();
