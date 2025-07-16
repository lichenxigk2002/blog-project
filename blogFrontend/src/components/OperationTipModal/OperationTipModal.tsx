import React, { useEffect, useRef, useState } from 'react';
import styles from './OperationTipModal.module.scss';
import Image from "next/image";

const iconMap = {
  success: '/images/success.png',
  error: '/images/failure.png',
  info: '/images/info.png',
  warning: '/images/warning.png',
  loading: '/images/loading.png'
};

interface OperationTipModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
  width?: number;
  iconSize?: number;
  icon?: string;
  theme?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  clickOverlayToClose?: boolean;
  showCloseButton?: boolean;
  position?: 'center' | 'top' | 'bottom';
  className?: string;
}

const OperationTipModal: React.FC<OperationTipModalProps> = ({
  open,
  onClose,
  message,
  type = 'success',
  width = 280,
  iconSize = 128,
  icon,
  theme,
  autoClose = true,
  autoCloseDelay = 1500,
  clickOverlayToClose = true,
  showCloseButton = false,
  position = 'center',
  className = ''
}) => {
  const [show, setShow] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const leaveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setShow(true);
      setLeaving(false);

      // 自动关闭逻辑
      if (autoClose) {
        leaveTimer.current = setTimeout(() => {
          setLeaving(true);
          setTimeout(() => {
            setShow(false);
            setLeaving(false);
            onClose();
          }, 500); // 离开动画时长
        }, autoCloseDelay);
      }
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
  }, [open, autoClose, autoCloseDelay, onClose, show]);

  const handleOverlayClick = () => {
    if (!leaving && clickOverlayToClose) {
      onClose();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!show) return null;

  // 根据主题和位置生成样式类
  const cardClassName = [
    styles.card,
    leaving ? styles['card-leave'] : '',
    styles[`position-${position}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={cardClassName}
        style={{ width }}
        onClick={handleCardClick}
      >
        <Image
          src={icon || iconMap[type] || iconMap.success}
          alt={type}
          className={styles.icon}
          width={iconSize}
          height={iconSize}
          priority
          quality={60}
          placeholder="blur"
          blurDataURL="/images/placeholder.png"
        />
        <div className={styles.message}>{message}</div>
        {showCloseButton && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default OperationTipModal; 