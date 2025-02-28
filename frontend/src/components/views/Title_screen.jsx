import title_screen from "../../assets/title_screen.jpg";
import { useNavigate } from "react-router-dom";
import "../../assets/animations/animations.css";

const TitleScreen = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/intro1");
  };
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${title_screen})`,
      }}
    >
      <h1 className="text-red-300 pt-[60px] text-9xl text-center font-bold font-[Creepster]">
        The Final Audit
      </h1>
      <h3 className="text-white absolute right-[220px] top-[150px] text-xl font-bold -rotate-12 animate-pulse-scale">
        The books are cooked, can you survive the audit?
      </h3>
      {/* Add your buttons here */}
      <button
        className="absolute 
    transition-all duration-500 
    left-1/2 top-1/2 transform -translate-x-1/2 
    bg-yellow-500 text-white px-12 py-3 rounded-lg 
    font-[Creepster]
    shadow-[0_0_10px_rgba(255,255,0,0.7)]
    hover:shadow-[0_0_20px_rgba(255,255,0,0.9)]
    hover:scale-105
    cursor-default hover:cursor-pointer text-2xl
  "
        onClick={handleStartGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default TitleScreen;
