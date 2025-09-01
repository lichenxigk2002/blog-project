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

  if (activeIndex === -1) return null;

  return (
    <motion.div
      className={styles.focusFrame}
      animate={{
        x: focusRect.x,
        y: focusRect.y,
        width: focusRect.width,
        height: focusRect.height,
        opacity: activeIndex >= 0 ? 1 : 0
      }}
      transition={{
        duration: animationDuration,
        ease: [0.68, -0.55, 0.265, 1.55] // 弹性动画曲线
      }}
      style={
        {
          '--border-color': borderColor,
          '--glow-color': glowColor
        } as React.CSSProperties
      }
    >
      <span className={`${styles.corner} ${styles.topLeft}`}></span>
      <span className={`${styles.corner} ${styles.topRight}`}></span>
      <span className={`${styles.corner} ${styles.bottomLeft}`}></span>
      <span className={`${styles.corner} ${styles.bottomRight}`}></span>
    </motion.div>
  );
};

export default NavbarFocus; 