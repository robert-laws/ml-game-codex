import { Link, Route, Routes } from 'react-router-dom';
import Tutorial from './components/Tutorial';
import GameBoard from './components/GameBoard';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <h1 className={styles.logo}>ML Memory Quest</h1>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link to="/" className={styles.navLink}>
            Tutorial
          </Link>
          <Link to="/game" className={styles.navLink}>
            Play Game
          </Link>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Tutorial />} />
          <Route path="/game" element={<GameBoard />} />
          <Route path="*" element={<Tutorial />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <p>Learn the fundamentals, then put your memory to the test.</p>
      </footer>
    </div>
  );
}
