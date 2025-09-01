import React, { useState } from 'react';
import styles from './DiagonalImageGallery.module.scss';

interface DiagonalImageGalleryProps {
  title?: string;
}

const DiagonalImageGallery: React.FC<DiagonalImageGalleryProps> = ({ title = "喜欢的动漫" }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 动漫图片数据
  const images = [
    {
      src: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/956b2a52-3e20-4ea8-8194-f2fad14b8309.png',
      alt: '青春猪头少年不会梦到兔女郎学姐',
      title: '青春猪头少年不会梦到兔女郎学姐',
    }, {
      src: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/16598d70-fac3-415e-9fc1-204627e79a2f.png',
      alt: '名侦探柯南',
      title: '名侦探柯南',
    }, {
      // src: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/7af223e7-0880-4eb7-8bd8-f548df1875c5.png',
      src: 'https://images-1359353257.cos.ap-beijing.myqcloud.com/images/b5878903-347b-43a5-af16-9e76ba1919f6.jpg',
      alt: '犬夜叉',
      title: '犬夜叉'
    }
  ];

  return (
    <div className={styles.galleryContainer}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.imageContainer}>
        {images.slice(0, 3).map((image, index) => (
          <div
            key={index}
            className={`${styles.imageSlice} ${styles[`slice${index + 1}`]} ${hoveredIndex === index ? styles.active : ''
              } ${hoveredIndex !== null && hoveredIndex !== index ? styles.inactive : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ backgroundColor: image.src ? 'transparent' : (image as any).color }}
          >
            {image.src ? (
              <img
                src={image.src}
                alt={image.alt}
                className={styles.image}
              />
            ) : (
              <div className={styles.colorBlock}>
                <div className={styles.sliceNumber}>{index + 1}</div>
              </div>
            )}
            {image.title && (
              <div className={styles.imageTitle}>{image.title}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagonalImageGallery; 