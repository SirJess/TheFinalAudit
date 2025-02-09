import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Firestore imports

const db = getFirestore(); // Initialize Firestore

// Function to save the game state
const saveGameState = async (userId, level, timeTaken, cleared) => {
  try {
    const gameStateRef = doc(db, "users", userId, "gameState", "current");
    await setDoc(gameStateRef, {
      level: level,
      timeTaken: timeTaken,
      cleared: cleared,
    });
    console.log("Game state saved successfully.");
  } catch (error) {
    console.error("Error saving game state:", error);
  }
};

// Function to load the game state
const loadGameState = async (userId) => {
  try {
    const gameStateRef = doc(db, "users", userId, "gameState", "current");
    const docSnap = await getDoc(gameStateRef);

    if (docSnap.exists()) {
      const gameState = docSnap.data();
      return gameState; // Return the game state (level, time, cleared)
    } else {
      console.log("No saved game state found.");
      return null; // No saved game state found
    }
  } catch (error) {
    console.error("Error loading game state:", error);
    return null;
  }
};

export { saveGameState, loadGameState };