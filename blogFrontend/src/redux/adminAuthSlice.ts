// src/redux/adminAuth/slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Admin } from '@/types/Admin';
import { AdminAPI } from '@/api/AdminAPI';
import { isTokenExpired } from '@/utils/jwtUtils';

interface AdminAuthState {
    isAuthenticated: boolean;  // 是否已登录
    admin: Admin | null;  // 当前登录用户信息
    loading: boolean;  // 是否正在加载状态
    error: string | null;  // 错误信息
    token: string | null;  // JWT令牌
}

// 统一的token存储键名
const ADMIN_TOKEN_KEY = 'admin_token';

// 清除token
const clearToken = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
};

// 设置token
const setToken = (token: string) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

// 获取token
const getToken = (): string | null => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
};

const initialState: AdminAuthState = {
    isAuthenticated: false,
    admin: null,
    loading: false,
    error: null,
    token: null,
}

export const adminLogin = createAsyncThunk(
    'adminAuth/login',
    async (
        credentials: { username: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await AdminAPI.login(credentials);
            if (response?.error) return rejectWithValue(response.error);
            if (!response?.token) return rejectWithValue('登录失败：服务器返回数据格式错误');

            // 检查token是否过期
            if (isTokenExpired(response.token)) {
                return rejectWithValue('Token已过期，请重新登录');
            }

            setToken(response.token);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || '登录失败，请稍后重试');
        }
    }
)

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {

        adminLogout(state) {
            clearToken();
            state.isAuthenticated = false;
            state.admin = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        },
        adminLoginFromStorage(state, action) {
            const token = getToken();
            if (token && !isTokenExpired(token)) {
                state.isAuthenticated = true;
                state.token = token;
                state.admin = action.payload.admin;
                state.loading = false;
                state.error = null;
            } else {
                // token不存在或已过期，清除状态
                if (token) {
                    clearToken();
                }
                state.isAuthenticated = false;
                state.admin = null;
                state.token = null;
                state.loading = false;
                state.error = null;
            }
        },
        // 检查并清除过期token
        checkTokenExpiry(state) {
            if (state.token && isTokenExpired(state.token)) {
                clearToken();
                state.isAuthenticated = false;
                state.admin = null;
                state.token = null;
                state.loading = false;
                state.error = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action: PayloadAction<any>) => {
                state.isAuthenticated = true;
                state.admin = action.payload.admin;
                state.token = action.payload.token;
                state.loading = false;
                state.error = null;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.admin = null;
                state.token = null;
                state.loading = false;
                state.error = action.payload as string;
            });
    },
})

export const { adminLogout, adminLoginFromStorage, checkTokenExpiry } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;