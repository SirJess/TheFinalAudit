require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceKey.json")),
});

// Function to process PDF with OCR
function processPdfWithOcr(bucket, objectPath, callback) {
  const command = `python ../Web_Scrape/google_cloud_vision_v2.py ${bucket} ${objectPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) return callback(`Error processing PDF: ${error.message}`);
    if (stderr) return callback(`Error processing PDF: ${stderr}`);

    const txtFilePath = stdout.trim(); // Assume Python script returns text file path
    callback(null, txtFilePath);
  });
}

// Function to generate JSON from extracted text
function generateJsonFromText(txtFilePath, callback) {
  const command = `python ../Web_Scrape/GeminiAI.py ${txtFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) return callback(`Error generating JSON: ${error.message}`);
    if (stderr) return callback(`Error generating JSON: ${stderr}`);

    const jsonOrTxtFile = stdout.trim(); // Returns JSON file path or a text file if conversion fails
    callback(null, jsonOrTxtFile);
  });
}

// Function to clean and rename text file if needed
function cleanAndRenameTxtFile(txtFilePath, callback) {
  const command = `python ../Web_Scrape/txt_to_json.py ${txtFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) return callback(`Error cleaning file: ${error.message}`);
    if (stderr) return callback(`Error cleaning file: ${stderr}`);

    const jsonFile = stdout.trim(); // Returns final JSON file path
    callback(null, jsonFile);
  });
}

// API endpoint to process PDF
app.post("/process-pdf", (req, res) => {
  const { bucket, object_path } = req.body;

  processPdfWithOcr(bucket, object_path, (error, txtFile) => {
    if (error) return res.status(500).send(error);

    generateJsonFromText(txtFile, (error, jsonOrTxtFile) => {
      if (error) return res.status(500).send(error);

      if (jsonOrTxtFile.endsWith(".txt")) {
        cleanAndRenameTxtFile(jsonOrTxtFile, (error, jsonFile) => {
          if (error) return res.status(500).send(error);
          res.json({ message: "Processing complete", json_file: jsonFile });
        });
      } else {
        res.json({ message: "Processing complete", json_file: jsonOrTxtFile });
      }
    });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
