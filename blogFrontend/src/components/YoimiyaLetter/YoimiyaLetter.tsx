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
  const [countdown, setCountdown] = useState(3); // 添加倒计时状态

  // 可用的邮票图片列表
  const stampImages = [
    '/images/YoimiyaLetter_1.jpg',
    '/images/YoimiyaLetter_2.jpg',
    '/images/YoimiyaLetter_3.jpg',
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

  // 弹窗3秒后自动打开信件，添加倒计时逻辑
  useEffect(() => {
    if (showLetterModal) {
      // 重置倒计时
      setCountdown(3);

      // 开始倒计时
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowLetterModal(false);
            setShowLetter(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
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
        message={`宵宫给您写了一封信，${countdown}秒后打开...`}
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
              <h3>宵宫寄语</h3>
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