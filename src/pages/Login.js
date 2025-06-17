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
      "bg-gradient-to-br",
      "from-[#00a884]",
      "to-[#008069]",
      "flex",
      "items-center",
      "justify-center",
      "flex-col",
      "relative",
      "px-4",
    ],
  });

  // Ajout d'un motif de fond élégant
  const pattern = createElement("div", {
    class: [
      "absolute",
      "inset-0",
      "opacity-10",
      "bg-[url('data:image/svg+xml,...')]", // Motif sera ajouté en CSS
      "pointer-events-none",
    ],
  });

  const form = createElement("div", {
    class: [
      "bg-white",
      "rounded-2xl",
      "p-8",
      "shadow-2xl",
      "w-full",
      "max-w-[440px]",
      "relative",
      "backdrop-blur-xl",
      "border",
      "border-white/10",
      "animate-fade-in",
    ],
  }, [
    // Logo et en-tête améliorés
    createElement("div", {
      class: ["text-center", "mb-8"]
    }, [
      createLogo(),
      createElement("h1", {
        class: [
          "text-3xl",
          "font-light",
          "text-[#41525d]",
          "mt-6",
          "mb-2"
        ]
      }, "WhatsApp Web"),
      createElement("p", {
        class: [
          "text-[#667781]",
          "text-sm",
          "max-w-sm",
          "mx-auto",
          "leading-relaxed"
        ]
      }, "Utilisez WhatsApp sur votre ordinateur en vous connectant avec votre compte")
    ]),

    // Conteneur du formulaire avec effet de carte
    createElement("div", {
      class: [
        "bg-[#f8fafc]",
        "rounded-xl",
        "p-6",
        "shadow-sm",
        "border",
        "border-gray-100",
      ]
    }, [
      createElement("div", {
        class: ["space-y-5"]
      }, [
        // Label amélioré
        createElement("label", {
          class: [
            "block",
            "text-sm",
            "font-medium",
            "text-[#41525d]",
            "mb-2"
          ]
        }, "Numéro de téléphone"),

        // Conteneur input téléphone amélioré
        createElement("div", {
          class: [
            "flex",
            "gap-3",
            "items-start"
          ]
        }, [
          createElement("div", {
            class: ["w-[130px]"]
          }, [
            createCountrySelect({
              id: "country-code",
              class: [
                "w-full",
                "px-4",
                "py-3.5",
                "border",
                "border-gray-200",
                "rounded-xl",
                "focus:border-[#00a884]",
                "focus:ring-2",
                "focus:ring-[#00a884]/20",
                "focus:outline-none",
                "transition-all",
                "duration-200",
                "bg-white",
              ]
            })
          ]),
          createElement("div", {
            class: ["flex-1"]
          }, [
            createElement("input", {
              type: "tel",
              id: "phone-number",
              placeholder: "77 XXX XX XX",
              class: [
                "w-full",
                "px-4",
                "py-3.5",
                "border",
                "border-gray-200",
                "rounded-xl",
                "focus:border-[#00a884]",
                "focus:ring-2",
                "focus:ring-[#00a884]/20",
                "focus:outline-none",
                "transition-all",
                "duration-200",
                "placeholder-gray-400",
              ]
            })
          ])
        ]),

        // Message d'erreur avec animation
        createElement("p", {
          id: "error-message",
          class: [
            "text-red-500",
            "text-sm",
            "hidden",
            "mt-2",
            "animate-shake"
          ]
        }),

        // Bouton de connexion amélioré
        createElement("button", {
          class: [
            "w-full",
            "bg-[#00a884]",
            "hover:bg-[#008069]",
            "text-white",
            "py-3.5",
            "px-4",
            "rounded-xl",
            "font-medium",
            "transition-all",
            "duration-200",
            "transform",
            "hover:translate-y-[-1px]",
            "hover:shadow-lg",
            "active:translate-y-[1px]",
            "mt-4",
            "flex",
            "items-center",
            "justify-center",
            "gap-2"
          ]
        }, [
          createElement("span", {}, "Se connecter"),
          createElement("i", {
            class: ["fas", "fa-arrow-right", "text-sm"]
          })
        ])
      ])
    ]),

    // Section inscription améliorée
    createElement("div", {
      class: [
        "mt-6",
        "text-center",
        "space-y-4"
      ]
    }, [
      createElement("p", {
        class: ["text-[#667781]", "text-sm"]
      }, "Vous n'avez pas de compte ?"),
      createElement("a", {
        href: "/register",
        class: [
          "text-[#00a884]",
          "hover:text-[#008069]",
          "font-medium",
          "text-sm",
          "inline-flex",
          "items-center",
          "gap-2",
          "transition-colors"
        ],
        onClick: (e) => {
          e.preventDefault();
          router.navigate("/register");
        }
      }, [
        "Créer un compte",
        createElement("i", {
          class: ["fas", "fa-user-plus", "text-xs"]
        })
      ])
    ])
  ]);

  // Ajout des écouteurs d'événements et de la logique existante
  const button = form.querySelector("button");
  const countrySelect = form.querySelector("#country-code");
  const phoneInput = form.querySelector("#phone-number");
  const errorMessage = form.querySelector("#error-message");

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
          "Connexion réussie ✅"
        );

        // Ajouter la notification à la page
        document.body.appendChild(notification);

        // Supprimer la notification après 3 secondes
        setTimeout(() => {
          notification.remove();
                  router.navigate("/chat");

        }, 1000);
      // router.navigate("/chat");
    } catch (error) {
      errorMessage.textContent = "Numéro de téléphone invalide";
      errorMessage.classList.remove("buttonhidden");
    }
  });

  container.appendChild(pattern);
  container.appendChild(form);
  return container;

}

function createSpinner() {
  return createElement('div', {
    class: [
      'hidden', // Caché par défaut
      'items-center',
      'justify-center',
      'ml-4'
    ]
  }, [
    createElement('div', {
      role: 'status'
    }, [
      createElement('svg', {
        class: [
          'w-8',
          'h-8',
          'text-gray-200',
          'animate-spin',
          'fill-[#00a884]'
        ],
        'aria-hidden': 'true',
        viewBox: '0 0 100 101',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg'
      }, [
        createElement('path', {
          d: 'M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z',
          fill: 'currentColor'
        }),
        createElement('path', {
          d: 'M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z',
          fill: 'currentFill'
        })
      ])
    ])
  ]);
}
