import { SystemSettingsAPI } from '@/api/SystemSettingsAPI';
import {
  // ContentSettings
  modifyCommentsEnabled,
  modifyAutoSaveEnabled,
  modifyUserRegistration,
  modifyMaxUploadSize,
  modifyAllowHtmlInMarkdown,
  // NotificationSettings
  modifyEmailNotifications,
  modifyNewArticleNotification,
  modifyCommentNotification,
  modifySystemMaintenance,
  modifyShowAdminLoginEntry,
  // UISettings
  modifyTheme,
  modifyLanguage,
  modifySidebarCollapsed,
  modifyShowBreadcrumb,
  modifyShowWatermark,
  // SystemInfo
  modifyServerPort,
  modifyDatabaseStatus,
  modifyUploadPath,
  modifyVersion,
  modifyLastUpdate,
} from '@/redux/systemSettingsSlice';


// ContentSettings 映射
export const contentFieldApiMap = {
  commentsEnabled: SystemSettingsAPI.setCommentsEnabled,
  autoSaveEnabled: SystemSettingsAPI.setAutoSaveEnabled,
  userRegistration: SystemSettingsAPI.setUserRegistration,
  maxUploadSize: SystemSettingsAPI.setMaxUploadSize,
  allowHtmlInMarkdown: SystemSettingsAPI.setAllowHtmlInMarkdown,
} as const;

export const contentFieldReduxMap = {
  commentsEnabled: modifyCommentsEnabled,
  autoSaveEnabled: modifyAutoSaveEnabled,
  userRegistration: modifyUserRegistration,
  maxUploadSize: modifyMaxUploadSize,
  allowHtmlInMarkdown: modifyAllowHtmlInMarkdown,
} as const;

export type ContentFieldKey = keyof typeof contentFieldApiMap;

// NotificationSettings 映射
export const notificationFieldApiMap = {
  emailNotifications: SystemSettingsAPI.setEmailNotifications,
  newArticleNotification: SystemSettingsAPI.setNewArticleNotification,
  commentNotification: SystemSettingsAPI.setCommentNotification,
  systemMaintenance: SystemSettingsAPI.setSystemMaintenance,
  showAdminLoginEntry: SystemSettingsAPI.setShowAdminLoginEntry,
} as const;

export const notificationFieldReduxMap = {
  emailNotifications: modifyEmailNotifications,
  newArticleNotification: modifyNewArticleNotification,
  commentNotification: modifyCommentNotification,
  systemMaintenance: modifySystemMaintenance,
  showAdminLoginEntry: modifyShowAdminLoginEntry,
} as const;

export type NotificationFieldKey = keyof typeof notificationFieldApiMap;

// UISettings 映射
export const uiFieldApiMap = {
  theme: SystemSettingsAPI.setTheme,
  language: SystemSettingsAPI.setLanguage,
  sidebarCollapsed: SystemSettingsAPI.setSidebarCollapsed,
  showBreadcrumb: SystemSettingsAPI.setShowBreadcrumb,
  showWatermark: SystemSettingsAPI.setShowWatermark,
} as const;

export const uiFieldReduxMap = {
  theme: modifyTheme,
  language: modifyLanguage,
  sidebarCollapsed: modifySidebarCollapsed,
  showBreadcrumb: modifyShowBreadcrumb,
  showWatermark: modifyShowWatermark,
} as const;

export type UIFieldKey = keyof typeof uiFieldApiMap;

// SystemInfo 映射
export const systemInfoFieldApiMap = {
  serverPort: SystemSettingsAPI.setServerPort,
  databaseStatus: SystemSettingsAPI.setDatabaseStatus,
  uploadPath: SystemSettingsAPI.setUploadPath,
  version: SystemSettingsAPI.setVersion,
  // lastUpdate 字段没有对应的 API 方法
} as const;

export const systemInfoFieldReduxMap = {
  serverPort: modifyServerPort,
  databaseStatus: modifyDatabaseStatus,
  uploadPath: modifyUploadPath,
  version: modifyVersion,
  // lastUpdate 字段没有对应的 API 方法
} as const;

export type SystemInfoFieldKey = keyof typeof systemInfoFieldApiMap; 