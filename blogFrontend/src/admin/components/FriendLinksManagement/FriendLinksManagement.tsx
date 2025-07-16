import React, { useState, useEffect } from 'react';
import { FriendLinksAPI } from '@/api/FriendLinkAPI';
import FriendLinksForm from './FriendLinksForm';
import type { FriendLinks } from '@/types/FriendLinks';
import styles from './FriendLinksManagement.module.scss';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const FriendLinksManagement: React.FC = () => {
  const [friendLinks, setFriendLinks] = useState<FriendLinks[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingFriendLink, setEditingFriendLink] = useState<FriendLinks | null>(null);
  const [deletingFriendLink, setDeletingFriendLink] = useState<FriendLinks | null>(null);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

  useEffect(() => {
    fetchFriendLinks();
  }, []);

  const fetchFriendLinks = async () => {
    setLoading(true);
    try {
      const response = await FriendLinksAPI.getAllFriendLinks();
      if (!response) {
        throw new Error('获取友链列表失败');
      }
      setFriendLinks(response);
    } catch (error: any) {
      console.error('Failed to fetch friend links:', error);
      setTipModal({ open: true, message: (error instanceof Error ? error.message : '获取友链列表失败'), type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (friendLink?: FriendLinks) => {
    setEditingFriendLink(friendLink || null);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        status: values.status || 'pending'
      };

      if (editingFriendLink) {
        await FriendLinksAPI.updateFriendLinks(editingFriendLink.id, data);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        await FriendLinksAPI.addFriendLinks(data);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      fetchFriendLinks();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
    }
  };

  const handleDelete = async () => {
    if (!deletingFriendLink) return;

    try {
      setLoading(true);
      await FriendLinksAPI.deleteFriendLinks(deletingFriendLink.id);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingFriendLink(null);
      await fetchFriendLinks();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (friendLink: FriendLinks) => {
    try {
      const newStatus = friendLink.status === 'approved' ? 'pending' : 'approved';
      await FriendLinksAPI.updateFriendLinks(friendLink.id, { status: newStatus });
      setTipModal({ open: true, message: '状态更新成功', type: 'success' });
      fetchFriendLinks();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '状态更新失败', type: 'failure' });
    }
  };

  const stats = {
    totalLinks: friendLinks.length,
    approvedLinks: friendLinks.filter(link => link.status === 'approved').length,
    pendingLinks: friendLinks.filter(link => link.status === 'pending').length
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>友链管理</h1>
        <button className={styles.primaryButton} onClick={() => openModal()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          添加友链
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>友链总数</div>
          <div className={styles.statValue}>{stats.totalLinks}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>已展示</div>
          <div className={styles.statValue}>{stats.approvedLinks}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>待审核</div>
          <div className={styles.statValue}>{stats.pendingLinks}</div>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {friendLinks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔗</div>
            <div className={styles.emptyText}>暂无友链</div>
            <button className={styles.emptyButton} onClick={() => openModal()}>
              添加第一个友链
            </button>
          </div>
        ) : (
          friendLinks.map((friendLink) => (
            <div key={friendLink.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <img
                    src={friendLink.avatarUrl || '/images/default-avatar.png'}
                    alt={friendLink.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/default-avatar.png';
                    }}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{friendLink.name}</h3>
                  <p className={styles.cardUrl}>{friendLink.url}</p>
                </div>
                <div className={styles.cardActions}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={friendLink.status === 'approved'}
                      onChange={() => handleStatusToggle(friendLink)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFriendLink(friendLink);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.cardContent} onClick={() => openModal(friendLink)}>
                <p className={styles.cardDescription}>{friendLink.description}</p>
                <div className={styles.cardMeta}>
                  <span className={`${styles.status} ${styles[friendLink.status]}`}>
                    {friendLink.status === 'approved' ? '已展示' : '待审核'}
                  </span>
                  <span className={styles.date}>
                    {new Date(friendLink.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑/新增模态框 */}
      {modalVisible && (
        <FriendLinksForm
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleSubmit}
          initialValues={editingFriendLink}
        />
      )}

      {/* 删除确认模态框 */}
      {deleteModalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3>确认删除</h3>
            <p>确定要删除友链 "{deletingFriendLink?.name}" 吗？此操作不可撤销。</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setDeleteModalVisible(false)}
              >
                取消
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDelete}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 操作提示模态框 */}
      <OperationTipModal
        open={tipModal.open}
        message={tipModal.message}
        type={tipModal.type}
        onClose={() => setTipModal({ ...tipModal, open: false })}
      />
    </div>
  );
};

export default FriendLinksManagement; 