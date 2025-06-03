import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  NotificationOutlined,
  SettingOutlined,
  UserOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useUser();

  // Define menu items based on role
  const commonMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/dashboard/donation-schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch hiến máu',
    },
    {
      key: '/dashboard/reports',
      icon: <FileTextOutlined />,
      label: 'Báo cáo',
    },
    {
      key: '/dashboard/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const staffMenuItems = [
    {
      key: '/dashboard/donors',
      icon: <TeamOutlined />,
      label: 'Người hiến máu',
    },
    {
      key: '/dashboard/campaigns',
      icon: <NotificationOutlined />,
      label: 'Chiến dịch',
    },
  ];

  const doctorMenuItems = [
    {
      key: '/dashboard/medical-records',
      icon: <MedicineBoxOutlined />,
      label: 'Hồ sơ y tế',
    },
    {
      key: '/dashboard/blood-inventory',
      icon: <BankOutlined />,
      label: 'Kho máu',
    },
  ];

  const menuItems = [
    ...commonMenuItems,
    ...(role === 'staff' ? staffMenuItems : doctorMenuItems),
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{
        height: '100%',
        borderRight: 0,
      }}
    />
  );
};

export default SideMenu; 