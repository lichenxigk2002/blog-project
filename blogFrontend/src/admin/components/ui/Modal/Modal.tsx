import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  width
}: ModalProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // 自动关闭逻辑
  useEffect(() => {
    if (!open) return;
    // 定义重置计时器函数
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    };
    resetTimer();
    // 监听弹窗内容区的点击
    const content = modalContentRef.current;
    if (content) {
      content.addEventListener('mousedown', resetTimer);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (content) content.removeEventListener('mousedown', resetTimer);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{ width: width || 400, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
        ref={modalContentRef}
      >
        {title && (
          <div className={styles.modalHeader}>
            <span className={styles.modalTitle}>{title}</span>
            <button className={styles.modalClose} onClick={onClose}>×</button>
          </div>
        )}
        <div className={styles.modalBody} style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal; 