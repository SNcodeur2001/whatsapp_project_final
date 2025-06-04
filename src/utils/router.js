import { createLoginPage } from '../pages/Login';
import { createMainLayout } from '../layouts/MainLayout';
import { store } from '../store/store';

export const router = {
  navigate: (route) => {
    const body = document.querySelector('body');
    body.innerHTML = '';

    switch (route) {
      case '/':
        body.appendChild(createLoginPage());
        break;
      case '/chat':
        // Rediriger vers login si pas connecté
        if (!store.state.currentUser) {
          router.navigate('/');
          return;
        }
        body.appendChild(createMainLayout());
        break;
      default:
        body.appendChild(createLoginPage());
    }
  }
};