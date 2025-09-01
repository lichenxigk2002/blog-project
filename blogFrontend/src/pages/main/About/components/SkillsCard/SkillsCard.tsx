import React, { useState, useEffect } from 'react';
import styles from './SkillsCard.module.scss';

const SkillsCard: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['探索', '进步', '学习', '工作'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className={styles.skillsCard}>
      <h1>源于</h1>
      <h2>热爱去坚持</h2>
      <div className={styles.dynamicTextContainer}>
        <div
          className={styles.dynamicText}
          style={{
            transform: `translateY(-${currentWordIndex * 2}rem)`
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              className={styles.word}
              style={{
                color: index === 0 ? '#3498db' : // 蓝色 - 探索
                  index === 1 ? '#e91e63' : // 粉色 - 进步
                    index === 2 ? '#ffc107' : // 黄色 - 学习
                      '#9c27b0' // 紫色 - 工作
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsCard; 