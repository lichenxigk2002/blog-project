import React from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import RssManagement from '@/admin/components/FriendLinksManagement/RssManagement';
import Head from 'next/head';

const RssManagementPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>管理员页面 | RSS管理</title>
        <meta name="description" content="管理RSS源和友链关联" />
      </Head>

      <AdminLayout>
        <RssManagement />
      </AdminLayout>
    </>
  );
};

export default RssManagementPage; 