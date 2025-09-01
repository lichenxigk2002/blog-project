import React from 'react';
import styles from './ArticleSearch.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { cleanMarkdownAndHtml } from '@/utils/htmlUtils';

interface SearchResult {
  text: string;
  index: number;
  context: string;
  paraId: string;
}

interface ArticleSearchProps {
  content: string;
  onResultClick: (paraId: string | number) => void;
}

const ArticleSearch: React.FC<ArticleSearchProps> = ({ content, onResultClick }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);



  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchResults: SearchResult[] = [];

    // 1. 按原始内容的段落分割，保持与渲染时的ID对应
    const originalParagraphs = content.split(/\n+/);
    let paraStartIdx = 0;
    let actualParagraphIndex = 0; // 实际段落计数器，与渲染时一致
    const paraMeta: { id: string; start: number; end: number; originalText: string; cleanText: string }[] = [];

    originalParagraphs.forEach((para, idx) => {
      if (para.trim().length > 0) {  // 只处理非空段落
        const start = paraStartIdx;
        const end = paraStartIdx + para.length;
        const cleanedPara = cleanMarkdownAndHtml(para);

        // 检查这个段落在渲染时是否会成为p标签（不是标题等）
        const isActualParagraph = !para.trim().startsWith('#') &&
          !para.trim().startsWith('```') &&
          !para.trim().match(/^[-*+]\s/) &&
          !para.trim().match(/^\d+\.\s/) &&
          para.trim().length > 0;

        if (isActualParagraph) {
          paraMeta.push({
            id: `para-${actualParagraphIndex}`, // 使用实际的段落索引
            start,
            end,
            originalText: para,
            cleanText: cleanedPara.trim()
          });
          actualParagraphIndex++; // 只有实际段落才递增计数器
        }
      }
      paraStartIdx += para.length + 1; // +1 for the split '\n'
    });

    // 2. 在每个段落的清理文本中搜索
    paraMeta.forEach((para, paraIndex) => {
      if (para.cleanText.length === 0) return;

      // 转义特殊字符以避免正则表达式错误
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedTerm, 'gi');
      let match;

      while ((match = regex.exec(para.cleanText)) !== null) {
        const matchIdx = match.index;

        // 生成干净的上下文
        const contextStart = Math.max(0, matchIdx - 30);
        const contextEnd = Math.min(para.cleanText.length, matchIdx + term.length + 30);
        const context = para.cleanText.slice(contextStart, contextEnd);

        searchResults.push({
          text: match[0],
          index: para.start + matchIdx, // 保持原始索引用于唯一性
          context: context.trim(),
          paraId: para.id
        });
      }
    });

    setResults(searchResults);
    setIsSearching(false);
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    // 转义特殊字符以避免正则表达式错误
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');

    return text.split(regex).map((part, i) =>
      regex.test(part) ?
        <span key={i} className={styles.highlight}>{part}</span> :
        part
    );
  };

  const handleResultClick = (paraId: string) => {
    // 直接调用父组件的回调函数，让父组件处理跳转逻辑
    onResultClick(paraId);
  };

  return (
    <motion.div
      className={styles.search}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.searchInput}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="搜索文章内容..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.input}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setResults([]);
            }}
            className={styles.clearButton}
          >
            <FiX />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className={styles.results}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.resultCount}>
              找到 {results.length} 个结果
            </div>
            {results.map((result, index) => (
              <motion.div
                key={index}
                className={styles.resultItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleResultClick(result.paraId)}
              >
                <div className={styles.resultContext}>
                  {highlightText(result.context, searchTerm)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isSearching && (
        <div className={styles.searching}>
          <div className={styles.loadingDots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ArticleSearch; 