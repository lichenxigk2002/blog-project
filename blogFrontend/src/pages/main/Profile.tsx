import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AuthAPI } from '@/api/AuthAPI';
import styles from './Profile/Profile.module.scss';
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    phone: '',
    avatar: '',
    code: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [boundEmail, setBoundEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxUploadSize = useSelector((state: RootState) => state.settings.contentSettings.maxUploadSize)
  // tip modal state
  const [tipOpen, setTipOpen] = useState(false);
  const [tipType, setTipType] = useState<'success' | 'error' | 'info' | 'warning' | 'loading'>('success');
  const [tipMessage, setTipMessage] = useState('');

  const showTip = (type: 'success' | 'error' | 'info' | 'warning' | 'loading', message: string) => {
    setTipType(type);
    setTipMessage(message);
    setTipOpen(true);
  };

  const hasBoundEmail = (email: string) => !!(email && email.trim() !== '');

  const deleteEmail = async (id: string) => {
    setLoading(true);
    try {
      const response = await AuthAPI.deleteEmail(parseInt(id)) as any;
      if (response.code === 200) {
        setBoundEmail('');
        setForm(prev => ({ ...prev, email: '' }));
        showTip('success', '邮箱解绑成功！');
      }
    } catch {
      showTip('error', '邮箱解绑失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  const handleSendCode = async () => {
    if (!form.email || form.email.trim() === '') {
      showTip('warning', '请输入邮箱');
      return;
    }
    try {
      showTip('loading', '正在发送验证码...');
      const response = await AuthAPI.sendEmailCode(form.email, 'bind');
      // @ts-ignore
      if (response.message === '验证码已发送') {
        showTip('success', response.message);
        setCountdown(60);
      } else {
        showTip('error', response.message || '验证码发送失败');
      }
    } catch {
      showTip('error', '验证码发送失败，请稍后重试');
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setFetching(true);
    AuthAPI.getUserById(user.id)
      .then(res => {
        if (res.data && isMounted) {
          setBoundEmail(res.data.emailAccount || '');
          setForm({
            id: res.data.id.toString(),
            username: res.data.username || '',
            email: '',
            phone: res.data.phone || '',
            avatar: res.data.avatar || '',
            code: '',
          });
        } else if (isMounted) {
          showTip('error', '获取用户信息失败');
        }
      })
      .catch(() => {
        if (isMounted) showTip('error', '获取用户信息失败');
      })
      .finally(() => {
        if (isMounted) setFetching(false);
      });
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeBytes = maxUploadSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setTipMessage(`头像文件过大，最大允许 ${maxUploadSize} MB`)
        setTipType('warning');
        setTipOpen(true);
        return;
      }
      setAvatarUploading(true);
      try {
        showTip('loading', '头像上传中...');
        const res = await AuthAPI.uploadAvatar(file);
        if (res.code === 200) {
          setForm(prev => ({ ...prev, avatar: res.url }));
          showTip('success', '头像上传成功！');
        } else {
          showTip('error', res.message || '头像上传失败');
        }
      } catch (e) {
        showTip('error', '头像上传失败');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  const bindEmail = async () => {
    if (!form.email || !form.code) {
      showTip('warning', '请填写完整的邮箱和验证码');
      return;
    }
    try {
      showTip('loading', '绑定中...');
      const response = await AuthAPI.bindEmail(parseInt(form.id), form.email, form.code) as any;
      if (response.code === 200) {
        setBoundEmail(form.email);
        setForm(prev => ({ ...prev, email: '', code: '' }));
        showTip('success', '邮箱绑定成功！');
      } else {
        showTip('error', response.message || '邮箱绑定失败');
      }
    } catch {
      showTip('error', '邮箱绑定失败，请稍后重试');
    }
  }

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      showTip('loading', '保存中...');
      await AuthAPI.updateUser(user.id, {
        username: form.username,
        avatar: form.avatar,
        phone: form.phone,
      });
      showTip('success', '修改成功！');
    } catch (e) {
      showTip('error', '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;

    // 验证表单
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showTip('warning', '请填写完整的密码信息');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showTip('warning', '新密码与确认密码不一致');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showTip('warning', '新密码长度不能少于6位');
      return;
    }

    setLoading(true);
    try {
      showTip('loading', '修改密码中...');
      const response = await AuthAPI.changePassword(user.id, passwordForm.oldPassword, passwordForm.newPassword);
      if (response.code === 200) {
        showTip('success', '密码修改成功！');
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordModal(false);
      } else {
        showTip('error', response.message || '密码修改失败');
      }
    } catch (e) {
      showTip('error', '密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  if (fetching) {
    return <div className={styles.profileCard}>加载中...</div>;
  }

  if (!user) {
    return <div className={styles.profileCard}>未登录</div>;
  }

  return (
    <>
      <OperationTipModal
        open={tipOpen}
        onClose={() => setTipOpen(false)}
        message={tipMessage}
        type={tipType}
      />

      {/* 修改密码模态框 */}
      {showPasswordModal && (
        <div className={styles.modalOverlay} onClick={closePasswordModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>修改密码</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>当前密码：</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="请输入当前密码"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>新密码：</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="请输入新密码（至少6位）"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>确认密码：</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="请再次输入新密码"
              />
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.button}
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? '修改中...' : '确认修改'}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closePasswordModal}
                disabled={loading}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.profileCard}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>个人信息</h2>
        <div className={styles.avatarWrapper}>
          <img
            src={form.avatar || '/images/avatar-default.png'}
            alt="头像"
            className={styles.avatarImg}
            onClick={() => fileInputRef.current?.click()}
            title="点击更换头像"
          />
          {avatarUploading && <div className={styles.avatarUploading}>上传中...</div>}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>昵称：</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>手机号：</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>邮箱：</label>
          <input
            name="email"
            value={hasBoundEmail(boundEmail) ? boundEmail : form.email}
            onChange={handleChange}
            className={styles.input}
            readOnly={hasBoundEmail(boundEmail)}
            style={{ color: hasBoundEmail(boundEmail) ? '#999' : '#000', backgroundColor: hasBoundEmail(boundEmail) ? 'rgba(245,245,245,0.18)' : 'rgba(255,255,255,0.18)' }}
          />
        </div>
        {!hasBoundEmail(boundEmail) && (
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="code">验证码</label>
            <div className={styles.codeInputContainer}>
              <input
                className={styles.input}
                type="text"
                id="code"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="请输入验证码"
                maxLength={6}
              />
              <button
                type="button"
                className={styles.sendCodeButton}
                onClick={handleSendCode}
                disabled={countdown > 0 || !form.email || form.email.trim() === ''}
              >
                {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
              </button>
            </div>
          </div>
        )}

        <div className={styles.bottomButton}>
          <div className={styles.buttonRow}>
            {!hasBoundEmail(boundEmail) && (
              <button className={styles.button} onClick={bindEmail} disabled={loading}>
                绑定邮箱
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className={styles.button}
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              className={styles.changePasswordButton}
              onClick={openPasswordModal}
              disabled={loading}
            >
              修改密码
            </button>
          </div>
          {hasBoundEmail(boundEmail) && (
            <button className={styles.unbindButton} onClick={() => deleteEmail(form.id)} disabled={loading}>解绑邮箱</button>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile; 