import React, { useState, useEffect } from 'react';
import { QuestionsAPI } from '@/api/QuestionsAPI';
import type { Question } from '@/types/Question';
import type { QuestionsFormData } from './QuestionsForm';
import styles from './QuestionsManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import QuestionsForm from './QuestionsForm';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../ui/Icons/Icons';

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

    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
        // 在本地数据中进行搜索过滤
        const filtered = questions.filter(question =>
            question.title.toLowerCase().includes(searchText.toLowerCase()) ||
            question.content.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredQuestions(filtered);
        setTotal(filtered.length);
        setCurrentPage(1); // 重置到第一页
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

    const columns = [
        {
            key: 'title',
            title: '标题',
            sortable: true,
            width: '35%',
            render: (value: any, record: Question) => (
                <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                }}>
                    {record.title}
                </div>
            )
        },
        {
            key: 'difficulty',
            title: '难度',
            sortable: true,
            width: '15%',
            render: (value: any, record: Question) => (
                <span
                    className={styles.difficultyTag}
                    style={{ backgroundColor: difficultyMap[record.difficulty].color }}
                >
                    {difficultyMap[record.difficulty].label}
                </span>
            )
        },
        {
            key: 'views',
            title: '浏览量',
            sortable: true,
            width: '15%',
            render: (value: any, record: Question) => record.views
        },
        {
            key: 'likes',
            title: '点赞数',
            sortable: true,
            width: '15%',
            render: (value: any, record: Question) => record.likes
        }
    ];

    const actions = [
        {
            key: 'edit',
            label: '编辑',
            variant: 'primary' as const,
            icon: <EditIcon />,
            onClick: (record: Question) => openModal(record)
        },
        {
            key: 'delete',
            label: '删除',
            variant: 'danger' as const,
            icon: <DeleteIcon />,
            onClick: (record: Question) => {
                setDeletingQuestion(record);
                setDeleteModalVisible(true);
            }
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>面试题管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <PlusIcon />
                    新建面试题
                </button>
            </div>

            <StatsCard
                stats={[
                    { title: '面试题总数', value: stats.totalQuestions },
                    { title: '简单', value: stats.easyQuestions },
                    { title: '中等', value: stats.mediumQuestions },
                    { title: '困难', value: stats.hardQuestions }
                ]}
            />

            <SearchBar
                placeholder="搜索标题或内容..."
                onSearch={handleSearch}
                initialValue={searchText}
            />

            <DataTable
                data={filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyText="暂无面试题数据"
            />

            <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={filteredQuestions.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />

            <FormModal
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                title={editingQuestion ? '编辑面试题' : '新增面试题'}
                size="large"
            >
                <QuestionsForm
                    initialValues={editingQuestion ? {
                        title: editingQuestion.title,
                        content: editingQuestion.content,
                        difficulty: editingQuestion.difficulty as 'easy' | 'medium' | 'hard',
                        status: editingQuestion.status as 'draft' | 'published'
                    } : undefined}
                    onSubmit={handleSubmit}
                />
            </FormModal>

            <FormModal
                open={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                title="确认删除"
                size="small"
            >
                <div className={styles.modalBody}>
                    <p>确定要删除面试题 "{deletingQuestion?.title}" 吗？此操作不可恢复。</p>
                </div>
                <div className={styles.modalFooter}>
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
                            setDeletingQuestion(null);
                        }}
                    >
                        取消
                    </button>
                </div>
            </FormModal>

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