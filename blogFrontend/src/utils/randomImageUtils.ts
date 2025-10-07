/**
 * 随机图片工具函数
 * 用于在图片加载失败时提供随机的备用图片
 */
import React from 'react';

// 背景图片列表 - 从 public/background 文件夹获取
const BACKGROUND_IMAGES = [
  '/background/Furina.png',
  '/background/Ganyu.png',
  '/background/HuTao.jpg',
  '/background/Kamisato.jpg',
  '/background/KeQing.jpg',
  '/background/Sangonomiya.png',
  '/background/Yoimiya.jpg'
];

/**
 * 获取随机背景图片路径
 * @returns 随机的背景图片路径
 */
export const getRandomBackgroundImage = (): string => {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
  return BACKGROUND_IMAGES[randomIndex];
};

/**
 * 获取指定数量的随机背景图片路径
 * @param count 需要的图片数量
 * @returns 随机背景图片路径数组
 */
export const getRandomBackgroundImages = (count: number): string[] => {
  const shuffled = [...BACKGROUND_IMAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, BACKGROUND_IMAGES.length));
};

/**
 * 图片加载失败处理函数
 * @param event 图片加载错误事件
 * @param fallbackSrc 备用图片路径，如果不提供则使用随机背景图片
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
): void => {
  const img = event.currentTarget;
  const fallbackImageSrc = fallbackSrc || getRandomBackgroundImage();

  console.log('图片加载失败，原始src:', img.src);
  console.log('使用备用图片:', fallbackImageSrc);

  // 避免无限循环：如果当前src已经是备用图片，则不再替换
  if (img.src !== fallbackImageSrc && img.src !== window.location.origin + fallbackImageSrc) {
    img.src = fallbackImageSrc;
    console.log('已设置备用图片');
  } else {
    console.log('避免无限循环，不替换图片');
  }
};

/**
 * 带随机头像的图片组件属性类型
 */
export interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  fallbackSrc?: string;
}

/**
 * 创建带随机头像的图片组件
 * @param props 图片属性
 * @returns JSX元素
 */
export const createImageWithFallback = (props: ImageWithFallbackProps): JSX.Element => {
  const { src, alt, className, style, onLoad, onError, fallbackSrc } = props;

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    handleImageError(event, fallbackSrc);
    if (onError) {
      onError(event);
    }
  };

  return React.createElement('img', {
    src,
    alt,
    className,
    style,
    onLoad,
    onError: handleError
  });
};

/**
 * 带随机头像的图片组件 - React组件版本
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = (props) => {
  const { src, alt, className, style, onLoad, onError, fallbackSrc } = props;
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      const fallbackImageSrc = fallbackSrc || getRandomBackgroundImage();
      console.log('图片组件错误处理，设置备用图片:', fallbackImageSrc);
      setCurrentSrc(fallbackImageSrc);
    }

    if (onError) {
      onError(event);
    }
  };

  return React.createElement('img', {
    src: currentSrc,
    alt,
    className,
    style,
    onLoad,
    onError: handleError
  });
};
