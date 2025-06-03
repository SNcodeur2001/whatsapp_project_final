import { createElement } from '../component';
import { createButton } from '../components/Button';
import { createInput } from '../components/Input';
import { createCountrySelect } from '../components/CountrySelect';
import { createMainLayout } from '../layouts/MainLayout';
import { createLogo } from '../components/Logo';

export function createLoginPage() {
  const container = createElement('div', {
    class: ['min-h-screen', 'bg-[#00a884]', 'flex', 'items-center', 'justify-center', 'flex-col']
  });

  // Ajout de la barre supérieure verte
  const topBar = createElement('div', {
    class: ['bg-[#00a884]', 'h-28', 'w-full', 'absolute', 'top-0']
  });

  const card = createElement('div', {
    class: ['bg-white', 'rounded-md', 'p-8', 'shadow-md', 'w-[400px]', 'z-10']
  }, [
    createLogo(),
    createElement('div', { 
      class: ['text-center', 'mb-8'] 
    }, [
      createElement('h1', { 
        class: ['text-[28px]', 'text-[#41525d]', 'font-light'] 
      }, 'WhatsApp Web'),
      createElement('p', { 
        class: ['text-[#41525d]', 'mt-4', 'text-sm'] 
      }, 'Entrez votre numéro de téléphone pour vous connecter.')
    ]),
    
    createElement('form', {
      class: ['space-y-6'],
      onsubmit: (e) => {
        e.preventDefault();
        const mainApp = createMainLayout();
        document.body.innerHTML = '';
        document.body.appendChild(mainApp);
      }
    }, [
      createElement('div', { class: ['space-y-1'] }, [
        createElement('label', {
          class: ['text-sm', 'text-[#41525d]']
        }, 'Sélectionnez votre pays'),
        createCountrySelect()
      ]),
      createElement('div', { class: ['space-y-1'] }, [
        createElement('label', {
          class: ['text-sm', 'text-[#41525d]']
        }, 'Entrez votre numéro de téléphone'),
        createInput({
          type: 'tel',
          placeholder: 'Numéro de téléphone',
          class: ['focus:ring-[#00a884]', 'focus:border-[#00a865]', 'w-full','focus:outline-none','bg-slate-100', 'h-[40px]','rounded-lg']
        })
      ]),
      createButton('SUIVANT', {
        type: 'submit',
        class: ['w-full', 'bg-[#008069]', 'hover:bg-[#006e5c]','h-[30px]','rounded-lg','text-white','text-white','py-1','text-sm','font-bold']
      })
    ]),

    createElement('a', {
      href: '#',
      class: ['text-[#008069]', 'hover:underline', 'text-center', 'block', 'mt-6', 'text-sm']
    }, 'Se connecter avec un code QR')
  ]);

  container.appendChild(topBar);
  container.appendChild(card);
  return container;
}