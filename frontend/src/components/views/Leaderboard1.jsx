import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import escapeRoom1 from "../../assets/escapeRoom1.jpg"; // Fullscreen background
import levels_image from "../../assets/levels_image.png"; // Paper background for leaderboard

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { timeTaken, email, bestTime } = location.state || {}; // Retrieve best time too

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const db = getFirestore();
        const leaderboardRef = collection(db, "times", "level1", "users"); // Hardcoded to level2
        const q = query(leaderboardRef, orderBy("bestTime", "asc"), limit(5)); // Top 5 fastest times
        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          name: doc.data().username.slice(0, 4), // Use first 4 characters of saved email as name
          score: doc.data().bestTime,
        }));

        setLeaderboard(fetchedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []); // Removed level from dependency array

  const handleBackToMenu = () => {
    navigate("/levels"); // Navigate back to the main menu
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${escapeRoom1})` }} // Fullscreen background
    >
      {/* Leaderboard Container */}
      <div
        className="relative bg-cover bg-center bg-no-repeat rounded-lg shadow-lg p-8 flex flex-col items-center"
        style={{
          backgroundImage: `url(${levels_image})`,
          width: "450px",
          height: "550px",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-gray-800 text-4xl text-center font-bold">
          Leaderboard
        </h1>

        {timeTaken && email && (
          <div className="mb-4 text-center text-gray-900">
            <p className="text-xl font-semibold">Your Time: {timeTaken} sec</p>
            <p className="text-xl font-semibold">
              Your Best Time: {bestTime} sec
            </p>
            <p className="text-xl font-semibold">
              Your Username: {email.slice(0, 4)}
            </p>
          </div>
        )}

        {/* Leaderboard Entries */}
        <ul className="my-4 w-full px-6">
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <li
                key={index}
                className="flex justify-between py-2 border-b border-gray-500 text-lg font-medium text-gray-800"
              >
                <span>{entry.name}</span>
                <span>{entry.score} sec</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-800">Loading leaderboard...</p>
          )}
        </ul>

        {/* Back to Menu Button */}
        <button
          className="mt-6 py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-all shadow-md"
          onClick={handleBackToMenu}
        >
          Levels
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
