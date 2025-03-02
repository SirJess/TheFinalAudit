import { useState } from "react";

const Settings = ({ musicRef, volume, setVolume, onFinish, handleClick }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed top-10 left-0 m-4 z-50">
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
    </div>
  );
};

export default Settings;
