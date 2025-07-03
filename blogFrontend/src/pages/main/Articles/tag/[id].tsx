import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './TagArticles.module.scss';
import { Article } from '@/types/Article';
import { TagsAPI } from '@/api/TagsAPI';
import Head from "next/head";
import {FaArrowLeft} from "react-icons/fa";

export default function TagArticles() {
  const router = useRouter();
  const { id } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string>('');

  const routerBack = useRouter();

  useEffect(() => {

    if (!id || Array.isArray(id) || isNaN(Number(id))) return;

    const fetchArticlesByTag = async () => {
      try {
        if (!id) return;

        setLoading(true);
        setError(null);

        // 使用 TagsAPI 获取标签信息
        const {name} = await TagsAPI.getTagById(Number(id));
        setTagName(name);

        // 使用 TagsAPI 获取该标签下的文章
        const articlesData = await TagsAPI.getArticlesByTagId(Number(id));
        setArticles(articlesData);
      } catch (err) {
        console.error('获取数据错误:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchArticlesByTag();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingDots}>
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
        </div>
        <div className={styles.loadingText}>正在加载文章...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <a onClick={() => routerBack.back()}
           className={styles.backLink}
        >
          <FaArrowLeft style={{ color: "var(--text)" }} />
          返回
        </a>
      </div>
    );
  }

  return (
    <div className={styles.articleList}>
      <Head>
        <title>标签:{tagName}</title>
      </Head>
      <div className={styles.articleHeader}>
        <h1 className={styles.articleTitle}>{tagName}</h1>
      </div>

      {articles.length === 0 ? (
        <div className={styles.empty}>
          <p>该标签下暂无文章</p>
          <a onClick={() => routerBack.back()}
             className={styles.backLink}
          >
            <FaArrowLeft style={{ color: "var(--text)" }} />
            返回
          </a>
        </div>
      ) : (
        <div className={styles.articlesGrid}>
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/main/Articles/${article.id}`}
              className={styles.articleCard}
            >
              <h2 className={styles.articleCardTitle}>{article.title}</h2>
              <p className={styles.articleCardExcerpt}>
                {article.excerpt || article.content.substring(0, 100) + '...'}
              </p>
              <div className={styles.articleCardMeta}>
                <span className={styles.date}>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <span className={styles.readingTime}>
                  {article.readingTime} 分钟阅读
                </span>
              </div>
            </Link>
          ))}
          <a onClick={() => routerBack.back()}
             className={styles.backLink}
          >
            <FaArrowLeft style={{ color: "var(--text)" }} />
            返回
          </a>
        </div>

      )}
    </div>
  );
} 