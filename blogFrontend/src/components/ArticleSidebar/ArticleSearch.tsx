import React from 'react';
import styles from './ArticleSearch.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchResult {
  text: string;
  index: number;
  context: string;
  paraId: string;
}

interface ArticleSearchProps {
  content: string;
  onResultClick: (index: number) => void;
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

    // 1. 将内容按段落分割，记录每个段落的起止索引和 id
    const paragraphs = content.split(/\n+/); // 假设段落用换行分割
    let paraStartIdx = 0;
    const paraMeta: { id: string; start: number; end: number }[] = [];
    paragraphs.forEach((para, idx) => {
      const start = paraStartIdx;
      const end = paraStartIdx + para.length;
      paraMeta.push({ id: `para-${idx}`, start, end });
      paraStartIdx = end + 1; // +1 for the split '\n'
    });

    // 2. 搜索所有匹配项，找到它属于哪个段落
    const regex = new RegExp(term, 'gi');
    let match;
    while ((match = regex.exec(content)) !== null) {
      // 找到属于哪个段落
      const matchIdx = match.index;
      const para = paraMeta.find(p => matchIdx >= p.start && matchIdx < p.end);
      const paraId = para ? para.id : '';
      const contextStart = Math.max(0, matchIdx - 20);
      const contextEnd = Math.min(content.length, matchIdx + term.length + 20);
      const context = content.slice(contextStart, contextEnd);
      searchResults.push({
        text: match[0],
        index: matchIdx,
        context,
        paraId
      });
    }

    setResults(searchResults);
    setIsSearching(false);
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ?
        <span key={i} className={styles.highlight}>{part}</span> :
        part
    );
  };

  const handleResultClick = (paraId: string) => {
    // 直接跳转到段落 id
    const element = document.getElementById(paraId);
    if (element) {
      // 可选：考虑顶部导航栏高度
      const nav = document.querySelector('nav') as HTMLElement;
      const navHeight = nav?.offsetHeight || 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // 高亮逻辑
      element.classList.add('search-highlight');
      setTimeout(() => {
        element.classList.remove('search-highlight');
      }, 2000);
      onResultClick(paraId as any); // 保持回调兼容
    }
  };

  return (
    <motion.div
      className={styles.search}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.searchInput}>
        <FaSearch className={styles.searchIcon} />
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
            <FaTimes />
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