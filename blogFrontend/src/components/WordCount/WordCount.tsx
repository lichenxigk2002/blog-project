import React from 'react';
import styles from './WordCount.module.scss';

interface WordCountProps {
  text: string;
  className?: string;
}

const WordCount: React.FC<WordCountProps> = ({ text, className }) => {
  // 计算字符数（包括空格）
  const charCount = text.length;

  // 计算词数（按空格分割）
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // 计算中文字数（不包括空格和标点）
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;

  // 计算英文单词数（不包括标点）
  const englishWordCount = (text.match(/[a-zA-Z]+/g) || []).length;

  return (
    <div className={`${styles.wordCount} ${className || ''}`}>
      <span className={styles.countItem}>
        <span className={styles.label}>字符数：</span>
        <span className={styles.value}>{charCount}</span>
      </span>
      <span className={styles.countItem}>
        <span className={styles.label}>词数：</span>
        <span className={styles.value}>{wordCount}</span>
      </span>
      <span className={styles.countItem}>
        <span className={styles.label}>中文字数：</span>
        <span className={styles.value}>{chineseCharCount}</span>
      </span>
      <span className={styles.countItem}>
        <span className={styles.label}>英文单词：</span>
        <span className={styles.value}>{englishWordCount}</span>
      </span>
    </div>
  );
};

export default WordCount; 