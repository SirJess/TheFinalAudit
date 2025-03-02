import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Levels from "./Levels";
import allLevel from "../assets/allLevel.png";
import levels_image from "../assets/levels_image.png";
import cleared_level_image from "../assets/success.png"; // The image to show when level is completed
import { FaLock } from "react-icons/fa"; // Import the lock icon
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AllLevels = () => {
  const [clearedLevels, setClearedLevels] = useState([]); // State to store cleared levels
  const glassStyle = {
    background: "rgba(46, 75, 103, 0.48)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(8.6px)",
    WebkitBackdropFilter: "blur(8.6px)",
    border: "1px solid rgba(28, 47, 66, 0.92)",
  };

  const levels = [
    { level: 1, path: "/escape-room-1" },
    { level: 2, path: "/escape-room-2" },
    { level: 3, path: "" },
    { level: 4, path: "" },
    { level: 5, path: "" },
    { level: 6, path: "" },
    { level: 7, path: "" },
    { level: 8, path: "" },
    { level: 9, path: "" },
    { level: 10, path: "" },
    { level: 11, path: "" },
    { level: 12, path: "" },
    { level: 13, path: "" },
    { level: 14, path: "" },
    { level: 15, path: "" },
    { level: 16, path: "" },
    { level: 17, path: "" },
    { level: 18, path: "" },
    { level: 19, path: "" },
  ];

  const user = getAuth().currentUser; // Get the current user

  // Fetch cleared levels for the user from Firestore
  useEffect(() => {
    const fetchClearedLevels = async () => {
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid); // Reference to the user's document

        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setClearedLevels(data.clearedLevels || []); // Set cleared levels in state
          }
        } catch (error) {
          console.error("Error fetching cleared levels:", error);
        }
      }
    };

    fetchClearedLevels();
  }, [user]);

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center items-center justify-center"
      style={{
        backgroundImage: `url(${allLevel})`,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div
          style={glassStyle}
          className="bg-opacity-70 p-12 rounded-lg shadow-lg"
        >
          <h1 className="text-6xl font-bold text-white mb-8 text-center font-mono pb-6">
            All Levels
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-y-10 gap-x-10 text-center place-items-center">
            {levels.map((level) => (
              <Link
                key={level.level}
                to={level.path}
                className={`h-[125px] w-[125px] flex items-center justify-center border-2 border-[#81663C] font-[Tangerine] text-white text-4xl shadow-lg relative ${
                  level.path === ""
                    ? "bg-gray-500 opacity-50 pointer-events-none"
                    : "bg-[#BC9456] hover:opacity-80"
                }`}
              >
                {/* Smaller overlay image in the top-left corner */}
                {clearedLevels.includes(`level${level.level}`) && (
                  <img
                    src={cleared_level_image}
                    alt="Cleared"
                    className="absolute top-0 left-0 w-[70px] h-[70px] object-contain z-10"
                  />
                )}

                {/* If the level is locked, show the lock icon */}
                {level.path === "" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <FaLock className="text-3xl text-white" />
                  </div>
                )}

                {/* Level Name centered on top of overlay */}
                <Levels level={level.level} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllLevels;
