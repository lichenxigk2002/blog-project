import React, { useState, FormEvent, useEffect } from 'react';
import { AuthAPI } from '@/api/AuthAPI';
import type { UserDTO } from '@/api/AuthAPI';
import type { User } from '@/types/auth';
import styles from './UserManagement.module.scss';
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import Button from '../ui/Button/Button';
import Pagination from '../ui/Pagination/Pagination';
import DataTable from '../ui/DataTable/DataTable';
import FormModal from '../ui/FormModal/FormModal';
import SearchBar from '../ui/SearchBar/SearchBar';
import { PlusIcon, EditIcon, DeleteIcon } from '../ui/Icons/Icons';

const UserManagement: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tipModal, setTipModal] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({ open: false, message: '', type: 'success' });

    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setError(null);
            const response = await AuthAPI.getUserList();
            if (response.code === 200) {
                setUsers(response.data);
                setFilteredUsers(response.data);
            } else {
                const errorMsg = response.message || '获取用户列表失败';
                console.error('获取用户列表失败:', errorMsg);
                setError(errorMsg);
            }
        } catch (error: any) {
            console.error('获取用户列表失败:', error);
            setError(error.message || '获取用户列表失败，请检查后端服务是否正常运行');
        }
    };

    // 分页逻辑
    const totalPages = Math.ceil(users.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentUsers = users.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // 重置到第一页
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            setLoading(true);
            const data: UserDTO = {
                username: formData.get('username') as string,
                password: formData.get('password') as string,
                phone: formData.get('phone') as string,
            };

            if (editingUser) {
                await AuthAPI.updateUser(editingUser.id, data);
                setTipModal({ open: true, message: '更新成功', type: 'success' });
            } else {
                await AuthAPI.register(data);
                setTipModal({ open: true, message: '创建成功', type: 'success' });
            }
            setModalVisible(false);
            setEditingUser(null);
            fetchUsers();
        } catch (e: any) {
            console.error('操作失败:', e);
            setTipModal({ open: true, message: e.message || '操作失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await AuthAPI.deleteUser(id);
            setTipModal({ open: true, message: '删除成功', type: 'success' });
            fetchUsers();
        } catch (error: any) {
            setTipModal({ open: true, message: error.message || '删除失败', type: 'failure' });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user?: User) => {
        setEditingUser(user || null);
        setModalVisible(true);
    };

    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
        // 在本地数据中进行搜索过滤
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // 重置到第一页
    };

    const columns = [
        {
            key: 'username',
            title: '用户名',
            sortable: true,
            width: '30%',
            render: (value: any, record: User) => record.username
        },
        {
            key: 'password',
            title: '密码',
            sortable: false,
            width: '25%',
            render: (value: any, record: User) => '******'
        },
        {
            key: 'phone',
            title: '手机号',
            sortable: true,
            width: '25%',
            render: (value: any, record: User) => record.phone || '-'
        }
    ];

    const actions = [
        {
            key: 'edit',
            label: '编辑',
            variant: 'primary' as const,
            icon: <EditIcon />,
            onClick: (record: User) => openModal(record)
        },
        {
            key: 'delete',
            label: '删除',
            variant: 'danger' as const,
            icon: <DeleteIcon />,
            onClick: (record: User) => handleDelete(record.id)
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>用户管理</h1>
                <Button
                    variant="primary"
                    onClick={() => openModal()}
                    icon={<PlusIcon />}
                >
                    新建用户
                </Button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <SearchBar
                placeholder="搜索用户名或手机号..."
                onSearch={handleSearch}
                initialValue={searchText}
            />

            <DataTable
                data={filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                columns={columns}
                actions={actions}
                loading={loading}
                emptyText="暂无用户数据"
            />

            {/* 分页组件 */}
            {filteredUsers.length > 0 && (
                <Pagination
                    total={filteredUsers.length}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            <OperationTipModal
                open={tipModal.open}
                onClose={() => setTipModal({ ...tipModal, open: false })}
                message={tipModal.message}
                type={tipModal.type}
            />

            <FormModal
                open={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingUser(null);
                }}
                title={editingUser ? '编辑用户' : '新增用户'}
                size="medium"
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">用户名</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            defaultValue={editingUser?.username}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">密码</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required={!editingUser}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">手机号</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            defaultValue={editingUser?.phone}
                            pattern="[0-9]{11}"
                            placeholder="请输入11位手机号"
                        />
                    </div>
                    <div className={styles.modalFooter}>
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => {
                                setModalVisible(false);
                                setEditingUser(null);
                            }}
                        >
                            取消
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? (editingUser ? '更新中...' : '创建中...') : (editingUser ? '更新' : '创建')}
                        </Button>
                    </div>
                </form>
            </FormModal>
        </div>
    );
};

export default UserManagement;