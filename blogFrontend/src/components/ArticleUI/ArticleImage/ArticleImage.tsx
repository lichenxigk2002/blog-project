import React, { useState, useCallback, useEffect } from 'react';
import styles from './ArticleImage.module.scss';

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

  // esc关闭
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowModal(false);
  }, []);
  useEffect(() => {
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showModal, handleKeyDown]);

  // 文章内图片样式
  const thumbStyle: React.CSSProperties = {
    maxWidth: width || (style && style.width) || undefined,
    ...style,
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${styles.articleImageThumb} ${className}`}
        style={thumbStyle}
        onClick={() => setShowModal(true)}
        title={'点击放大预览'}
        draggable={false}
        {...rest}
      />
      {showModal && (
        <div className={styles.articleImageModal} onClick={() => setShowModal(false)}>
          <img
            src={src}
            alt={alt}
            className={styles.articleImageModalImg}
            onClick={e => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </>
  );
};

export default ArticleImage; 