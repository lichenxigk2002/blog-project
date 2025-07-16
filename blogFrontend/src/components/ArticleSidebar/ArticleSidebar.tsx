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
  contentRef: React.RefObject<HTMLDivElement>;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  articleContent,
  onFontSizeChange,
  readingTime,
  onExportOutline,
  onResultClick,
  contentRef
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
        articleContent={articleContent}
        contentRef={contentRef}
      />
    </aside>
  );
};

export default ArticleSidebar; 