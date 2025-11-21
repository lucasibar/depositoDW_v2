import React from "react";
import { ERROR_MESSAGES } from "../../constants/stockConstants";
import styles from "./ErrorState.module.css";

export const ErrorState = ({ error, onRetry }) => {
  return (
    <div className={styles.error}>
      <p>{error}</p>
      <button onClick={onRetry} className={styles.retryButton}>
        {ERROR_MESSAGES.RETRY}
      </button>
    </div>
  );
}; 