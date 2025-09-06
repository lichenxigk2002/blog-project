import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './NavbarFocus.module.scss';

interface NavbarFocusProps {
  activeIndex: number;
  navItems: HTMLElement[];
  containerRef: React.RefObject<HTMLElement>;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const NavbarFocus: React.FC<NavbarFocusProps> = ({
  activeIndex,
  navItems,
  containerRef,
  borderColor = 'var(--nav-underline-active-color, #333)',
  glowColor = 'var(--nav-underline-active-color, #333)',
  animationDuration = 0.5
}) => {
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (activeIndex === -1 || !navItems[activeIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = navItems[activeIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [activeIndex, navItems, containerRef]);

  // 移除这个条件，让组件始终渲染以支持消失动画

  return (
    <motion.div
      className={styles.focusFrame}
      animate={{
        x: activeIndex >= 0 ? focusRect.x : focusRect.x,
        y: activeIndex >= 0 ? focusRect.y : focusRect.y,
        width: activeIndex >= 0 ? focusRect.width : 0,
        height: activeIndex >= 0 ? focusRect.height : 0,
        opacity: activeIndex >= 0 ? 1 : 0,
        scale: activeIndex >= 0 ? 1 : 0.6
      }}
      transition={{
        duration: animationDuration,
        ease: [0.68, -0.55, 0.265, 1.55], // 弹性动画曲线
        opacity: { duration: 0.3 }, // 透明度变化稍快
        scale: { duration: 0.4 } // 缩放变化稍慢
      }}
      style={
        {
          '--border-color': borderColor,
          '--glow-color': glowColor
        } as React.CSSProperties
      }
      // 当没有选中项时，动画完成后隐藏元素
      onAnimationComplete={() => {
        if (activeIndex === -1) {
          // 可以在这里添加额外的逻辑，比如完全隐藏元素
        }
      }}
    >
      <span className={`${styles.corner} ${styles.topLeft}`}></span>
      <span className={`${styles.corner} ${styles.topRight}`}></span>
      <span className={`${styles.corner} ${styles.bottomLeft}`}></span>
      <span className={`${styles.corner} ${styles.bottomRight}`}></span>
    </motion.div>
  );
};

export default NavbarFocus; 