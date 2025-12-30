# Machine Learning Memory Quest

An interactive React experience that teaches core machine learning concepts through a guided tutorial and a 16-card memory matching game.

## Project structure

- `client/`: Vite + React frontend with tutorial content and the memory game.

## Getting started

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

If `npm install` fails due to registry access, double-check network/proxy settings or mirror the npm registry inside your environment.

## Gameplay overview

- **Tutorial:** 8–10 foundational ML concepts with concise explanations, examples, and visual placeholders to warm up before playing.
- **Memory game:** 16 cards representing ML terms and definitions. Features shuffling, flip animations, match/mismatch logic, scoring, win/lose states, restart, and localStorage persistence for progress and high scores.
- **Resilience:** Basic error handling with a visible fallback when storage is unavailable.

## Future extensions

- Add timers, streak bonuses, and achievements for advanced challenges.
- Include sound effects and accessibility-first animations (reduced-motion support).
- Expand the concept deck with difficulty levels or custom decks per user persona.
- Track per-concept accuracy to surface areas that need review.
