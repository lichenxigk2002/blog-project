import React, { useState, useEffect } from 'react';
import { TagsAPI } from '@/api/TagsAPI';
import type { Tag } from '@/types/Tags';
import TagArticlesModal from './TagArticlesModal';
import styles from './TagManagement.module.scss';
import TagForm from './TagForm';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';


const TagManagement: React.FC = () => {

  const [paginatedTags, setPaginatedTags] = useState<Tag[]>([]); // 存储当前页评论
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]); // 存储过滤后的标签
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [articlesModalVisible, setArticlesModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedTags(filteredTags.slice(start, end));
  }, [currentPage, pageSize, allTags]);

  useEffect(() => {
    fetchTags();
  }, []);
  const fetchTags = async (name = '') => {
    setLoading(true);
    try {
      const response = await TagsAPI.getTagsWithCount();
      let data = response as Tag[];
      if (name) {
        data = data.filter(tag =>
          tag.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      setAllTags(data);
      setFilteredTags(data); // 初始化过滤后的标签
      setTotal(data.length);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (tag?: Tag) => {
    setEditingTag(tag || null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const tagData = {
        name: values.name,
        color: values.color,
        slug: values.slug || values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      if (editingTag) {
        await TagsAPI.updateTag(editingTag.id, tagData);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        await TagsAPI.createTag(tagData);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      fetchTags();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
    }
  };

  const handleDelete = async () => {
    if (!deletingTag) return;

    try {
      setLoading(true);
      await TagsAPI.deleteTag(deletingTag.id);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingTag(null);
      await fetchTags();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticles = async (tag: Tag) => {
    setSelectedTag(tag);
    setArticlesModalVisible(true);
    setArticlesLoading(true);
    try {
      const response = await TagsAPI.getArticlesByTagId(tag.id);
      setArticles(response as any[]);
    } catch (error: any) {
      alert('获取文章列表失败：' + error.message);
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // 重置到第一页
    fetchTags(searchText)
  };

  const stats = {
    totalTags: allTags.length,
    totalUsage: allTags.reduce((sum, tag) => sum + (tag.count || 0), 0),
    mostUsedTag: allTags.reduce((max, tag) => (tag.count || 0) > (max.count || 0) ? tag : max, allTags[0])
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>标签管理</h1>
        <Button variant="primary" onClick={() => openModal()} icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        }>新建标签</Button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>标签总数</div>
          <div className={styles.statValue}>{stats.totalTags}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>标签使用总次数</div>
          <div className={styles.statValue}>{stats.totalUsage}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>最常用标签</div>
          <div className={styles.statValue}>
            {stats.mostUsedTag?.name || '-'}
            {stats.mostUsedTag && (
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: stats.mostUsedTag.color,
                borderRadius: '50%',
                marginLeft: '8px'
              }} />
            )}
          </div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="搜索标签名称..."
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
          <div className={styles.tableHeaderCell}>标签名称</div>
          <div className={styles.tableHeaderCell}>别名</div>
          <div className={styles.tableHeaderCell}>颜色</div>
          <div className={styles.tableHeaderCell}>使用次数</div>
          <div className={styles.tableHeaderCell}>操作</div>
        </div>
        <div className={styles.tableBody}>
          {paginatedTags.map((tag) => (
            <div key={tag.id} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <span
                  className={styles.statusTag}
                  style={{
                    backgroundColor: tag.color + '20',
                    borderColor: tag.color,
                    color: tag.color,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewArticles(tag)}
                >
                  {tag.name}
                </span>
              </div>
              <div className={styles.tableCell}>{tag.slug}</div>
              <div className={styles.tableCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: tag.color,
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9'
                  }} />
                  <span>{tag.color}</span>
                </div>
              </div>
              <div className={styles.tableCell}>{tag.count || 0}</div>
              <div className={styles.tableCell} >
                <div className={styles.actionButtons}>
                  <Button
                    variant="primary"
                    size="medium"
                    style={{ padding: '4px 8px' }}
                    onClick={() => openModal(tag)}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    }
                  >编辑</Button>
                  <Button
                    variant="danger"
                    size="medium"
                    style={{ padding: '4px 8px' }}
                    onClick={() => {
                      setDeletingTag(tag);
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
        currentPage={currentPage}
        pageSize={pageSize}
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
                {editingTag ? '编辑标签' : '新建标签'}
              </h2>
              <button
                className={styles.modalClose}
                onClick={() => setModalVisible(false)}
              >
                ×
              </button>
            </div>
            <TagForm
              initialValues={editingTag ? {
                name: editingTag.name,
                slug: editingTag.slug,
                color: editingTag.color
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setModalVisible(false)}
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
            <p>确定要删除标签 "{deletingTag?.name}" 吗？此操作不可恢复。</p>
            {deletingTag?.count && deletingTag.count > 0 && (
              <p style={{ color: '#ff4d4f', marginTop: '8px' }}>
                警告：该标签正在被 {deletingTag.count} 篇文章使用，删除后这些文章将失去此标签！
              </p>
            )}
            <div className={styles.modalFooter}>
              <Button
                onClick={() => setDeleteModalVisible(false)}
                className={styles.button}
              >取消</Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >确认删除</Button>
            </div>
          </div>
        </div>
      )}

      <TagArticlesModal
        visible={articlesModalVisible}
        tag={selectedTag}
        articles={articles}
        loading={articlesLoading}
        onClose={() => {
          setArticlesModalVisible(false);
          setSelectedTag(null);
          setArticles([]);
        }}
      />

      {/* 操作提示弹窗 */}
      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      )}
    </div>
  );
};

export default TagManagement; 