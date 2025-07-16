import React from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import FriendLinksManagement from '@/admin/components/FriendLinksManagement/FriendLinksManagement';
import { withAdminAuth } from '@/admin/components/withAdminAuth';

const Friendlinks: React.FC = () => {
    return (
        <AdminLayout>
            <FriendLinksManagement />
        </AdminLayout>
    );
};

export default withAdminAuth(Friendlinks);