# Milk Sales App - Menka

Simple Stage 1 React app (Vite) to help track daily milk sales, monthly totals,
and provide Hindi voice prompts. Data is stored in browser localStorage.

## Features
- Add customers (example customer: "ps chahuan")
- Daily entry per customer (quantity in kg)
- Attendance marker (present/absent)
- Monthly totals per customer and overall
- Hindi voice greetings and action feedback using Web Speech API

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open browser at the address shown by Vite (usually http://localhost:5173)

## Notes
- This is a local-first app (no backend). If you want server persistence later, we can add a backend.
- The Hindi voice uses the browser's SpeechSynthesis; make sure your browser supports it.
