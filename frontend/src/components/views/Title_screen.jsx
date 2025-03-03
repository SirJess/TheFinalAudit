import title_screen from "../../assets/title_screen.jpg";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import "../../assets/animations/animations.css";
import "../../assets/animations/title_screen.css";

const TitleScreen = () => {
  const navigate = useNavigate();
  const { data, loading, startProcessing } = useSocket();

  const handleStartGame = () => {
    navigate("/login");
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center overflow-x-hidden"
      style={{
        backgroundImage: `url(${title_screen})`,
      }}
    >
      <div className="mb-40">
        <div className="glitch-wrapper">
          <div
            style={{ fontFamily: "'Sixtyfour Convergence', serif" }}
            className="glitch"
            data-glitch="The Final Audit"
          >
            The Final Audit
          </div>
        </div>
        <h3 className="text-white text-md text-center font-bold animate-pulse-scale overflow-hidden">
          The books are cooked, can you survive the audit?
        </h3>
      </div>
      <button
        className="transition-all duration-500 
    bg-yellow-500 text-white px-12 py-3 rounded-lg 
    font-[Creepster]
    shadow-[0_0_10px_rgba(255,255,0,0.7)]
    hover:shadow-[0_0_20px_rgba(255,255,0,0.9)]
    hover:scale-105
    cursor-default hover:cursor-pointer text-2xl
    self-center mt-4"
        onClick={handleStartGame} // Start game when clicked
      >
        Start Game
      </button>
    </div>
  );
};

export default TitleScreen;
