import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import escapeRoom2 from "../../assets/escapeRoom2.jpg"; // Fullscreen background
import levels_image from "../../assets/levels_image.png"; // Paper background for leaderboard

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Access the passed state

  const { timeTaken, email } = location.state || {}; // Retrieve timeTaken and email

  // Sample leaderboard data
  const [leaderboard, setLeaderboard] = useState([
    { name: email ? email.slice(0, 4) : "Anonymous", score: timeTaken },
    { name: "bani", score: 602 },
    { name: "eric", score: 701 },
    { name: "jieq", score: 912 },
  ]);

  const handleBackToMenu = () => {
    navigate("/intro2"); // Navigate back to the main menu
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${escapeRoom2})` }} // Fullscreen background
    >
      {/* Leaderboard Container with Paper Background */}
      <div
        className="relative bg-cover bg-center bg-no-repeat rounded-lg shadow-lg p-8 flex flex-col items-center"
        style={{
          backgroundImage: `url(${levels_image})`, // Paper image
          width: "450px", // Adjust width as needed
          height: "550px", // Adjust height as needed
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-gray-800 text-4xl text-center font-bold">
          Leaderboard
        </h1>

        {/* Display the user's timeTaken and username */}
        {timeTaken && email && (
          <div className="mb-4 text-center text-gray-900">
            <p className="text-xl font-semibold">Your Time: {timeTaken} sec</p>
            <p className="text-xl font-semibold">
              Your Username: {email ? email.slice(0, 4) : "Anonymous"}
            </p>
          </div>
        )}

        {/* Leaderboard Entries */}
        <ul className="my-4 w-full px-6">
          {leaderboard.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between py-2 border-b border-gray-500 text-lg font-medium text-gray-800"
            >
              <span>{entry.name}</span>
              <span>{entry.score} sec</span>
            </li>
          ))}
        </ul>

        {/* Back to Menu Button */}
        <button
          className="mt-6 py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-all shadow-md"
          onClick={handleBackToMenu}
        >
          Ending Scene
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
