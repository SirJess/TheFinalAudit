import escapeRoom2 from "../../assets/escapeRoom2.jpg";
import learnBalanceSheet from "../../assets/learnBalanceSheet.png";
import levels_image from "../../assets/levels_image.png";
import Horizontal_Analysis from "../../assets/Horizontal_Analysis.png";
import what_is_ebitda from "../../assets/what_is_ebitda.png";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Fix missing import
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  return { user, loading };
}

export default function EscapeRoom2() {
  const navigate = useNavigate(); // Fix for navigation
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null); // Ensure only one declaration
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null); // Fixed declaration

  // Hardcoded quiz values
  const netIncome = 16270;
  const interestExpense = 2519;
  const taxes = 5879;
  const depreciationAmortization = 11853;
  const correctEBITDA =
    netIncome + interestExpense + taxes + depreciationAmortization;

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
      startTimer(); // Start timer when user is authenticated
    }
    return () => stopTimer();
  }, [user]);

  const handleSubmit = () => {
    if (parseInt(userAnswer) === correctEBITDA) {
      setFeedback("✅ Correct! Well done!");
      handleClearRoom();
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${correctEBITDA}.`);
    }
  };

  const handleClearRoom = async () => {
    setCleared(true);
    stopTimer();
  
    if (user) {
      const db = getFirestore();
      const userRef = doc(db, "times", "level2", "users", user.uid);
  
      try {
        // Get the current best time
        const userDoc = await getDoc(userRef);
        const existingBestTime = userDoc.exists() ? userDoc.data().bestTime : null;
      
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
      
        // Navigate to leaderboard and pass the data (current time and best time)
        navigate("/leaderboard2", {
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
      id: "explain_EBITDA",
      x: "370px",
      y: "180px",
      width: "90px",
      height: "140px",
      image: what_is_ebitda,
      borderRadius: "0px",
      boxShadow: "0px 0px 10px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "w-[450px]",
    },
    {
      id: "enter_EBITDA",
      x: "570px",
      y: "250px",
      width: "200px",
      height: "150px",
      image: levels_image,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 0, 0, 0.6)",
      imagewidth: "100px",
    },
    {
      id: "depreciation_amortization",
      x: "940px",
      y: "270px",
      width: "180px",
      height: "160px",
      image: levels_image,
      borderRadius: "12px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "100px",
    },
    {
      id: "lost_your_data",
      x: "1145px",
      y: "545px",
      width: "75px",
      height: "40px",
      image: Horizontal_Analysis,
      borderRadius: "0px",
      boxShadow: "0px 0px 15px 4px rgba(255, 255, 0, 0.6)",
      imagewidth: "100px",
    },
  ];

  return (
    <div className="relative w-full h-screen bg-black">
      <img
        src={escapeRoom2}
        alt="Escape Room"
        className="w-full h-full object-cover"
      />

      {hotspots.map((spot) => (
        <motion.div
          key={spot.id}
          className="absolute bg-transparent cursor-pointer"
          style={{
            left: spot.x,
            top: spot.y,
            width: spot.width,
            height: spot.height,
            boxShadow: spot.boxShadow,
            borderRadius: spot.borderRadius,
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            if (spot.id === "depreciation_amortization") {
              setSelectedItem("quiz");
            } else {
              setSelectedItem(spot);
            }
          }}
        />
      ))}

      {selectedItem === "quiz" && (
        <Dialog.Root open={true} onOpenChange={() => setSelectedItem(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Calculate EBITDA</h2>
              <p>Net Income: ${netIncome}</p>
              <p>Interest Expense: ${interestExpense}</p>
              <p>Taxes: ${taxes}</p>
              <p>Depreciation & Amortization: ${depreciationAmortization}</p>

              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="mt-4 p-2 border border-gray-400 rounded w-full text-center"
                placeholder="Enter EBITDA"
              />

              <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>

              {feedback && <p className="mt-3 font-bold">{feedback}</p>}

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setUserAnswer("");
                  setFeedback(null);
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
}
