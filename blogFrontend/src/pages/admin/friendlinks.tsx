import React from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import FriendLinksManagement from '@/admin/components/FriendLinksManagement/FriendLinksManagement';
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import Head from "next/head";

const Friendlinks: React.FC = () => {
    return (
        <AdminLayout>
            <div>
                <Head>
                    <title>管理员页面 | 友链管理</title>
                    <meta name="description" />
                </Head>
                <FriendLinksManagement />
            </div>

        </AdminLayout>
    );
};

export default withAdminAuth(Friendlinks);