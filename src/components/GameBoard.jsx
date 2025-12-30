import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import styles from './GameBoard.module.css';

const STORAGE_KEY = 'ml-memory-state';
const BEST_KEY = 'ml-memory-best';
const MAX_MISTAKES = 8;

const basePairs = [
  {
    id: 'overfitting',
    term: 'Overfitting',
    definition: 'When a model memorizes training data noise, hurting performance on new samples.',
    hint: 'Watch validation performance to detect it early.',
  },
  {
    id: 'features',
    term: 'Feature Engineering',
    definition: 'Transforming raw inputs into signals that make patterns easier for models to learn.',
    hint: 'Great features can outperform more complex models.',
  },
  {
    id: 'bias-variance',
    term: 'Bias-Variance Trade-off',
    definition: 'Balancing systematic error (bias) with sensitivity to data changes (variance).',
    hint: 'Aim for a sweet spot between underfitting and overfitting.',
  },
  {
    id: 'evaluation',
    term: 'Evaluation Metrics',
    definition: 'Choosing metrics like accuracy, precision, recall, or F1 to reflect the real goal.',
    hint: 'Pick metrics that align with business impact.',
  },
  {
    id: 'regularization',
    term: 'Regularization',
    definition: 'Constraining model complexity (L1/L2, dropout) to improve generalization.',
    hint: 'Penalties keep parameters from growing unchecked.',
  },
  {
    id: 'optimization',
    term: 'Gradient Optimization',
    definition: 'Iteratively updating weights using gradients to reduce loss.',
    hint: 'Learning rates control how boldly you move downhill.',
  },
  {
    id: 'validation',
    term: 'Validation Strategy',
    definition: 'Splitting or cross-validating data to estimate out-of-sample performance.',
    hint: 'Never tune directly on the test set.',
  },
  {
    id: 'data-leakage',
    term: 'Data Leakage',
    definition: 'When future or target-only information sneaks into training, inflating metrics.',
    hint: 'Fit preprocessing only on training data.',
  },
];

const baseCards = basePairs.flatMap((pair) => [
  {
    id: `${pair.id}-term`,
    pairId: pair.id,
    label: pair.term,
    type: 'Term',
    helper: pair.hint,
  },
  {
    id: `${pair.id}-definition`,
    pairId: pair.id,
    label: pair.definition,
    type: 'Definition',
    helper: pair.hint,
  },
]);

const baseCardMap = new Map(baseCards.map((card) => [card.id, card]));

