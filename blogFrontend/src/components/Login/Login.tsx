// 导入React相关hooks和依赖
import React, { useState, useContext, useEffect } from 'react';
// Redux的dispatch hook
import { useAppDispatch } from '@/redux/store';
// 自定义的认证hook
import { useAuth } from '@/hooks/useAuth';
// Redux的登录/登出action
import { login, logout } from '@/redux/auth/actions';
// 样式文件
import styles from './Login.module.scss';
// 全局登录模态框的Context
import { LoginModalContext } from '@/context/LoginModalContext';
// 导入注册组件
import Register from '../Register/Register';
// 导入API
import { AuthAPI } from '@/api/AuthAPI';

// 定义登录组件
const Login: React.FC = () => {

  const MoreLoginOptions: React.FC<{
    onClose: () => void;
    onSelect: (type: 'sms' | 'github' | 'google') => void;
  }> = ({ onClose, onSelect }) => {
    return (
      <div className={styles.moreLoginPopup}>
        <div className={styles.moreLoginContent}>
          <button
            className={styles.loginOption}
            onClick={() => onSelect('sms')}
            title="短信登录"
          >
            <span className={styles.icon}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            </span>
          </button>

          <button
            className={styles.loginOption}
            onClick={() => onSelect('github')}
            title="GitHub 登录"
          >
            <span className={styles.icon}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </span>
          </button>

          <button
            className={styles.loginOption}
            onClick={() => onSelect('google')}
            title="Google 登录"
          >
            <span className={styles.icon}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    );
  };
  // 表单数据状态（用户名和密码）
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    code: ''
  });

  // 控制是否显示社交账号登录界面
  const [showSocialLogin, setShowSocialLogin] = useState(false);
  // 控制是否显示注册界面
  const [showRegister, setShowRegister] = useState(false);
  // 控制是否显示短信验证登录
  const [showSmsLogin, setShowSmsLogin] = useState(false);
  // 倒计时状态
  const [countdown, setCountdown] = useState(0);

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // 获取Redux的dispatch方法，使用正确的类型
  const dispatch = useAppDispatch();

  // 使用自定义hook获取认证状态
  const { isLoading, error, isAuthenticated, user } = useAuth();

  // 使用全局Context控制登录模态框显示
  const { setShowLogin } = useContext(LoginModalContext);

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginTypeSelect = (type: 'sms' | 'github' | 'google') => {
    setShowMoreOptions(false);
    switch (type) {
      case 'sms':
        setShowSmsLogin(true);
        break;
      case 'github':
        // 处理 GitHub 登录
        break;
      case 'google':
        // 处理 Google 登录
        break;
    }
  };
  // 处理表单提交（登录）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showSmsLogin) {
      // 短信验证登录
      if (!formData.phone || !formData.code) {
        console.error('Phone or code is empty');
        return;
      }

      try {
        const loginData = {
          phone: formData.phone.trim(),
          code: formData.code.trim()
        };
        await dispatch(login(loginData));
      } catch (error) {
        console.error('SMS login failed:', error);
      }
    } else {
      // 用户名密码登录
      if (!formData.username || !formData.password) {
        console.error('Username or password is empty');
        return;
      }

      try {
        const loginData = {
          username: formData.username.trim(),
          password: formData.password.trim()
        };
        await dispatch(login(loginData));
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.phone) {
      console.error('Phone number is empty');
      return;
    }

    try {
      const response = await AuthAPI.sendSmsCode(formData.phone, 'login');
      if (response.code === 200) {
        // 开始倒计时
        setCountdown(60);
      } else {
        console.error('Failed to send verification code:', response.message);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 关闭模态框
  const handleClose = () => {
    setShowLogin(false);
    setShowSocialLogin(false);
    setShowRegister(false);
    setShowSmsLogin(false);
  };

  // 处理登出操作
  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  // 如果显示注册界面
  if (showRegister) {
    return <Register onClose={() => setShowRegister(false)} />;
  }

  // 如果已认证且存在用户信息，显示登录成功界面
  if (isAuthenticated && user) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.loginCard}>
          {/* 关闭按钮 */}
          <button className={styles.closeButton} onClick={handleClose}>×</button>

          <div className={styles.header}>
            <h2>登录成功</h2>
          </div>

          <div className={styles.form}>
            <div className={styles.successMessage}>
              <p style={{ color: 'var(--text)' }}>欢迎用户 {user.username}!</p>
              <p style={{ color: 'var(--text)' }}>登录状态: 已登录</p>
            </div>

            {/* 登出按钮 */}
            <button className={styles.logoutButton} onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 如果显示社交账号登录界面
  if (showSocialLogin) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.loginCard}>
          {/* 关闭按钮 */}
          <button className={styles.closeButton} onClick={handleClose}>×</button>

          <div className={styles.header}>
            <h2>社交账号登录</h2>
          </div>

          {/* 社交登录按钮区域 */}
          <div className={styles.socialLoginExpanded}>
            {/* GitHub登录按钮 */}
            <button className={`${styles.socialButtonLarge} ${styles.githubButton}`}>
              <span className={styles.socialIcon}>
                {/* GitHub图标 */}
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </span>
              <span>使用 GitHub 账号登录</span>
            </button>

            {/* Google登录按钮 */}
            <button className={`${styles.socialButtonLarge} ${styles.googleButton}`}>
              <span className={styles.socialIcon}>
                {/* Google图标 */}
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </span>
              <span>使用 Google 账号登录</span>
            </button>
          </div>

          {/* 底部返回按钮 */}
          <div className={styles.footer}>
            <button className={styles.backButton} onClick={() => setShowSocialLogin(false)}>
              返回邮箱登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 默认显示邮箱登录界面
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.loginCard}>
        {/* 关闭按钮 */}
        <button className={styles.closeButton} onClick={handleClose}>×</button>

        <div className={styles.header}>
          <h2>用户登录</h2>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 错误提示 */}
          {error && (
            <div className={styles.error}>
              登录失败: {error}
            </div>
          )}

          {showSmsLogin ? (
            // 短信验证登录表单
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="phone">手机号</label>
                <input
                  className={styles.input}
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="请输入手机号"
                  maxLength={11}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="code">验证码</label>
                <div className={styles.codeInputContainer}>
                  <input
                    className={styles.input}
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    placeholder="请输入验证码"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    className={styles.sendCodeButton}
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            // 用户名密码登录表单
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="username">用户名</label>
                <input
                  className={styles.input}
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoComplete="username"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">密码</label>
                <input
                  className={styles.input}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
              </div>
            </>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 底部链接 */}
        <div className={styles.footer}>
          <div className={styles.moreLoginContainer}>
            <button
              className={styles.switchButton}
              onClick={() => setShowMoreOptions(!showMoreOptions)}
            >
              更多登录方式
            </button>
            {showMoreOptions && (
              <MoreLoginOptions
                onClose={() => setShowMoreOptions(false)}
                onSelect={handleLoginTypeSelect}
              />
            )}
          </div>
          <button
            className={styles.switchButton}
            onClick={() => setShowRegister(true)}
          >
            注册账号
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;