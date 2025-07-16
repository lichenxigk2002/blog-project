// 内容管理设置
export interface ContentSettings {
    commentsEnabled: boolean;        // 是否开启评论功能
    autoSaveEnabled: boolean;        // 是否开启自动保存
    userRegistration: boolean;       // 是否开放用户注册
    maxUploadSize: number;           // 最大上传文件大小（MB）
    allowHtmlInMarkdown: boolean;    // 是否允许在Markdown中使用HTML标签
}
//内容设置默认值
export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
    commentsEnabled: true,
    autoSaveEnabled: true,
    userRegistration: true,
    maxUploadSize: 10,
    allowHtmlInMarkdown: true
};

// 通知设置
export interface NotificationSettings {
    emailNotifications: boolean;     // 是否开启邮件订阅功能
    newArticleNotification: boolean; // 是否发送新文章通知
    commentNotification: boolean;    // 是否发送评论通知
    systemMaintenance: boolean;      // 是否发送系统维护通知
    showAdminLoginEntry: boolean;    // 是否显示管理员登录状态
}
// 通知设置默认值
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    emailNotifications: true,
    newArticleNotification: true,
    commentNotification: true,
    systemMaintenance: true,
    showAdminLoginEntry: true
};

// 界面设置
export interface UISettings {
    theme: 'light' | 'dark' | 'auto';  // 主题模式：浅色/深色/自动
    language: 'zh-CN' | 'en-US';       // 语言设置：中文/英文
    sidebarCollapsed: boolean;         // 侧边栏是否默认收起
    showBreadcrumb: boolean;              // 是否显示面包屑导航
    showWatermark: boolean;            // 是否显示水印
}

// 界面设置默认值
export const DEFAULT_UI_SETTINGS: UISettings = {
    theme: 'auto',
    language: 'zh-CN',
    sidebarCollapsed: false,
    showBreadcrumb: true,
    showWatermark: false
};

// 系统信息
export interface SystemInfo {
    serverPort: number;              // 服务器端口
    databaseStatus: 'connected' | 'disconnected';  // 数据库连接状态
    uploadPath: string;              // 文件上传路径
    version: string;                 // 系统版本
    lastUpdate: string;              // 最后更新时间
}

export const DEFAULT_SYSTEM_INFO: SystemInfo = {
    serverPort: 3000,
    databaseStatus: 'connected',
    uploadPath: '/uploads',
    version: '1.0.0',
    lastUpdate: '2023-04-05'
};

// 主Props接口
export interface SystemSettingsProps {
    contentSettings: ContentSettings;           // 内容设置数据
    notificationSettings: NotificationSettings; // 通知设置数据
    uiSettings: UISettings;                     // 界面设置数据
    systemInfo: SystemInfo;                     // 系统信息数据
    onContentChange: (settings: Partial<ContentSettings>) => void;     // 内容设置变化回调
    onNotificationChange: (settings: Partial<NotificationSettings>) => void; // 通知设置变化回调
    onUIChange: (settings: Partial<UISettings>) => void;              // 界面设置变化回调
    onSave: () => void;                        // 保存设置回调
    onReset: () => void;                       // 重置设置回调
}

export interface SystemSettings {
    contentSettings: ContentSettings;
    notificationSettings: NotificationSettings;
    uiSettings: UISettings;
    systemInfo: SystemInfo;
}

export interface SystemSettingsApiResponse {
    id: number;
    commentsEnabled: boolean;
    autoSaveEnabled: boolean;
    userRegistration: boolean;
    maxUploadSize: number;
    allowHtmlInMarkdown: boolean;
    emailNotifications: boolean;
    newArticleNotification: boolean;
    commentNotification: boolean;
    systemMaintenance: boolean;
    showAdminLoginEntry: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: 'zh-CN' | 'en-US';
    sidebarCollapsed: boolean;
    showBreadcrumb: boolean;
    showWatermark: boolean;
    serverPort: number;
    databaseStatus: 'connected' | 'disconnected';
    uploadPath: string;
    version: string;
    lastUpdate: string;
}