const shuffleDeck = (cards) => {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const freshDeck = () => shuffleDeck(baseCards.map((card) => ({ ...card, isMatched: false })));

const createDeckFromOrder = (order, matchedSet) =>
  order
    .map((cardId) => {
      const base = baseCardMap.get(cardId);
      if (!base) return null;
      return { ...base, isMatched: matchedSet.has(cardId) };
    })
    .filter(Boolean);

const loadInitialGame = () => {
  // Start with a fully shuffled, unmatched deck if storage is unavailable or empty.
  const fallback = {
    deck: freshDeck(),
    savedState: null,
    bestRecord: null,
    storageProblem: '',
  };

  if (typeof window === 'undefined' || !window?.localStorage) {
    return { ...fallback, storageProblem: 'Storage is unavailable in this environment.' };
  }

  try {
    const savedRaw = window.localStorage.getItem(STORAGE_KEY);
    const bestRaw = window.localStorage.getItem(BEST_KEY);
    const savedState = savedRaw ? JSON.parse(savedRaw) : null;
    const bestRecord = bestRaw ? JSON.parse(bestRaw) : null;

    const matchedSet = new Set(savedState?.matchedIds || []);
    const deck = savedState?.order
      ? createDeckFromOrder(savedState.order, matchedSet)
      : freshDeck();

    // If saved state is malformed, fall back gracefully.
    if (!deck || deck.length !== baseCards.length) {
      return fallback;
    }

    return {
      deck,
      savedState,
      bestRecord,
      storageProblem: '',
    };
  } catch (error) {
    return {
      ...fallback,
      storageProblem: 'We could not access localStorage; progress will reset each visit.',
    };
  }
};

export default function GameBoard() {
  const { deck, savedState, bestRecord, storageProblem } = React.useMemo(loadInitialGame, []);
  const [cards, setCards] = React.useState(deck);
  const [selection, setSelection] = React.useState([]);
  const [moves, setMoves] = React.useState(savedState?.moves ?? 0);
  const [mistakes, setMistakes] = React.useState(savedState?.mistakes ?? 0);
  const [gameStatus, setGameStatus] = React.useState(savedState?.gameStatus ?? 'playing');
  const [bestMoves, setBestMoves] = React.useState(bestRecord);
  const [storageError, setStorageError] = React.useState(storageProblem);
  const [isChecking, setIsChecking] = React.useState(false);

  const storageEnabled = !storageError && typeof window !== 'undefined' && !!window.localStorage;

  const resetGame = React.useCallback(() => {
    setSelection([]);
    setCards(freshDeck());
    setMoves(0);
    setMistakes(0);
    setGameStatus('playing');
  }, []);

  const handleCardClick = (cardId) => {
    if (gameStatus !== 'playing' || isChecking) return;
    if (selection.includes(cardId)) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.isMatched) return;

    // Allow only two active flips at a time.
    setSelection((prev) => (prev.length < 2 ? [...prev, cardId] : prev));
  };

  React.useEffect(() => {
    if (selection.length !== 2) return undefined;

    const [firstId, secondId] = selection;
    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);

    if (!first || !second) {
      setSelection([]);
      return undefined;
    }

    setIsChecking(true);
    setMoves((prev) => prev + 1);

    if (first.pairId === second.pairId && first.type !== second.type) {
      setCards((prev) =>
        prev.map((card) =>
          card.pairId === first.pairId ? { ...card, isMatched: true } : card,
        ),
      );
      setSelection([]);
      setIsChecking(false);
    } else {
      const timer = setTimeout(() => {
        setSelection([]);
        setMistakes((prev) => prev + 1);
        setIsChecking(false);
      }, 850);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [selection, cards]);

  React.useEffect(() => {
    if (gameStatus === 'playing' && cards.length && cards.every((card) => card.isMatched)) {
      setGameStatus('won');
    }
  }, [cards, gameStatus]);

  React.useEffect(() => {
    if (gameStatus === 'playing' && mistakes >= MAX_MISTAKES) {
      setGameStatus('lost');
    }
  }, [mistakes, gameStatus]);

  React.useEffect(() => {
    if (!storageEnabled) return;

    // Persist progress so players can resume mid-round.
    try {
      const payload = {
        order: cards.map((card) => card.id),
        matchedIds: cards.filter((card) => card.isMatched).map((card) => card.id),
        moves,
        mistakes,
        gameStatus,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      setStorageError('We could not save progress; storage may be disabled.');
    }
  }, [cards, moves, mistakes, gameStatus, storageEnabled]);

  React.useEffect(() => {
    if (gameStatus !== 'won' || !storageEnabled) return;

    // Track high-score (fewest moves) in localStorage when possible.
    const shouldUpdateBest = bestMoves === null || moves < bestMoves;
    if (shouldUpdateBest) {
      setBestMoves(moves);
      try {
        window.localStorage.setItem(BEST_KEY, JSON.stringify(moves));
      } catch (error) {
        setStorageError('Storage failed while saving your best score.');
      }
    }
  }, [gameStatus, moves, bestMoves, storageEnabled]);

  const message = (() => {
    if (gameStatus === 'won') {
      return 'You matched every concept! Keep the streak going.';
    }
    if (gameStatus === 'lost') {
      return 'You hit the mistake limit. Restart for another run!';
    }
    return 'Find the matching term and definition pairs.';
  })();

  return (
    <section className={styles.boardWrapper}>
      <div className={styles.boardHeader}>
        <div>
          <p className={styles.kicker}>Memory Challenge</p>
          <h2 className={styles.title}>Match the ML Concepts</h2>
          <p className={styles.subtitle}>{message}</p>
          {storageError && <p className={styles.warning}>{storageError}</p>}
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.actionButton} onClick={resetGame}>
            Restart
          </button>
          <Link to="/" className={styles.secondaryButton}>
            Back to Tutorial
          </Link>
        </div>
      </div>

      <div className={styles.scoreboard}>
        <div>
          <p className={styles.label}>Moves</p>
          <p className={styles.metric}>{moves}</p>
        </div>
        <div>
          <p className={styles.label}>Mistakes</p>
          <p className={`${styles.metric} ${mistakes >= MAX_MISTAKES - 2 ? styles.danger : ''}`}>
            {mistakes} / {MAX_MISTAKES}
          </p>
        </div>
        <div>
          <p className={styles.label}>Best (fewest moves)</p>
          <p className={styles.metric}>{bestMoves ?? '—'}</p>
        </div>
        <div>
          <p className={styles.label}>Status</p>
          <p className={styles.metric}>{gameStatus === 'playing' ? 'In progress' : gameStatus}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={card.isMatched || selection.includes(card.id)}
            disabled={gameStatus !== 'playing'}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </section>
  );
}
