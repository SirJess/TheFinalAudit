import React, { useState, useEffect } from "react";
import "./Login.module.css";
import { signInWithGoogle, logout, auth, storage, uploadFile, deleteFile } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";

const Login = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserFiles(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserFiles = (userId) => {
    const storageRef = ref(storage, `users/${userId}/files/`);
    listAll(storageRef)
      .then((res) => {
        const files = res.items.map((itemRef) =>
          getDownloadURL(itemRef).then((url) => ({ name: itemRef.name, url }))
        );
        Promise.all(files).then((resolvedFiles) => {
          setUploadedFiles(resolvedFiles.filter(file => file !== null));
        });
      })
      .catch((error) => console.error("Error listing files: ", error));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    if (user) {
      uploadFile(user.uid, file).then(() => fetchUserFiles(user.uid));
    }
  };

  const handleDelete = (fileName) => {
    if (user) {
      deleteFile(user.uid, fileName).then(() => fetchUserFiles(user.uid));
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        {user ? (
          <div className="card">
            <h2>Welcome, {user.displayName}</h2>
            <img src={user.photoURL} alt="User" className="user-avatar" />
            <p>{user.email}</p>
            <p>Please upload the balance sheet, shareholder equity statement, and cashflow statement.2</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            <button onClick={logout}>Logout</button>
            {uploadedFiles.length > 0 && (
              <div>
                <h3>Your uploaded files:</h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                    <button onClick={() => handleDelete(file.name)}>Delete</button>
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

            <button>Submit</button>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <div className="footer">
              <p>Have an account? <a href="#">Sign in</a></p>
              <p><a href="#">Terms & Conditions</a></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;