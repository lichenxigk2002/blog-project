// 从 Redux Toolkit 导入 configureStore 函数
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 导入各个模块的 reducer
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import adminAuthReducer from './adminAuthSlice';
import settingsReducer from './systemSettingsSlice';

// 使用 configureStore 创建 Redux store
const store = configureStore({
    reducer: {
        theme: themeReducer,  // 主题相关的状态管理
        auth: authReducer,   // 认证相关的状态管理
        adminAuth: adminAuthReducer,// 管理员认证相关的状态管理
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    // 注意：configureStore 默认已经包含了以下中间件：
    // 1. redux-thunk (用于异步操作)
    // 2. Redux DevTools 扩展支持
    // 3. 一些开发环境下的检查中间件
});

// 导出 RootState 类型 - 获取整个 Redux 状态的类型
export type RootState = ReturnType<typeof store.getState>;

// 导出 AppDispatch 类型 - 获取 dispatch 函数的类型
export type AppDispatch = typeof store.dispatch;

// 导出 ThunkAction 类型
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    undefined,
    Action<string>
>;

// 导出类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 导出配置好的 store
export default store;