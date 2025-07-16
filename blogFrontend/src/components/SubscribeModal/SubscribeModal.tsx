import React, { useState, useRef, useEffect } from 'react';
import styles from './SubscribeModal.module.scss';
import OperationTipModal from '../OperationTipModal/OperationTipModal';
import { isValidEmail } from '@/utils/validate';
import { SubscribeAPI } from '@/api/SubscribeAPI';
import { useLoading } from '@/hooks/useLoading';
import { useSelector } from "react-redux";
import { RootState } from '@/redux/store';

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const emailNotifications = useSelector((state: RootState) => state.settings.notificationSettings.emailNotifications)
  const [tip, setTip] = useState<{ open: boolean; message: string; type: 'success' | 'warning' | 'error' | 'info' }>({ open: false, message: '', type: 'success' });
  const { isLoading, withLoading } = useLoading();
  const hasLoadingShown = useRef(false);


  useEffect(() => {
    if (isLoading) {
      hasLoadingShown.current = true;
    }
  }, [isLoading]);

  if (!open && !tip.open) return null;

  const handleClose = () => {
    hasLoadingShown.current = false;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setTip({ open: true, message: '请输入正确的邮箱格式', type: 'info' });
      return;
    }
    if (name.trim() === '') {
      setTip({ open: true, message: '如何称呼您呢', type: 'info' });
      return;
    }
    try {
      const response = await withLoading(SubscribeAPI.createSubscribe(email, name));
      if (!response.success) {
        setTip({ open: true, message: response.message || '订阅失败', type: 'error' });
        return;
      }
      setEmail('');
      setName('');
      handleClose();
      setTimeout(() => {
        setTip({ open: true, message: '订阅成功！请查收邮件', type: 'success' });
      }, 200);
    } catch (error) {
      setTip({ open: true, message: '服务器错误，请稍后重试', type: 'error' });
    }
  };

  const handleCancel = () => {
    if (hasLoadingShown.current || isLoading) {
      handleClose();
      return;
    }
    // 先关闭订阅弹窗
    handleClose();
    // 然后显示确认提示
    setTimeout(() => {
      setTip({ open: true, message: '真的不订阅吗？前沿技术干货不容错过', type: 'warning' });
    }, 200);
  };

  // @ts-ignore
  return (
    <>
      {emailNotifications ? <>{open && (
        <div className={styles.modalOverlay}>
          <div className={styles.subscribeCard}>
            <button className={styles.closeButton} onClick={handleCancel}>×</button>
            <div className={styles.header}>
              <h2>订阅孤芳不自赏的文章</h2>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="subscribe-email">邮箱地址</label>
                <input
                  className={styles.input}
                  id="subscribe-email"
                  type="text"
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="subscribe-name">称呼</label>
                <input
                  className={styles.input}
                  id="subscribe-name"
                  type="text"
                  placeholder="如何称呼您呢？"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button className={`${styles.button} ${styles.subscribeButton}`} type="submit">订阅</button>
                <button className={`${styles.button} ${styles.cancelButton}`} type="button" onClick={handleCancel}>取消</button>
              </div>
            </form>
          </div>
        </div>
      )}</> : <><OperationTipModal
        open={open}
        onClose={handleClose}
        message="站长已关闭邮件订阅功能"
        type="info"
        theme=""
      /></>}
      <OperationTipModal
        open={isLoading}
        onClose={handleClose}
        message="正在订阅，请客官稍等…"
        type="loading"
        theme=""
      />
      <OperationTipModal
        open={tip.open}
        onClose={() => setTip({ ...tip, open: false })}
        message={tip.message}
        type={tip.type}
        icon={tip.type === 'success' ? '/images/subscribe.png' : undefined}
        theme={''}
      />
    </>
  );
};

export default SubscribeModal; 