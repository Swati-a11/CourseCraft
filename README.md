# CourseCraft 🚀 — AI-Powered Learning Hub

CourseCraft is a next-generation, full-stack AI platform built using the MERN stack and powered by the Google Gemini API. It completely automates curriculum design by generating tailored study plans, structured learning notes, relevant video references, and interactive quizzes to test knowledge retention. Secured with JWT authentication, it provides a seamless, personalized upskilling environment for students and creators alike.

---

## 🌟 Key Features

- **AI Study Plan Generator:** Instantly maps out high-impact, personalized timelines based on user learning goals.
- **Automated Content Orchestration:** Generates rich, comprehensive markdown notes and curates structured instructional videos via AI insights.
- **Interactive Retrieval-Testing (Quizzes):** Dynamically spins up targeted quiz sets after every module to test understanding with real-time feedback.
- **Secure JWT Authentication:** Implements robust JSON Web Token workflows for protected user routing, secure credential state management, and profile isolation.
- **Premium Space-Dark Grid UI:** Styled with a sleek, modern, low-strain interface using Tailwind CSS for an optimal reading and coding environment.

---

## 🛠️ Tech Stack

- **Frontend Architecture:** React.js, Tailwind CSS (Custom Theme Variables)
- **Backend Infrastructure:** Node.js, Express.js micro-routers
- **Database Layer:** MongoDB with Mongoose ODM
- **AI Core:** Google Gemini Pro / Flash API
- **Security & Session Layer:** JSON Web Tokens (JWT) & bcrypt encryption

---

Project Case Study
1. The Core Challenge & System Vision
Modern self-paced learning is highly fragmented. Students spend more time gathering study resources—curating notes, filtering videos, and setting up quizzes—than actually studying. CourseCraft was built to eliminate this friction. By linking an LLM pipeline with a secure user state dashboard, the app instantly materializes a standard textbook-like environment from a single text prompt.

2. Prompt Structuring & Gemini Integration
The foundational engine uses structured prompt topologies to force Gemini to return predictable payload structures. This ensures that the generated study plans, notes, and quizzes can be safely parsed as programmatic JSON matrices rather than raw text blobs. If a module requires self-testing, the backend forces schema adherence on the API response so the frontend can seamlessly render multiple-choice question components with an interactive point-counter.

### Ask your documents

Signed-in learners can upload a text-based PDF (up to 5 MB), select it in Documents, and ask questions. CourseCraft saves extracted passages under the user's account and retrieves passages using keyword overlap before sending the question and selected excerpts to Google Gemini. Answers include numbered passages to inspect. The feature needs the existing MongoDB connection, JWT secret, and `GEMINI_API_KEY` configured on the server. Scanned PDFs without selectable text are not supported. Retrieval uses keywords rather than semantic embeddings, so rephrasing a question with terms from the document can improve results. Deleting a document removes its saved text.
