import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock, FiTag } from 'react-icons/fi';
import Link from 'next/link';
import styles from './Search/Search.module.scss';
import Head from 'next/head';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { Article } from '@/types/Article';
import { useLoading } from '@/hooks/useLoading';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 获取所有文章
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await withLoading(ArticlesAPI.getArticles());
        if (response?.data) {
          const publishedArticles = response.data.filter((article: Article) =>
            article.status === 'published'
          );
          setArticles(publishedArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  // 搜索功能
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const searchResults = articles.filter(article => {
        const searchContent = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase();
        const searchTerms = debouncedSearchQuery.toLowerCase().split(' ');
        return searchTerms.every(term => searchContent.includes(term));
      });
      setFilteredArticles(searchResults);
      setShowResults(true);
    } else {
      setFilteredArticles([]);
      setShowResults(false);
    }
  }, [debouncedSearchQuery, articles]);

  // 清除搜索
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>搜索 - 博客</title>
      </Head>

      <motion.div
        className={styles.searchContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>搜索</h1>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="输入关键词搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="清除搜索"
            >
              <FiX />
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : showResults ? (
          <motion.div
            className={styles.resultsContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className={styles.resultsTitle}>
              搜索结果 ({filteredArticles.length})
            </h2>
            {filteredArticles.length > 0 ? (
              <div className={styles.articlesGrid}>
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    className={styles.articleCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/main/Articles/${article.id}`}>
                      <h3 className={styles.articleTitle}>{article.title}</h3>
                      <p className={styles.articleExcerpt}>
                        {article.excerpt || article.content.slice(0, 150)}...
                      </p>
                      <div className={styles.articleMeta}>
                        <span className={styles.metaItem}>
                          <FiClock className={styles.metaIcon} />
                          {formatDate(article.publishedAt)}
                        </span>
                        {article.tags && article.tags.length > 0 && (
                          <div className={styles.tags}>
                            {article.tags.map(tag => (
                              <span
                                key={tag.id}
                                className={styles.tag}
                                style={{ backgroundColor: `${tag.color}20` }}
                              >
                                <FiTag className={styles.tagIcon} />
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>没有找到相关文章</p>
                <p className={styles.noResultsTip}>试试其他关键词？</p>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Search; 