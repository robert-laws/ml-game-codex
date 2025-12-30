import { Link } from 'react-router-dom';
import styles from './Tutorial.module.css';

const concepts = [
  {
    id: 'overfitting',
    title: 'Overfitting vs. Generalization',
    icon: '🎯',
    summary:
      'Overfitting happens when a model memorizes the training data instead of learning the underlying patterns. Generalization is the model’s ability to perform well on unseen data by capturing signal instead of noise.',
    example:
      'Example: A model that nails every training point but performs poorly on validation data is likely overfitting; regularization or more data can help it generalize.',
  },
  {
    id: 'features',
    title: 'Feature Engineering',
    icon: '🧰',
    summary:
      'Feature engineering is the craft of transforming raw data into meaningful inputs that models can learn from. Good features can simplify the problem, reduce noise, and boost accuracy.',
    example:
      'Example: Converting timestamps into hour-of-day or day-of-week features can help a model learn daily or weekly patterns in user activity.',
  },
  {
    id: 'bias-variance',
    title: 'Bias-Variance Trade-off',
    icon: '⚖️',
    summary:
      'Bias measures how far off predictions are from reality, while variance measures how much predictions change across datasets. Balancing the two leads to models that are both accurate and stable.',
    example:
      'Example: A shallow tree may underfit due to high bias, while an overly deep tree may overfit due to high variance; pruning can improve the balance.',
  },
  {
    id: 'evaluation',
    title: 'Evaluation Metrics',
    icon: '📊',
    summary:
      'Metrics like accuracy, precision, recall, and F1-score provide different lenses on model performance. Selecting the right metric depends on the business goal and data balance.',
    example:
      'Example: In fraud detection, recall and precision matter more than raw accuracy because false negatives and false positives carry different costs.',
  },
  {
    id: 'regularization',
    title: 'Regularization',
    icon: '🧱',
    summary:
      'Regularization adds constraints that discourage overly complex models. Techniques like L1/L2 penalties or dropout prevent overfitting by limiting how much each feature can dominate.',
    example:
      'Example: Adding an L2 penalty in logistic regression shrinks coefficients, helping the model stay stable on new data.',
  },
  {
    id: 'optimization',
    title: 'Gradient-Based Optimization',
    icon: '📈',
    summary:
      'Algorithms like stochastic gradient descent adjust model parameters by following the slope of the loss function. Learning rates and momentum terms control how fast and smoothly the model converges.',
    example:
      'Example: Warm restarts or adaptive rates (Adam, RMSProp) can speed up training and escape small local minima.',
  },
  {
    id: 'validation',
    title: 'Validation Strategy',
    icon: '🧭',
    summary:
      'Validation splits and cross-validation help estimate out-of-sample performance before deployment. They protect against optimistic estimates that arise from tuning on the test set.',
    example:
      'Example: K-fold cross-validation trains multiple folds and averages scores to reduce the variance of the performance estimate.',
  },
  {
    id: 'data-leakage',
    title: 'Data Leakage',
    icon: '🚧',
    summary:
      'Data leakage occurs when training data includes information that will not be available at prediction time. Leakage inflates metrics and can quietly break real-world performance.',
    example:
      'Example: Normalizing all rows using statistics computed on the full dataset (including test data) leaks future information; the fix is to fit preprocessing only on training data.',
  },
  {
    id: 'interpretability',
    title: 'Interpretability',
    icon: '🔎',
    summary:
      'Interpretability techniques explain how models make decisions. Tools like SHAP values, feature importance, and partial dependence plots help teams trust and debug predictions.',
    example:
      'Example: If SHAP shows one feature dominates churn predictions, product teams can explore why and design interventions.',
  },
  {
    id: 'pipelines',
    title: 'ML Pipelines',
    icon: '🛠️',
    summary:
      'Pipelines chain preprocessing, feature generation, model training, and evaluation into a repeatable workflow. They improve reproducibility and reduce errors from manual steps.',
    example:
      'Example: A scikit-learn Pipeline that standardizes features, imputes missing values, and trains a classifier ensures the same steps run during both training and inference.',
  },
];

export default function Tutorial() {
  return (
    <section className={styles.tutorial}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Learn first, then play</p>
          <h2 className={styles.title}>Machine Learning Quickstart Guide</h2>
          <p className={styles.subtitle}>
            Review core ML concepts before you jump into the matching game. Each card
            pairs a term with its definition, examples, and a placeholder icon to make
            the memory task more vivid.
          </p>
          <div className={styles.actions}>
            <Link to="/game" className={styles.primaryButton}>
              Start the Game
            </Link>
            <a
              href="#concepts"
              className={styles.secondaryButton}
              aria-label="Skip to the list of concepts"
            >
              Browse Concepts
            </a>
          </div>
        </div>
        <div className={styles.heroCard}>
          <span className={styles.heroIcon}>🧠</span>
          <p className={styles.heroText}>
            Match ML ideas to their definitions to solidify your intuition. Quick rounds,
            quick learning.
          </p>
        </div>
      </div>

      <div id="concepts" className={styles.grid}>
        {concepts.map((concept) => (
          <article key={concept.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon} aria-hidden>
                {concept.icon}
              </span>
              <h3 className={styles.cardTitle}>{concept.title}</h3>
            </div>
            <p className={styles.summary}>{concept.summary}</p>
            <p className={styles.exampleLabel}>Example</p>
            <p className={styles.example}>{concept.example}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
