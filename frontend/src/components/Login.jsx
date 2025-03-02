import React, { useState, useEffect } from "react";
import {
  signInWithGoogle,
  logout,
  auth,
  storage,
  uploadFile,
  deleteFile,
  fetchUserFiles,
} from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { FaGoogle } from "react-icons/fa";
import loginpageBackground from "../assets/loginpageBackground.png";
import { useNavigate } from "react-router-dom";
import brickBackground from "../assets/brickBackground.png";

// Import FilePond and plugins
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import SuccessDialog from "./Dialogs/SuccessDialog";
import { motion } from "framer-motion";

// Register the plugins
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode
);

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const glassStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Increased transparency
    backgroundImage:
      "linear-gradient(315deg, rgba(0, 0, 0, 0.8) 0%, rgba(66, 36, 25, 0.5) 74%)", // Increased transparency
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    border: "1px solid rgba(144, 144, 144, 0.49)",
  };
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [fileUrl, setFileUrl] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [timerInterval, setTimerInterval] = useState(null);

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {}, 1000); // Timer logic can be added back if needed
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      stopTimer();
      setUser(currentUser);

      if (currentUser) {
        fetchUserFiles(currentUser.uid);
        startTimer();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (fileItems) => {
    setFile(fileItems[0]?.file);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    if (!user) return;

    try {
      // Fetch all uploaded files
      const userFiles = await fetchUserFiles(user.uid);

      if (userFiles.length > 0) {
        // Delete all files
        await Promise.all(
          userFiles.map((file) => deleteFile(user.uid, file.name))
        );
      }

      // Upload the new file
      const downloadURL = await uploadFile(user.uid, file);
      setFileUrl(downloadURL);

      // Refresh uploaded files list
      const updatedFiles = await fetchUserFiles(user.uid);
      setUploadedFiles(updatedFiles);

      // Navigate to title screen
      setOpen(true);
      setStartGame(true);
    } catch (error) {
      console.error("Error during upload process:", error);
    }
  };

  const handleDelete = (fileName) => {
    if (user) {
      deleteFile(user.uid, fileName)
        .then(() => {
          setFileUrl("");
          fetchUserFiles(user.uid).then((files) => setUploadedFiles(files));
        })
        .catch((error) => console.error("Error deleting file:", error));
    }
  };

  const handleLogout = () => {
    stopTimer();
    logout();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${brickBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-screen flex w-screen items-center justify-center bg-gradient-to-r from-gray-600 to-gray-900"
    >
      <div
        style={glassStyle}
        className="flex relative flex-row space-x-3 w-7/8 bg-gray-900 bg-opacity-50 rounded-2xl shadow-lg h-4/5"
      >
        <div className="flex-1 p-2">
          <div
            className="w-full h-full rounded-2xl"
            style={{ border: "1px solid rgba(144, 144, 144, 0.49)" }}
          >
            <img
              className="w-full h-full object-cover rounded-2xl"
              src={loginpageBackground}
            />
          </div>
        </div>
        <div className="flex-1">
          {user ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col w-4/5">
                <div className="text-center space-y-10">
                  <h2 className="text-white text-5xl font-bold mb-4 font-mono">
                    Welcome, {user.displayName}
                  </h2>
                  <p className="mt-4 text-[#D7AC68] font-mono">
                    Please upload the balance sheet, shareholder equity
                    statement, and cashflow statement.
                  </p>
                  <div className="items-center justify-center mx-auto">
                    <FilePond
                      files={file ? [file] : []}
                      allowMultiple={false}
                      onupdatefiles={handleFileChange}
                      acceptedFileTypes={["application/pdf"]}
                      labelIdle='Drag & Drop your PDF or <span class="filepond--label-action">Browse</span>'
                    />
                    <button
                      onClick={handleUpload}
                      className="w-full mt-4 py-2 duration-200 ease-in bg-[#D7AC68] hover:bg-[#AA8954] hover:cursor-pointer rounded-md text-[#422419] font-bold"
                    >
                      Upload File
                    </button>
                    {startGame && (
                      // <button
                      //   onClick={() => navigate("/intro1")}
                      //   className="absolute bottom-4 right-4 py-2 px-4 duration-200 ease-in bg-yellow-500 hover:bg-[#AA8954] hover:cursor-pointer rounded-md text-[#422419] font-bold"
                      // >
                      //   Start Game
                      // </button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/intro1")}
                        className="absolute bottom-4 right-4 py-2 px-4 ease-in bg-yellow-500 hover:cursor-pointer rounded-md text-[#422419] font-bold"
                      >
                        Start
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
              <SuccessDialog
                open={open}
                onClose={() => setOpen(false)}
                message="Your operation was successful!"
              />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col w-4/5">
                <h2 className="text-5xl font-bold mb-15 text-white ">
                  <span
                    style={{
                      background:
                        "linear-gradient(to bottom right, #AA8954, #FFDFAE)",
                      WebkitBackgroundClip: "text", // Clips background to text
                      WebkitTextFillColor: "transparent", // Makes the text transparent so gradient shows
                    }}
                  >
                    Create an account
                  </span>{" "}
                </h2>
                <div className="flex flex-row space-x-5">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="flex-1 block w-full mb-4 p-2 rounded-md text-gray-700 bg-white border border-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="flex-1 block w-full mb-4 p-2 rounded-md text-gray-700 bg-white border border-gray-300"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full mb-4 p-2 rounded-md text-gray-700 bg-white border border-gray-300"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full mb-4 p-2 rounded-md text-gray-700 bg-white border border-gray-300"
                />
                <button className="w-full py-2 bg-[#D7AC68] hover:bg-[#AA8954] rounded-md hover:cursor-pointer text-black font-bold mb-4">
                  Sign Up
                </button>
                <div className="flex items-center justify-center mb-4">
                  <hr className="w-16 border-gray-300" />
                  <span className="px-3 text-gray-300">or</span>
                  <hr className="w-16 border-gray-300" />
                </div>
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center w-full py-2 bg-white hover:bg-gray-200 hover:cursor-pointer text-black rounded-md"
                >
                  <FaGoogle className="mr-2" />
                  Sign in with Google
                </button>
                <div className="mt-4 text-center">
                  <p className="text-gray-300">
                    Have an account?{" "}
                    <a
                      href="#"
                      className="font-bold text-[#D7AC68] hover:underline"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
