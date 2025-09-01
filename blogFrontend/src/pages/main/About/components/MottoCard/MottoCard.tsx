import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import styles from './MottoCard.module.scss';

const MottoCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 鼠标位置追踪
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 基于鼠标位置的变换
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 鼠标移动处理
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const text1 = "日益努力";
  const text2 = "而后风生水起";

  return (
    <motion.div
      ref={containerRef}
      className={styles.mottoContainer}
      initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
      animate={isVisible ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h1>
        我坚信
      </h1>

      <div className={styles.mottoContent}>
        <div className={styles.mottoText}>
          {/* 第一行文字 */}
          <motion.div
            className={styles.textLine}
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            {text1.split('').map((char, index) => (
              <motion.span
                key={`char1-${index}`}
                className={styles.char}
                initial={{ opacity: 0, y: 100, rotateX: -90, scale: 0.5 }}
                animate={isVisible ? {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + index * 0.08,
                  type: "spring",
                  stiffness: 120,
                  damping: 12
                }}
                whileHover={{
                  scale: 1.3,
                  y: -12,
                  rotateX: 10,
                  transition: {
                    duration: 0.2,
                    type: "spring",
                    stiffness: 400
                  }
                }}
                whileTap={{ scale: 0.9 }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              className={styles.punctuation}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={isVisible ? {
                opacity: 1,
                scale: 1,
                rotate: 0
              } : {}}
              transition={{
                delay: 1.4,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              whileHover={{
                scale: 1.4,
                rotate: 360,
                transition: {
                  duration: 0.5,
                  ease: "easeInOut"
                }
              }}
            >
              ，
            </motion.span>
          </motion.div>

          {/* 第二行文字 */}
          <motion.div
            className={styles.textLine}
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            {text2.split('').map((char, index) => (
              <motion.span
                key={`char2-${index}`}
                className={styles.char}
                initial={{ opacity: 0, y: 100, rotateX: -90, scale: 0.5 }}
                animate={isVisible ? {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1
                } : {}}
                transition={{
                  duration: 0.8,
                  delay: 1.4 + index * 0.08,
                  type: "spring",
                  stiffness: 120,
                  damping: 12
                }}
                whileHover={{
                  scale: 1.3,
                  y: -12,
                  rotateX: 10,
                  transition: {
                    duration: 0.2,
                    type: "spring",
                    stiffness: 400
                  }
                }}
                whileTap={{ scale: 0.9 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 添加动态光晕效果 */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isHovered
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
            : 'transparent',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 5
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default MottoCard; 