import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/redux/store';
import { adminLogin } from '@/redux/adminAuthSlice';
import { LoginModalContext } from '@/context/LoginModalContext';
import styles from './AdminLogin.module.scss';

const AdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showAdminLogin, setShowAdminLogin } = useContext(LoginModalContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAdminLogin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const resultAction = await dispatch(adminLogin({ username, password }));

      if (adminLogin.fulfilled.match(resultAction)) {
        setShowAdminLogin(false);
        router.push('/admin');
      } else if (adminLogin.rejected.match(resultAction)) {
        setError(resultAction.payload || '登录失败，请检查账号密码');
      }
    } catch (error: any) {
      setError(error.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.loginCard}>
        <button
          className={styles.closeButton}
          onClick={() => setShowAdminLogin(false)}
        >
          ×
        </button>
        <div className={styles.header}>
          <h2>管理员登录</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>用户名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>密码</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.button} ${styles.loginButton} ${isLoading ? styles.loading : ''}`}
              disabled={isLoading}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setShowAdminLogin(false)}
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={isLoading}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 