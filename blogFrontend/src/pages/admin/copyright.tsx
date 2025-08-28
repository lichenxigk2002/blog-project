import React from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import CopyrightManagement from '@/admin/components/CopyrightManagement/CopyrightManagement';
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import Head from "next/head";

const CopyrightPage: React.FC = () => {
  return (
    <AdminLayout>
      <div>
        <Head>
          <title>管理员页面 | 版权管理</title>
          <meta name="description" />
        </Head>
        <CopyrightManagement />
      </div>
    </AdminLayout>
  );
};

export default withAdminAuth(CopyrightPage); 