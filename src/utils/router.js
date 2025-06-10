import { createLoginPage } from '../pages/Login';
import { createMainLayout } from '../layouts/MainLayout';
import { store } from '../store/store';

export const router = {
  navigate: (route) => {
    console.log('Navigation to:', route);
    
    const body = document.querySelector('body');
    body.style.height = '100vh';
    body.style.margin = '0';
    body.style.overflow = 'hidden';
    body.innerHTML = '';

    switch (route) {
      case '/':
        body.appendChild(createLoginPage());
        break;
      case '/chat':
        if (!store.state.currentUser) {
          console.log('No user found, redirecting to login');
          router.navigate('/');
          return;
        }
        const layout = createMainLayout();
        body.appendChild(layout);
        break;
      default:
        body.appendChild(createLoginPage());
    }
  }
};