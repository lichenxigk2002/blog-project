import React from 'react';
import { SystemInfo } from './types';
import styles from './allSettings.module.scss';

interface SystemInfoPanelProps {
    settings: SystemInfo;
    onChange: (settings: Partial<SystemInfo>) => void;
    onSingleFieldSubmit: (field: keyof SystemInfo) => void;
    setTip: React.Dispatch<React.SetStateAction<{ open: boolean, message: string, type: 'success' | 'error' }>>;
}

const SystemInfoPanel: React.FC<SystemInfoPanelProps> = ({ settings, onChange, onSingleFieldSubmit, setTip }) => {
    return (
        <div className={styles.settingsCard}>
            <div className={styles.cardTitle}>🎨 系统信息</div>
            <hr className={styles.cardDivider} />
            <div className={styles.panelContainer}>
                {/*服务器端口功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>服务器端口设置</div>
                    <div className={styles.miniCardDesc}>配置服务器运行端口号</div>
                    <div className={styles.miniCardControl}>
                        <input
                            type="number"
                            min={1024}
                            max={65535}
                            value={settings.serverPort}
                            className={styles.textarea}
                            onChange={e => {
                                const value = Number(e.target.value);
                                if (!isNaN(value)) {
                                    onChange({ serverPort: value });
                                }
                            }}
                        />
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('serverPort');
                                setTip({
                                    open: true,
                                    message: `服务器端口已设置为 ${settings.serverPort}`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.portDemo}>
                            <div className={styles.formTitle}>端口设置演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>🔌</span>
                                当前端口：{settings.serverPort}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                端口设置已生效
                            </div>
                        </div>
                    </div>
                </div>
                {/*数据库状态功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>数据库连接状态
                        {settings.databaseStatus === 'connected' ? '(已连接)' : '(未连接)'}
                    </div>
                    <div className={styles.miniCardDesc}>显示数据库连接状态</div>
                    <div className={styles.miniCardControl}>
                        <select
                            value={settings.databaseStatus}
                            onChange={(e) => onChange({ databaseStatus: e.target.value as 'connected' | 'disconnected' })}
                            className={styles.textarea}
                        >
                            <option value="connected">已连接</option>
                            <option value="disconnected">未连接</option>
                        </select>
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('databaseStatus');
                                setTip({
                                    open: true,
                                    message: `数据库状态已更新为${settings.databaseStatus === 'connected' ? '已连接' : '未连接'}`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.databaseDemo}>
                            <div className={styles.formTitle}>数据库状态演示</div>
                            {settings.databaseStatus === 'connected' ? (
                                <div className={styles.demoTip}>
                                    <span className={styles.demoSuccessIcon}>🟢</span>
                                    数据库连接正常
                                </div>
                            ) : (
                                <div className={styles.demoStatusOff}>
                                    <span className={styles.demoOffIcon}>🔴</span>
                                    数据库连接异常
                                </div>
                            )}
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                状态已更新
                            </div>
                        </div>
                    </div>
                </div>
                {/*文件上传路径功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>文件上传路径设置</div>
                    <div className={styles.miniCardDesc}>配置文件上传的存储路径</div>
                    <div className={styles.miniCardControl}>
                        <input
                            type="text"
                            value={settings.uploadPath}
                            className={styles.textarea}
                            onChange={e => onChange({ uploadPath: e.target.value })}
                            placeholder="请输入上传路径"
                        />
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('uploadPath');
                                setTip({
                                    open: true,
                                    message: `文件上传路径已设置为 ${settings.uploadPath}`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.uploadPathDemo}>
                            <div className={styles.formTitle}>上传路径演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>📁</span>
                                当前路径：{settings.uploadPath}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                路径设置已生效
                            </div>
                        </div>
                    </div>
                </div>
                {/*系统版本功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>系统版本信息</div>
                    <div className={styles.miniCardDesc}>显示当前系统版本号</div>
                    <div className={styles.miniCardControl}>
                        <input
                            type="text"
                            value={settings.version}
                            className={styles.textarea}
                            onChange={e => onChange({ version: e.target.value })}
                            placeholder="请输入版本号"
                        />
                        <button
                            className={styles.submitButton}
                            onClick={() => {
                                onSingleFieldSubmit('version');
                                setTip({
                                    open: true,
                                    message: `系统版本已更新为 ${settings.version}`,
                                    type: 'success'
                                });
                            }}
                        >
                            提交
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.versionDemo}>
                            <div className={styles.formTitle}>版本信息演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>📦</span>
                                当前版本：{settings.version}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>✅</span>
                                版本信息已更新
                            </div>
                        </div>
                    </div>
                </div>
                {/*最后更新时间功能卡片*/}
                <div className={styles.miniCard}>
                    <div className={styles.miniCardTitle}>最后更新时间</div>
                    <div className={styles.miniCardDesc}>显示系统最后更新时间（只读）</div>
                    <div className={styles.miniCardControl}>
                        <input
                            type="text"
                            value={settings.lastUpdate}
                            className={styles.textarea}
                            disabled
                            placeholder="系统自动更新"
                        />
                        <button
                            className={styles.submitButton}
                            disabled
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                            只读
                        </button>
                    </div>
                    <div className={styles.miniCardPreview}>
                        <div className={styles.updateTimeDemo}>
                            <div className={styles.formTitle}>更新时间演示</div>
                            <div className={styles.demoTip}>
                                <span className={styles.demoSuccessIcon}>🕒</span>
                                最后更新：{settings.lastUpdate}
                            </div>
                            <div className={styles.demoStatusSuccess}>
                                <span className={styles.demoSuccessIcon}>📋</span>
                                此字段为只读，系统自动维护
                            </div>
                        </div>
                    </div>
                </div>
                {/* 其他设置项可按此模式扩展为小卡片 */}
            </div>
        </div>
    );
};

export default SystemInfoPanel;