import "./index.css";
import { router } from "./utils/router";
import { initializeData, checkAuthState } from "./services/api";

// Charger les données avant de démarrer l'application
async function startApp() {
  try {
    // Vérifier si un utilisateur est déjà connecté
    const savedUser = checkAuthState();
    if (savedUser) {
      await initializeData();
      router.navigate("/chat");
    } else {
      router.navigate("/");
    }
  } catch (error) {
    console.error("Erreur au démarrage:", error);
  }
}

startApp();
