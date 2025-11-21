import React from "react";
import { ERROR_MESSAGES } from "../../constants/stockConstants";
import styles from "./LoadingState.module.css";

export const LoadingState = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>{ERROR_MESSAGES.LOADING}</p>
    </div>
  );
}; 