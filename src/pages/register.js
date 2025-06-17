import { router } from "../utils/router";
import { createElement } from "../component";
import { register } from "../services/api";
import { store } from "../store/store";
import { createCountrySelect } from "../components/CountrySelect";

export function createRegisterPage() {
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

  // Ajout du motif de fond
  const pattern = createElement("div", {
    class: [
      "absolute",
      "inset-0",
      "opacity-10",
      "pattern-bg",
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
    // En-tête avec logo
    createElement("div", {
      class: ["text-center", "mb-8"]
    }, [
      createElement("img", {
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        alt: "WhatsApp Logo",
        class: ["w-16", "h-16", "mx-auto"]
      }),
      createElement("h1", {
        class: [
          "text-3xl",
          "font-light",
          "text-[#41525d]",
          "mt-6",
          "mb-2"
        ]
      }, "Créer un compte"),
      createElement("p", {
        class: [
          "text-[#667781]",
          "text-sm",
          "max-w-sm",
          "mx-auto",
          "leading-relaxed"
        ]
      }, "Rejoignez des millions d'utilisateurs sur WhatsApp Web")
    ]),

    // Conteneur du formulaire
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
        // Message d'erreur
        createElement("div", {
          id: "error-message",
          class: [
            "text-red-500",
            "text-sm",
            "hidden",
            "bg-red-50",
            "border",
            "border-red-100",
            "p-3",
            "rounded-lg",
            "animate-shake"
          ]
        }),

        // Champ nom
        createElement("div", {
          class: ["space-y-2"]
        }, [
          createElement("label", {
            class: ["block", "text-sm", "font-medium", "text-[#41525d]"]
          }, "Nom complet"),
          createElement("input", {
            id: "nom",
            type: "text",
            placeholder: "Entrez votre nom",
            required: true,
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
            ],
          })
        ]),

        // Champ téléphone avec select pays
        createElement("div", {
          class: ["space-y-2"]
        }, [
          createElement("label", {
            class: ["block", "text-sm", "font-medium", "text-[#41525d]"]
          }, "Numéro de téléphone"),
          createElement("div", {
            class: ["flex", "gap-3"]
          }, [
            createElement("div", {
              class: ["w-[140px]"]
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
            createElement("input", {
              id: "phone",
              type: "tel",
              placeholder: "77 XXX XX XX",
              required: true,
              class: [
                "flex-1",
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

        // Bouton d'inscription
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
          ],
          onclick: handleRegister
        }, [
          createElement("span", {}, "S'inscrire"),
          createElement("i", {
            class: ["fas", "fa-arrow-right", "text-sm"]
          })
        ]),
      ])
    ]),

    // Lien de connexion
    createElement("div", {
      class: [
        "mt-6",
        "text-center",
        "space-y-4"
      ]
    }, [
      createElement("p", {
        class: ["text-[#667781]", "text-sm"]
      }, "Vous avez déjà un compte ?"),
      createElement("a", {
        href: "/",
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
        onclick: (e) => {
          e.preventDefault();
          router.navigate("/");
        }
      }, [
        "Se connecter",
        createElement("i", {
          class: ["fas", "fa-sign-in-alt", "text-xs"]
        })
      ])
    ])
  ]);

  // La fonction de gestion de l'inscription reste la même
  async function handleRegister(event) {
    event.preventDefault();
    const errorMessage = document.querySelector("#error-message");
    errorMessage.classList.add("hidden");

    const nom = document.querySelector("#nom").value.trim();
    const phoneNumber = document.querySelector("#phone").value.trim();
    const countryCode = document.querySelector("#country-code").value;

    const countryPrefixes = {
      SN: "+221",
      FR: "+33",
      BE: "+32",
      CH: "+41",
    };

    if (!nom) {
      showError("Le nom est obligatoire");
      return;
    }

    if (!phoneNumber) {
      showError("Le numéro de téléphone est obligatoire");
      return;
    }

    const fullPhoneNumber = `${countryPrefixes[countryCode]}${phoneNumber}`;

    if (!/^\+?[0-9]{10,}$/.test(fullPhoneNumber)) {
      showError("Format de numéro invalide (minimum 10 chiffres)");
      return;
    }

    try {
      const users = await (await fetch('https://whatsapp-json-server.onrender.com/users')).json();
      if (users.some(user => user.phone === fullPhoneNumber)) {
        showError("Ce numéro est déjà utilisé");
        return;
      }

      await register(nom, fullPhoneNumber);
      showSuccess();

    } catch (error) {
      showError("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  }

  function showError(message) {
    const errorMessage = document.querySelector("#error-message");
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
  }

  function showSuccess() {
    const notification = createElement("div", {
      class: [
        "fixed",
        "top-4",
        "right-4",
        "bg-green-500",
        "text-white",
        "p-4",
        "rounded-xl",
        "shadow-lg",
        "font-medium",
        "animate-fade-in",
        "flex",
        "items-center",
        "gap-2"
      ]
    }, [
      createElement("i", {
        class: ["fas", "fa-check-circle"]
      }),
      "Inscription réussie !"
    ]);

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
      router.navigate("/");
    }, 1500);
  }

  container.appendChild(pattern);
  container.appendChild(form);
  return container;
}
