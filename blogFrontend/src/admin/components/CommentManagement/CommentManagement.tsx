import React, { useState, useEffect } from 'react';
import { CommentsAPI } from "@/api/CommentsAPI";
import { Comment } from '@/types/Comment'
import styles from './CommentManagement.module.scss'
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { SearchIcon, DeleteIcon } from '../ui/Icons/Icons';

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
    const handleSearch = (searchText: string) => {
        setCurrentPage(1); // 重置到第一页
        setSearchText(searchText);
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

    const columns = [
        {
            key: 'articleTitle',
            title: '文章标题',
            sortable: true,
            width: '20%',
            render: (value: any, record: Comment) => record.articleTitle
        },
        {
            key: 'content',
            title: '评论内容',
            sortable: false,
            width: '35%',
            render: (value: any, record: Comment) => (
                <div
                    className={`${expandedComments.has(record.id) ? styles.expanded : ''}`}
                    onClick={() => toggleComment(record.id, record.content)}
                    style={{ cursor: 'pointer' }}
                >
                    {record.content}
                </div>
            )
        },
        {
            key: 'username',
            title: '评论用户',
            sortable: true,
            width: '15%',
            render: (value: any, record: Comment) => record.username
        },
        {
            key: 'createdAt',
            title: '评论时间',
            sortable: true,
            width: '20%',
            render: (value: any, record: Comment) => (
                <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    minWidth: 'fit-content'
                }}>
                    {new Date(record.createdAt).toLocaleString()}
                </div>
            )
        }
    ];

    const actions = [
        {
            key: 'delete',
            label: '删除',
            variant: 'danger' as const,
            icon: <DeleteIcon />,
            onClick: (record: Comment) => {
                setDeletingComment(record);
                setDeleteModalVisible(true);
            }
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>评论管理</h1>
            </div>

            <StatsCard stats={[
                { title: '评论总数', value: stats.totalComments.toString() },
                { title: '今日评论', value: stats.todayComments.toString() },
                { title: '涉及文章', value: stats.totalArticles.toString() },
                { title: '评论用户', value: stats.totalUsers.toString() }
            ]} />

            <SearchBar
                placeholder="搜索评论..."
                onSearch={handleSearch}
                initialValue={searchText}
            />

            <DataTable
                data={paginatedComments}
                columns={columns}
                actions={actions}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                loading={loading}
                emptyText="暂无评论"
            />

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

            <FormModal
                open={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                title="确认删除"
                size="small"
            >
                <p>确定要删除这条评论吗？此操作不可恢复。</p>
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