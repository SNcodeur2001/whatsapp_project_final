import { router } from "../utils/router";
import { createElement } from "../component";
import { register } from "../services/api";

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
    class: ["border", "border-gray-300", "p-2", "rounded-md", "mb-4"],
  });

  const inputPhone = createElement("input", {
    id: "phone",
    type: "tel",
    placeholder: "Numéro de téléphone",
    class: ["border", "border-gray-300", "p-2", "rounded-md", "mb-4"],
  });

  const submitButton = createElement(
    "button",
    {
      class: [
        "bg-[#00a884]", // Couleur bouton WhatsApp
        "text-white",
        "p-2",
        "rounded-md",
        "font-bold",
        "cursor-pointer",
        "hover:bg-[#008069]",
      ],
      onClick: (event) => {
        event.preventDefault();

        // Récupérer les valeurs des champs input AU MOMENT du clic
        const nom = inputName.value;
        const phone = inputPhone.value;

        register(nom, phone);
        // Créer une notification temporaire
        const notification = createElement(
          "div",
          {
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
          },
          "Inscription réussie ! ✅"
        );

        // Ajouter la notification à la page
        document.body.appendChild(notification);

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
          notification.remove();
                  router.navigate("/login");

        }, 1000);

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

  form.addNode(inputName).addNode(inputPhone).addNode(submitButton);
  container.addNode(logo).addNode(title).addNode(form).addNode(returnButton);

  return container;
}
