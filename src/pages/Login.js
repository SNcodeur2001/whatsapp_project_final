import { createElement } from "../component";
import { createLogo } from "../components/Logo";
import { createCountrySelect } from "../components/CountrySelect";
import { api } from "../services/api";
import { router } from "../utils/router";
import { store } from "../store/store";

export function createLoginPage() {
  const container = createElement("div", {
    class: [
      "min-h-screen",
      "bg-[#00a884]",
      "flex",
      "items-center",
      "justify-center",
      "flex-col",
    ],
  });

  const topBar = createElement("div", {
    class: ["bg-[#00a884]", "h-28", "w-full", "absolute", "top-0"],
  });

  const errorMessage = createElement("p", {
    class: ["text-red-500", "text-sm", "hidden", "mt-2"],
  });

  // Création du conteneur pour l'input de téléphone
  const phoneInputContainer = createElement(
    "div",
    {
      class: ["flex", "gap-2", "items-start"],
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
              "py-3",
              "border",
              "border-[#d1d7db]",
              "rounded-lg",
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
            type: "tel",
            id: "phone-number",
            placeholder: "77 XXX XX XX",
            class: [
              "w-full",
              "px-4",
              "py-3",
              "border",
              "border-[#d1d7db]",
              "rounded-lg",
              "focus:outline-none",
              "focus:border-[#00a884]",
              "text-[#111b21]",
            ],
          }),
        ]
      ),
    ]
  );

  const form = createElement(
    "div",
    {
      class: [
        "bg-white",
        "rounded-md",
        "p-8",
        "shadow-md",
        "w-[400px]",
        "z-10",
      ],
    },
    [
      createLogo(),
      createElement(
        "div",
        {
          class: ["text-center", "mb-8"],
        },
        [
          createElement(
            "h1",
            {
              class: ["text-[28px]", "text-[#41525d]", "font-light"],
            },
            "WhatsApp Web"
          ),
          createElement(
            "p",
            {
              class: ["text-[#41525d]", "mt-4", "text-sm"],
            },
            "Entrez votre numéro de téléphone pour vous connecter."
          ),
        ]
      ),

      createElement(
        "div",
        {
          class: ["space-y-6"],
        },
        [
          createElement("div", { class: ["space-y-2"] }, [
            createElement(
              "label",
              {
                class: ["text-sm", "text-[#41525d]"],
              },
              "Numéro de téléphone"
            ),
            phoneInputContainer,
            errorMessage,
          ]),
          createElement(
            "button",
            {
              class: [
                "w-full",
                "bg-[#008069]",
                "text-white",
                "py-3",
                "rounded-lg",
                "hover:bg-[#006e5c]",
                "transition-colors",
                "font-medium",
              ],
            },
            "Se connecter"
          ),
          createElement(
            "div",
            {
              class: ["text-end", "mt-4"],
            },
            [
              createElement(
                "a",
                {
                  class: ["text-[#00a884]", "text-sm"],
                  href: "/register",
                  onClick: (e) => {
                    e.preventDefault();
                    router.navigate("/register");
                  }
                },
                "S'inscrire"
              ),
            ]
          )
        ]
      ),
    ]
  );

  const button = form.querySelector("button");
  const countrySelect = form.querySelector("#country-code");
  const phoneInput = form.querySelector("#phone-number");

  button.addEventListener("click", async () => {
    const countryCode = countrySelect.value;
    const phoneNumber = phoneInput.value.trim();

    // Mapping des codes pays vers les indicatifs
    const countryPrefixes = {
      SN: "+221",
      FR: "+33",
      BE: "+32",
      CH: "+41",
    };

    try {
      errorMessage.classList.add("hidden");

      // Construire le numéro complet
      const fullPhoneNumber = `${countryPrefixes[countryCode]}${phoneNumber}`;
      console.log("État avant connexion:", store.state);

      // Tentative de connexion avec le numéro complet
      await api.login(fullPhoneNumber);
      console.log("État après connexion:", store.state);
      router.navigate("/chat");
    } catch (error) {
      errorMessage.textContent = "Numéro de téléphone invalide";
      errorMessage.classList.remove("hidden");
    }
  });

  container.appendChild(topBar);
  container.appendChild(form);
  return container;

}
