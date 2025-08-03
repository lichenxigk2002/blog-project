import React, { useState, useEffect } from 'react';
import { BulletinBoardAPI } from '@/api/BulletinBoardAPI';
import type { BulletinBoardProps } from '@/types/BulletinBoard';
import styles from './BulletinBoardManagement.module.scss';
import Pagination from "@/admin/components/ui/Pagination/Pagination";
import BulletinBoardForm from './BulletinBoardForm';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import StatsCard from '../ui/StatsCard/StatsCard';
import SearchBar from '../ui/SearchBar/SearchBar';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../ui/Icons/Icons';

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
    const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });

    // 分页数据计算
    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setFilteredMessages(messages.slice(start, end));
    }, [currentPage, pageSize, messages]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            // 获取所有数据，不分页
            const response = await BulletinBoardAPI.getMessages(1, 1000); // 获取足够多的数据
            if (response && response.records) {
                setMessages(response.records);
                setTotal(response.records.length); // 使用实际获取的数据长度
            } else {
                console.error('Invalid response format:', response);
                setMessages([]);
                setTotal(0);
                setTipModal({ open: true, message: '获取留言列表失败', type: 'error' });
            }
        } catch (error: any) {
            console.error('Failed to fetch messages:', error);
            setMessages([]);
            setTotal(0);
            setTipModal({ open: true, message: error.message || '获取留言列表失败', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (message?: BulletinBoardProps) => {
        setEditingMessage(message || null);
        setModalVisible(true);
    };

    const handleSubmit = async (values: BulletinBoardProps, action: 'update' | 'reply' | 'create') => {
        try {
            if (action === 'create') {
                await BulletinBoardAPI.createMessage(values);
                setTipModal({ open: true, message: '创建成功', type: 'success' });
            } else if (action === 'update') {
                // 更新留言基本信息
                const updateData = {
                    ...values,
                    id: editingMessage!.id,
                    reply: undefined // 移除回复字段，避免更新时包含
                };
                await BulletinBoardAPI.updateMessage(editingMessage!.id, updateData);
                setTipModal({ open: true, message: '更新成功', type: 'success' });
            } else if (action === 'reply') {
                // 回复留言
                if (!values.reply?.trim()) {
                    setTipModal({ open: true, message: '回复内容不能为空', type: 'error' });
                    return;
                }
                console.log('回复留言，sendEmail:', values.sendEmail); // 调试日志
                await BulletinBoardAPI.replyMessage(
                    editingMessage!.id,
                    values.reply,
                    !!values.sendEmail
                );
                setTipModal({ open: true, message: '回复成功', type: 'success' });
            }
            setModalVisible(false);
            fetchMessages();
        } catch (e: any) {
            console.error('操作失败:', e);
            setTipModal({ open: true, message: e.message || '操作失败', type: 'error' });
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
            setTipModal({ open: true, message: error.message || '删除失败', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
        setCurrentPage(1); // 重置到第一页

        if (!searchText.trim()) {
            // 如果搜索文本为空，重新获取所有数据
            fetchMessages();
            return;
        }

        // 在本地数据中进行搜索过滤，但不修改原始messages
        const filtered = messages.filter(message =>
            message.name.toLowerCase().includes(searchText.toLowerCase()) ||
            message.email.toLowerCase().includes(searchText.toLowerCase()) ||
            message.content.toLowerCase().includes(searchText.toLowerCase())
        );
        // 直接设置过滤后的数据到messages，这样分页计算会基于过滤后的数据
        setMessages(filtered);
        setTotal(filtered.length);
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
            setTipModal({ open: true, message: error.message || '状态更新失败', type: 'error' });
        }
    };

    // const handleReply = async (id: number, reply: string) => {
    //     try {
    //         await BulletinBoardAPI.replyMessage(
    //             editingMessage.id,
    //             values.reply || '',
    //             !!values.sendEmail // 保证是布尔值
    //         );
    //         setTipModal({ open: true, message: '回复成功', type: 'success' });
    //         fetchMessages();
    //     } catch (error: any) {
    //         setTipModal({ open: true, message: error.message || '回复失败', type: 'failure' });
    //     }
    // };

    const stats = {
        totalMessages: messages?.length || 0,
        pendingMessages: messages?.filter(m => m.status === 'pending').length || 0,
        approvedMessages: messages?.filter(m => m.status === 'approved').length || 0,
        rejectedMessages: messages?.filter(m => m.status === 'rejected').length || 0,
    };

    const columns = [
        {
            key: 'name',
            title: '姓名',
            sortable: true,
            width: '15%',
            render: (value: any, record: BulletinBoardProps) => record.name
        },
        {
            key: 'email',
            title: '邮箱',
            sortable: true,
            width: '20%',
            render: (value: any, record: BulletinBoardProps) => record.email
        },
        {
            key: 'gender',
            title: '性别',
            sortable: true,
            width: '10%',
            render: (value: any, record: BulletinBoardProps) => record.gender
        },
        {
            key: 'status',
            title: '状态',
            sortable: true,
            width: '15%',
            render: (value: any, record: BulletinBoardProps) => (
                <span
                    className={`${styles.statusTag} ${styles[record.status || 'pending']}`}
                >
                    {statusMap[record.status || 'pending'].label}
                </span>
            )
        },
        {
            key: 'content',
            title: '内容',
            sortable: false,
            width: '30%',
            render: (value: any, record: BulletinBoardProps) => record.content
        }
    ];

    const actions = [
        {
            key: 'edit',
            label: '编辑',
            variant: 'primary' as const,
            icon: <EditIcon />,
            onClick: (record: BulletinBoardProps) => openModal(record)
        },
        {
            key: 'delete',
            label: '删除',
            variant: 'danger' as const,
            icon: <DeleteIcon />,
            onClick: (record: BulletinBoardProps) => {
                setDeletingMessage(record);
                setDeleteModalVisible(true);
            }
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>留言板管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <PlusIcon />
                    新建留言
                </button>
            </div>

            <StatsCard
                stats={[
                    { title: '留言总数', value: stats.totalMessages },
                    { title: '待审核', value: stats.pendingMessages },
                    { title: '已通过', value: stats.approvedMessages },
                    { title: '已拒绝', value: stats.rejectedMessages }
                ]}
            />

            <SearchBar
                placeholder="搜索留言内容..."
                onSearch={handleSearch}
                initialValue={searchText}
            />

            <DataTable
                data={filteredMessages}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyText="暂无留言数据"
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
                title={editingMessage ? '编辑留言' : '新增留言'}
                size="large"
            >
                <BulletinBoardForm
                    initialValues={editingMessage || undefined}
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
                    <p>确定要删除这条留言吗？此操作不可恢复。</p>
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
                            setDeletingMessage(null);
                        }}
                    >
                        取消
                    </button>
                </div>
            </FormModal>

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