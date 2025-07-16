import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import styles from './SystemSettings.module.scss';
import ContentSettingsPanel from "@/admin/components/SystemSettings/ContentSettingsPanel";
import NotificationSettingsPanel from "@/admin/components/SystemSettings/NotificationSettingsPanel";
import UISettingsPanel from "@/admin/components/SystemSettings/UISettingsPanel";
import SystemInfoPanel from "@/admin/components/SystemSettings/SystemInfoPanel";
import {
    ContentSettings,
    NotificationSettings,
    UISettings,
    SystemInfo,
    SystemSettings as SystemSettingsType
} from './types';

import {
    contentFieldApiMap,
    contentFieldReduxMap,
    ContentFieldKey,
    NotificationFieldKey,
    notificationFieldApiMap,
    notificationFieldReduxMap,
    uiFieldApiMap,
    uiFieldReduxMap,
    UIFieldKey,
    systemInfoFieldApiMap,
    systemInfoFieldReduxMap,
    SystemInfoFieldKey
} from '@/utils/settingFieldMaps';
import OperationTipModal from "@/admin/components/ui/OperationTipModal/OperationTipModal";
import { groupedToFlatSettings } from "@/utils/settingTransform";
import {SystemSettingsAPI} from "@/api/SystemSettingsAPI";
import {modifyAllSettings} from "@/redux/systemSettingsSlice";

const SystemSettings: React.FC = () => {

    const globalSettings = useAppSelector(state => state.settings);
    const [localSettings, setLocalSettings] = useState<SystemSettingsType>(globalSettings);
    const [tip, setTip] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({
        open: false,
        message: '',
        type: 'success'
    });
    const dispatch = useAppDispatch()

    useEffect(() => {
        setLocalSettings(globalSettings)
    }, [globalSettings])

    // const handleSingleFieldSubmit = async (field: any, settingType: any, apiMapType: any, reduxMapType: any) => {
    //     const value = localSettings[settingType][ field];
    //     const apiFunc =  apiMapType[field];
    //     const reduxAction = reduxMapType[field];
    //
    //     if (apiFunc && reduxAction) {
    //         await apiFunc(value);
    //         dispatch(reduxAction(value));
    //     }else{
    //         console.warn('未找到对应的API或Redux方法', field);
    //     }
    // }
    const handleContentFieldSubmit = async (field: ContentFieldKey) => {
        const value = localSettings.contentSettings[field];
        const apiFunc = contentFieldApiMap[field];
        const reduxAction = contentFieldReduxMap[field];

        if (apiFunc && reduxAction) {
            await apiFunc(value);
            dispatch(reduxAction(value));
        } else {
            console.warn('未找到对应的API或Redux方法', field);
        }
    }

    const handleNotificationFieldSubmit = async (field: NotificationFieldKey) => {
        const value = localSettings.notificationSettings[field];
        const apiFunc = notificationFieldApiMap[field];
        const reduxAction = notificationFieldReduxMap[field];

        if (apiFunc && reduxAction) {
            await apiFunc(value);
            dispatch(reduxAction(value));
        } else {
            console.warn('未找到对应的API或Redux方法', field);
        }
    }

    const handleUIFieldSubmit = async (field: UIFieldKey) => {
        const value = localSettings.uiSettings[field];
        const apiFunc = uiFieldApiMap[field];
        const reduxAction = uiFieldReduxMap[field];

        if (apiFunc && reduxAction) {
            await apiFunc(value);
            dispatch(reduxAction(value));
        } else {
            console.warn('未找到对应的API或Redux方法', field);
        }
    }

    const handleSystemInfoFieldSubmit = async (field: SystemInfoFieldKey) => {
        const value = localSettings.systemInfo[field];
        const apiFunc = systemInfoFieldApiMap[field];
        const reduxAction = systemInfoFieldReduxMap[field];

        if (apiFunc && reduxAction) {
            await apiFunc(value);
            dispatch(reduxAction(value));
        } else {
            console.warn('未找到对应的API或Redux方法', field);
        }
    }

    const handleContentChange = async (newSettings: Partial<ContentSettings>) => {
        setLocalSettings(prev => ({
            ...prev,
            contentSettings: { ...prev.contentSettings, ...newSettings }
        }));
        // try {
        //     // 先请求后端
        //     const response = await SystemSettingsAPI.setCommentsEnabled(newSettings.commentsEnabled!);
        //     console.log('保存成功:', response);
        //
        //     // 保存成功后，拉一次最新设置
        //     if (response.success) {
        //         const latestSettings = await SystemSettingsAPI.getSettings();
        //         // 假设 latestSettings.contentSettings 是最新的内容设置
        //         dispatch(modifyCommentsEnabled(latestSettings.commentsEnabled));
        //     }
        // } catch (error) {
        //     console.error('保存失败:', error);
        //     // 可以在这里添加错误提示
        // }
    }

    const handleNotificationChange = (newSettings: Partial<NotificationSettings>) => {
        setLocalSettings(prev => ({
            ...prev,
            notificationSettings: { ...prev.notificationSettings, ...newSettings }
        }))
    }

    const handleUIChange = (newSettings: Partial<UISettings>) => {
        setLocalSettings(prev => ({
            ...prev,
            uiSettings: { ...prev.uiSettings, ...newSettings }
        }))
    }

    const handleSystemChange = (newSettings: Partial<SystemInfo>) => {
        setLocalSettings(prev => ({
            ...prev,
            systemInfo: { ...prev.systemInfo, ...newSettings }
        }))
    }

    const handleSave = async () => {
        // 保存设置逻辑
        try{
            const flatSettings = groupedToFlatSettings(localSettings);
            await SystemSettingsAPI.saveAll(flatSettings)
            dispatch(modifyAllSettings(localSettings));
            setTip({
                open: true,
                message: '设置已保存！',
                type: 'success'
            });
        }catch (err){
            setTip({
                open: true,
                message: '保存失败，请重试',
                type: 'error'
            });
        }
    }

    const handleReset = () => {
        console.log('重置设置');
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>系统设置</h1>

            <ContentSettingsPanel
                settings={localSettings.contentSettings}
                onChange={handleContentChange}
                onSingleFieldSubmit={handleContentFieldSubmit}
                setTip={setTip}
            />

            <NotificationSettingsPanel
                settings={localSettings.notificationSettings}
                onChange={handleNotificationChange}
                onSingleFieldSubmit={handleNotificationFieldSubmit}
                setTip={setTip}
            />

            <UISettingsPanel
                settings={localSettings.uiSettings}
                onChange={handleUIChange}
                onSingleFieldSubmit={handleUIFieldSubmit}
                setTip={setTip}
            />

            <SystemInfoPanel
                settings={localSettings.systemInfo}
                onChange={handleSystemChange}
                onSingleFieldSubmit={(field: keyof SystemInfo) => {
                    if (field in systemInfoFieldApiMap) {
                        handleSystemInfoFieldSubmit(field as SystemInfoFieldKey);
                    } else {
                        console.warn('该字段没有对应的API方法:', field);
                    }
                }}
                setTip={setTip}
            />

            {/* 操作按钮 */}
            <div className={styles.actions}>
                <button onClick={handleSave} className={styles.primaryButton}>
                    保存设置
                </button>
                <button onClick={handleReset} className={styles.button} disabled={true}>
                    重置设置
                </button>
            </div>
            <OperationTipModal
                open={tip.open}
                onClose={() => setTip(prev => ({ ...prev, open: false }))}
                message={tip.message}
                type={tip.type === 'error' ? 'failure' : tip.type}
            />
        </div>
    );
};

export default SystemSettings;