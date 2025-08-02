import type {LoginCredentials, User} from "@/types/auth";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AuthAPI} from "@/api/AuthAPI";

interface AuthState {
    isAuthenticated: boolean;    // 是否已认证（是否登录）
    user: User | null;           // 用户信息，未登录时为null
    isLoading: boolean;          // 是否正在加载（如登录请求中）
    error: string | null;        // 错误信息，无错误时为null
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
}


export const login = createAsyncThunk<User,LoginCredentials, { rejectValue: string }>(
    'auth/login',
    // @ts-ignore
    async (
        credentials: LoginCredentials,
        { rejectWithValue }
    ) => {
        try {
            let data;
            if (credentials.email && credentials.code){
                data = await AuthAPI.loginWithEmail(credentials.email, credentials.code);
            } else{
                data = await AuthAPI.login(credentials);
            }
            if (data.code === 200) {
                if (credentials.email && credentials.code) {
                    // 邮箱验证码登录
                    if (data.data.token) localStorage.setItem('token', data.data.token);
                    // 返回用户信息
                    return data.data.user;
                } else {
                    // 用户名密码登录
                    if (data.data.token) localStorage.setItem('token', data.data.token);
                    // 返回用户信息
                    return data.data.user;
                }
            } else {
                return rejectWithValue(data.message || '登录失败');
            }
        }catch (error: any) {
            // 这里捕获网络等异常，返回自定义错误信息
            return rejectWithValue(error?.message || '网络请求失败');
        }
    }
)

export const register = createAsyncThunk<any, // 注册成功返回什么类型（比如 User），你可以具体写
    { username: string; password: string },
    { rejectValue: string }>(
    'auth/register',
    async (
        credentials:{username: string, password: string},
        { dispatch, rejectWithValue }
    ) => {
        try {
            const data = await AuthAPI.register(credentials);
            if(data.code === 200){
                await dispatch(login(credentials));
                return data.data; // 或 return true/{}，看你后端返回什么
            }else{
                return rejectWithValue(data.message);
            }

        }catch ( error ) {
            return rejectWithValue('网络请求失败');
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout() {
            localStorage.removeItem('token');
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                // 注册成功后自动登录，user 状态由 login.fulfilled 更新
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;
