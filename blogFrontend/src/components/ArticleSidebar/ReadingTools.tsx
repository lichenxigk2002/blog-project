import React, { useState } from 'react';
import { FaFont, FaMoon, FaSun, FaFileExport, FaShareAlt, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch } from '@/redux/store';
import { toggleTheme } from '@/redux/themeSlice';
import styles from './ReadingTools.module.scss';

interface ReadingToolsProps {
  onFontSizeChange: (size: number) => void;
  readingTime: number;
  articleContent: string;
  contentRef: React.RefObject<HTMLDivElement>;
}

const ReadingTools: React.FC<ReadingToolsProps> = ({
  onFontSizeChange,
  readingTime,
  articleContent,
  contentRef,
}) => {
  const [fontSize, setFontSize] = React.useState(16);
  const [isCopied, setIsCopied] = React.useState(false);
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    onFontSizeChange(newSize);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([articleContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // const handleExportPDF = async () => {
  //   if (!contentRef.current) return;
  //   const html2pdf = (await import('html2pdf.js')).default;
  //   html2pdf(contentRef.current, {
  //     margin: 0.5,
  //     filename: 'article.pdf',
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  //   });
  // };

  return (
    <div className={`${styles.tools} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.toolHeader}>
        <span className={styles.toolTitle}>阅读工具</span>
        <button
          className={`${styles.collapseButton} ${isCollapsed ? styles.collapsed : ''}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FaChevronUp />
        </button>
      </div>
      <div className={styles.toolContent}>
        <div className={styles.toolItem}>
          <div className={styles.toolHeader}>
            <span className={styles.toolTitle}>字体大小</span>
            <FaFont className={styles.toolIcon} />
          </div>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={handleFontSizeChange}
            className={styles.slider}
          />
          <span className={styles.fontSizeValue}>{fontSize}px</span>
        </div>

        <div className={styles.toolItem}>
          <div className={styles.toolHeader}>
            <span className={styles.toolTitle}>主题切换</span>
            {isDarkMode ? (
              <FaMoon className={styles.toolIcon} />
            ) : (
              <FaSun className={styles.toolIcon} />
            )}
          </div>
          <button
            className={styles.themeButton}
            onClick={handleThemeToggle}
          >
            {isDarkMode ? '切换到浅色主题' : '切换到深色主题'}
          </button>
        </div>

        <div className={styles.toolItem}>
          <div className={styles.toolHeader}>
            <span className={styles.toolTitle}>阅读时间</span>
          </div>
          <div className={styles.readingTime}>
            {readingTime} 分钟
          </div>
        </div>

        <div className={styles.toolItem}>
          <button
              className={`${styles.exportButton} ${styles.shareButton}`}
              onClick={handleShareClick}
          >
            <FaShareAlt className={styles.toolIcon} />
            {isCopied ? '已复制' : '分享文章'}
          </button>
          <button
              className={`${styles.exportButton} ${styles.shareButton}`}
              onClick={handleExportMarkdown}
          >
            <FaFileExport className={styles.toolIcon} />
            导出 Markdown
          </button>
        </div>
        {/*<div className={styles.toolItem}>*/}
        {/*  */}
        {/*  <button*/}
        {/*    className={styles.exportButton}*/}
        {/*    onClick={handleExportPDF}*/}
        {/*  >*/}
        {/*    <FaFileExport className={styles.toolIcon} />*/}
        {/*    导出 PDF*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default ReadingTools;