import React, { useState, useEffect } from 'react';
import { FriendLinksAPI } from '@/api/FriendLinkAPI';
import FriendLinksForm from './FriendLinksForm';
import type { FriendLinks } from '@/types/FriendLinks';
import styles from './FriendLinksManagement.module.scss';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import StatsCard from '../ui/StatsCard/StatsCard';
import FormModal from '../ui/FormModal/FormModal';
import Switch from '../ui/Switch/Switch';
import Button from '../ui/Button/Button';
import { PlusIcon, DeleteIcon, EditIcon } from '../ui/Icons/Icons';

const FriendLinksManagement: React.FC = () => {
  const [friendLinks, setFriendLinks] = useState<FriendLinks[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingFriendLink, setEditingFriendLink] = useState<FriendLinks | null>(null);
  const [deletingFriendLink, setDeletingFriendLink] = useState<FriendLinks | null>(null);
  const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });

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
      setTipModal({ open: true, message: (error instanceof Error ? error.message : '获取友链列表失败'), type: 'error' });
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
      setTipModal({ open: true, message: e.message || '操作失败', type: 'error' });
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
      setTipModal({ open: true, message: error.message || '删除失败', type: 'error' });
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
      setTipModal({ open: true, message: error.message || '状态更新失败', type: 'error' });
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
        <Button variant="primary" onClick={() => openModal()}>
          <PlusIcon />
          添加友链
        </Button>
      </div>

      <StatsCard
        stats={[
          { title: '友链总数', value: stats.totalLinks },
          { title: '已展示', value: stats.approvedLinks },
          { title: '待审核', value: stats.pendingLinks }
        ]}
      />

      <div className={styles.cardsContainer}>
        {friendLinks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔗</div>
            <div className={styles.emptyText}>暂无友链</div>
            <Button variant="primary" onClick={() => openModal()}>
              添加第一个友链
            </Button>
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
                  <Switch
                    checked={friendLink.status === 'approved'}
                    onChange={() => handleStatusToggle(friendLink)}
                    size="small"
                  />
                  <Button
                    variant="danger"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingFriendLink(friendLink);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
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
      <FormModal
        open={modalVisible}
        title={editingFriendLink ? '编辑友链' : '添加友链'}
        onClose={() => setModalVisible(false)}
        size="medium"
      >
        <FriendLinksForm
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleSubmit}
          initialValues={editingFriendLink}
        />
      </FormModal>

      {/* 删除确认模态框 */}
      <FormModal
        open={deleteModalVisible}
        title="确认删除"
        onClose={() => setDeleteModalVisible(false)}
        size="small"
      >
        <div className={styles.deleteModalContent}>
          <p>确定要删除友链 "{deletingFriendLink?.name}" 吗？此操作不可撤销。</p>
          <div className={styles.modalActions}>
            <Button
              variant="default"
              onClick={() => setDeleteModalVisible(false)}
            >
              取消
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              删除
            </Button>
          </div>
        </div>
      </FormModal>

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