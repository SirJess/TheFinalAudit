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
      className="relative w-full h-screen bg-cover bg-center flex justify-center items-start"
      style={{
        backgroundImage: `url(${title_screen})`,
      }}
    >
      <div className="glitch-wrapper">
        <div
          style={{ fontFamily: "'Sixtyfour Convergence', serif" }}
          className="glitch"
          data-glitch="The Final Audit"
        >
          The Final Audit
        </div>
      </div>
      <h3 className="text-white absolute right-[220px] top-[190px] text-md font-bold -rotate-12 animate-pulse-scale">
        The books are cooked, can you survive the audit?
      </h3>
      <button
        className="absolute 
          transition-all duration-500 
          left-1/2 top-1/2 transform -translate-x-1/2 
          bg-yellow-500 text-white px-12 py-3 rounded-lg 
          font-[Creepster]
          shadow-[0_0_10px_rgba(255,255,0,0.7)]
          hover:shadow-[0_0_20px_rgba(255,255,0,0.9)]
          hover:scale-105
          cursor-default hover:cursor-pointer text-2xl"
        onClick={handleStartGame} // Start game when clicked
      >
        Start Game
      </button>
    </div>
  );
};

export default TitleScreen;
