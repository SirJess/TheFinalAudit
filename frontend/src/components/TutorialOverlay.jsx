import { useState } from "react";

const TutorialOverlay = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  const steps = [
    "Click on glowing objects to collect hints.",
    "Use the hints to solve the puzzle and escape.",
    "Click the computer screen to start entering your answer.",
    "Complete the level by submitting the correct answer.",
  ];

  return (
    <div className="fixed top-10 left-0 m-4 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-md shadow-lg max-w-md text-center">
        <p>{steps[step]}</p>
        <button
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              onFinish(); // Close tutorial
            }
          }}
        >
          {step < steps.length - 1 ? "Next" : "Start Playing"}
        </button>
      </div>
    </div>
  );
};
export default TutorialOverlay;
