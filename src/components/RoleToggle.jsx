import React from 'react';
import { Button, Tooltip } from 'antd';
import { UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';

const RoleToggle = () => {
  const { role, toggleRole } = useUser();

  const isDoctor = role === 'doctor';

  return (
    <Tooltip title={`Chuyển sang ${isDoctor ? 'Nhân viên' : 'Bác sĩ'}`}>
      <Button
        type="text"
        icon={isDoctor ? <MedicineBoxOutlined /> : <UserOutlined />}
        onClick={toggleRole}
        style={{
          color: isDoctor ? '#1890ff' : '#52c41a',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {isDoctor ? 'Bác sĩ' : 'Nhân viên'}
      </Button>
    </Tooltip>
  );
};

export default RoleToggle; 