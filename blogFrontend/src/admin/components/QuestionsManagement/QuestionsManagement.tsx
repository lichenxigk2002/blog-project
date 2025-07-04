import React, { useState, useEffect } from 'react';
import { QuestionsAPI } from '@/api/QuestionsAPI';
import type { Question } from '@/types/Question';
import type { QuestionsFormData } from './QuestionsForm';
import styles from './QuestionsManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import QuestionsForm from './QuestionsForm';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';

const difficultyMap: Record<string, { label: string; color: string }> = {
    easy: { label: '简单', color: '#4CAF50' },
    medium: { label: '中等', color: '#FFC107' },
    hard: { label: '困难', color: '#F44336' },
};

const QuestionsManagement: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

    useEffect(() => {
        fetchQuestions();
    }, [currentPage, pageSize]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await QuestionsAPI.getQuestions({
                page: currentPage,
                size: pageSize,
                search: searchText,
                difficulty: undefined
            });

            if (response && response.data) {
                const { records } = response.data;
                if (Array.isArray(records)) {
                    setQuestions(records);
                    setFilteredQuestions(records);
                    setTotal(response.data.total || 0);
                } else {
                    setQuestions([]);
                    setFilteredQuestions([]);
                    setTotal(0);
                }
            } else {
                setQuestions([]);
                setFilteredQuestions([]);
                setTotal(0);
            }
        } catch (error: any) {
            setQuestions([]);
            setFilteredQuestions([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (question?: Question) => {
        setEditingQuestion(question || null);
        setModalVisible(true);
    };

    const handleSubmit = async (values: QuestionsFormData) => {
        try {
            setLoading(true);
            if (editingQuestion) {
                const updateData = {
                    ...values,
                    views: editingQuestion.views || 0,
                    likes: editingQuestion.likes || 0
                };
                const response = await QuestionsAPI.updateQuestion(editingQuestion.id, updateData);
                if (response.data) {
                    setTipModal({ open: true, message: '更新成功', type: 'success' });
                    setModalVisible(false);
                    fetchQuestions();
                } else {
                    throw new Error('更新失败');
                }
            } else {
                const createData = {
                    ...values,
                    views: 0,
                    likes: 0
                };
                const response = await QuestionsAPI.createQuestion(createData);
                if (response.data) {
                    setTipModal({ open: true, message: '创建成功', type: 'success' });
                    setModalVisible(false);
                    fetchQuestions();
                } else {
                    throw new Error('创建失败');
                }
            }
        } catch (e: any) {
            setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingQuestion) return;

        try {
            setLoading(true);
            await QuestionsAPI.deleteQuestion(deletingQuestion.id);
            setTipModal({ open: true, message: '删除成功', type: 'success' });
            setDeleteModalVisible(false);
            setDeletingQuestion(null);
            await fetchQuestions();
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchQuestions();
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }

        const sortedQuestions = [...filteredQuestions].sort((a: any, b: any) => {
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

        setFilteredQuestions(sortedQuestions);
    };

    const stats = {
        totalQuestions: questions?.length || 0,
        easyQuestions: questions?.filter(q => q.difficulty === 'easy').length || 0,
        mediumQuestions: questions?.filter(q => q.difficulty === 'medium').length || 0,
        hardQuestions: questions?.filter(q => q.difficulty === 'hard').length || 0,
    };

    const handleEdit = (question: Question) => {
        setEditingQuestion(question);
        setModalVisible(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>面试题管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    新建面试题
                </button>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>面试题总数</div>
                    <div className={styles.statValue}>{stats.totalQuestions}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>简单</div>
                    <div className={styles.statValue}>{stats.easyQuestions}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>中等</div>
                    <div className={styles.statValue}>{stats.mediumQuestions}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>困难</div>
                    <div className={styles.statValue}>{stats.hardQuestions}</div>
                </div>
            </div>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜索标题或内容..."
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
                        onClick={() => handleSort('title')}
                    >
                        标题
                        {sortField === 'title' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('difficulty')}
                    >
                        难度
                        {sortField === 'difficulty' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('views')}
                    >
                        浏览量
                        {sortField === 'views' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`${styles.tableHeaderCell} ${styles.sortable}`}
                        onClick={() => handleSort('likes')}
                    >
                        点赞数
                        {sortField === 'likes' && (
                            <span className={styles.sortIcon}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </div>
                    <div className={styles.tableHeaderCell}>操作</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredQuestions.map((question) => (
                        <div key={question.id} className={styles.tableRow}>
                            <div className={styles.tableCell}>{question.title}</div>
                            <div className={styles.tableCell}>
                                <span
                                    className={styles.difficultyTag}
                                    style={{ backgroundColor: difficultyMap[question.difficulty].color }}
                                >
                                    {difficultyMap[question.difficulty].label}
                                </span>
                            </div>
                            <div className={styles.tableCell}>{question.views}</div>
                            <div className={styles.tableCell}>{question.likes}</div>
                            <div className={styles.tableCell}>
                                <div className={styles.actionButtons}>
                                    <button
                                        className={styles.primaryButton}
                                        onClick={() => handleEdit(question)}
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
                                            setDeletingQuestion(question);
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
                                {editingQuestion ? '编辑面试题' : '新增面试题'}
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setModalVisible(false)}
                            >
                                ×
                            </button>
                        </div>
                        <QuestionsForm
                            initialValues={editingQuestion ? {
                                title: editingQuestion.title,
                                content: editingQuestion.content,
                                difficulty: editingQuestion.difficulty as 'easy' | 'medium' | 'hard',
                                status: editingQuestion.status as 'draft' | 'published'
                            } : undefined}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}

            {deleteModalVisible && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>确认删除</h2>
                        <p>确定要删除面试题 "{deletingQuestion?.title}" 吗？此操作不可恢复。</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.dangerButton}
                                onClick={handleDelete}
                            >
                                确认删除
                            </button>
                            <button
                                className={styles.secondaryButton}
                                onClick={() => {
                                    setDeleteModalVisible(false);
                                    setDeletingQuestion(null);
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

export default QuestionsManagement;