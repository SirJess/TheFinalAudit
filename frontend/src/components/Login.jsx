import React, { useState, useEffect } from "react";
import "./Login.module.css";
import {
  signInWithGoogle,
  logout,
  auth,
  storage,
  uploadFile,
  deleteFile,
} from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { saveGameState, loadGameState } from "./gameState"; // Import game state functions
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const glassStyle = {
    background: "rgba(109, 108, 108, 0.5)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    border: "1px solid rgba(144, 144, 144, 0.49)",
  };
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState("");

  const [username, setUsername] = useState(""); //fill in username
  const [password, setPassword] = useState("");

  const [level, setLevel] = useState(1);
  const [timeTaken, setTimeTaken] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  // Function to start the timer
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);

    const interval = setInterval(() => {
      setTimeTaken((prevTime) => prevTime + 1); // Increment time every second
    }, 1000);

    setTimerInterval(interval);
  };

  // Function to stop the timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Listen for user authentication state changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      stopTimer(); // Stop timer for previous user
      setUser(currentUser);

      if (currentUser) {
        // Load saved game state
        const state = await loadGameState(currentUser.uid);
        console.log("Fetched game state:", state); // Debugging

        if (state) {
          // Apply the fetched state to the component's state
          setLevel(state.level);
          setTimeTaken(state.timeTaken || 0);
          setCleared(state.cleared || false);
        } else {
          // Reset state if no saved state is found
          setLevel(1);
          setTimeTaken(0);
          setCleared(false);
        }

        fetchUserFiles(currentUser.uid); // Fetch files for the logged-in user
        startTimer(); // Start a new timer for the new user
      } else {
        // Reset state if no user is logged in
        setLevel(1);
        setTimeTaken(0);
        setCleared(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save game state whenever `cleared`, `level`, or `timeTaken` changes
  useEffect(() => {
    if (user) {
      saveGameState(user.uid, level, timeTaken, cleared);
    }
  }, [cleared, level, timeTaken, user]); // Save state when these values change

  // Fetch user's uploaded files

  const fetchUserFiles = (userId) => {
    const storageRef = ref(storage, `users/${userId}/files/`);
    listAll(storageRef)
      .then((res) => {
        const files = res.items.map((itemRef) =>
          getDownloadURL(itemRef).then((url) => ({ name: itemRef.name, url }))
        );
        //   Promise.all(files).then((resolvedFiles) => {
        //     setUploadedFiles(resolvedFiles.filter(file => file !== null));
        //   });
        // })
        // .catch((error) => console.error("Error listing files: ", error));

        const filesPromises = res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        });

        Promise.all(filesPromises).then((files) => {
          setUploadedFiles(files);
        });
      })
      .catch((error) => {
        console.error("Error fetching files: ", error);
      });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload file
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    if (user) {
      uploadFile(user.uid, file)
        .then((downloadURL) => {
          setFileUrl(downloadURL);
          fetchUserFiles(user.uid);
        })
        .catch((error) => {
          console.error("Upload failed", error);
        });
    }
  };

  const handleDelete = (fileName) => {
    if (user) {
      deleteFile(user.uid, fileName)
        .then(() => {
          console.log("File deleted successfully");
          fetchUserFiles(user.uid);
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
        });
    }
  };

  // Handle clearing the room
  const handleClearRoom = () => {
    setCleared(true); // Update the state
    stopTimer(); // Stop timer when level is cleared
  };

  // Handle logout
  const handleLogout = () => {
    stopTimer(); // Stop timer on logout
    logout();
  };

  return (
    <div className="login-container">
      <div className="left-panel py-10 px-8" style={glassStyle}>
        {user ? (
          <div className="card">
            <h2>Welcome, {user.displayName}</h2>
            <img src={user.photoURL} alt="User" className="user-avatar" />
            <p>{user.email}</p>
            <p>
              Please upload the balance sheet, shareholder equity statement, and
              cashflow statement.
            </p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            <button onClick={logout}>Logout</button>
            {uploadedFiles.length > 0 && (
              <div>
                <h3>Your uploaded files:</h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <a>{file.name}</a>
                    <button onClick={() => handleDelete(file.name)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <h2>Create an account</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-col items-center justify-center">
              <button className="mb-[20px]">Sign Up</button>
              <div className="flex items-center">
                <hr className="w-16 border-gray-300" />
                <span className="px-3 text-gray-500">or</span>
                <hr className="w-16 border-gray-300" />
              </div>
              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-center text-black"
              >
                <FaGoogle className="mr-2" />
                Sign in with Google
              </button>
            </div>
            <div className="footer">
              <p className="pt-[10px]">
                Have an account?{" "}
                <a href="#" className="font-bold">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
