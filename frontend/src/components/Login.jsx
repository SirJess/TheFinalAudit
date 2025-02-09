import React, { useState, useEffect } from "react";
import { signInWithGoogle, logout, auth, storage, uploadFile, deleteFile } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { saveGameState, loadGameState } from "./gameState"; // Import game state functions

const Login = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
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

  // Handle file selection
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

  // Handle file deletion
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt="User" width="100" />
          <p>{user.email}</p>
          <button onClick={handleLogout}>Logout</button>

          {/* Display game state */}
          <div>
            <p>Current Level: {level}</p>
            <p>Time Taken: {timeTaken}s</p>
            <p>{cleared ? "Level Cleared!" : "Level Not Cleared"}</p>
          </div>

          {/* Simulate clearing the room */}
          <button onClick={handleClearRoom}>Clear Room (Finish Level)</button>

          {/* File upload section */}
          <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            {fileUrl && <p>File uploaded successfully: <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a></p>}
          </div>

          {/* Show uploaded files */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3>Your uploaded files:</h3>
              {uploadedFiles.map((file, index) => (
                <div key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                  <button onClick={() => handleDelete(file.name)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Login;