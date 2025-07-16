import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {
    SystemSettings,
    DEFAULT_CONTENT_SETTINGS,
    DEFAULT_NOTIFICATION_SETTINGS,
    DEFAULT_UI_SETTINGS,
    DEFAULT_SYSTEM_INFO
} from '@/admin/components/SystemSettings/types';


const initialState: SystemSettings = {
    contentSettings: DEFAULT_CONTENT_SETTINGS,
    notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
    uiSettings: DEFAULT_UI_SETTINGS,
    systemInfo: DEFAULT_SYSTEM_INFO
};

const systemSettingsSlice = createSlice({
    name: 'systemSettings',
    initialState,
    reducers: {
        modifyAllSettings(state, action: PayloadAction<SystemSettings>) {
            return { ...state, ...action.payload };
        },
        modifyCommentsEnabled(state ,action: PayloadAction<boolean>){
            state.contentSettings.commentsEnabled = action.payload;
        },
        modifyAutoSaveEnabled(state ,action: PayloadAction<boolean>){
            state.contentSettings.autoSaveEnabled = action.payload;
        },
        modifyUserRegistration(state ,action: PayloadAction<boolean>){
            state.contentSettings.userRegistration = action.payload;
        },
        modifyMaxUploadSize(state ,action: PayloadAction<number>){
            state.contentSettings.maxUploadSize = action.payload;
        },
        modifyAllowHtmlInMarkdown(state ,action: PayloadAction<boolean>){
            state.contentSettings.allowHtmlInMarkdown = action.payload;
        },
        modifyEmailNotifications(state ,action: PayloadAction<boolean>){
            state.notificationSettings.emailNotifications = action.payload;
        },
        modifyNewArticleNotification(state ,action: PayloadAction<boolean>){
            state.notificationSettings.newArticleNotification = action.payload;
        },
        modifyCommentNotification(state ,action: PayloadAction<boolean>){
            state.notificationSettings.commentNotification = action.payload;
        },
        modifySystemMaintenance(state ,action: PayloadAction<boolean>){
            state.notificationSettings.systemMaintenance = action.payload;
        },
        modifyShowAdminLoginEntry(state ,action: PayloadAction<boolean>){
            state.notificationSettings.showAdminLoginEntry = action.payload;
        },
        modifySidebarCollapsed(state ,action: PayloadAction<boolean>){
            state.uiSettings.sidebarCollapsed = action.payload;
        },
        modifyShowBreadcrumb(state ,action: PayloadAction<boolean>){
            state.uiSettings.showBreadcrumb = action.payload;
        },
        modifyShowWatermark(state ,action: PayloadAction<boolean>){
            state.uiSettings.showWatermark = action.payload;
        },
        modifyTheme(state ,action: PayloadAction<'light' | 'dark' | 'auto'>){
            state.uiSettings.theme = action.payload;
        },
        modifyLanguage(state ,action: PayloadAction<'zh-CN' | 'en-US'>){
            state.uiSettings.language = action.payload;
        },
        modifyUploadPath(state ,action: PayloadAction<string>){
            state.systemInfo.uploadPath = action.payload;
        },
        modifyServerPort(state ,action: PayloadAction<number>){
            state.systemInfo.serverPort = action.payload;
        },
        modifyDatabaseStatus(state ,action: PayloadAction<'connected' | 'disconnected'>){
            state.systemInfo.databaseStatus = action.payload;
        },
        modifyLastUpdate(state ,action: PayloadAction<string>){
            state.systemInfo.lastUpdate = action.payload;
        },
        modifyVersion(state ,action: PayloadAction<string>){
            state.systemInfo.version = action.payload;
        },
    }
})

export const {
    modifyAllSettings,
    modifyCommentsEnabled,
    modifyAutoSaveEnabled,
    modifyUserRegistration,
    modifyMaxUploadSize,
    modifyAllowHtmlInMarkdown,
    modifyEmailNotifications,
    modifyNewArticleNotification,
    modifyCommentNotification,
    modifySystemMaintenance,
    modifyShowAdminLoginEntry,
    modifySidebarCollapsed,
    modifyShowBreadcrumb,
    modifyShowWatermark,
    modifyTheme,
    modifyLanguage,
    modifyUploadPath,
    modifyServerPort,
    modifyDatabaseStatus,
    modifyLastUpdate,
    modifyVersion
} = systemSettingsSlice.actions;
export default systemSettingsSlice.reducer;