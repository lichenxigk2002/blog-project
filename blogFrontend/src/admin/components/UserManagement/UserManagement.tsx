import React, { useState, FormEvent, useEffect } from 'react';
import { AuthAPI } from '@/api/AuthAPI';
import type { User, UserDTO } from '@/api/AuthAPI';
import styles from './UserManagement.module.scss';

const UserManagement: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setError(null);
            const response = await AuthAPI.getUserList();
            if (response.code === 200) {
                setUsers(response.data);
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
                alert('更新成功');
            } else {
                await AuthAPI.register(data);
                alert('创建成功');
            }
            setModalVisible(false);
            setEditingUser(null);
            fetchUsers();
        } catch (e: any) {
            console.error('操作失败:', e);
            alert(e.message || '操作失败');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定要删除这个用户吗？')) return;
        try {
            setLoading(true);
            await AuthAPI.deleteUser(id);
            alert('删除成功');
            fetchUsers();
        } catch (error: any) {
            alert(error.message || '删除失败');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user?: User) => {
        setEditingUser(user || null);
        setModalVisible(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>用户管理</h1>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    新建用户
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderCell}>用户名</div>
                    <div className={styles.tableHeaderCell}>密码</div>
                    <div className={styles.tableHeaderCell}>手机号</div>
                    <div className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>操作</div>
                </div>
                <div className={styles.tableBody}>
                    {loading ? (
                        <div className={styles.loading}>加载中...</div>
                    ) : users.length === 0 ? (
                        <div className={styles.empty}>暂无数据</div>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className={styles.tableRow}>
                                <div className={styles.tableCell}>{user.username}</div>
                                <div className={styles.tableCell}>******</div>
                                <div className={styles.tableCell}>{user.phone || '-'}</div>
                                <div className={styles.tableCell} style={{ justifyContent: 'flex-end' }}>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.primaryButton}
                                            onClick={() => openModal(user)}
                                            style={{ padding: '4px 8px', marginRight: '8px' }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            编辑
                                        </button>
                                        <button
                                            className={styles.dangerButton}
                                            onClick={() => handleDelete(user.id)}
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
                        ))
                    )}
                </div>
            </div>



            {/* 新建/编辑用户的模态框 */}
            {modalVisible && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingUser ? '编辑用户' : '新增用户'}
                            </h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => {
                                    setModalVisible(false);
                                    setEditingUser(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
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
                                <button
                                    type="button"
                                    className={styles.secondaryButton}
                                    onClick={() => {
                                        setModalVisible(false);
                                        setEditingUser(null);
                                    }}
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className={styles.primaryButton}
                                    disabled={loading}
                                >
                                    {loading ? (editingUser ? '更新中...' : '创建中...') : (editingUser ? '更新' : '创建')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;