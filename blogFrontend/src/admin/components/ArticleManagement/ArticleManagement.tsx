import React, { useState, useEffect } from 'react';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';
import ArticleForm from './ArticleForm';
import type { Article } from '@/types/Article';
import styles from './ArticleManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import { buildArticleData } from "@/utils/articleUtils";
import Button from '../ui/Button/Button';


const ArticleManagement: React.FC = () => {
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]); // 存储当前页评论
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]); // 存储过滤后的标签
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedArticles(filteredArticles.slice(start, end) as Article[]);
  }, [currentPage, pageSize, allArticles]);

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, [currentPage, pageSize]);

  const fetchArticles = async (title = '') => {
    setLoading(true);
    try {
      const response = await ArticlesAPI.getArticles();
      if (!response || 'error' in response) {
        throw new Error(typeof response?.error === 'string' ? response.error : '获取文章列表失败');
      }
      const data = response.data as unknown as Article[];
      setAllArticles(data);
      setFilteredArticles(data);
      setTotal(data.length);
    } catch (error: any) {
      console.error('Failed to fetch articles:', error);
      setTipModal({ open: true, message: (error instanceof Error ? error.message : '获取文章列表失败'), type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await TagsAPI.getTags();
      setAllTags(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setAllTags([]);
    }
  };

  const openModal = (article?: Article) => {
    setEditingArticle(article || null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = buildArticleData(values, editingArticle);

      if (editingArticle) {
        data.id = editingArticle.id;
        await ArticlesAPI.updateArticle(editingArticle.id, data);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        await ArticlesAPI.createArticle(data);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      fetchArticles();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
    }
  };

  const handleDelete = async () => {
    if (!deletingArticle) return;

    try {
      setLoading(true);
      await ArticlesAPI.deleteArticle(deletingArticle.id);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingArticle(null);
      await fetchArticles();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalArticles: allArticles.length,
    publishedArticles: allArticles.filter(a => a.status === 'published').length,
    totalViews: allArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0),
    totalLikes: allArticles.reduce((sum, article) => sum + (article.likeCount || 0), 0)
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchArticles(searchText);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }

    const sortedArticles = [...filteredArticles].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue === null || bValue === null) {
        return aValue === null ? -1 : 1;
      }

      return sortOrder === 'asc'
        ? (aValue || 0) - (bValue || 0)
        : (bValue || 0) - (aValue || 0);
    });

    setFilteredArticles(sortedArticles);
    setAllArticles(sortedArticles);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>文章管理</h1>
        <Button variant="primary" onClick={() => openModal()} icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        }>新建文章</Button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>文章总数</div>
          <div className={styles.statValue}>{stats.totalArticles}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>已发布</div>
          <div className={styles.statValue}>{stats.publishedArticles}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>总浏览量</div>
          <div className={styles.statValue}>{stats.totalViews}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>总点赞数</div>
          <div className={styles.statValue}>{stats.totalLikes}</div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="搜索文章标题..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button
          variant="search"
          onClick={handleSearch}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          }
        >搜索</Button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('title')}
          >
            文章标题
            {sortField === 'title' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('publishedAt')}
          >
            发布时间
            {sortField === 'publishedAt' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('status')}
          >
            状态
            {sortField === 'status' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('readingTime')}
          >
            阅读时长
            {sortField === 'readingTime' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('viewCount')}
          >
            浏览量
            {sortField === 'viewCount' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div
            className={`${styles.tableHeaderCell} ${styles.sortable}`}
            onClick={() => handleSort('likeCount')}
          >
            点赞数
            {sortField === 'likeCount' && (
              <span className={styles.sortIcon}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className={styles.tableHeaderCell}>操作</div>
        </div>
        <div className={styles.tableBody}>
          {paginatedArticles.map((article) => (
            <div key={article.id} className={styles.tableRow}>
              <div className={styles.tableCell} style={{ fontWeight: 500 }}>{article.title}</div>
              <div className={styles.tableCell}>
                {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : '-'}
              </div>
              <div className={styles.tableCell}>
                <span className={`${styles.statusTag} ${article.status === 'published'
                  ? styles.published
                  : article.status === 'archived'
                    ? styles.archived
                    : styles.draft
                  }`}>
                  {article.status === 'published'
                    ? '已发布'
                    : article.status === 'archived'
                      ? '已归档'
                      : '草稿'}
                </span>
              </div>
              <div className={styles.tableCell}>{article.readingTime} 分钟</div>
              <div className={styles.tableCell}>{article.viewCount}</div>
              <div className={styles.tableCell}>{article.likeCount}</div>
              <div className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  <Button
                    variant="primary"
                    onClick={() => openModal(article)}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    }
                  >编辑</Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeletingArticle(article);
                      setDeleteModalVisible(true);
                    }}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    }
                  >删除</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        total={total}
        currentPage={currentPage || 1}
        pageSize={pageSize || 10}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {modalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingArticle ? '编辑文章' : '新建文章'}
              </h2>
              <button
                className={styles.modalClose}
                onClick={() => setModalVisible(false)}
              >
                ×
              </button>
            </div>
            <ArticleForm
              allTags={allTags}
              initialValues={editingArticle ? {
                ...editingArticle,
                status: editingArticle.status as 'draft' | 'published',
                postType: editingArticle.postType as 'post' | 'page',
                tags: editingArticle.tags?.map(tag => tag.id) || []
              } : undefined}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

      {deleteModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>确认删除</h2>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteModalVisible(false)}
              >
                ×
              </button>
            </div>
            <p>确定要删除文章 "{deletingArticle?.title}" 吗？此操作不可恢复。</p>
            <div className={styles.modalFooter}>
              <Button
                className={styles.button}
                onClick={() => setDeleteModalVisible(false)}
              >取消</Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />
    </div>
  );
};

export default ArticleManagement; 