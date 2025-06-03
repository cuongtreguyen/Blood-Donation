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
  BarChartOutlined,
  NotificationOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Người dùng mới đăng ký',
      message: 'Nguyễn Văn A đã đăng ký tài khoản mới',
      type: 'user',
      read: false,
      timestamp: '2024-03-20 10:30:00'
    },
    { 
      id: 2, 
      title: 'Ngân hàng máu mới',
      message: 'Bệnh viện Chợ Rẫy đã được thêm vào hệ thống',
      type: 'bloodBank',
      read: false,
      timestamp: '2024-03-20 09:15:00'
    },
    { 
      id: 3, 
      title: 'Báo cáo mới',
      message: 'Báo cáo thống kê tháng 3 đã được tạo',
      type: 'report',
      read: true,
      timestamp: '2024-03-19 15:45:00'
    },
  ]);

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
      key: '/admin/notifications',
      icon: <NotificationOutlined />,
      label: 'Thông báo',
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
    <Menu style={{ width: 300 }}>
      <Menu.Item key="header" disabled style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>Thông báo</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
      {notifications.length > 0 ? (
        notifications.slice(0, 5).map(notification => (
          <Menu.Item 
            key={notification.id} 
            style={{ 
              backgroundColor: notification.read ? 'white' : '#f0f0f0',
              padding: '12px 16px'
            }}
            onClick={() => {
              setNotifications(notifications.map(n => 
                n.id === notification.id ? { ...n, read: true } : n
              ));
              // Navigate based on notification type
              switch(notification.type) {
                case 'user':
                  navigate('/admin/users');
                  break;
                case 'bloodBank':
                  navigate('/admin/blood-banks');
                  break;
                case 'report':
                  navigate('/admin/statistics');
                  break;
                default:
                  break;
              }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{notification.title}</span>
                {!notification.read && <Badge status="processing" />}
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>{notification.message}</span>
              <span style={{ fontSize: '11px', color: '#999' }}>{notification.timestamp}</span>
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>Không có thông báo mới</Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="all">
        <Link to="/admin/notifications" style={{ textAlign: 'center', display: 'block' }}>
          Xem tất cả thông báo
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo" style={{ height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
              alt="Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            {!collapsed && <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: 'bold', color: '#d32f2f' }}>Dòng Máu Việt</span>}
          </Link>
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
            <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={['click']}>
              <Badge count={notifications.filter(n => !n.read).length} style={{ marginRight: '24px' }}>
                <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
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