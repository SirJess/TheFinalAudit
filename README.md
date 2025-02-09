# Inspiration

Our inspiration comes from the fact that learning about finance can be challenging, but when combined with gameplay, it becomes enjoyable. That’s why we created a detective game where players uncover clues, explore financial concepts, and have fun while learning.

## What it does

Final Audit turns learning finance into an immersive detective adventure. Players step into a mystery where every room hides financial clues, waiting to be uncovered. By exploring different spaces, clicking on hidden objects, and piecing together key concepts like EBITDA, cash flow, and balance sheets, they gradually unravel the financial puzzle.

But discovery alone isn’t enough—each room presents a challenge, a test of knowledge that must be solved to move forward. The faster players crack the case, the better their standing on the global leaderboard. With every step, finance transforms from numbers on a page into an interactive journey, making learning not just educational but truly exciting.

## How We Built It

1. **Financial Document Processing**
   We implemented a system where users upload financial documents such as the balance sheet, shareholder equity sheet, and cash flow sheet.
   To extract text from PDFs, we integrated Google Cloud Vision OCR into our backend.
   The extracted text is then processed using Gemini LLM, which converts it into a structured JSON format.
   This structured data is used to create interactive quizzes that test users on financial concepts.

2. **Interactive Detective Game**

We designed an immersive detective-style game where players navigate different rooms.
Each room contains hidden clues related to key financial concepts like EBITDA, cash flow, and balance sheets.
Players can click on clues to learn about these topics in an engaging way.
At the end of each room, a puzzle challenges players to apply their knowledge.
Successfully solving the puzzle unlocks the next room, encouraging continuous learning.

3. **Leaderboard & Competition**
   To make the experience competitive, we implemented a leaderboard system.
   Players can speed-run through the game, with their completion time recorded.
   The leaderboard allows players to compete with others and track their progress.
   This adds an element of fun and motivation while reinforcing financial learning.

**Tech Stack**

- Frontend: Built with React for an interactive user experience.
- Backend: Developed using FastAPI, handling OCR, text processing, and game logic. AI & OCR: Used Google Cloud Vision OCR for text extraction and Gemini LLM for data structuring.
  🚀 Final Audit turns finance into a fun, interactive adventure!

4. **Challenges We Ran Into**
   Working with PDFs proved to be a major challenge. Many were encrypted or difficult to convert, and even when successfully processed, misaligned numbers made extraction unreliable. Fine-tuning the AI model was crucial to ensure accurate text recognition.

Another obstacle was the alternating black-and-white lines in balance sheets, which confused the OCR and made text unreadable. To overcome this, we had to carefully adjust grayscale levels and invert colors to enhance text clarity.

Integrating machine learning models into our React-based frontend was also tricky, as they require a dedicated server-side processing pipeline.

5. **Accomplishments That We're Proud Of**
   We’re thrilled about what we’ve built so far!

Creative Storyline – We designed an engaging detective narrative that makes learning finance feel like solving a mystery.
AI-Powered Learning – From OCR processing to LLM-based data structuring, we successfully integrated AI to turn financial documents into an interactive experience.
Interactive Gameplay – Players don’t just read about finance; they explore, discover clues, and solve puzzles, making learning hands-on and fun.
Bringing these elements together has transformed finance education into something truly immersive! 🚀

6. **What's next for The Final Audit**

- Fine-tuning the AI to improve accuracy in extracting and processing financial data.
- Developing an AI agent that uses LLMs to dynamically quiz players, making the learning experience more interactive and personalized.
- Expanding game levels by introducing auto-generated rooms and puzzles based on financial reports, ensuring endless challenges for players.
  The goal is to make Final Audit even smarter, more engaging, and a must-play for anyone looking to master finance through gameplay! 🚀
