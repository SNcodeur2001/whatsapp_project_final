import { createElement } from "../../component";
import { sendMessage, sendAudioMessage } from "../../services/api";
import { store } from "../../store/store";

export function createMessageInput() {
  let isRecording = false;
  let mediaRecorder = null;
  let audioChunks = [];
  let recordingStartTime = null;
  let recordingTimer = null;

  const inputContainer = createElement("div", {
    class: [
      "bg-[#f0f2f5]", 
      "px-4", 
      "py-3", 
      "flex", 
      "items-center", 
      "gap-3",
      "border-t",
      "border-[#e9edef]",
      "shadow-sm"
    ],
  });

  // Input pour le texte avec design moderne
  const inputWrapper = createElement("div", {
    class: [
      "flex-1",
      "relative",
      "bg-white",
      "rounded-full",
      "border",
      "border-[#e9edef]",
      "hover:border-[#d1d7db]",
      "focus-within:border-[#00a884]",
      "focus-within:ring-2",
      "focus-within:ring-[#00a884]",
      "focus-within:ring-opacity-20",
      "transition-all",
      "duration-200",
      "shadow-sm"
    ]
  });

  const input = createElement("input", {
    type: "text",
    placeholder: "Tapez un message",
    class: [
      "w-full",
      "px-4",
      "py-3",
      "pl-12",
      "pr-12",
      "bg-transparent",
      "focus:outline-none",
      "text-[#111b21]",
      "text-sm",
      "placeholder-[#667781]",
      "rounded-full"
    ],
    onkeypress: (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    }
  });

  // Icône emoji dans l'input
  const emojiIcon = createElement("div", {
    class: [
      "absolute",
      "left-3",
      "top-1/2",
      "transform",
      "-translate-y-1/2",
      "text-[#54656f]",
      "hover:text-[#00a884]",
      "cursor-pointer",
      "transition-colors",
      "duration-200",
      "p-1",
      "rounded-full",
      "hover:bg-[#f5f6f6]"
    ]
  }, [
    createElement("i", {
      class: ["fas", "fa-smile", "text-lg"]
    })
  ]);

  // Icône d'attachement dans l'input
  const attachIcon = createElement("div", {
    class: [
      "absolute",
      "right-3",
      "top-1/2",
      "transform",
      "-translate-y-1/2",
      "text-[#54656f]",
      "hover:text-[#00a884]",
      "cursor-pointer",
      "transition-colors",
      "duration-200",
      "p-1",
      "rounded-full",
      "hover:bg-[#f5f6f6]"
    ]
  }, [
    createElement("i", {
      class: ["fas", "fa-paperclip", "text-lg"]
    })
  ]);

  // Assembler l'input wrapper
  inputWrapper.append(emojiIcon, input, attachIcon);

  // Fonction pour envoyer un message texte
  async function handleSendMessage() {
    const message = input.value.trim();
    if (message && store.state.currentChat) {
      try {
        // Désactiver l'input pendant l'envoi
        input.disabled = true;
        inputWrapper.classList.add('opacity-50');
        await sendMessage(store.state.currentChat, message);
        input.value = '';
      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        // Toast notification au lieu d'alert
        showNotification('Erreur lors de l\'envoi du message', 'error');
      } finally {
        input.disabled = false;
        inputWrapper.classList.remove('opacity-50');
        input.focus();
      }
    }
  }

  // Fonction pour démarrer l'enregistrement audio
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      recordingStartTime = Date.now();

      // Démarrer le timer d'enregistrement
      startRecordingTimer();

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          await sendAudioMessage(store.state.currentChat, audioBlob);
          showNotification('Message vocal envoyé', 'success');
        } catch (error) {
          console.error('Erreur lors de l\'envoi de l\'audio:', error);
          showNotification('Erreur lors de l\'envoi du message audio', 'error');
        }
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
        stopRecordingTimer();
      };

      mediaRecorder.start();
      isRecording = true;
      updateAudioButton();
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      showNotification('Impossible d\'accéder au microphone. Vérifiez les permissions.', 'error');
    }
  }

  // Fonction pour arrêter l'enregistrement
  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      updateAudioButton();
    }
  }

  // Timer d'enregistrement
  function startRecordingTimer() {
    const timerElement = document.getElementById('recording-timer');
    if (timerElement) {
      recordingTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);
    }
  }

  function stopRecordingTimer() {
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
  }

  // Bouton audio/microphone avec design moderne
  const audioButton = createElement("button", {
    class: [
      "w-12",
      "h-12",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
      "transition-all",
      "duration-200",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-opacity-30",
      "shadow-sm",
      "hover:shadow-md"
    ],
    onclick: () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  });

  // Fonction pour mettre à jour l'apparence du bouton audio
  function updateAudioButton() {
    audioButton.innerHTML = '';
    
    if (isRecording) {
      // Style d'enregistrement
      audioButton.className = [
        "w-12",
        "h-12",
        "rounded-full",
        "flex",
        "items-center",
        "justify-center",
        "bg-[#ff4444]",
        "text-white",
        "hover:bg-[#e63939]",
        "transition-all",
        "duration-200",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-[#ff4444]",
        "focus:ring-opacity-30",
        "shadow-sm",
        "hover:shadow-md",
        "animate-pulse"
      ].join(' ');
      
      audioButton.appendChild(
        createElement("i", {
          class: ["fas", "fa-stop", "text-sm"]
        })
      );
    } else {
      // Style normal
      audioButton.className = [
        "w-12",
        "h-12",
        "rounded-full",
        "flex",
        "items-center",
        "justify-center",
        "bg-white",
        "text-[#54656f]",
        "hover:text-[#00a884]",
        "hover:bg-[#f5f6f6]",
        "border",
        "border-[#e9edef]",
        "hover:border-[#d1d7db]",
        "transition-all",
        "duration-200",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-[#00a884]",
        "focus:ring-opacity-30",
        "shadow-sm",
        "hover:shadow-md"
      ].join(' ');
      
      audioButton.appendChild(
        createElement("i", {
          class: ["fas", "fa-microphone", "text-lg"]
        })
      );
    }
  }

  // Bouton d'envoi avec design moderne
  const sendButton = createElement("button", {
    class: [
      "w-12",
      "h-12",
      "rounded-full",
      "bg-[#00a884]",
      "text-white",
      "hover:bg-[#008069]",
      "active:bg-[#006b5b]",
      "flex",
      "items-center",
      "justify-center",
      "transition-all",
      "duration-200",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-[#00a884]",
      "focus:ring-opacity-30",
      "shadow-sm",
      "hover:shadow-md",
      "hover:scale-105",
      "active:scale-95"
    ],
    onclick: handleSendMessage
  }, [
    createElement("i", {
      class: ["fas", "fa-paper-plane", "text-sm", "ml-0.5"]
    })
  ]);

  // Indicateur d'enregistrement
  const recordingIndicator = createElement("div", {
    id: "recording-indicator",
    class: [
      "hidden",
      "absolute",
      "top-0",
      "left-0",
      "right-0",
      "bg-[#ff4444]",
      "text-white",
      "px-4",
      "py-2",
      "flex",
      "items-center",
      "justify-center",
      "gap-2",
      "text-sm",
      "font-medium",
      "shadow-lg"
    ]
  }, [
    createElement("div", {
      class: ["w-2", "h-2", "bg-white", "rounded-full", "animate-pulse"]
    }),
    createElement("span", {}, "Enregistrement en cours..."),
    createElement("span", {
      id: "recording-timer",
      class: ["font-mono", "bg-white", "bg-opacity-20", "px-2", "py-1", "rounded"]
    }, "0:00")
  ]);

  // Fonction pour afficher les notifications
  function showNotification(message, type = 'info') {
    const notification = createElement("div", {
      class: [
        "fixed",
        "top-4",
        "right-4",
        "px-4",
        "py-3",
        "rounded-lg",
        "text-white",
        "text-sm",
        "font-medium",
        "shadow-lg",
        "z-50",
        "transform",
        "translate-x-full",
        "transition-transform",
        "duration-300",
        type === 'error' ? 'bg-[#ff4444]' : 'bg-[#00a884]'
      ]
    }, [
      createElement("div", {
        class: ["flex", "items-center", "gap-2"]
      }, [
        createElement("i", {
          class: ["fas", type === 'error' ? "fa-exclamation-circle" : "fa-check-circle"]
        }),
        createElement("span", {}, message)
      ])
    ]);

    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Suppression automatique
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Observer pour afficher/masquer l'indicateur d'enregistrement
  function toggleRecordingIndicator() {
    const indicator = document.getElementById('recording-indicator');
    if (indicator) {
      if (isRecording) {
        indicator.classList.remove('hidden');
      } else {
        indicator.classList.add('hidden');
      }
    }
  }

  // Initialiser le bouton audio
  updateAudioButton();

  // Assembler le container principal
  inputContainer.append(
    recordingIndicator,
    inputWrapper,
    audioButton,
    sendButton
  );

  // Mettre à jour l'indicateur d'enregistrement quand nécessaire
  const originalUpdateAudioButton = updateAudioButton;
  updateAudioButton = function() {
    originalUpdateAudioButton();
    toggleRecordingIndicator();
  };

  return inputContainer;
}
