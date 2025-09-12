import React, { useState, useEffect } from 'react';
import styles from './YoimiyaLetter.module.scss';
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';

interface YoimiyaLetterProps {
  isVisible: boolean;
  onClose: () => void;
  content: string;
  autoTrigger?: boolean;
  triggerDelay?: number; // 阅读时间（毫秒）
}

const YoimiyaLetter: React.FC<YoimiyaLetterProps> = ({
  isVisible,
  onClose,
  content,
  autoTrigger = false,
  triggerDelay = 60000 // 默认60秒
}) => {
  const [randomImage, setRandomImage] = useState<string>('');
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [canTrigger, setCanTrigger] = useState(false); // 是否可以触发

  // 可用的邮票图片列表
  const stampImages = [
    '/images/YoimiyaLetter_1.jpg',
    '/images/YoimiyaLetter_2.jpg',
  ];

  // 检测是否滚动到页面一半
  const checkIfAtHalf = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 滚动到页面一半
    return scrollTop + windowHeight >= documentHeight / 2;
  };

  // 1分钟后设置可以触发
  useEffect(() => {
    if (!autoTrigger || hasTriggered) return;

    const timer = setTimeout(() => {
      setCanTrigger(true);
    }, triggerDelay);

    return () => clearTimeout(timer);
  }, [autoTrigger, triggerDelay, hasTriggered]);

  // 监听滚动，当可以触发且滚动到底部时触发
  useEffect(() => {
    if (!canTrigger || hasTriggered) return;

    const handleScroll = () => {
      if (checkIfAtHalf()) {
        setShowLetterModal(true);
        setHasTriggered(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 初始检查一次
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [canTrigger, hasTriggered]);

  // 弹窗3秒后自动打开信件
  useEffect(() => {
    if (showLetterModal) {
      const timer = setTimeout(() => {
        setShowLetterModal(false);
        setShowLetter(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showLetterModal]);

  // 随机选择邮票图片
  useEffect(() => {
    if (isVisible || showLetter) {
      const randomIndex = Math.floor(Math.random() * stampImages.length);
      setRandomImage(stampImages[randomIndex]);
    }
  }, [isVisible, showLetter]);

  const handleLetterModalClose = () => {
    setShowLetterModal(false);
  };

  const handleLetterClose = () => {
    setShowLetter(false);
    onClose();
  };

  return (
    <>
      {/* 自动触发的弹窗 */}
      <OperationTipModal
        open={showLetterModal}
        onClose={handleLetterModalClose}
        message="宵宫给您写了一封信，3秒后打开..."
        type="info"
        iconSize={128}
        autoClose={false}
        clickOverlayToClose={false}
        showCloseButton={true}
        position="center"
      />

      {/* 信件内容 */}
      {(isVisible || showLetter) && (
        <div className={styles.letterOverlay}>
          <div
            className={styles.letterContainer}
            style={{ '--stamp-image': `url('${randomImage}')` } as React.CSSProperties}
          >
            <div className={styles.letterHeader}>
              <h3>宵宫的信</h3>
            </div>

            <div className={styles.letterContent}>
              <div style={{ fontFamily: 'zihunccy', fontSize: '16px', lineHeight: '1.6' }}>你好呀！我是宵宫～</div>
              <div dangerouslySetInnerHTML={{
                __html: content
                  .split('\n')
                  .map(line => line.trim() ? `<p style="text-indent: 2em; margin: 0.1em 0;">${line}</p>` : '<br>')
                  .join('')
              }} />
            </div>

            <div className={styles.letterSignature}>
              <span>—— Yoimiya</span>
            </div>

            <button onClick={handleLetterClose} className={styles.closeBtn}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default YoimiyaLetter; 