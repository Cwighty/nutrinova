import styles from "./AtomSpinner.module.scss";

export const AtomSpinner = () => {
  return (
    <div className={styles.atomSpinner}>
      <div className={styles.spinnerInner}>
        <div className={styles.spinnerLine}></div>
        <div className={styles.spinnerLine}></div>
        <div className={styles.spinnerLine}></div>
        <div className={styles.spinnerCircle}></div>
        &#9679;
      </div>
    </div>
  );
};
