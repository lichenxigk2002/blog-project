import React from 'react';
import type { Tag } from '@/types/Tags';
import styles from '../ArticleManagement/ArticleManagement.module.scss';

interface TagArticlesModalProps {
  visible: boolean;
  tag: Tag | null;
  articles: any[];
  loading: boolean;
  onClose: () => void;
}

const TagArticlesModal: React.FC<TagArticlesModalProps> = ({
  visible,
  tag,
  articles,
  loading,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>使用标签 "{tag?.name}" 的文章</h2>
          <button className={styles.modalClose} onClick={onClose}>×</button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>文章标题</div>
            <div className={styles.tableHeaderCell}>发布时间</div>
            <div className={styles.tableHeaderCell}>状态</div>
            <div className={styles.tableHeaderCell}>浏览量</div>
          </div>
          <div className={styles.tableBody}>
            {articles.map((article) => (
              <div key={article.id} className={styles.tableRow}>
                <div className={styles.tableCell} style={{ fontWeight: 500 }}>
                  <a
                    href={`/article/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#a259ff', textDecoration: 'none' }}
                  >
                    {article.title}
                  </a>
                </div>
                <div className={styles.tableCell}>
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : '-'}
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.statusTag} ${article.status === 'published' ? styles.published : styles.draft}`}>
                    {article.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </div>
                <div className={styles.tableCell}>{article.viewCount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.button} onClick={onClose}>
            关闭
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      )}
    </div>
  );
};

export default TagArticlesModal; 