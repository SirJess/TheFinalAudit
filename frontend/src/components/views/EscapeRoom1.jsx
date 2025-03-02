import escapeRoom1 from "../../assets/escapeRoom1.jpg";
import sheet1 from "../../assets/sheet1.png";
import sheet2 from "../../assets/sheet2.png";
import sheet3 from "../../assets/sheet3.png";
import learnBalanceSheet from "../../assets/learnBalanceSheet.png";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import BalanceSheetQuiz from "../missingBalanceSheet/BalanceSheetQuiz";
import TutorialOverlay from "../TutorialOverlay";
import ShowItem from "../Dialogs/ShowItem";
import informationIcon from "../../assets/informationIcon.png";
import settingIcon from "../../assets/settingIcon.png";

export default function EscapeRoom1() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Track the user
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [cleared, setCleared] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const balanceSheetQuizRef = useRef(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Firebase Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when authenticated
      } else {
        setUser(null); // Clear user when not authenticated
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Timer Functions
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimeTaken((prevTime) => prevTime + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  useEffect(() => {
    if (user) {
      startTimer();
    }
    return () => stopTimer();
  }, [user]);

  const handleClearRoom = async () => {
    setCleared(true);
    stopTimer();

    if (user) {
      const db = getFirestore();
      const userRef = doc(db, "times", "level1", "users", user.uid);
      const clearedLevelsRef = doc(db, "users", user.uid);

      try {
        // Get the current best time
        const userDoc = await getDoc(userRef);
        const existingBestTime = userDoc.exists()
          ? userDoc.data().bestTime
          : null;

        let newBestTime;
        // If the new time is better OR if there's no existing best time, update Firestore
        if (existingBestTime == null || timeTaken < existingBestTime) {
          newBestTime = timeTaken; // Set the new best time
        } else {
          newBestTime = existingBestTime; // Keep the old best time
        }

        // Store the current time and best time in Firestore
        await setDoc(userRef, {
          username: user.email,
          time: timeTaken, // Store current time
          bestTime: newBestTime, // Update best time if necessary
        });

        const clearedLevelsDoc = await getDoc(clearedLevelsRef);
        const clearedLevels = clearedLevelsDoc.exists()
          ? clearedLevelsDoc.data().clearedLevels || []
          : []; // If no data, start with an empty array

        // Check if the level is already in the cleared levels
        if (!clearedLevels.includes("level1")) {
          clearedLevels.push("level1"); // Add the current level to the cleared levels
          await setDoc(
            clearedLevelsRef,
            {
              clearedLevels, // Update the cleared levels list
            },
            { merge: true }
          ); // Merge so we don't overwrite other data
        }

        // Navigate to leaderboard and pass the data (current time and best time)
        navigate("/leaderboard1", {
          state: {
            timeTaken: timeTaken,
            bestTime: newBestTime, // Use the correct best time here
            email: user.email,
          },
        });
      } catch (error) {
        console.error("Error saving completion time:", error);
      }
    }
  };

  const hotspots = [
    {
      id: "poster",
      x: "748px",
      y: "368px",
      width: "66px",
      height: "92px",
      image: learnBalanceSheet,
      borderRadius: "0px",
      boxShadow: "0px 0px 10px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "assets",
      x: "825px",
      y: "785px",
      width: "78px",
      height: "33px",
      image: sheet1,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "liability",
      x: "298px",
      y: "825px",
      width: "60px",
      height: "33px",
      image: sheet2,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "enter_balance_sheet",
      x: "445px",
      y: "500px",
      width: "111px",
      height: "80px",
      image: "",
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
    {
      id: "profit",
      x: "1454px",
      y: "610px",
      width: "70px",
      height: "19px",
      image: sheet3,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
    },
  ];

  return (
    <div className="relative w-full h-screen bg-black">
      {showTutorial && (
        <TutorialOverlay onFinish={() => setShowTutorial(false)} />
      )}
      {/* Background Image */}
      <img
        src={escapeRoom1}
        alt="Escape Room"
        className="w-full h-full object-cover z-0"
      />

      {/* Hotspots */}
      {hotspots.map((spot) => (
        <motion.div
          key={spot.id}
          className="absolute bg-transparent cursor-pointer z-10" // Set z-index to ensure it's above the background
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.width,
            height: spot.height,
            boxShadow: spot.boxShadow,
            borderRadius: spot.borderRadius,
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setSelectedItem(spot)}
        />
      ))}

      {/* Popup Dialog */}
      {selectedItem && (
        <Dialog.Root open={true} onOpenChange={() => setSelectedItem(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50 z-20" />{" "}
          {/* Ensure overlay is on top */}
          <Dialog.Content className="fixed inset-0 flex justify-center items-center p-4 z-30">
            <div className="bg-white p-4 rounded-lg">
              {selectedItem.id === "enter_balance_sheet" ? (
                <BalanceSheetQuiz onQuizComplete={handleClearRoom} />
              ) : (
                <img src={selectedItem.image} alt="Popup" className="w-full" />
              )}

              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
      <div className="absolute top-4 left-4 z-50">
        <ShowItem imageSrc={informationIcon} itemComponent={TutorialOverlay} />
      </div>
      <div className="absolute top-4 left-16 z-50">
        <ShowItem imageSrc={settingIcon} itemComponent={TutorialOverlay} />
      </div>
    </div>
  );git sta
}
