import React, { useState, useEffect } from 'react';
import { BulletinBoardAPI } from '@/api/BulletinBoardAPI';
import type { BulletinBoardProps } from '@/types/BulletinBoard';
import styles from './BulletinBoardManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import BulletinBoardForm from './BulletinBoardForm';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '待审核', color: '#FFC107' },
    approved: { label: '已通过', color: '#4CAF50' },
    rejected: { label: '已拒绝', color: '#F44336' },
};

const BulletinBoardManagement: React.FC = () => {
    const [messages, setMessages] = useState<BulletinBoardProps[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<BulletinBoardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editingMessage, setEditingMessage] = useState<BulletinBoardProps | null>(null);
    const [deletingMessage, setDeletingMessage] = useState<BulletinBoardProps | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

    useEffect(() => {
        fetchMessages();
    }, [currentPage, pageSize]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await BulletinBoardAPI.getMessages(currentPage, pageSize);
            if (response && response.records) {
                setMessages(response.records);
                setFilteredMessages(response.records);
                setTotal(response.total);
            } else {
                console.error('Invalid response format:', response);
                setMessages([]);
                setFilteredMessages([]);
                setTotal(0);
                setTipModal({ open: true, message: '获取留言列表失败', type: 'failure' });
            }
        } catch (error: any) {
            console.error('Failed to fetch messages:', error);
            setMessages([]);
            setFilteredMessages([]);
            setTotal(0);
            setTipModal({ open: true, message: error.message || '获取留言列表失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (message?: BulletinBoardProps) => {
        setEditingMessage(message || null);
        setModalVisible(true);
    };

    const handleSubmit = async (values: BulletinBoardProps) => {
        try {
            if (editingMessage) {
                await BulletinBoardAPI.updateMessage(editingMessage.id, values);
                setTipModal({ open: true, message: '更新成功', type: 'success' });
            } else {
                await BulletinBoardAPI.createMessage(values);
                setTipModal({ open: true, message: '创建成功', type: 'success' });
            }
            setModalVisible(false);
            fetchMessages();
        } catch (e: any) {
            console.error('操作失败:', e);
            setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
        }
    };

    const handleDelete = async () => {
        if (!deletingMessage) return;

        try {
            setLoading(true);
            await BulletinBoardAPI.deleteMessage(deletingMessage.id);
            setTipModal({ open: true, message: '删除成功', type: 'success' });
            setDeleteModalVisible(false);
            setDeletingMessage(null);
            await fetchMessages();
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchMessages();
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }

        const sortedMessages = [...filteredMessages].sort((a: any, b: any) => {
            const aValue = a[field];
            const bValue = b[field];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortOrder === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        });

        setFilteredMessages(sortedMessages);
    };

    const handleStatusChange = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
        try {
            await BulletinBoardAPI.updateStatus(id, status);
            setTipModal({ open: true, message: '状态更新成功', type: 'success' });
            fetchMessages();
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '状态更新失败', type: 'failure' });
        }
    };

    const handleReply = async (id: number, reply: string) => {
        try {
            await BulletinBoardAPI.replyMessage(id, reply);
            setTipModal({ open: true, message: '回复成功', type: 'success' });
            fetchMessages();
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '回复失败', type: 'failure' });
        }
    };

    const stats = {
        totalMessages: messages?.length || 0,
        pendingMessages: messages?.filter(m => m.status === 'pending').length || 0,
        approvedMessages: messages?.filter(m => m.status === 'approved').length || 0,
        rejectedMessages: messages?.filter(m => m.status === 'rejected').length || 0,
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>留言板管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    新建留言
                </button>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>留言总数</div>
                    <div className={styles.statValue}>{stats.totalMessages}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>待审核</div>
                    <div className={styles.statValue}>{stats.pendingMessages}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>已通过</div>
                    <div className={styles.statValue}>{stats.approvedMessages}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>已拒绝</div>
                    <div className={styles.statValue}>{stats.rejectedMessages}</div>
                </div>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜索留言内容..."
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
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('name')}
                    >
                        姓名
                        {sortField === 'name' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('email')}
                    >
                        邮箱
                        {sortField === 'email' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('gender')}
                    >
                        性别
                        {sortField === 'gender' && (
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
                    <div className={styles.tableHeaderCell}>内容</div>
                    <div className={styles.tableHeaderCell}>操作</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredMessages.map((message) => (
                        <div key={message.id} className={styles.tableRow}>
                            <div className={styles.tableCell}>{message.name}</div>
                            <div className={styles.tableCell}>{message.email}</div>
                            <div className={styles.tableCell}>{message.gender}</div>
                            <div className={styles.tableCell}>
                                <span
                                    className={`${styles.statusTag} ${styles[message.status || 'pending']}`}
                                >
                                    {statusMap[message.status || 'pending'].label}
                                </span>
                            </div>
                            <div className={styles.tableCell}>{message.content}</div>
                            <div className={styles.tableCell}>
                                <div className={styles.actionButtons}>
                                    <button
                                        className={styles.primaryButton}
                                        onClick={() => openModal(message)}
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
                                            setDeletingMessage(message);
                                            setDeleteModalVisible(true);
                                        }}
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
                    ))}
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={total}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />

            {modalVisible && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingMessage ? '编辑留言' : '新增留言'}
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setModalVisible(false)}
                            >
                                ×
                            </button>
                        </div>
                        <BulletinBoardForm
                            initialValues={editingMessage || undefined}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}

            {deleteModalVisible && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>确认删除</h2>
                        <p>确定要删除这条留言吗？此操作不可恢复。</p>
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
                                    setDeletingMessage(null);
                                }}
                            >
                                取消
                            </button>
                        </div>
                    </div>
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

export default BulletinBoardManagement;