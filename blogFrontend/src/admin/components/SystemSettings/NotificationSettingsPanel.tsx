import React, { useState } from 'react';
import { NotificationSettings } from './types';
import styles from './allSettings.module.scss'
import OperationTipModal from "@/admin/components/ui/OperationTipModal/OperationTipModal";
import AdminAvatarPreview from "@/components/AdminAvatarPreview/AdminAvatarPreview";

interface NotificationSettingsPanelProps {
    settings: NotificationSettings;
    onChange: (settings: Partial<NotificationSettings>) => void;
    onSingleFieldSubmit: (field: keyof NotificationSettings) => void;
    setTip: React.Dispatch<React.SetStateAction<{ open: boolean, message: string, type: 'success' | 'error' }>>;
}

const NotificationSettingsPanel: React.FC<NotificationSettingsPanelProps> = ({ settings, onChange, onSingleFieldSubmit, setTip }) => {

    return (
        <div className={styles.settingsCard}>
            <div className={styles.cardTitle}>🎨 通知管理设置</div>
            <hr className={styles.cardDivider} />
            <div className={styles.panelContainer}>
                {/*登录状态显示功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>登录状态显示功能
                        {settings.showAdminLoginEntry ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>像用户展示登录状态</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.showAdminLoginEntry}
                                onChange={() => onChange({ showAdminLoginEntry: !settings.showAdminLoginEntry })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('showAdminLoginEntry');
                                setTip({
                                    open: true,
                                    message: settings.showAdminLoginEntry ? '登录状态显示功能已开启' : '登录状态显示功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <AdminAvatarPreview showAdminLoginEntry={settings.showAdminLoginEntry} />
                    </div>
                </div>
                {/*邮件通知功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>邮件推送订阅功能
                        {settings.emailNotifications ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>允许用户订阅邮件推送</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={() => onChange({ emailNotifications: !settings.emailNotifications })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('emailNotifications');
                                setTip({
                                    open: true,
                                    message: settings.emailNotifications ? '邮件推送订阅功能已开启' : '邮件推送订阅功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.emailNotifications ? (
                                <div className={styles.emailDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>邮件推送订阅功能</div>
                                        <input
                                            className={styles.demoInput}
                                            placeholder="用户邮箱地址"
                                            disabled
                                        />
                                        <div className={styles.demoTip}>
                                            <span className={styles.demoSuccessIcon}>📧</span>
                                            邮件推送订阅功能已开启，有新文章发布时会发送邮件给用户
                                        </div>
                                        <div className={styles.demoStatusSuccess}>
                                            <span className={styles.demoSuccessIcon}>✅</span>
                                            订阅已成功
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emailDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>邮件推送订阅功能</div>
                                        <div className={styles.demoStatusOff}>
                                            <span className={styles.demoOffIcon}>⏸️</span>
                                            孤芳不自赏已关闭邮件推送订阅
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*新文章通知功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>新文章通知功能
                        {settings.newArticleNotification ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>当发布新文章时自动发送通知给订阅用户</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.newArticleNotification}
                                onChange={() => onChange({ newArticleNotification: !settings.newArticleNotification })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('newArticleNotification');
                                setTip({
                                    open: true,
                                    message: settings.newArticleNotification ? '新文章通知功能已开启' : '新文章通知功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.newArticleNotification ? (
                                <div className={styles.articleNotificationDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>新文章通知演示</div>
                                        <div className={styles.demoTip}>
                                            <span className={styles.demoSuccessIcon}>📝</span>
                                            新文章发布时，订阅用户将收到通知
                                        </div>
                                        <div className={styles.demoStatusSuccess}>
                                            <span className={styles.demoSuccessIcon}>✅</span>
                                            通知已发送给 128 位订阅用户
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.articleNotificationDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>新文章通知演示</div>
                                        <div className={styles.demoStatusOff}>
                                            <span className={styles.demoOffIcon}>⏸️</span>
                                            新文章通知已关闭
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*评论通知功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>评论通知功能
                        {settings.commentNotification ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>当有新评论时自动发送通知给文章作者</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.commentNotification}
                                onChange={() => onChange({ commentNotification: !settings.commentNotification })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('commentNotification');
                                setTip({
                                    open: true,
                                    message: settings.commentNotification ? '评论通知功能已开启' : '评论通知功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.commentNotification ? (
                                <div className={styles.commentNotificationDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>评论通知演示</div>
                                        <div className={styles.demoTip}>
                                            <span className={styles.demoSuccessIcon}>💬</span>
                                            有新评论时，文章作者将收到通知
                                        </div>
                                        <div className={styles.demoStatusSuccess}>
                                            <span className={styles.demoSuccessIcon}>✅</span>
                                            评论通知已发送给作者
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.commentNotificationDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>评论通知演示</div>
                                        <div className={styles.demoStatusOff}>
                                            <span className={styles.demoOffIcon}>⏸️</span>
                                            评论通知已关闭
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*系统维护通知功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>系统维护通知功能
                        {settings.systemMaintenance ? '(开启)' : '(关闭)'}
                    </div>
                    <div className={styles.miniCardDesc}>系统维护时自动发送通知给所有用户</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.systemMaintenance}
                                onChange={() => onChange({ systemMaintenance: !settings.systemMaintenance })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('systemMaintenance');
                                setTip({
                                    open: true,
                                    message: settings.systemMaintenance ? '系统维护通知功能已开启' : '系统维护通知功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div>
                            {settings.systemMaintenance ? (
                                <div className={styles.maintenanceNotificationDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>系统维护通知演示</div>
                                        <div className={styles.demoTip}>
                                            <span className={styles.demoSuccessIcon}>🔧</span>
                                            系统维护时，所有用户将收到通知
                                        </div>
                                        <div className={styles.demoStatusSuccess}>
                                            <span className={styles.demoSuccessIcon}>✅</span>
                                            维护通知已发送给所有用户
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.maintenanceNotificationDemo}>
                                    <div className={styles.emailFormContainer}>
                                        <div className={styles.formTitle}>系统维护通知演示</div>
                                        <div className={styles.demoStatusOff}>
                                            <span className={styles.demoOffIcon}>⏸️</span>
                                            系统维护通知已关闭
                                        </div>
                                    </div>
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

export default NotificationSettingsPanel;