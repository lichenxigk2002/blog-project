import React, { useState, useEffect } from 'react';
import { ThoughtsAPI } from '@/api/ThoughtsAPI';
import type { ThoughtsProps } from '@/types/Thoughts';
import styles from './ThoughtsManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import ThoughtsForm from './ThoughtsForm';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon } from '../ui/Icons/Icons';

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

    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
        const filtered = thoughts.filter(thought =>
            thought.content.toLowerCase().includes(searchText.toLowerCase()) ||
            thought.location.toLowerCase().includes(searchText.toLowerCase()) ||
            thought.tags.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredThoughts(filtered);
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

    const columns = [
        {
            key: 'content',
            title: '内容',
            sortable: true,
            width: '35%',
            render: (value: any, record: ThoughtsProps) => (
                <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                }}>
                    {record.content}
                </div>
            )
        },
        {
            key: 'mood',
            title: '心情',
            sortable: true,
            width: '15%',
            render: (value: any, record: ThoughtsProps) => (
                <span className={styles.moodTag}>
                    {moodMap[record.mood] || record.mood}
                </span>
            )
        },
        {
            key: 'location',
            title: '位置',
            sortable: true,
            width: '20%',
            render: (value: any, record: ThoughtsProps) => record.location
        },
        {
            key: 'createdAt',
            title: '创建时间',
            sortable: true,
            width: '20%',
            render: (value: any, record: ThoughtsProps) => new Date(record.createdAt).toLocaleString()
        }
    ];

    const actions = [
        {
            key: 'edit',
            label: '编辑',
            variant: 'primary' as const,
            icon: <EditIcon />,
            onClick: (record: ThoughtsProps) => openModal(record)
        },
        {
            key: 'delete',
            label: '删除',
            variant: 'danger' as const,
            icon: <DeleteIcon />,
            onClick: (record: ThoughtsProps) => {
                setDeletingThought(record);
                setDeleteModalVisible(true);
            }
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>思考管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <PlusIcon />
                    新建思考
                </button>
            </div>

            <StatsCard
                stats={[
                    { title: '思考总数', value: stats.totalThoughts },
                    { title: '开心', value: stats.happyThoughts },
                    { title: '难过', value: stats.sadThoughts },
                    { title: '平静', value: stats.neutralThoughts }
                ]}
            />

            <SearchBar
                placeholder="搜索内容、位置或标签..."
                onSearch={handleSearch}
                initialValue={searchText}
            />

            <DataTable
                data={filteredThoughts.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyText="暂无思考数据"
            />

            <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={total}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />

            <FormModal
                open={modalVisible}
                onClose={() => setModalVisible(false)}
                title={editingThought ? '编辑思考' : '新建思考'}
                size="large"
            >
                <ThoughtsForm
                    initialValues={editingThought || undefined}
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

export default ThoughtsManagement;