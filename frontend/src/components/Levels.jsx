// frontend/src/components/Levels.jsx
import React from "react";

const Levels = ({ level }) => {
  return (
    <div className="level-card text-2xl font-mono">
      <h2>Level {level}</h2>
    </div>
  );
};

export default Levels;
