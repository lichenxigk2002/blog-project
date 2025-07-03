import React from "react";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner: React.FC = () => (
    <div className={styles.loadingWrapper}>
        <div className={styles.dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
        <div className={styles.loadingText}>正在加载你的想法，就像等待一杯好咖啡一样值得☕...</div>
    </div>
);

export default LoadingSpinner;