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
  BankOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock notifications
  const notifications = [
    { id: 1, message: 'Người dùng mới đăng ký', read: false },
    { id: 2, message: 'Ngân hàng máu mới được thêm', read: false },
    { id: 3, message: 'Báo cáo mới đã được tạo', read: true },
  ];

  // Menu items for admin
  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
    },
    {
      key: '/admin/blood-banks',
      icon: <BankOutlined />,
      label: 'Quản lý ngân hàng máu',
    },
    {
      key: '/admin/statistics',
      icon: <BarChartOutlined />,
      label: 'Thống kê',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/admin/profile">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Item key="settings">
        <Link to="/admin/settings">Cài đặt</Link>
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
        <Link to="/admin/notifications">Xem tất cả thông báo</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo" style={{ height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
            alt="Logo"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
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
            <Dropdown overlay={notificationMenu} placement="bottomRight">
              <Badge count={notifications.filter(n => !n.read).length} style={{ marginRight: '24px' }}>
                <BellOutlined style={{ fontSize: '20px' }} />
              </Badge>
            </Dropdown>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: '8px' }}>Admin</span>
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

export default AdminLayout; 