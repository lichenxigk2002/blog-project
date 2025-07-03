import React, { useState, useEffect, useRef } from 'react';
import type { BulletinBoardProps } from '@/types/BulletinBoard';
import styles from './BulletinBoardForm.module.scss';
import { http } from '@/utils/request';
import { ApiResponse } from '@/types/common';

interface BulletinBoardFormProps {
    initialValues?: BulletinBoardProps;
    onSubmit: (values: BulletinBoardProps) => void;
}

interface AvatarUploadResponse {
    url: string;
}

const BulletinBoardForm: React.FC<BulletinBoardFormProps> = ({
    initialValues,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<BulletinBoardProps>({
        id: 0,
        name: '',
        email: '',
        content: '',
        gender: '小哥哥',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        avatar: ''
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
            if (initialValues.avatar) {
                setAvatarPreview(initialValues.avatar);
            }
        }
    }, [initialValues]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let avatarUrl = formData.avatar || '';
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);
                const response = await http.post<{ url: string }>('/bulletinboard/upload-avatar', formData);
                if (response && response.url) {
                    avatarUrl = response.url;
                } else {
                    throw new Error('头像上传失败');
                }
            }

            const submitData = {
                ...formData,
                avatar: avatarUrl
            };

            onSubmit(submitData);
        } catch (error: any) {
            console.error('提交失败:', error);
            alert(error.message || '提交失败');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formItem}>
                <label className={styles.label}>头像</label>
                <div className={styles.avatarUpload}>
                    <div
                        className={`${styles.avatarPreview} ${formData.gender === '小姐姐' ? styles.female : styles.male}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="预览" />
                        ) : (
                            <span>点击上传</span>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>姓名</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>邮箱</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>性别</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={styles.select}
                >
                    <option value="小哥哥">小哥哥</option>
                    <option value="小姐姐">小姐姐</option>
                </select>
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>状态</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={styles.select}
                >
                    <option value="pending">待审核</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">已拒绝</option>
                </select>
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>置顶</label>
                <input
                    type="checkbox"
                    name="isPinned"
                    checked={formData.isPinned}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>内容</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.label}>回复</label>
                <textarea
                    name="reply"
                    value={formData.reply || ''}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="输入回复内容..."
                />
            </div>

            <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>
                    {initialValues ? '更新' : '创建'}
                </button>
            </div>
        </form>
    );
};

export default BulletinBoardForm;