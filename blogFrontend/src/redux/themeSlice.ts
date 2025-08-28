import { createSlice } from '@reduxjs/toolkit';

// 从 localStorage 获取初始主题状态
const getInitialTheme = () => {
    if (typeof window === 'undefined') {
        return { isDarkMode: false };
    }

    try {
        const saved = localStorage.getItem('theme_mode');
        if (saved) {
            const parsed = JSON.parse(saved);
            console.log('🔍 从 localStorage 恢复主题:', parsed);
            return { isDarkMode: parsed.isDarkMode ?? false };
        }
    } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
    }

    console.log('🔍 使用默认主题: false');
    return { isDarkMode: false };
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: getInitialTheme(),
    reducers: {
        toggleTheme(state) {
            state.isDarkMode = !state.isDarkMode;
            console.log('🔄 切换主题到:', state.isDarkMode);

            // 保存到 localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('theme_mode', JSON.stringify(state));
                    console.log('💾 主题已保存到 localStorage');
                } catch (error) {
                    console.warn('Failed to save theme to localStorage:', error);
                }
            }
        }
    }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;