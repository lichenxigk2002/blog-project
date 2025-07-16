import { SystemSettingsApiResponse } from '@/admin/components/SystemSettings/types';
import { SystemSettings } from '@/admin/components/SystemSettings/types';

// 扁平结构转分组结构
export function flatToGroupedSettings(flat: SystemSettingsApiResponse): SystemSettings {
    return {
        contentSettings: {
            commentsEnabled: flat.commentsEnabled,
            autoSaveEnabled: flat.autoSaveEnabled,
            userRegistration: flat.userRegistration,
            maxUploadSize: flat.maxUploadSize,
            allowHtmlInMarkdown: flat.allowHtmlInMarkdown,
        },
        notificationSettings: {
            emailNotifications: flat.emailNotifications,
            newArticleNotification: flat.newArticleNotification,
            commentNotification: flat.commentNotification,
            systemMaintenance: flat.systemMaintenance,
            showAdminLoginEntry: flat.showAdminLoginEntry,
        },
        uiSettings: {
            theme: flat.theme,
            language: flat.language,
            sidebarCollapsed: flat.sidebarCollapsed,
            showBreadcrumb: flat.showBreadcrumb,
            showWatermark: flat.showWatermark,
        },
        systemInfo: {
            serverPort: flat.serverPort,
            databaseStatus: flat.databaseStatus,
            uploadPath: flat.uploadPath,
            version: flat.version,
            lastUpdate: flat.lastUpdate,
        }
    };
}

export function groupedToFlatSettings(grouped: SystemSettings): SystemSettingsApiResponse {
    return {
        id: 1, // 如有需要
        commentsEnabled: grouped.contentSettings.commentsEnabled,
        autoSaveEnabled: grouped.contentSettings.autoSaveEnabled,
        userRegistration: grouped.contentSettings.userRegistration,
        maxUploadSize: grouped.contentSettings.maxUploadSize,
        allowHtmlInMarkdown: grouped.contentSettings.allowHtmlInMarkdown,
        emailNotifications: grouped.notificationSettings.emailNotifications,
        newArticleNotification: grouped.notificationSettings.newArticleNotification,
        commentNotification: grouped.notificationSettings.commentNotification,
        systemMaintenance: grouped.notificationSettings.systemMaintenance,
        showAdminLoginEntry: grouped.notificationSettings.showAdminLoginEntry,
        theme: grouped.uiSettings.theme,
        language: grouped.uiSettings.language,
        sidebarCollapsed: grouped.uiSettings.sidebarCollapsed,
        showBreadcrumb: grouped.uiSettings.showBreadcrumb,
        showWatermark: grouped.uiSettings.showWatermark,
        serverPort: grouped.systemInfo.serverPort,
        databaseStatus: grouped.systemInfo.databaseStatus,
        uploadPath: grouped.systemInfo.uploadPath,
        version: grouped.systemInfo.version,
        lastUpdate: grouped.systemInfo.lastUpdate,
    };
}