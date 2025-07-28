// 导入必要的依赖
import { useAppSelector } from '@/redux/store';  // 使用类型化的 useSelector
import { RootState } from '@/redux/store';  // 之前定义的 RootState 类型

// 定义 useAuth 自定义 Hook
export const useAuth = () => {
    // 使用 useSelector 从 Redux store 中提取 auth 状态
    // @ts-ignore
    const { user, loading, error } = useAppSelector(
        (state: RootState) => state.auth  // 选择 state 中的 auth 切片
    );

    // 返回 auth 状态对象，方便组件使用
    return {
        isAuthenticated: !!user,
        user,            // 用户信息（登录用户数据）
        isLoading: loading,  // 是否正在加载（如登录过程中）
        error           // 错误信息（登录失败时的错误）
    };
};