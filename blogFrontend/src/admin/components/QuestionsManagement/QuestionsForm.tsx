import React, { useState, useEffect } from 'react';
import type { Question } from '@/types/Question';
import styles from './QuestionsForm.module.scss';
import Select from '../ui/Select/Select';

const difficultyMap: Record<string, { label: string; color: string }> = {
    easy: { label: '简单', color: '#4CAF50' },
    medium: { label: '中等', color: '#FFC107' },
    hard: { label: '困难', color: '#F44336' },
};

export interface QuestionsFormData {
    title: string;
    content: string;
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'draft' | 'published';
}

interface QuestionsFormProps {
    initialValues?: {
        title?: string;
        content?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
        status?: 'draft' | 'published';
    };
    onSubmit?: (values: QuestionsFormData) => void;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({
    initialValues,
    onSubmit
}) => {
    const [formData, setFormData] = useState<QuestionsFormData>({
        title: '',
        content: '',
        difficulty: 'medium',
        status: 'draft',
        ...initialValues
    });



    useEffect(() => {
        if (initialValues) {
            setFormData(prev => ({
                ...prev,
                ...initialValues
            }));
        }
    }, [initialValues]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.difficulty || !formData.status) {
            alert('请填写所有必填字段');
            return;
        }
        onSubmit?.(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formItem}>
                <label className={styles.formLabel}>标题</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="输入面试题标题..."
                    required
                />
            </div>

            <div className={styles.formItem}>
                <label className={styles.formLabel}>内容</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="输入面试题内容..."
                    required
                />
            </div>

            <div className={styles.formItemRow}>
                <div className={styles.formItem}>
                    <label className={styles.formLabel}>难度</label>
                    <Select
                        value={formData.difficulty}
                        onChange={(value) => handleSelectChange('difficulty', value as string)}
                        options={Object.entries(difficultyMap).map(([key, { label }]) => ({
                            value: key,
                            label: label
                        }))}
                        placeholder="选择难度"
                    />
                </div>
                <div className={styles.formItem}>
                    <label className={styles.formLabel}>状态</label>
                    <Select
                        value={formData.status}
                        onChange={(value) => handleSelectChange('status', value as string)}
                        options={[
                            { value: 'draft', label: '草稿' },
                            { value: 'published', label: '已发布' }
                        ]}
                        placeholder="选择状态"
                    />
                </div>
            </div>

            <div className={styles.formFooter}>
                <button type="submit" className={styles.submitButton}>
                    {initialValues ? '更新' : '创建'}
                </button>
            </div>
        </form>
    );
};

export default QuestionsForm;