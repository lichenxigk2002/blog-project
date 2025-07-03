import React from 'react';
import styles from './ArticleSidebar.module.scss';
import ReadingTools from './ReadingTools';
import ArticleSearch from './ArticleSearch';

interface ArticleSidebarProps {
  articleContent: string;
  onFontSizeChange: (size: number) => void;
  readingTime: number;
  onExportOutline: (format: 'markdown' | 'pdf') => void;
  onResultClick: (index: number) => void;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  articleContent,
  onFontSizeChange,
  readingTime,
  onExportOutline,
  onResultClick
}) => {
  return (
    <aside className={styles.sidebar}>
      <ArticleSearch
        content={articleContent}
        onResultClick={onResultClick}
      />
      <ReadingTools
        onFontSizeChange={onFontSizeChange}
        readingTime={readingTime}
        onExportOutline={onExportOutline}
      />
    </aside>
  );
};

export default ArticleSidebar; 