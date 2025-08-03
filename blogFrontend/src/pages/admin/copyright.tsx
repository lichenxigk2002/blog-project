import React from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import CopyrightManagement from '@/admin/components/CopyrightManagement/CopyrightManagement';
import { withAdminAuth } from '@/admin/components/withAdminAuth';

const CopyrightPage: React.FC = () => {
  return (
    <AdminLayout>
      <CopyrightManagement />
    </AdminLayout>
  );
};

export default withAdminAuth(CopyrightPage); 