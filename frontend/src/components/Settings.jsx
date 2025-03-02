import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = ({ musicRef, volume, setVolume, openSettings }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const navigate = useNavigate();

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleNavigationLevels = () => {
    navigate("/levels");
  };

  return (
    <div className="fixed top-12 left-4" style={{ zIndex: 1000 }}>
      {/* Settings Menu */}
      {isSettingsOpen && (
        <div className="mt-2 p-3 bg-gray-800 text-white rounded-md w-60">
          {/* Volume Slider */}
          <div className="mb-3">
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Navigate Buttons */}
      <div className="mt-4">
        <button
          onClick={handleNavigationLevels}
          className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          All Levels
        </button>
      </div>
    </div>
  );
};

export default Settings;
