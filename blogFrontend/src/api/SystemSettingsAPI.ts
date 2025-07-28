import { http } from '@/http/request';
import { SystemSettings } from '@/admin/components/SystemSettings/types';
import {SystemSettingsApiResponse} from "@/admin/components/SystemSettings/types";


export const SystemSettingsAPI = {
  // 获取全部系统设置
  getSettings: () =>
    http.get<SystemSettingsApiResponse>('/system-settings/get'),

  // 单项保存：是否显示管理员登录入口
  setShowAdminLoginEntry: (value: boolean) =>
    http.post('/system-settings/set/showAdminLoginEntry', { value }),

  // 单项保存：开启/关闭评论
  setCommentsEnabled: (value: boolean) =>
    http.post('/system-settings/set/commentsEnabled', { value }),

  // 单项保存：自动保存
  setAutoSaveEnabled: (value: boolean) =>
    http.post('/system-settings/set/autoSaveEnabled', { value }),

  // 单项保存：用户注册
  setUserRegistration: (value: boolean) =>
    http.post('/system-settings/set/userRegistration', { value }),

  // 单项保存：最大上传文件大小
  setMaxUploadSize: (value: number) =>
    http.post('/system-settings/set/maxUploadSize', { value }),

  // 单项保存：Markdown允许HTML
  setAllowHtmlInMarkdown: (value: boolean) =>
    http.post('/system-settings/set/allowHtmlInMarkdown', { value }),

  // 单项保存：邮件通知
  setEmailNotifications: (value: boolean) =>
    http.post('/system-settings/set/emailNotifications', { value }),

  // 单项保存：新文章通知
  setNewArticleNotification: (value: boolean) =>
    http.post('/system-settings/set/newArticleNotification', { value }),

  // 单项保存：评论通知
  setCommentNotification: (value: boolean) =>
    http.post('/system-settings/set/commentNotification', { value }),

  // 单项保存：系统维护
  setSystemMaintenance: (value: boolean) =>
    http.post('/system-settings/set/systemMaintenance', { value }),

  // 单项保存：主题
  setTheme: (value: string) =>
    http.post('/system-settings/set/theme', { value }),

  // 单项保存：语言
  setLanguage: (value: string) =>
    http.post('/system-settings/set/language', { value }),

  // 单项保存：侧边栏收起
  setSidebarCollapsed: (value: boolean) =>
    http.post('/system-settings/set/sidebarCollapsed', { value }),

  // 单项保存：面包屑
  setShowBreadcrumb: (value: boolean) =>
    http.post('/system-settings/set/showBreadcrumb', { value }),

  // 单项保存：水印
  setShowWatermark: (value: boolean) =>
    http.post('/system-settings/set/showWatermark', { value }),

  // 单项保存：服务器端口
  setServerPort: (value: number) =>
    http.post('/system-settings/set/serverPort', { value }),

  // 单项保存：数据库状态
  setDatabaseStatus: (value: string) =>
    http.post('/system-settings/set/databaseStatus', { value }),

  // 单项保存：上传路径
  setUploadPath: (value: string) =>
    http.post('/system-settings/set/uploadPath', { value }),

  // 单项保存：版本
  setVersion: (value: string) =>
    http.post('/system-settings/set/version', { value }),

  // 整体保存
  saveAll: (data: SystemSettings) =>
    http.post('/system-settings/save', data),

  // 重置为默认
  reset: () =>
    http.post('/system-settings/reset', {}),
};
