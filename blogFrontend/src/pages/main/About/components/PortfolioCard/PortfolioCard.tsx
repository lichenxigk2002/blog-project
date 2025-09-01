import React, { useState, useEffect } from 'react';
import styles from './PortfolioCard.module.scss';

const PortfolioCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 纯色作品数据（代替真实图片）
  const portfolioItems = [
    { id: 1, color: '#e74c3c', title: '云裳城——城市汉韵沉浸式体验平台', imageUrl: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/markdown%E4%B8%93%E7%94%A8/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-05-23%20225429.png' },
    { id: 2, color: '#3498db', title: '孤芳不自赏的Blog', imageUrl: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b63a15c3-7d4a-4507-94ec-a7833eda11a6.png' },
    { id: 3, color: '#27ae60', title: 'Epic UNREAL ENGINE 引擎官网复刻', imageUrl: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/701380d8-fde9-47ff-bde9-93952e6d1e91.png' },
    { id: 4, color: '#f39c12', title: '孤芳电影——toB与toC端的影院购票系统', imageUrl: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/0e66acf9-19ba-474d-a0be-7f7e07e1f0ec.png' },
    { id: 5, color: '#9b59b6', title: '孤芳组件——自研组件库', imageUrl: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b93d4fb8-f4a9-4327-86ea-6b09195a194c.png' },
  ];

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % portfolioItems.length);
      setTimeout(() => setIsAnimating(false), 600);
    }, 3000);

    return () => clearInterval(interval);
  }, [portfolioItems.length]);



  return (
    <div className={styles.portfolioCard}>
      {/* 展柜顶部白线 */}
      <div className={styles.topLine}></div>

      {/* 聚光灯效果 */}
      <div className={styles.spotlight}></div>

      {/* 标题区域 */}
      <div className={styles.titleSection}>
        <h1>作品集</h1>
        <h2 className={styles.currentTitle}>{portfolioItems[currentIndex].title}</h2>
      </div>

      {/* 轮播图容器 */}
      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.carouselItem} ${index === currentIndex ? styles.active : ''
                }`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className={styles.projectImage}
              />
            </div>
          ))}
        </div>

        {/* 滚动图标指示器 */}
        <div className={styles.indicators}>
          {/* 五个位置点 */}
          {portfolioItems.map((_, index) => (
            <div
              key={index}
              className={`${styles.positionDot} ${index === currentIndex ? styles.activeDot : ''}`}
            >
              {/* 滚动图标只在激活的点内显示 */}
              {index === currentIndex && (
                <div className={`${styles.rollingIcon} ${isAnimating ? styles.rolling : ''}`}>
                  <img src="/images/雪霁梅.svg" alt="rolling icon" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 说明文字 */}
        <div className={styles.description}>
          项目中的部分展示...
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard; 