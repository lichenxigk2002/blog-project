import React from 'react';
import CodeRain from "@/components/CodeRain/CodeRain";
import PageHeader from '../../components/PageHeader/PageHeader';

const NoResources: React.FC = () => {
    return (
        <div style={{
            position: 'relative',
            width: '100vw',
            fontFamily: "Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif",
            zIndex: 1,
            background: 'transparent',
        }}>
            <CodeRain />
            <PageHeader
                headerText="页面未找到"
                introText="很抱歉，您访问的页面不存在或已被删除。请检查链接是否正确，或返回首页继续浏览。"
                englishTitle="404"
            />
        </div>
    );
};

export default NoResources;