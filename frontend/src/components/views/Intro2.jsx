import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import escapeRoom2 from "../../assets/escapeRoom2.jpg";

export default function Intro() {
  const navigate = useNavigate(); // Initialize navigate
  const handleNavigation = () => {
    navigate("/levels"); // Replace with the correct route path
  };
  return (
    <div
      style={{
        backgroundImage: `url(${escapeRoom2})`,
      }}
      className="flex flex-col items-center h-screen justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-50"
    >
      {/* Animated title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          fontSize: "3rem",
          color: "white",
          textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)",
          marginBottom: "20px",
        }}
      >
        Escape... but at What Cost?
      </motion.h1>

      {/* Story text box */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
          As the last piece of the puzzle falls into place, the truth becomes
          clear. You’ve uncovered the hidden figures, solved the complex
          calculations, and pieced together the financial missteps that led to
          this company's downfall. The escape is within reach, but there’s one
          final question that lingers—why were you chosen to uncover these
          secrets?
        </p>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginTop: "10px" }}>
          The answers are now in your hands, but escaping the Final Audit is
          just the beginning. The deeper you look, the more you realize—there’s
          more to this story than what meets the eye. What you’ve uncovered so
          far is only the tip of the iceberg.
        </p>
        <p style={{ fontSize: "1.2rem", lineHeight: "1.6", marginTop: "10px" }}>
          The mysteries of this office extend far beyond what you’ve solved. The
          next challenge awaits, and it will demand more than just your wits.
          Will you uncover the full story? Only time will tell...
        </p>
      </motion.div>
    </div>
  );
}
