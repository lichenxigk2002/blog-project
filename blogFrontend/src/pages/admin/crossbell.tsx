import React from 'react';
import AdminLayout from '../../admin/components/layout/AdminLayout';
import { CrossbellManagement } from '../../admin/components/CrossbellManagement/CrossbellManagement';
import { withAdminAuth } from '../../admin/components/withAdminAuth';

const CrossbellPage: React.FC = () => {
  return (
    <AdminLayout>
      <CrossbellManagement />
    </AdminLayout>
  );
};

export default withAdminAuth(CrossbellPage); 