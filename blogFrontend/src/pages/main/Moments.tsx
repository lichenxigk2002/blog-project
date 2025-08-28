import React, { useState, useEffect, useRef } from 'react';
import styles from './Moments/Moments.module.scss';
import Head from "next/head";
import PageHeader from '../../components/PageHeader/PageHeader';
import { RssAPI } from '../../api/RssAPI';
import { RssArticle } from '../../types/RssArticle';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OperationTipModal from '../../components/OperationTipModal/OperationTipModal';
import { cleanHtmlTagsWithLimit } from '../../utils/htmlUtils';

const Moments: React.FC = () => {
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [randomArticle, setRandomArticle] = useState<RssArticle | null>(null);
  const [showFishingModal, setShowFishingModal] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpUrl, setJumpUrl] = useState<string>('');
  const [jumpCountdown, setJumpCountdown] = useState(3);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [newArticlesCount, setNewArticlesCount] = useState(0); // 新增文章数量
  const pageSize = 20;

  useEffect(() => {
    fetchRssArticles(1, true);
    fetchTotalCount();

    // 清理定时器
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // 监听新增文章数量变化，在动画完成后重置
  useEffect(() => {
    if (newArticlesCount > 0) {
      const timer = setTimeout(() => {
        setNewArticlesCount(0);
      }, 1000); // 等待动画完成

      return () => clearTimeout(timer);
    }
  }, [newArticlesCount]);

  const fetchTotalCount = async () => {
    try {
      const response = await RssAPI.getRssArticlesCount();
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error('获取文章总数失败:', err);
    }
  };

  const fetchRssArticles = async (page: number, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await RssAPI.getRssArticles({ page, size: pageSize });

      console.log(`第${page}页RSS数据:`, data.slice(0, 5)); // 调试：显示前5条数据

      // 确保所有文章都有有效的发布时间，然后按发布时间排序
      const validArticles = data.filter(article => {
        const date = new Date(article.pubDate);
        return !isNaN(date.getTime()) && date.getTime() > 0;
      });

      // 按发布时间排序，最新的在前面
      const sortedData = validArticles.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA; // 降序：最新的在前面
      });

      if (isInitial) {
        setArticles(sortedData);
        // 随机选择一篇文章用于钓鱼
        if (sortedData.length > 0) {
          const randomIndex = Math.floor(Math.random() * sortedData.length);
          setRandomArticle(sortedData[randomIndex]);
        }
        setNewArticlesCount(0);
      } else {
        // 追加新数据
        setArticles(prev => [...prev, ...sortedData]);
        setNewArticlesCount(sortedData.length);
      }

      // 判断是否还有更多数据
      setHasMore(sortedData.length === pageSize);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError('获取RSS文章失败');
      console.error('获取RSS文章失败:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchRssArticles(currentPage + 1, false);
    }
  };

  const handleRandomClick = () => {
    if (articles.length > 0) {
      const randomIndex = Math.floor(Math.random() * articles.length);
      setRandomArticle(articles[randomIndex]);
      console.log('随机选择文章:', articles[randomIndex]); // 调试：显示随机选择的文章
    }
  };

  const handleArticleClick = (link: string) => {
    window.open(link, '_blank');
  };

  const handleJumpWithDelay = (url: string) => {
    // 清理之前的定时器
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    setJumpUrl(url);
    setJumpCountdown(3);
    setShowJumpModal(true);

    // 3秒倒计时
    countdownTimerRef.current = setInterval(() => {
      setJumpCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          setShowJumpModal(false);
          window.open(url, '_blank');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCloseJumpModal = () => {
    // 停止倒计时
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setShowJumpModal(false);
    setJumpCountdown(3);
  };

  return (
    <>
      <Head>
        <title>朋友圈 | 来自友链的最新动态</title>
        <meta name="description" content="关注友链的最新动态，发现更多精彩内容" />
      </Head>

      <div className={styles.container}>
        <PageHeader
          headerText="朋友圈"
          introText="关注友链的最新动态，发现更多精彩内容。在这里，你可以看到来自各个友链的最新文章和分享，让我们一起探索更广阔的知识世界。"
          englishTitle="Moments"
        />

        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <h2>❌ 钓鱼失败</h2>
            <p>{error}</p>
            <button onClick={() => fetchRssArticles(1, true)} className={styles.retryButton}>
              🔄 重新尝试
            </button>
          </div>
        ) : (
          <>

            {/* 三栏布局：标题区域 */}
            <div className={styles.headerSection}>
              <div className={styles.headerLeft}>
                <h2>全部文章</h2>
              </div>
              <div className={styles.headerCenter}>
                <p>来自友链的最新动态 ({totalCount > 0 ? totalCount : articles.length} 篇)</p>
              </div>
              <div className={styles.headerRight}>
                <div
                  className={styles.fishingButton}
                  onClick={() => {
                    if (articles.length > 0) {
                      const randomIndex = Math.floor(Math.random() * articles.length);
                      setRandomArticle(articles[randomIndex]);
                      setShowFishingModal(true);
                    }
                  }}
                >
                  🎣
                </div>
              </div>
            </div>

            {/* 钓鱼弹窗 */}
            {showFishingModal && randomArticle && (
              <div className={styles.fishingModal} onClick={() => setShowFishingModal(false)}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>🎣 钓到一条鱼！</h3>
                    <button
                      className={styles.closeButton}
                      onClick={() => setShowFishingModal(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className={styles.articlePreview}>
                    <div className={styles.sourceInfo}>
                      <img
                        src={randomArticle.sourceAvatarUrl || '/images/default-avatar.png'}
                        alt={randomArticle.sourceName}
                        className={styles.sourceAvatar}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-avatar.png';
                        }}
                      />
                      <div>
                        <h4
                          className={styles.sourceName}
                          onClick={() => {
                            handleJumpWithDelay(randomArticle.sourceUrl);
                            setShowFishingModal(false);
                          }}
                        >
                          {randomArticle.sourceName}
                        </h4>
                        <span>{new Date(randomArticle.pubDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h5
                      className={styles.articleTitle}
                      onClick={() => {
                        handleJumpWithDelay(randomArticle.link);
                        setShowFishingModal(false);
                      }}
                    >
                      {randomArticle.title}
                    </h5>

                    <p className={styles.articleDescription}>
                      {cleanHtmlTagsWithLimit(randomArticle.description, 200)}
                    </p>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      className={styles.sourceButton}
                      onClick={() => {
                        handleJumpWithDelay(randomArticle.sourceUrl);
                        setShowFishingModal(false);
                      }}
                    >
                      访问主页
                    </button>
                    <button
                      className={styles.articleButton}
                      onClick={() => {
                        handleJumpWithDelay(randomArticle.link);
                        setShowFishingModal(false);
                      }}
                    >
                      阅读文章
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 跳转提示模态框 */}
            <OperationTipModal
              open={showJumpModal}
              onClose={handleCloseJumpModal}
              message={`即将跳转，${jumpCountdown}...`}
              type="info"
              icon="/images/loading.png"
              autoClose={false}
              showCloseButton={true}
              iconSize={128}
            />

            {/* 文章网格 */}
            <div className={styles.articlesGrid}>
              {articles.map((article, index) => {
                // 判断是否为新增的文章（用于加载更多时的动画）
                const isNewArticle = index >= articles.length - newArticlesCount && newArticlesCount > 0;

                return (
                  <div
                    key={`${article.sourceName}-${index}`}
                    className={`${styles.articleCard} ${isNewArticle ? styles.articleCardNew : ''}`}
                    onClick={() => handleJumpWithDelay(article.link)}
                    style={{
                      '--bg-avatar': `url(${article.sourceAvatarUrl || '/images/default-avatar.png'})`
                    } as React.CSSProperties}
                  >
                    <div className={styles.cardHeader}>
                      <img
                        src={article.sourceAvatarUrl || '/images/default-avatar.png'}
                        alt={article.sourceName}
                        className={styles.sourceAvatar}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-avatar.png';
                        }}
                      />
                      <div className={styles.sourceInfo}>
                        <h3>{article.sourceName}</h3>
                        <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h4 className={styles.articleTitle}>{article.title}</h4>
                    <p className={styles.articleDescription}>
                      {cleanHtmlTagsWithLimit(article.description, 150)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 加载更多按钮 */}
            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  className={styles.loadMoreButton}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? '加载中...' : '加载更多'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Moments; 