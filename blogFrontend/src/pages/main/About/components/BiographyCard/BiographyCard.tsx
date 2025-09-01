import React, { useState } from 'react';
import styles from './BiographyCard.module.scss';

const BiographyCard: React.FC = () => {
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleItemClick = (itemType: string) => {
    setClickedItem(itemType);
    // 1秒后重置状态
    setTimeout(() => {
      setClickedItem(null);
    }, 1000);
  };

  const getDetailInfo = (type: string) => {
    switch (type) {
      case 'birth':
        return '千禧年出生的00后 🎉';
      case 'school':
        return '计算机科学与技术专业💻';
      case 'occupation':
        return '即将踏入社会的新青年🚀';
      default:
        return '';
    }
  };

  return (
    <div className={styles.biographyCard}>
      <h1>关于我</h1>
      <div className={styles.biographyGrid}>
        <div
          className={`${styles.biographyItem} ${clickedItem === 'birth' ? styles.clicked : ''}`}
          onClick={() => handleItemClick('birth')}
        >
          <div className={styles.label}>生于</div>
          <div className={`${styles.content} ${styles.birthYear}`}>
            {clickedItem === 'birth' ? getDetailInfo('birth') : '2002'}
          </div>
        </div>
        <div
          className={`${styles.biographyItem} ${clickedItem === 'school' ? styles.clicked : ''}`}
          onClick={() => handleItemClick('school')}
        >
          <div className={styles.label}>就读于</div>
          <div className={`${styles.content} ${styles.school}`}>
            {clickedItem === 'school' ? getDetailInfo('school') : '洛阳理工学院'}
          </div>
        </div>
        <div
          className={`${styles.biographyItem} ${clickedItem === 'occupation' ? styles.clicked : ''}`}
          onClick={() => handleItemClick('occupation')}
        >
          <div className={styles.label}>现在职业</div>
          <div className={`${styles.content} ${styles.occupation}`}>
            {clickedItem === 'occupation' ? getDetailInfo('occupation') : '大四学生'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiographyCard; 