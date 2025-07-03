import React from "react";
import styles from "./LoadingError.module.scss";

interface LoadingErrorProps {
    errorMessage?: string;
    onRetry?: () => void;
}

const LoadingError: React.FC<LoadingErrorProps> = ({
                                                       errorMessage = "加载遇到了一点小麻烦",
                                                       onRetry,
                                                   }) => (
    <div className={styles.errorWrapper}>
        <div className={styles.errorIllustration}>
            <div className={styles.errorCloud}>
                <div className={styles.errorFace}>
                    <div className={styles.errorEye}></div>
                    <div className={styles.errorEye}></div>
                    <div className={styles.errorMouth}></div>
                </div>
                <div className={styles.errorRain}></div>
                <div className={styles.errorRain}></div>
                <div className={styles.errorRain}></div>
            </div>
        </div>

        <div className={styles.errorText}>
            {errorMessage}
        </div>

        {onRetry && (
            <button className={styles.retryButton} onClick={onRetry}>
                <span className={styles.retryIcon}>↻</span>
                再试一次
            </button>
        )}

        <div className={styles.errorTip}>
            小贴士: 检查网络连接或稍后再试
        </div>
    </div>
);

export default LoadingError;