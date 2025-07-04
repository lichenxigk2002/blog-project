import React, { useState, useEffect } from 'react';
import { GalleryAPI } from '@/api/GalleryAPI';
import type { Gallery } from '@/types/Gallery';
import GalleryForm from './GalleryForm';
import styles from './GalleryManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const GalleryManagement: React.FC = () => {
  const [allGalleries, setAllGalleries] = useState<Gallery[]>([]);
  const [paginatedGalleries, setPaginatedGalleries] = useState<Gallery[]>([]); // 存储当前页评论
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]); // 存储过滤后的标签
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [deletingGallery, setDeletingGallery] = useState<Gallery | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setPaginatedGalleries(filteredGalleries.slice(start, end));
  }, [currentPage, pageSize, allGalleries]);

  useEffect(() => {
    fetchGalleries();
  }, [currentPage, pageSize]);

  const fetchGalleries = async (title = '') => {
    setLoading(true);
    try {
      const response = await GalleryAPI.getGalleries();
      let data = response;
      if (title) {
        data = data.filter((item: Gallery) => item.title.includes(title));
      }
      setAllGalleries(data)
      setTotal(data.length);
      setFilteredGalleries(data)
    } catch (error) {
      console.error('获取相册列表失败:', error);
      setTipModal({ open: true, message: '获取相册列表失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (gallery?: Gallery) => {
    setEditingGallery(gallery || null);
    setModalVisible(true);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingGallery) {
        await GalleryAPI.updateGallery(editingGallery.id, formData);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        await GalleryAPI.addGallery(formData);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      fetchGalleries();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
    }
  };

  const handleDelete = async () => {
    if (!deletingGallery) return;

    try {
      setLoading(true);
      await GalleryAPI.deleteGallery(deletingGallery.id);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingGallery(null);
      await fetchGalleries();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchGalleries(searchText);
  };

  const stats = {
    totalGalleries: allGalleries.length,
    totalCategories: new Set(allGalleries.map(g => g.category)).size,
    mostRecentGallery: allGalleries[0]?.title || '-'
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>相册管理</h1>
        <button className={styles.primaryButton} onClick={() => openModal()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          新建相册
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>相册总数</div>
          <div className={styles.statValue}>{stats.totalGalleries}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>分类总数</div>
          <div className={styles.statValue}>{stats.totalCategories}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>最新相册</div>
          <div className={styles.statValue}>{stats.mostRecentGallery}</div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="搜索相册标题..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button
          className={styles.searchButton}
          onClick={handleSearch}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          搜索
        </button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>封面</div>
          <div className={styles.tableHeaderCell}>标题</div>
          <div className={styles.tableHeaderCell}>描述</div>
          <div className={styles.tableHeaderCell}>分类</div>
          <div className={styles.tableHeaderCell}>创建时间</div>
          <div className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>操作</div>
        </div>
        <div className={styles.tableBody}>
          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : allGalleries.length === 0 ? (
            <div className={styles.empty}>暂无数据</div>
          ) : (
            paginatedGalleries.map((gallery) => (
              <div key={gallery.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  {gallery.coverImage ? (
                    <img
                      key={gallery.id}
                      src={gallery.coverImage}
                      alt={gallery.title}
                      className={styles.coverImage}
                      onError={(e) => {
                        console.error('图片加载失败:', {
                          originalPath: gallery.coverImage,
                          error: e
                        });
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/default-image.jpg') {
                          target.src = '/default-image.jpg';
                        }
                      }}
                    />
                  ) : (
                    <img
                      src="/default-image.jpg"
                      alt="默认封面"
                      className={styles.coverImage}
                    />
                  )}
                </div>
                <div className={styles.tableCell}>{gallery.title}</div>
                <div className={styles.tableCell}>{gallery.description}</div>
                <div className={styles.tableCell}>
                  <span className={styles.categoryTag}>
                    {gallery.category}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  {new Date(gallery.date).toLocaleDateString()}
                </div>
                <div className={styles.tableCell} style={{ justifyContent: 'flex-end' }}>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.primaryButton}
                      onClick={() => openModal(gallery)}
                      style={{ padding: '4px 8px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      编辑
                    </button>
                    <button
                      className={styles.dangerButton}
                      onClick={() => {
                        setDeletingGallery(gallery);
                        setDeleteModalVisible(true);
                      }}
                      style={{ padding: '4px 8px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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

      {/* 新建/编辑相册的模态框 */}
      {modalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingGallery ? '编辑相册' : '新增相册'}
              </h2>
              <button
                className={styles.modalClose}
                onClick={() => setModalVisible(false)}
              >
                ×
              </button>
            </div>
            <GalleryForm
              initialData={editingGallery || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setModalVisible(false)}
            />
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {deleteModalVisible && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>确认删除</h2>
            <p>确定要删除相册 "{deletingGallery?.title}" 吗？此操作不可恢复。</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.dangerButton}
                onClick={handleDelete}
              >
                确认删除
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  setDeleteModalVisible(false);
                  setDeletingGallery(null);
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 操作提示弹窗 */}
      <OperationTipModal
        open={tipModal.open}
        onClose={() => setTipModal({ ...tipModal, open: false })}
        message={tipModal.message}
        type={tipModal.type}
      />
    </div>
  );
};

export default GalleryManagement; 