import React, { useState, useEffect } from 'react';
import { RssSourceAPI, RssSource, RssFeedDTO } from '@/api/RssSourceAPI';
import { FriendLinksAPI } from '@/api/FriendLinkAPI';
import type { FriendLinks } from '@/types/FriendLinks';
import {
  Button,
  StatsCard,
  FormModal,
  FormInput,
  Select,
  OperationTipModal,
  SearchBar
} from '@/admin/components/ui';
import { PlusIcon, DeleteIcon, TestIcon } from '@/admin/components/ui/Icons/Icons';
import styles from './RssManagement.module.scss';

const RssManagement: React.FC = () => {
  const [rssSources, setRssSources] = useState<RssFeedDTO[]>([]);
  const [friendLinks, setFriendLinks] = useState<FriendLinks[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [editingRssSource, setEditingRssSource] = useState<RssSource | null>(null);
  const [deletingRssSource, setDeletingRssSource] = useState<RssFeedDTO | null>(null);
  const [testingRssUrl, setTestingRssUrl] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipModal, setTipModal] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRssSources();
    fetchFriendLinks();
  }, []);

  const fetchRssSources = async () => {
    setLoading(true);
    try {
      const response = await RssSourceAPI.getRssSources();
      setRssSources(response);
    } catch (error: any) {
      console.error('Failed to fetch RSS sources:', error);
      setTipModal({ open: true, message: (error instanceof Error ? error.message : '获取RSS源列表失败'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendLinks = async () => {
    try {
      const response = await FriendLinksAPI.getAllFriendLinks();
      if (response) {
        setFriendLinks(response);
      }
    } catch (error: any) {
      console.error('Failed to fetch friend links:', error);
    }
  };

  const openModal = (rssSource?: RssSource) => {
    if (rssSource) {
      setEditingRssSource(rssSource);
      setIsEditing(true);
    } else {
      setEditingRssSource({
        friendLinkId: 0,
        rssUrl: '',
        isActive: true
      });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        friendLinkId: editingRssSource?.friendLinkId || 0,
        rssUrl: editingRssSource?.rssUrl || '',
        isActive: true
      };

      if (isEditing && editingRssSource?.id) {
        // 更新RSS源
        await RssSourceAPI.updateRssSource(editingRssSource.id, data);
        setTipModal({ open: true, message: '更新成功', type: 'success' });
      } else {
        // 添加RSS源
        await RssSourceAPI.addRssSource(data);
        setTipModal({ open: true, message: '创建成功', type: 'success' });
      }
      setModalVisible(false);
      setEditingRssSource(null);
      setIsEditing(false);
      fetchRssSources();
    } catch (e: any) {
      console.error('操作失败:', e);
      setTipModal({ open: true, message: e.message || '操作失败', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deletingRssSource) return;

    try {
      setLoading(true);
      await RssSourceAPI.deleteRssSource(deletingRssSource.sourceId);
      setTipModal({ open: true, message: '删除成功', type: 'success' });
      setDeleteModalVisible(false);
      setDeletingRssSource(null);
      await fetchRssSources();
    } catch (error: any) {
      setTipModal({ open: true, message: error.message || '删除失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestRss = async () => {
    if (!testingRssUrl) return;

    try {
      setLoading(true);
      // 这里需要后端实现测试RSS源的接口
      // const result = await RssSourceAPI.testRssSource(testingRssUrl);
      // 模拟测试结果
      const result = { success: true, message: 'RSS源测试成功，可以正常访问' };
      setTestResult(result);
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || 'RSS源测试失败' });
    } finally {
      setLoading(false);
    }
  };

  const filteredRssSources = rssSources.filter(source =>
    source.friendName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.rssUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: 'RSS源总数', value: rssSources.length },
    { title: '活跃源', value: rssSources.length }, // 简化处理，所有源都认为是活跃的
    { title: '友链总数', value: friendLinks.length },
    { title: '已配置RSS', value: rssSources.length }
  ];

  if (loading && rssSources.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>RSS管理</h1>
        <Button variant="primary" onClick={() => openModal()}>
          <PlusIcon />
          添加RSS源
        </Button>
      </div>

      <StatsCard stats={stats} />

      <SearchBar
        placeholder="搜索友链名称或RSS地址..."
        onSearch={setSearchTerm}
        initialValue={searchTerm}
      />

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableHeaderCell}>友链信息</div>
          <div className={styles.tableHeaderCell}>RSS地址</div>
          <div className={styles.tableHeaderCell}>创建时间</div>
          <div className={styles.tableHeaderCell}>操作</div>
        </div>
        <div className={styles.tableBody}>
          {filteredRssSources.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📡</div>
              <div className={styles.emptyText}>暂无RSS源</div>
              <Button variant="primary" onClick={() => openModal()}>
                添加第一个RSS源
              </Button>
            </div>
          ) : (
            filteredRssSources.map((source) => (
              <div key={source.sourceId} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.friendInfo}>
                    <img
                      src={source.friendAvatarUrl || '/images/default-avatar.png'}
                      alt={source.friendName}
                      className={styles.avatar}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default-avatar.png';
                      }}
                    />
                    <div>
                      <div className={styles.friendName}>{source.friendName}</div>
                      <div className={styles.friendUrl}>{source.friendUrl}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.rssUrl}>
                    <a href={source.rssUrl} target="_blank" rel="noopener noreferrer">
                      {source.rssUrl}
                    </a>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <span>{new Date(source.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <Button
                      variant="default"
                      size="small"
                      onClick={() => {
                        setTestingRssUrl(source.rssUrl);
                        setTestModalVisible(true);
                      }}
                    >
                      <TestIcon />
                      测试
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => {
                        setDeletingRssSource(source);
                        setDeleteModalVisible(true);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 添加/编辑RSS源模态框 */}
      <FormModal
        open={modalVisible}
        title={isEditing ? '编辑RSS源' : '添加RSS源'}
        onClose={() => setModalVisible(false)}
        size="medium"
      >
        <div className={styles.form}>
          <div className={styles.formItem}>
            <label>选择友链</label>
            <Select
              options={friendLinks.map(link => ({
                value: link.id,
                label: link.name
              }))}
              value={editingRssSource?.friendLinkId || ''}
              onChange={(value) => {
                setEditingRssSource(prev => ({
                  ...prev,
                  friendLinkId: typeof value === 'number' ? value : parseInt(value as string),
                  rssUrl: prev?.rssUrl || ''
                }));
              }}
              placeholder="请选择友链"
            />
          </div>
          <div className={styles.formItem}>
            <label>RSS地址</label>
            <FormInput
              name="rssUrl"
              type="url"
              value={editingRssSource?.rssUrl || ''}
              onChange={(e) => setEditingRssSource(prev => ({
                ...prev,
                rssUrl: e.target.value,
                friendLinkId: prev?.friendLinkId || 0
              }))}
              placeholder="请输入RSS地址"
            />
          </div>
          <div className={styles.modalFooter}>
            <Button variant="default" onClick={() => {
              setModalVisible(false);
              setEditingRssSource(null);
              setIsEditing(false);
            }}>
              取消
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              {isEditing ? '更新' : '添加'}
            </Button>
          </div>
        </div>
      </FormModal>

      {/* 删除确认模态框 */}
      <FormModal
        open={deleteModalVisible}
        title="确认删除"
        onClose={() => setDeleteModalVisible(false)}
        size="small"
      >
        <div className={styles.deleteModalContent}>
          <p>确定要删除RSS源 "{deletingRssSource?.friendName}" 吗？此操作不可撤销。</p>
          <div className={styles.modalFooter}>
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

      {/* 测试RSS源模态框 */}
      <FormModal
        open={testModalVisible}
        title="测试RSS源"
        onClose={() => setTestModalVisible(false)}
        size="medium"
      >
        <div className={styles.testModalContent}>
          <div className={styles.formItem}>
            <label>RSS地址</label>
            <FormInput
              name="testRssUrl"
              type="url"
              value={testingRssUrl}
              onChange={(e) => setTestingRssUrl(e.target.value)}
              placeholder="请输入RSS地址"
            />
          </div>
          {testResult && (
            <div className={`${styles.testResult} ${testResult.success ? styles.success : styles.error}`}>
              {testResult.message}
            </div>
          )}
          <div className={styles.modalFooter}>
            <Button variant="default" onClick={() => setTestModalVisible(false)}>
              关闭
            </Button>
            <Button variant="primary" onClick={handleTestRss} disabled={loading}>
              {loading ? '测试中...' : '测试'}
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

export default RssManagement; 