import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import escapeRoom1 from "../../assets/escapeRoom1.jpg";
import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function Intro1() {
  const navigate = useNavigate(); // Initialize navigate function
  const user = getAuth().currentUser;

  useEffect(() => {
    
    const fetchLevel0 = async () => {
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "times", "level0", "users", user.uid);
        const clearedLevelsRef = doc(db, "users", user.uid);
    
        try {
          // Get the current best time
          const userDoc = await getDoc(userRef);
          console.log("adding level0");
        
          const clearedLevelsDoc = await getDoc(clearedLevelsRef);
          const clearedLevels = clearedLevelsDoc.exists()
            ? clearedLevelsDoc.data().clearedLevels || []
            : []; // If no data, start with an empty array
    
          // Check if the level is already in the cleared levels
          if (!clearedLevels.includes("level0")) {
            clearedLevels.push("level0"); // Add the current level to the cleared levels
            await setDoc(
              clearedLevelsRef,
              {
                clearedLevels, // Update the cleared levels list
              },
              { merge: true }
            ); // Merge so we don't overwrite other data
            }
          } catch (error) {
            console.error("Error adding level 0:", error);
          }
      }
    };
    fetchLevel0()
  }, [user]);

  const handleNavigation = () => {
    navigate("/levels"); // Replace with the correct route path
  };

  

  return (
    <div
      style={{
        backgroundImage: `url(${escapeRoom1})`,
      }}
      className="flex flex-col items-center h-screen justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-50"
    >
      {/* Animated title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          fontSize: "3rem",
          color: "white",
          textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)",
          marginBottom: "20px",
        }}
      >
        The Final Audit Awaits...
      </motion.h1>

      {/* Story text box */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
          You find yourself standing at the threshold of an old, crumbling
          corporate office building. The once-glamorous Ledger & Co. Financial
          Firm has been abandoned for decades.
        </p>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginTop: "10px" }}>
          You’ve entered the heart of corporate decay. To escape, you must
          uncover the secrets of the company’s downfall. Balance the books,
          analyze the data, and complete the audit—or join the firm’s other
          employees who never left...
        </p>

        {/* Button to navigate to another view */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigation}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#f7c744",
            color: "black",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Enter the Audit
        </motion.button>
      </motion.div>
    </div>
  );
}
