import React from 'react';
import styles from '../../pages/main/Home/Home.module.scss';

const HomeSkeleton: React.FC = () => {
  return (
    <div className={styles.mainContentArea}>
      {/* 左侧文章区域骨架 - 完全复制首页结构 */}
      <div className={styles.mainContentLeft}>
        <h2 className={styles.latestArticlesTitle}>最新文章</h2>
        <div className={styles.articlesGrid}>
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className={styles.articleCard}>
              <div>
                <h3 className={styles.articleTitle}>文章标题加载中...</h3>
                <p className={styles.articleDescription}>文章描述内容正在加载中，请稍候...</p>
              </div>
              <div className={styles.articleMeta}>
                <span className={styles.articleCreatedAt}>2025/01/01</span>
                <span className={styles.articleViewCount}>0 阅读</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧区域骨架 - 完全复制首页结构 */}
      <div className={styles.mainContentRight}>
        {/* 照片区域骨架 */}
        <h2 className={styles.latestArticlesTitle}>近期照片</h2>
        <div className={styles.photosGrid}>
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className={styles.photoCard}>
              <div className={styles.photoImage} style={{
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px'
              }}>
                加载中
              </div>
              <div className={styles.photoInfo} style={{ opacity: 1 }}>
                <h3>照片标题加载中...</h3>
                <span>2025/01/01</span>
              </div>
            </div>
          ))}
        </div>

        {/* 统计区域骨架 */}
        <section className={styles.stats}>
          <h2>博客统计</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span>--</span>
              <p>文章数</p>
            </div>
            <div className={styles.statItem}>
              <span>--</span>
              <p>标签数</p>
            </div>
            <div className={styles.statItem}>
              <span>--</span>
              <p>总阅读量</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeSkeleton; 