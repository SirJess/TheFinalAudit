require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceKey.json")),
});

app.post("/verify-token", async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ success: true, uid: decodedToken.uid, email: decodedToken.email });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));