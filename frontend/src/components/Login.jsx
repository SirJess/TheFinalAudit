import React, { useState, useEffect } from "react";
import { signInWithGoogle, logout, auth, storage, uploadFile, deleteFile } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage"; // Ensure getDownloadURL is imported

const Login = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Listen to user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserFiles(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's uploaded files
  const fetchUserFiles = (userId) => {
    const storageRef = ref(storage, `users/${userId}/files/`);
    listAll(storageRef)
      .then((res) => {
        // Fetch download URLs for each file reference
        const files = res.items.map((itemRef) => {
          return getDownloadURL(itemRef)
            .then((url) => ({
              name: itemRef.name,
              url,
            }))
            .catch((error) => {
              console.error("Error getting file URL: ", error);
              return null; // In case there's an error retrieving the URL
            });
        });

        // Resolve all promises and update the state with the files
        Promise.all(files)
          .then((resolvedFiles) => {
            setUploadedFiles(resolvedFiles.filter(file => file !== null)); // Filter out null errors
          })
          .catch((error) => {
            console.error("Error fetching files: ", error);
          });
      })
      .catch((error) => {
        console.error("Error listing files: ", error);
      });
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload the file
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    if (user) {
      uploadFile(user.uid, file)
        .then((downloadURL) => {
          setFileUrl(downloadURL);
          fetchUserFiles(user.uid); // Fetch files after upload
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
          fetchUserFiles(user.uid); // Refresh the list after deletion
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
        });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt="User" width="100" />
          <p>{user.email}</p>
          <button onClick={logout}>Logout</button>

          {/* File upload section */}
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload File</button>

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
