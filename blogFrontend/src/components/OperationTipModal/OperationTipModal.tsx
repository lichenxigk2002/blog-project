import React, { useEffect, useRef, useState } from 'react';
import styles from './OperationTipModal.module.scss';

const iconMap = {
  success: '/images/success.png',
  error: '/images/failure.png',
  info: '/images/info.png',
  warning: '/images/warning.png'
};

interface OperationTipModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  width?: number;
  iconSize?: number;
  icon?: string;
}

const OperationTipModal: React.FC<OperationTipModalProps> = ({
  open,
  onClose,
  message,
  type = 'success',
  width = 280,
  iconSize = 128,
  icon
}) => {
  const [show, setShow] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const leaveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setShow(true);
      setLeaving(false);
      // 自动 2 秒后关闭
      leaveTimer.current = setTimeout(() => {
        setLeaving(true);
        setTimeout(() => {
          setShow(false);
          setLeaving(false);
          onClose();
        }, 500); // 离开动画时长
      }, 1500);
    } else if (show) {
      setLeaving(true);
      leaveTimer.current = setTimeout(() => {
        setShow(false);
        setLeaving(false);
      }, 350); // 动画时长 0.35s
    }
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, [open]);

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={() => { if (!leaving) onClose(); }}>
      <div
        className={leaving ? `${styles.card} ${styles['card-leave']}` : styles.card}
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={icon || iconMap[type] || iconMap.success}
          alt={type}
          className={styles.icon}
          style={{ width: iconSize, height: iconSize }}
        />
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
};

export default OperationTipModal; 