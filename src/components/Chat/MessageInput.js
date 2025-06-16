import { createElement } from "../../component";
import { sendMessage, sendAudioMessage } from "../../services/api";
import { store } from "../../store/store";

export function createMessageInput() {
  let isRecording = false;
  let mediaRecorder = null;
  let audioChunks = [];

  const inputContainer = createElement("div", {
    class: ["bg-[#f0f2f5]", "px-4", "py-3", "flex", "items-center", "gap-4"],
  });

  // Input pour le texte
  const input = createElement("input", {
    type: "text",
    placeholder: "Tapez un message",
    class: ["flex-1", "focus:outline-none", "text-[#111b21]"],
    onkeypress: (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    }
  });

  // Fonction pour envoyer un message texte
  async function handleSendMessage() {
    const message = input.value.trim();
    if (message && store.state.currentChat) {
      try {
        // Désactiver l'input pendant l'envoi
        input.disabled = true;
        await sendMessage(store.state.currentChat, message);
        input.value = '';
      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        alert('Erreur lors de l\'envoi du message');
      } finally {
        input.disabled = false;
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

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          await sendAudioMessage(store.state.currentChat, audioBlob);
        } catch (error) {
          console.error('Erreur lors de l\'envoi de l\'audio:', error);
          alert('Erreur lors de l\'envoi du message audio');
        }
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      isRecording = true;
      updateAudioButton();
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
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

  // Bouton audio/microphone
  const audioButton = createElement("button", {
    class: [
      "text-[#54656f]",
      "hover:text-[#00a884]",
      "transition-colors",
      "p-2",
      "rounded-full",
      "hover:bg-[#e9edef]"
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
    audioButton.appendChild(
      createElement("i", {
        class: [
          "fas",
          isRecording ? "fa-stop" : "fa-microphone",
          isRecording ? "text-red-500" : ""
        ]
      })
    );
    
    if (isRecording) {
      audioButton.classList.add("animate-pulse");
    } else {
      audioButton.classList.remove("animate-pulse");
    }
  }

  // Bouton d'envoi
  const sendButton = createElement("button", {
    class: [
      "text-[#54656f]",
      "hover:text-[#00a884]",
      "transition-colors",
      "p-2",
      "rounded-full",
      "hover:bg-[#e9edef]"
    ],
    onclick: handleSendMessage
  }, [
    createElement("i", {
      class: ["fas", "fa-paper-plane"]
    })
  ]);

  // Initialiser le bouton audio
  updateAudioButton();

  // Assembler le container
  inputContainer.append(
    createElement("button", {
      class: ["text-[#54656f]", "hover:text-[#00a884]"]
    }, [
      createElement("i", { class: ["fas", "fa-smile"] })
    ]),
    input,
    audioButton,
    sendButton
  );

  return inputContainer;
}
