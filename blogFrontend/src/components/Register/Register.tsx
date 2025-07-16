import React, { useState } from 'react';
import {RootState, useAppDispatch} from '@/redux/store';
import {useSelector} from "react-redux";
import { register } from '@/redux/authSlice';
import styles from './Register.module.scss';
import { validatePassword } from '@/utils/validate';

interface RegisterProps {
    onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
    const [showPassword, setShowPassword] = useState(false);
    const userRegistration = useSelector((state:RootState) => state.settings.contentSettings.userRegistration)

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username) {
            newErrors.username = '用户名不能为空';
        } else if (formData.username.length < 3) {
            newErrors.username = '用户名至少需要3个字符';
        }

        if (!formData.password) {
            newErrors.password = '密码不能为空';
        } else if (formData.password.length < 6) {
            newErrors.password = '密码至少需要6个字符';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const updatePasswordStrength = (password: string) => {
        const { isValid } = validatePassword(password);

        if (!isValid) {
            setPasswordStrength('weak');
            return;
        }

        let strength = 0;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

        if (strength >= 4) {
            setPasswordStrength('strong');
        } else if (strength >= 3) {
            setPasswordStrength('medium');
        } else {
            setPasswordStrength('weak');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setFormData(prev => ({
            ...prev,
            password: newPassword
        }));
        updatePasswordStrength(newPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 验证密码
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                setError(passwordValidation.message);
                setIsLoading(false);
                return;
            }

            // 验证用户名
            if (!formData.username) {
                setError('用户名不能为空');
                setIsLoading(false);
                return;
            }

            // 直接调用注册API，不使用加密
            await dispatch(register({
                username: formData.username,
                password: formData.password
            }));

            // 注册成功后关闭注册框
            onClose();
        } catch (error) {
            console.error('Registration failed:', error);
            setError('注册失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles.modalOverlay} ${styles.active}`}>
            <div className={styles.registerCard}>
                <div className={styles.header}>
                    <h2>注册账号</h2>
                </div>

                {userRegistration ? <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="username">用户名</label>
                        <input
                            className={`${styles.input} ${errors.username ? styles.error : ''}`}
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                        />
                        {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>密码</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={styles.input}
                                value={formData.password}
                                onChange={handlePasswordChange}
                                placeholder="请输入密码"
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePasswordButton}
                                onClick={() => setShowPassword(!showPassword)}
                                data-show={showPassword}
                                aria-label={showPassword ? "隐藏密码" : "显示密码"}
                            />
                            <button
                                type="button"
                                className={styles.generatePasswordButton}
                                onClick={() => {
                                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
                                    let pwd = '';
                                    for (let i = 0; i < 12; i++) {
                                        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
                                    }
                                    setFormData(prev => ({ ...prev, password: pwd }));
                                    updatePasswordStrength(pwd);
                                }}
                                title="自动生成强密码"
                            >生成密码</button>
                        </div>
                        <div className={styles.passwordStrength}>
                            <div className={`${styles.strengthBar} ${styles[`strength${passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}`]}`} />
                        </div>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '注册中...' : '注册'}
                    </button>
                </form>:<div className={styles.info}>
                    <label className={styles.labelInfo}>站长已将账号密码注册功能关闭啦，可以使用邮箱登录哦</label>
                </div>
                }

                <div className={styles.footer}>
                    <button className={styles.switchButton} onClick={onClose}>
                        返回登录
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;