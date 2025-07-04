import React, { useState, useEffect } from 'react';
import { CommentsAPI } from "@/api/CommentsAPI";
import { Comment } from '@/types/Comment'
import styles from './CommentManagement.module.scss'
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const CommentManagement: React.FC = () => {
    // 状态管理
    const [allComments, setAllComments] = useState<Comment[]>([]); // 存储所有评论
    const [paginatedComments, setPaginatedComments] = useState<Comment[]>([]); // 存储当前页评论
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

    // 当页码或每页条数改变时，重新计算当前页数据
    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setPaginatedComments(allComments.slice(start, end));
    }, [currentPage, pageSize, allComments]);

    // 初始加载数据
    useEffect(() => {
        fetchComments();
    }, []);

    // 获取评论数据
    const fetchComments = async (articleId = '') => {
        setLoading(true);
        try {
            const response = await CommentsAPI.getAllComments();
            let data = response as Comment[];

            // 如果有文章ID筛选，进行筛选
            if (articleId) {
                data = data.filter((item: Comment) =>
                    item.content.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.username.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.articleTitle.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            // 保存所有评论数据
            setAllComments(data);
            setTotal(data.length);

            // 计算并设置当前页数据
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            setPaginatedComments(data.slice(start, end));
        } finally {
            setLoading(false);
        }
    };

    // 删除评论
    const handleDelete = async () => {
        if (!deletingComment) return;
        try {
            setLoading(true);
            const response = await CommentsAPI.deleteComment(deletingComment.id);
            if (typeof response === 'string' || 'message' in response) {
                setTipModal({ open: true, message: '删除成功', type: 'success' });
                setDeleteModalVisible(false);
                setDeletingComment(null);
                await fetchComments(); // 重新获取所有数据
            } else if ('error' in response) {
                setTipModal({ open: true, message: response.error || '删除失败', type: 'failure' });
            }
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    // 搜索处理
    const handleSearch = () => {
        setCurrentPage(1); // 重置到第一页
        fetchComments(searchText);
    };

    // 排序处理
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }

        // 对所有评论数据进行排序
        const sortedComments = [...allComments].sort((a: any, b: any) => {
            const aValue = a[field];
            const bValue = b[field];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (field === 'createdAt') {
                return sortOrder === 'asc'
                    ? new Date(aValue).getTime() - new Date(bValue).getTime()
                    : new Date(bValue).getTime() - new Date(aValue).getTime();
            }

            return sortOrder === 'asc'
                ? aValue - bValue
                : bValue - aValue;
        });

        // 更新所有评论数据
        setAllComments(sortedComments);
    };

    // 计算统计信息 - 使用所有评论数据
    const stats = {
        totalComments: allComments.length,
        todayComments: allComments.filter(c => {
            const today = new Date();
            const commentDate = new Date(c.createdAt);
            return commentDate.toDateString() === today.toDateString();
        }).length,
        totalArticles: new Set(allComments.map(c => c.articleId)).size,
        totalUsers: new Set(allComments.map(c => c.userId)).size
    };

    // 处理评论展开/收起
    const toggleComment = (commentId: string, content: string) => {
        // 检查内容是否只有一行
        const isSingleLine = content.split('\n').length === 1 && content.length < 50;
        if (isSingleLine) return;

        setExpandedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>评论管理</h1>
            </div>

            {/* 统计信息 */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>评论总数</div>
                    <div className={styles.statValue}>{stats.totalComments}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>今日评论</div>
                    <div className={styles.statValue}>{stats.todayComments}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>涉及文章</div>
                    <div className={styles.statValue}>{stats.totalArticles}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>评论用户</div>
                    <div className={styles.statValue}>{stats.totalUsers}</div>
                </div>
            </div>

            {/* 搜索栏 */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜索评论..."
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

            {/* 表格 */}
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('articleTitle')}
                    >
                        文章标题
                        {sortField === 'articleTitle' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div className={styles.tableHeaderCell}>评论内容</div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('username')}
                    >
                        评论用户
                        {sortField === 'username' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('createdAt')}
                    >
                        评论时间
                        {sortField === 'createdAt' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div className={styles.tableHeaderCell}>操作</div>
                </div>
                <div className={styles.tableBody}>
                    {loading ? (
                        <div className={styles.loading}>加载中...</div>
                    ) : paginatedComments.length === 0 ? (
                        <div className={styles.empty}>暂无评论</div>
                    ) : (
                        paginatedComments.map((item) => (
                            <div key={item.id} className={styles.tableRow}>
                                <div className={styles.tableCell}>{item.articleTitle}</div>
                                <div
                                    className={`${styles.tableCell} ${expandedComments.has(item.id) ? styles.expanded : ''}`}
                                    onClick={() => toggleComment(item.id, item.content)}
                                >
                                    {item.content}
                                </div>
                                <div className={styles.tableCell}>{item.username}</div>
                                <div className={styles.tableCell}>
                                    {new Date(item.createdAt).toLocaleString()}
                                </div>
                                <div className={styles.tableCell}>
                                    <button
                                        className={styles.dangerButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingComment(item);
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
                        ))
                    )}
                </div>
            </div>

            {/* 分页 */}
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

            {/* 删除确认弹窗 */}
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
                        <p>确定要删除这条评论吗？此操作不可恢复。</p>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.button}
                                onClick={() => setDeleteModalVisible(false)}
                            >
                                取消
                            </button>
                            <button
                                className={styles.dangerButton}
                                onClick={handleDelete}
                            >
                                确认删除
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

            {/* 加载状态 */}
            {loading && (
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner} />
                </div>
            )}
        </div>
    );
};

export default CommentManagement;