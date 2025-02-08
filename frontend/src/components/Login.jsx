import React from "react";
import { signInWithGoogle, logout, auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt="User" width="100" />
          <p>{user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Login;