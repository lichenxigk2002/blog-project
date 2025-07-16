import React from 'react';
import { UISettings } from './types';
import styles from './allSettings.module.scss';
import Watermark from "@/components/Watermark/Watermark";

interface UiSettingsPanelProps {
    settings: UISettings;
    onChange: (settings: Partial<UISettings>) => void;
    onSingleFieldSubmit: (field: keyof UISettings) => void;
    setTip: React.Dispatch<React.SetStateAction<{ open: boolean, message: string, type: 'success' | 'error' }>>;
}

const UiSettingsPanel: React.FC<UiSettingsPanelProps> = ({ settings, onChange, onSingleFieldSubmit, setTip }) => {
    return (
        <div className={styles.settingsCard}>
            <div className={styles.cardTitle}>🎨 界面设置</div>
            <hr className={styles.cardDivider} />
            <div className={styles.panelContainer}>
                {/*主题模式功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>主题模式设置</div>
                    <div className={styles.miniCardDesc}>选择网站的主题显示模式</div>
                    <div className={styles.miniCardControl}>
                        <select
                            value={settings.theme}
                            onChange={(e) => onChange({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
                            className={styles.textarea}
                        >
                            <option value="light">浅色模式</option>
                            <option value="dark">深色模式</option>
                            <option value="auto">自动模式</option>
                        </select>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('theme');
                                setTip({
                                    open: true,
                                    message: `主题模式已设置为${settings.theme === 'light' ? '浅色模式' : settings.theme === 'dark' ? '深色模式' : '自动模式'}`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.themeDemo}>
                            <div className={styles.formTitle}>主题模式演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>🎨</span>
                                当前主题：{settings.theme === 'light' ? '浅色模式' : settings.theme === 'dark' ? '深色模式' : '自动模式'}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                主题设置已生效
                            </div>
                        </div>
                    </div>
                </div>
                {/*语言设置功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>语言设置</div>
                    <div className={styles.miniCardDesc}>选择网站显示语言</div>
                    <div className={styles.miniCardControl}>
                        <select
                            value={settings.language}
                            onChange={(e) => onChange({ language: e.target.value as 'zh-CN' | 'en-US' })}
                            className={styles.textarea}
                        >
                            <option value="zh-CN">中文</option>
                            <option value="en-US">English</option>
                        </select>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('language');
                                setTip({
                                    open: true,
                                    message: `语言设置已更改为${settings.language === 'zh-CN' ? '中文' : 'English'}`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.languageDemo}>
                            <div className={styles.formTitle}>语言设置演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>🌐</span>
                                当前语言：{settings.language === 'zh-CN' ? '中文' : 'English'}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                语言设置已生效
                            </div>
                        </div>
                    </div>
                </div>
                {/*侧边栏设置功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>侧边栏默认状态
                        {settings.sidebarCollapsed ? '(收起)' : '(展开)'}
                    </div>
                    <div className={styles.miniCardDesc}>设置侧边栏的默认显示状态</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.sidebarCollapsed}
                                onChange={() => onChange({ sidebarCollapsed: !settings.sidebarCollapsed })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('sidebarCollapsed');
                                setTip({
                                    open: true,
                                    message: settings.sidebarCollapsed ? '侧边栏默认收起' : '侧边栏默认展开',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.sidebarDemo}>
                            <div className={styles.formTitle}>侧边栏状态演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>📱</span>
                                侧边栏默认{settings.sidebarCollapsed ? '收起' : '展开'}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                设置已生效
                            </div>
                        </div>
                    </div>
                </div>
                {/*面包屑导航功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>面包屑导航
                        {settings.showBreadcrumb ? '(显示)' : '(隐藏)'}
                    </div>
                    <div className={styles.miniCardDesc}>是否在页面中显示面包屑导航</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.showBreadcrumb}
                                onChange={() => onChange({ showBreadcrumb: !settings.showBreadcrumb })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('showBreadcrumb');
                                setTip({
                                    open: true,
                                    message: settings.showBreadcrumb ? '面包屑导航已显示' : '面包屑导航已隐藏',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.breadcrumbDemo}>
                            <div className={styles.formTitle}>面包屑导航演示</div>
                            {settings.showBreadcrumb ? (
                                <div className={styles.demoTip}>
                                    <span className={styles.demoSuccessIcon}>📍</span>
                                    首页 {'>'} 文章管理 {'>'} 编辑文章
                                </div>
                            ) : (
                                <div className={styles.demoStatusOff}>
                                    <span className={styles.demoOffIcon}>⏸️</span>
                                    面包屑导航已隐藏
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/*水印功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>水印功能
                        {settings.showWatermark ? '(显示)' : '(隐藏)'}
                    </div>
                    <div className={styles.miniCardDesc}>是否在页面中显示水印</div>
                    <div className={styles.miniCardControl}>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={settings.showWatermark}
                                onChange={() => onChange({ showWatermark: !settings.showWatermark })}
                            />
                            <span className={styles.slider}></span>
                        </label>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('showWatermark');
                                setTip({
                                    open: true,
                                    message: settings.showWatermark ? '水印功能已开启' : '水印功能已关闭',
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                        {settings.showWatermark ?
                            <Watermark
                                content="孤芳不自赏"
                                opacity={1} // 设置水印透明度
                                gap={[150, 150]} // 设置水印间隔
                                debug={true}>
                                <div className={styles.miniCardPreview}>
                            <div className={styles.watermarkDemo}>
                                <div className={styles.formTitle}>水印功能演示</div>
                                <div className={styles.demoTip}>
                                    <span className={styles.demoSuccessIcon}>💧</span>
                                    页面水印已显示
                                </div>
                            </div>
                                </div>
                        </Watermark>:
                            <div className={styles.miniCardPreview}>
                            <div className={styles.watermarkDemo}>
                            <div className={styles.formTitle}>水印功能演示</div>
                            <div className={styles.demoStatusOff}>
                                <span className={styles.demoOffIcon}>⏸️</span>
                                水印功能已关闭
                            </div>
                        </div></div>}
                </div>
                {/* 其他设置项可按此模式扩展为小卡片 */}
            </div>
        </div>
    );
};

export default UiSettingsPanel;