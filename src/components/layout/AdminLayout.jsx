import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';
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
  NotificationOutlined,
  HeartOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
  SwapOutlined,
  RedEnvelopeOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for managing open menu keys (for submenus)
  const [openKeys, setOpenKeys] = useState(() => {
    // Khởi tạo openKeys dựa trên pathname hiện tại nếu nó là một trong các trang con của 'Quản lý kho máu'
    if (['/admin/blood-banks', '/admin/blood-units'].includes(location.pathname)) {
      return ['blood-management'];
    }
    return [];
  });

  // Handle menu open/close
  const onOpenChange = (keys) => {
    console.log('onOpenChange called with keys:', keys);
    setOpenKeys(keys);
  };

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
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
    },
    {
      key: '/admin/blood-units',
      icon: <BankOutlined />,
      label: 'Đơn vị máu',
    },
    {
      key: '/admin/statistics',
      icon: <BarChartOutlined />,
      label: 'Thống kê tổng quan',
    },
    {
      key: '/admin/blood-requests',
      icon: <RedEnvelopeOutlined />,
      label: 'Quản lý yêu cầu máu khẩn cấp',
    },
    {
      key: '/admin/blood-donation-approval',
      icon: <ExclamationCircleOutlined />,
      label: 'Xác nhận yêu cầu nhận máu',
    },
    {
      key: '/admin/donation-confirmation',
      icon: <HeartOutlined />,
      label: 'Xác nhận yêu cầu hiến máu',
    },
    {
      key: '/admin/blogs',
      icon: <FileTextOutlined />,
      label: 'Quản lý bài viết',
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
      <Menu.Item key="logout" onClick={() => {
        dispatch(logout());
        toast.success('Đăng xuất thành công!');
        navigate('/');
      }}>
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
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ background: '#d32f2f' }}>
        <div className="logo" style={{ height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
              alt="Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            {!collapsed && <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Dòng Máu Việt</span>}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => {
            console.log('onClick called with key:', key);
            // Chỉ điều hướng nếu key là một đường dẫn (bắt đầu bằng '/')
            // Việc mở/đóng submenu sẽ do onOpenChange quản lý
            if (key.startsWith('/')) {
              navigate(key);
            }
          }}
          onOpenChange={onOpenChange}
          className="blood-donation-admin-menu"
          style={{ background: '#d32f2f' }}
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

// Add custom styles for menu items
const customStyles = `
  .custom-menu .ant-menu-item {
    color: white !important;
  }
  .custom-menu .ant-menu-item-selected {
    background-color: #ff4d4f !important;
  }
  .custom-menu .ant-menu-item:hover {
    background-color: #ff7875 !important;
  }
  .custom-menu .ant-menu-item .anticon {
    color: white !important;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

export default AdminLayout; 