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
import { FaTachometerAlt, FaUser, FaNotesMedical, FaTint, FaFileAlt, FaUserCircle, FaUsers, FaCog, FaBell, FaHeart, FaExclamationCircle, FaChartBar, FaBlog, FaEnvelopeOpenText, FaHospital } from 'react-icons/fa';

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

  // Map icon cho từng menu item
  const iconMap = {
    '/admin': <FaTachometerAlt />,
    '/admin/users': <FaUsers />,
    '/admin/blood-units': <FaHospital />,
    '/admin/statistics': <FaChartBar />,
    '/admin/blood-requests': <FaEnvelopeOpenText />,
    '/admin/blood-donation-approval': <FaExclamationCircle />,
    '/admin/donation-confirmation': <FaHeart />,
    '/admin/blogs': <FaBlog />,
    '/admin/notifications': <FaBell />,
    '/admin/settings': <FaCog />,
  };

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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      {/* Sidebar giống doctor */}
      <div style={{ width: 260, background: '#d32f2f', color: '#fff', padding: '0 0', display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 64, textDecoration: 'none', marginBottom: 24 }}>
          <img src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain" alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <span style={{ marginLeft: 10, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>Dòng Máu Việt</span>
        </Link>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.key;
            return (
              <Link
                key={item.key}
                to={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 20px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#fff',
                  background: isActive ? '#b71c1c' : 'transparent',
                  textDecoration: 'underline',
                  margin: '2px 8px',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                }}
              >
                <span style={{ fontSize: 18 }}>{iconMap[item.key]}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
            <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={['click']}>
              <Badge count={notifications.filter(n => !n.read).length} style={{ marginRight: 24 }}>
                <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
              </Badge>
            </Dropdown>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>Admin</span>
              </div>
            </Dropdown>
          </div>
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout; 