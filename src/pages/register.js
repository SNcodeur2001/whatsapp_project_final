import { router } from "../utils/router";
import { createElement } from "../component";
import { register } from "../services/api";
import { store } from "../store/store";
import { createCountrySelect } from "../components/CountrySelect";

export function createRegisterPage() {
  const container = createElement("div", {
    class: [
      "min-h-screen",
      "bg-[#00a884]", // Couleur principale de WhatsApp
      "flex",
      "items-center",
      "justify-center",
      "flex-col",
      "p-6",
    ],
  });

  const logo = createElement("img", {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png",
    alt: "Logo WhatsApp",
    class: ["w-16", "mb-4"],
  });

  const title = createElement(
    "h1",
    {
      class: ["text-white", "text-2xl", "font-bold", "mb-4"],
    },
    "Inscription à WhatsApp"
  );

  // Ajouter un conteneur pour les messages d'erreur
  const errorContainer = createElement("div", {
    class: ["text-red-500", "text-sm", "mb-4", "hidden"],
  });

  const form = createElement("form", {
    class: [
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "p-6",
      "w-80",
      "flex",
      "flex-col",
    ],
  });

  const inputName = createElement("input", {
    id: "nom",
    type: "text",
    placeholder: "Nom complet",
    required: true,
    class: [
      "border",
      "border-gray-300",
      "p-2",
      "rounded-md",
      "mb-4",
      "focus:outline-none",
      "focus:border-[#00a884]",
    ],
  });

  // Créer le conteneur pour le numéro de téléphone avec le sélecteur de pays
  const phoneInputContainer = createElement(
    "div",
    {
      class: ["flex", "gap-2", "items-start", "mb-4"],
    },
    [
      // Sélecteur de pays avec indicatif
      createElement(
        "div",
        {
          class: ["w-[120px]"],
        },
        [
          createCountrySelect({
            id: "country-code",
            class: [
              "w-full",
              "px-2",
              "py-2",
              "border",
              "border-gray-300",
              "rounded-md",
              "focus:outline-none",
              "focus:border-[#00a884]",
              "text-[#111b21]",
              "bg-white",
            ],
          }),
        ]
      ),
      // Input pour le numéro
      createElement(
        "div",
        {
          class: ["flex-1"],
        },
        [
          createElement("input", {
            id: "phone",
            type: "tel",
            placeholder: "77 XXX XX XX",
            required: true,
            class: [
              "w-full",
              "px-3",
              "py-2",
              "border",
              "border-gray-300",
              "rounded-md",
              "focus:outline-none",
              "focus:border-[#00a884]",
              "text-[#111b21]",
            ],
          }),
        ]
      ),
    ]
  );

  // Fonction pour afficher les erreurs
  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");
  }

  // Fonction pour cacher les erreurs
  function hideError() {
    errorContainer.classList.add("hidden");
  }

  // Modifier la logique de soumission pour inclure le préfixe
  const submitButton = createElement(
    "button",
    {
      class: [
        "bg-[#00a884]",
        "text-white",
        "p-2",
        "rounded-md",
        "font-bold",
        "cursor-pointer",
        "hover:bg-[#008069]",
      ],
      onClick: async (event) => {
        event.preventDefault();
        hideError();

        const nom = inputName.value.trim();
        const phoneNumber = document.querySelector("#phone").value.trim();
        const countryCode = document.querySelector("#country-code").value;

        // Mapping des codes pays vers les indicatifs
        const countryPrefixes = {
          SN: "+221",
          FR: "+33",
          BE: "+32",
          CH: "+41",
        };

        if (!nom) {
          showError("Le nom est obligatoire");
          inputName.focus();
          return;
        }

        if (!phoneNumber) {
          showError("Le numéro de téléphone est obligatoire");
          document.querySelector("#phone").focus();
          return;
        }

        // Construire le numéro complet
        const fullPhoneNumber = `${countryPrefixes[countryCode]}${phoneNumber}`;

        // Validation du format du numéro
        if (!/^\+?[0-9]{10,}$/.test(fullPhoneNumber)) {
          showError("Format de numéro invalide (minimum 10 chiffres)");
          document.querySelector("#phone").focus();
          return;
        }

        try {
          // Vérifier si le numéro existe déjà
          const response = await fetch('https://whatsapp-json-server.onrender.com/users');
          const users = await response.json();
          const phoneExists = users.some(user => user.phone === fullPhoneNumber);

          if (phoneExists) {
            showError("Ce numéro est déjà utilisé");
            return;
          }

          // Si tout est valide, procéder à l'inscription
          await register(nom, fullPhoneNumber);

          // Créer une notification de succès
          const notification = createElement("div", {
            class: [
              "absolute",
              "top-4",
              "right-4",
              "bg-green-500",
              "text-white",
              "p-3",
              "rounded-md",
              "shadow-lg",
              "font-bold",
              "animate-fade-in",
            ],
          }, "Inscription réussie ! ✅");

          document.body.appendChild(notification);

          setTimeout(() => {
            notification.remove();
            router.navigate("/");
          }, 1000);

        } catch (error) {
          showError("Erreur lors de l'inscription. Veuillez réessayer.");
        }
      },
    },
    "S'inscrire"
  );
  const returnButton = createElement(
    "button",
    {
      class: [
        "mt-4",
        "bg-green-600",
        "text-white",
        "p-2",
        "rounded-md",
        "font-bold",
        "cursor-pointer",
        "hover:bg-green-700",
      ],
      onClick: () => {
        router.navigate("/login");
      },
    },
    "Retour à la connexion"
  );

  // Ajout du bouton de retour sous le formulaire

  form.addNode(errorContainer)
     .addNode(inputName)
     .addNode(phoneInputContainer) // Remplacer inputPhone par phoneInputContainer
     .addNode(submitButton);

  container.addNode(logo)
           .addNode(title)
           .addNode(form)
           .addNode(returnButton);

  return container;
}
