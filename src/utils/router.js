import { createLoginPage } from '../pages/Login';
import { createMainLayout } from '../layouts/MainLayout';

export const router = {
  navigate: (route) => {
    const body = document.querySelector('body');
    body.innerHTML = '';

    switch (route) {
      case '/':
        body.appendChild(createLoginPage());
        break;
      case '/chat':
        body.appendChild(createMainLayout());
        break;
      default:
        body.appendChild(createLoginPage());
    }
  }
};