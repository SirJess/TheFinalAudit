import React from "react";
import { useNavigate } from "react-router-dom";

const Congratulations = () => {
  const navigate = useNavigate(); // ✅ useNavigate inside the component

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f8ff",
        border: "1px solid #add8e6",
        borderRadius: "8px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#2e8b57" }}>Congratulations!</h2>
      <p style={{ fontSize: "18px" }}>
        You successfully completed this balance sheet exercise.
      </p>

      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px 20px",
            margin: "0 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => navigate("/escape-room-2")} // ✅ Use an arrow function
        >
          Move on to Level 2
        </button>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 20px",
            margin: "0 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => navigate("/title-screen")} // ✅ Use an arrow function
        >
          Back to Title Page
        </button>
      </div>
    </div>
  );
};

export default Congratulations;
