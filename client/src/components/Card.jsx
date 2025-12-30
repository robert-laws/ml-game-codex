import styles from './Card.module.css';

export default function Card({ card, isFlipped, onClick, disabled }) {
  const { label, type, helper, isMatched } = card;

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      disabled={disabled || isMatched || isFlipped}
      aria-label={`${type} card: ${label}`}
    >
      <div
        className={`${styles.inner} ${isFlipped ? styles.flipped : ''} ${
          isMatched ? styles.matched : ''
        }`}
      >
        <div className={styles.front}>
          <span className={styles.placeholderIcon}>🧠</span>
          <p className={styles.prompt}>Tap to reveal</p>
        </div>
        <div className={styles.back}>
          <div className={styles.badge}>{type}</div>
          <p className={styles.label}>{label}</p>
          <p className={styles.helper}>{helper}</p>
        </div>
      </div>
    </button>
  );
}
