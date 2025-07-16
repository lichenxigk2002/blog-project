import React, { useState } from 'react';
import { ContentSettings } from './types';
import styles from './allSettings.module.scss'
import OperationTipModal from "@/admin/components/ui/OperationTipModal/OperationTipModal";

interface ContentSettingsPanelProps {
    settings: ContentSettings;
    onChange: (settings: Partial<ContentSettings>) => void;
    onSingleFieldSubmit: (field: keyof ContentSettings) => void;
    setTip: React.Dispatch<React.SetStateAction<{ open: boolean, message: string, type: 'success' | 'error' }>>;
}

const ContentSettingsPanel: React.FC<ContentSettingsPanelProps> = ({ settings, onChange, onSingleFieldSubmit, setTip }) => {
    // 新增本地 state 控制弹框
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'success' | 'error'>('success');
    // 新增本地 state 模拟文件大小输入
    const [mockFileSize, setMockFileSize] = useState(0);

    return (
        <div className={styles.settingsCard}>
            <div className={styles.cardTitle}>🎨 内容管理设置</div>
            <hr className={styles.cardDivider} />
            <div className={styles.panelContainer}>
                {/* 评论功能卡片 */}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>评论功能
                        {settings.commentsEnabled ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>允许用户对文章进行评论</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.commentsEnabled}
                                onChange={() => onChange({ commentsEnabled: !settings.commentsEnabled })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('commentsEnabled')
                                setTip({
                                    open: true,
                                    message: settings.commentsEnabled ? '评论功能已开启' : '评论功能已关闭',
                                    type: 'success'
                                });
                            }}>
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.commentsEnabled ? (
                                <>
                                    {/*<div className={styles.demoTitle}>发表评论演示</div>*/}
                                    <div className={styles.commentFormContainer}>
                                        <div className={styles.formTitle}>发表评论</div>
                                        <textarea className={styles.textarea} placeholder="写下你的评论..." disabled />
                                        <button className={styles.submitButton} disabled>发布评论</button>
                                    </div>
                                    <div className={styles.commentList}>
                                        <div className={styles.empty}>暂无评论，快来发表第一条评论吧！</div>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.commentFormContainer}>
                                    <div className={styles.loginPrompt}>
                                        <p>作者已关闭了评论功能</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* 文章自动保存功能卡片 */}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>文章自动保存功能
                        {settings.autoSaveEnabled ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>允许用户对文章进行评论</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.autoSaveEnabled}
                                onChange={() => onChange({ autoSaveEnabled: !settings.autoSaveEnabled })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('autoSaveEnabled');
                                setTip({
                                    open: true,
                                    message: settings.autoSaveEnabled ? '自动保存功能已开启' : '自动保存功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.autoSaveEnabled ? (
                                <div className={styles.autoSaveDemo}>
                                    {/*<div className={styles.demoTitle}>自动保存演示</div>*/}
                                    <input
                                        className={styles.demoInput}
                                        placeholder="这里模拟输入文章内容..."
                                        disabled
                                    />
                                    <div className={styles.demoTip}>
                                        <span className={styles.demoClock}>⏱️</span>
                                        停止输入 10 秒后，系统会自动保存草稿
                                    </div>
                                    <div className={styles.demoStatusSuccess}>
                                        <span className={styles.demoSuccessIcon}>✅</span>
                                        自动保存成功
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.autoSaveDemo}>
                                    <div className={styles.demoTitle}>自动保存演示</div>
                                    <div className={styles.demoStatusOff}>
                                        <span className={styles.demoOffIcon}>⏸️</span>
                                        自动保存已关闭
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*注册功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>注册功能
                        {settings.userRegistration ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>允许用户对文章进行评论</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.userRegistration}
                                onChange={() => onChange({ userRegistration: !settings.userRegistration })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('userRegistration');
                                setTip({
                                    open: true,
                                    message: settings.userRegistration ? '注册功能已开启' : '注册功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.userRegistration ? (
                                <div className={styles.registrationDemo}>
                                    {/*<div className={styles.demoTitle}>注册表单演示</div>*/}
                                    <input
                                        className={styles.demoInput}
                                        placeholder="用户名"
                                        disabled
                                    />
                                    <input
                                        className={styles.demoInput}
                                        placeholder="密码"
                                        type="password"
                                        disabled
                                    />
                                    <button className={styles.submitButton} disabled>注册</button>
                                    <div className={styles.demoTip}>
                                        <span className={styles.demoSuccessIcon}>✅</span>
                                        注册功能已开启，用户可注册新账号
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.registrationDemo}>
                                    {/*<div className={styles.demoTitle}>注册表单演示</div>*/}
                                    <div className={styles.demoStatusOff}>
                                        <span className={styles.demoOffIcon}>⏸️</span>
                                        注册已关闭，无法注册新用户
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*限制图片上传大小功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>最大上传文件大小功能
                    </div>
                    <div className={styles.miniCardDesc}>限制用户上传的单个文件最大体积（单位：MB）</div>
                    <div className={styles.miniCardControl}>
                        <input
                            type="number"
                            min={1}
                            max={1024}
                            value={settings.maxUploadSize}
                            className={styles.textarea}
                            onChange={e => {
                                const value = Number(e.target.value);
                                if (!isNaN(value)) {
                                    onChange({ maxUploadSize: value });
                                }
                            }}
                        />
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('maxUploadSize');
                                setTip({
                                    open: true,
                                    message: `最大上传文件大小已设置为 ${settings.maxUploadSize} MB`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.uploadDemo}>
                            <input
                                type="number"
                                min={0}
                                max={2048}
                                value={mockFileSize}
                                onChange={e => setMockFileSize(Number(e.target.value))}
                                className={styles.demoInput}
                                placeholder="模拟文件大小 (MB)"
                                style={{ width: '140px', marginRight: '8px' }}
                            />
                            <button
                                className={styles.submitButton}
                                onClick={() => {
                                    if (mockFileSize > settings.maxUploadSize) {
                                        setUploadStatus('error');
                                    } else {
                                        setUploadStatus('success');
                                    }
                                    setShowUploadModal(true);
                                }}
                            >
                                上传
                            </button>
                            <div className={styles.demoTip}>
                                <span className={styles.demoInfoIcon}>ℹ️</span>
                                当前最大上传文件大小：<b>{settings.maxUploadSize} MB</b>
                            </div>
                        </div>
                        {showUploadModal && (
                            <div className={styles.uploadModal} onClick={() => setShowUploadModal(false)}>
                                <div className={styles.uploadModalContent} onClick={e => e.stopPropagation()}>
                                    {uploadStatus === 'success' ? (
                                        <div className={styles.modalSuccess}>
                                            <span>✅ 上传成功！</span>
                                        </div>
                                    ) : (
                                        <div className={styles.modalError}>
                                            <span>❌ 文件过大，无法上传</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/*允许HTML标签功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>允许HTML标签
                        {settings.allowHtmlInMarkdown ? '(允许)' : '(禁止)'}
                    </div>
                    <div className={styles.miniCardDesc}>是否允许在Markdown内容中使用HTML标签</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.allowHtmlInMarkdown}
                                onChange={() => onChange({ allowHtmlInMarkdown: !settings.allowHtmlInMarkdown })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('allowHtmlInMarkdown');
                                setTip({
                                    open: true,
                                    message: settings.allowHtmlInMarkdown ? '已允许在Markdown中使用HTML标签' : '已禁止在Markdown中使用HTML标签',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.htmlDemo}>
                            <div className={styles.formTitle}>HTML标签演示</div>
                            {settings.allowHtmlInMarkdown ? (
                                <div className={styles.demoTip}>
                                    <span className={styles.demoSuccessIcon}>🌐</span>
                                    <span>支持 <code>&lt;div&gt;</code>、<code>&lt;span&gt;</code>、<code>&lt;img&gt;</code> 等标签</span>
                                </div>
                            ) : (
                                <div className={styles.demoStatusOff}>
                                    <span className={styles.demoOffIcon}>⏸️</span>
                                    禁止在Markdown中使用HTML标签
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* 其他设置项可按此模式扩展为小卡片 */}
            </div>

        </div>

    );
};

export default ContentSettingsPanel;