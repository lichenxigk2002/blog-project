import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ArticleImage.module.scss';
import { useMobile } from '@/hooks/useMobile';

interface ArticleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({
  src,
  alt,
  style,
  width,
  height,
  className = '',
  ...rest
}) => {
  const [showModal, setShowModal] = useState(false);
  const { isMobile } = useMobile();

  // 处理图片点击事件
  const handleImageClick = useCallback(() => {
    if (!isMobile) { // 移动端禁用点击放大
      setShowModal(true);
    }
  }, [isMobile]);

  // 关闭模态框
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // 阻止模态框背景点击关闭
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  // 文章内图片样式
  const thumbStyle: React.CSSProperties = {
    // 移动端强制使用屏幕宽度，桌面端使用原有逻辑
    maxWidth: isMobile ? '100vw' : (width || (style && style.width) || undefined),
    width: isMobile ? '100%' : undefined, // 移动端强制100%宽度
    ...style,
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${styles.articleImageThumb} ${className}`}
        style={thumbStyle}
        onClick={handleImageClick}
        title={isMobile ? undefined : '点击放大预览'}
        {...rest}
      />
      {showModal && createPortal(
        <div className={styles.articleImageModal} onClick={handleModalClick}>
          <img
            src={src}
            alt={alt}
            className={styles.articleImageModalImg}
            onClick={handleCloseModal}
          />
        </div>,
        document.body
      )}
    </>
  );
};

export default ArticleImage; 