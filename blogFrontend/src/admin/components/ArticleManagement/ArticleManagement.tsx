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
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../ui/Icons/Icons';


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

      // 根据搜索关键词过滤文章
      const filteredData = title
        ? data.filter(article =>
          article.title.toLowerCase().includes(title.toLowerCase())
        )
        : data;

      setAllArticles(data);
      setFilteredArticles(filteredData);
      setTotal(filteredData.length);
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

  const stats = [
    { title: '文章总数', value: allArticles.length },
    { title: '已发布', value: allArticles.filter(a => a.status === 'published').length },
    { title: '总浏览量', value: allArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0) },
    { title: '总点赞数', value: allArticles.reduce((sum, article) => sum + (article.likeCount || 0), 0) }
  ];



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
        <Button variant="primary" onClick={() => openModal()} icon={<PlusIcon />}>新建文章</Button>
      </div>

      <StatsCard stats={stats} />

      <SearchBar
        placeholder="搜索文章标题..."
        onSearch={(searchText) => {
          setCurrentPage(1);
          fetchArticles(searchText);
        }}
      />

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
                    icon={<EditIcon />}
                  >编辑</Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeletingArticle(article);
                      setDeleteModalVisible(true);
                    }}
                    icon={<DeleteIcon />}
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

      <FormModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingArticle ? '编辑文章' : '新建文章'}
        size="large"
      >
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
      </FormModal>

      <FormModal
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="确认删除"
        size="small"
      >
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
      </FormModal>

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