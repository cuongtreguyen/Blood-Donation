import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  HeartOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('staff'); // This would come from authentication context in a real app

  // Mock notifications
  const notifications = [
    { id: 1, message: 'Yêu cầu hiến máu mới', read: false },
    { id: 2, message: 'Lịch hiến máu đã được cập nhật', read: false },
    { id: 3, message: 'Báo cáo mới đã được tạo', read: true },
  ];

  // Menu items common for both staff and doctors
  const commonMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/dashboard/calendar',
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

  // Staff specific menu items
  const staffMenuItems = [
    {
      key: '/dashboard/donors',
      icon: <TeamOutlined />,
      label: 'Người hiến máu',
    },
    {
      key: '/dashboard/campaigns',
      icon: <HeartOutlined />,
      label: 'Chiến dịch',
    },
  ];

  // Doctor specific menu items
  const doctorMenuItems = [
    {
      key: '/dashboard/medical-records',
      icon: <MedicineBoxOutlined />,
      label: 'Hồ sơ y tế',
    },
    {
      key: '/dashboard/blood-inventory',
      icon: <HeartOutlined />,
      label: 'Kho máu',
    },
  ];

  // Combine menu items based on role
  const menuItems = [
    ...commonMenuItems,
    ...(userRole === 'staff' ? staffMenuItems : doctorMenuItems),
  ];

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/dashboard/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/dashboard/settings">Cài đặt</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={() => navigate('/login')}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Notifications menu
  const notificationMenu = (
    <Menu>
      {notifications.map(notification => (
        <Menu.Item key={notification.id} style={{ backgroundColor: notification.read ? 'white' : '#f0f0f0' }}>
          {notification.message}
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="all">
        <Link to="/dashboard/notifications">Xem tất cả thông báo</Link>
      </Menu.Item>
    </Menu>
  );

  // Role switcher for demo purposes
  const toggleRole = () => {
    setUserRole(userRole === 'staff' ? 'doctor' : 'staff');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo" style={{ height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HeartOutlined style={{ fontSize: '24px', color: '#d32f2f' }} />
          {!collapsed && <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: 'bold', color: '#d32f2f' }}>Dòng Máu Việt</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '24px' }}>
            {/* For demo purposes only - toggle between staff and doctor */}
            <Button 
              type="primary" 
              onClick={toggleRole} 
              style={{ marginRight: '16px', background: '#d32f2f', borderColor: '#d32f2f' }}
            >
              Chuyển sang {userRole === 'staff' ? 'Bác sĩ' : 'Nhân viên'}
            </Button>
            
            <Dropdown overlay={notificationMenu} placement="bottomRight">
              <Badge count={notifications.filter(n => !n.read).length} style={{ marginRight: '24px' }}>
                <BellOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </Dropdown>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: '8px' }}>
                  {userRole === 'staff' ? 'Nhân viên' : 'Bác sĩ'}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: '4px',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout; 