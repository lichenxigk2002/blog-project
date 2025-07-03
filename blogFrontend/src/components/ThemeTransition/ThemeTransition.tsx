import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import styles from './ThemeTransition.module.scss';

interface ThemeTransitionProps {
  children: React.ReactNode;
  duration?: number;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({
  children,
  duration = 300
}) => {
  const { isDarkMode } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [isDarkMode, duration]);

  return (
    <div
      className={`${styles.themeTransition} ${isTransitioning ? styles.transitioning : ''}`}
      style={{ '--transition-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default ThemeTransition; 