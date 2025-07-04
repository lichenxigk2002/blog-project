import React, { useState, useEffect } from 'react';
import { ThoughtsAPI } from '@/api/ThoughtsAPI';
import type { ThoughtsProps } from '@/types/Thoughts';
import styles from './ThoughtsManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import ThoughtsForm from './ThoughtsForm';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const moodMap: Record<string, string> = {
    happy: '😄',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    excited: '🤩',
    tired: '😪',
};

const ThoughtsManagement: React.FC = () => {
    const [thoughts, setThoughts] = useState<ThoughtsProps[]>([]);
    const [filteredThoughts, setFilteredThoughts] = useState<ThoughtsProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editingThought, setEditingThought] = useState<ThoughtsProps | null>(null);
    const [deletingThought, setDeletingThought] = useState<ThoughtsProps | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

    useEffect(() => {
        fetchThoughts();
    }, [currentPage, pageSize]);

    const fetchThoughts = async () => {
        setLoading(true);
        try {
            const response = await ThoughtsAPI.getAllThoughts();
            if (!response) {
                throw new Error('获取思考列表失败');
            }
            setThoughts(response);
            setFilteredThoughts(response);
            setTotal(response.length);
        } catch (error: any) {
            console.error('Failed to fetch thoughts:', error);
            setTipModal({ open: true, message: error.message || '获取思考列表失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (thought?: ThoughtsProps) => {
        setEditingThought(thought || null);
        setModalVisible(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingThought) {
                await ThoughtsAPI.updateThought({ ...values, id: editingThought.id });
                setTipModal({ open: true, message: '更新成功', type: 'success' });
            } else {
                await ThoughtsAPI.createThought(values);
                setTipModal({ open: true, message: '创建成功', type: 'success' });
            }
            setModalVisible(false);
            fetchThoughts();
        } catch (e: any) {
            console.error('操作失败:', e);
            setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
        }
    };

    const handleDelete = async () => {
        if (!deletingThought) return;

        try {
            setLoading(true);
            await ThoughtsAPI.deleteThought(deletingThought.id);
            setTipModal({ open: true, message: '删除成功', type: 'success' });
            setDeleteModalVisible(false);
            setDeletingThought(null);
            await fetchThoughts();
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = thoughts.filter(thought =>
            thought.content.toLowerCase().includes(searchText.toLowerCase()) ||
            thought.location.toLowerCase().includes(searchText.toLowerCase()) ||
            thought.tags.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredThoughts(filtered);
        setTotal(filtered.length);
        setCurrentPage(1);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }

        const sortedThoughts = [...filteredThoughts].sort((a: any, b: any) => {
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

        setFilteredThoughts(sortedThoughts);
    };

    const stats = {
        totalThoughts: thoughts.length,
        happyThoughts: thoughts.filter(t => t.mood === 'happy').length,
        sadThoughts: thoughts.filter(t => t.mood === 'sad').length,
        neutralThoughts: thoughts.filter(t => t.mood === 'neutral').length,
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>思考管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    新建思考
                </button>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>思考总数</div>
                    <div className={styles.statValue}>{stats.totalThoughts}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>开心</div>
                    <div className={styles.statValue}>{stats.happyThoughts}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>难过</div>
                    <div className={styles.statValue}>{stats.sadThoughts}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>平静</div>
                    <div className={styles.statValue}>{stats.neutralThoughts}</div>
                </div>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜索内容、位置或标签..."
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
                        onClick={() => handleSort('content')}
                    >
                        内容
                        {sortField === 'content' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('mood')}
                    >
                        心情
                        {sortField === 'mood' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('location')}
                    >
                        位置
                        {sortField === 'location' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('createdAt')}
                    >
                        创建时间
                        {sortField === 'createdAt' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div className={styles.tableHeaderCell}>操作</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredThoughts
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((thought) => (
                            <div key={thought.id} className={styles.tableRow}>
                                <div className={styles.tableCell}>{thought.content}</div>
                                <div className={styles.tableCell}>
                                    <span className={styles.moodTag}>
                                        {moodMap[thought.mood] || thought.mood}
                                    </span>
                                </div>
                                <div className={styles.tableCell}>{thought.location}</div>
                                <div className={styles.tableCell}>
                                    {new Date(thought.createdAt).toLocaleString()}
                                </div>
                                <div className={styles.tableCell}>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => openModal(thought)}
                                        >
                                            编辑
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => {
                                                setDeletingThought(thought);
                                                setDeleteModalVisible(true);
                                            }}
                                        >
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
                                {editingThought ? '编辑思考' : '新建思考'}
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setModalVisible(false)}
                            >
                                ×
                            </button>
                        </div>
                        <ThoughtsForm
                            initialValues={editingThought || undefined}
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
                        <div className={styles.modalBody}>
                            <p>确定要删除这条思考吗？此操作不可恢复。</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setDeleteModalVisible(false)}
                            >
                                取消
                            </button>
                            <button
                                className={styles.dangerButton}
                                onClick={handleDelete}
                            >
                                删除
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

export default ThoughtsManagement;