# TechSensei 🚀

TechSensei is an advanced, AI-powered developer learning platform designed to accelerate your coding journey. Use the power of Google's Gemini AI to generate learning roadmaps, analyze repositories, refute misconceptions, and build personalized skills.

![TechSensei Banner](public/logo.png)

## ✨ Key Features

### 🧠 AI-Powered Learning
- **Explanation Engine**: Get deep, context-aware explanations for complex tech concepts.
- **Concept Simplification**: "Explain like I'm 5" mode for difficult topics.
- **Chat Assistant**: Interactive AI tutor for conversational learning.

### 🗺️ Personalized Data
- **Dynamic Roadmaps**: Generate custom learning paths based on your goals and time availability.
- **Skill Building**: Track XP, level up, and maintain streaks.
- **Daily Challenges**: AI-curated coding challenges tailored to your skill level.

### 🛠️ Developer Tools
- **Productivity Copilot**:
    - **Code Generation**: Instant boilerplate and utility generation.
    - **Refactoring**: Clean up and optimize legacy code.
    - **Documentation**: Auto-generate markdown docs for your functions.
- **Repository Analysis**: Paste a GitHub URL to get an architectural breakdown, complexity score, and improvement suggestions.
- **Knowledge Vault**: Save and semantically search your learning snippets.

### 🛡️ Resilience & UX
- **Offline Support**: Network status detection and offline indicators.
- **Mobile Responsive**: Fully responsive UI with Dark Mode support.
- **Global Error Handling**: Graceful failure recovery.

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Firestore (NoSQL)
- **Auth**: Firebase Authentication
- **AI**: Google Gemini API (Generative AI)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase Project with Firestore and Functions enabled.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/http-pruthvi/Techsensei.git
   cd Techsensei
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

   Setup Backend Env:
   ```bash
   cd functions
   # Create .env with GOOGLE_AI_API_KEY
   ```

4. **Run Locally**
   ```bash
   # Start Firebase Emulators (Optional but recommended)
   firebase emulators:start

   # Start React Dev Server
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

MIT License.
