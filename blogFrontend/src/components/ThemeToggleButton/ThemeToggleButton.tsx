import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '@/redux/themeSlice';
import styles from './ThemeToggleButton.module.scss';

// 定义图标资源类型
interface ThemeIcons {
    themeDay: React.ReactNode;
    themeNight: React.ReactNode;
}

// 组件props类型
interface ThemeToggleButtonProps {
    icons: ThemeIcons;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ icons }) => {
    const dispatch = useDispatch();
    const { isDarkMode } = useTheme();

    return (
        <button
            className={styles.iconButton}
            onClick={() => dispatch(toggleTheme())}
            aria-label={isDarkMode ? '切换到白天模式' : '切换到夜间模式'}
            data-theme={isDarkMode ? 'dark' : 'light'}
        >
            {isDarkMode ? icons.themeNight : icons.themeDay}
        </button>
    );
};

export default ThemeToggleButton;