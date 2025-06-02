import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Tag, Progress, List, Avatar } from 'antd';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined';
import BankOutlined from '@ant-design/icons/lib/icons/BankOutlined';
import CalendarOutlined from '@ant-design/icons/lib/icons/CalendarOutlined';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

function AdminDashboard() {
  // Mock data for dashboard
  const [stats, setStats] = useState({
    totalUsers: 1245,
    totalBloodBanks: 45,
    totalDonations: 856,
    bloodInventory: {
      'A+': 85,
      'A-': 45,
      'B+': 76,
      'B-': 30,
      'AB+': 25,
      'AB-': 15,
      'O+': 92,
      'O-': 38,
    },
    donationTrend: +12.5,
    userTrend: +8.3,
  });

  // Mock data for recent users
  const recentUsers = [
    {
      key: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'donor',
      status: 'active',
      joinDate: '15/10/2023',
    },
    {
      key: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'staff',
      status: 'active',
      joinDate: '14/10/2023',
    },
    {
      key: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'doctor',
      status: 'inactive',
      joinDate: '13/10/2023',
    },
  ];

  // Mock data for recent blood banks
  const recentBloodBanks = [
    {
      key: '1',
      name: 'Bệnh viện Đa khoa Trung ương',
      location: 'Quận 1, TP.HCM',
      status: 'active',
      lastUpdate: '15/10/2023',
    },
    {
      key: '2',
      name: 'Trung tâm Huyết học Quốc gia',
      location: 'Quận 1, TP.HCM',
      status: 'active',
      lastUpdate: '14/10/2023',
    },
    {
      key: '3',
      name: 'Bệnh viện Chợ Rẫy',
      location: 'Quận 5, TP.HCM',
      status: 'inactive',
      lastUpdate: '13/10/2023',
    },
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      action: 'đã đăng ký tài khoản',
      time: '2 giờ trước',
    },
    {
      id: 2,
      user: 'Trần Thị B',
      action: 'đã cập nhật thông tin ngân hàng máu',
      time: '3 giờ trước',
    },
    {
      id: 3,
      user: 'Lê Văn C',
      action: 'đã thêm người dùng mới',
      time: '5 giờ trước',
    },
    {
      id: 4,
      user: 'Phạm Thị D',
      action: 'đã xóa ngân hàng máu',
      time: '1 ngày trước',
    },
  ];

  // Columns for users table
  const userColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          donor: 'blue',
          staff: 'green',
          doctor: 'purple',
          admin: 'red',
        };
        const labels = {
          donor: 'Người hiến máu',
          staff: 'Nhân viên',
          doctor: 'Bác sĩ',
          admin: 'Quản trị viên',
        };
        return <Tag color={colors[role]}>{labels[role]}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
  ];

  // Columns for blood banks table
  const bloodBankColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Cập nhật gần nhất',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Tổng quan Admin</h1>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <span style={{ fontSize: '0.5em', marginLeft: 8 }}>
                  <ArrowUpOutlined style={{ color: '#3f8600' }} /> {stats.userTrend}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng ngân hàng máu"
              value={stats.totalBloodBanks}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt hiến máu"
              value={stats.totalDonations}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#d32f2f' }}
              suffix={
                <span style={{ fontSize: '0.5em', marginLeft: 8 }}>
                  <ArrowUpOutlined style={{ color: '#3f8600' }} /> {stats.donationTrend}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng mới hôm nay"
              value={12}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main content */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Người dùng gần đây" extra={<Button type="link">Xem tất cả</Button>} style={{ marginBottom: 24 }}>
            <Table 
              dataSource={recentUsers} 
              columns={userColumns} 
              pagination={false}
              size="small"
            />
          </Card>
          <Card title="Ngân hàng máu gần đây" extra={<Button type="link">Xem tất cả</Button>}>
            <Table 
              dataSource={recentBloodBanks} 
              columns={bloodBankColumns} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" style={{ marginBottom: 24 }}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.user}
                    description={`${item.action} - ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card title="Tình trạng nhóm máu">
            {Object.entries(stats.bloodInventory).map(([type, amount]) => (
              <div key={type} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Nhóm máu {type}</span>
                  <span>{amount} đơn vị</span>
                </div>
                <Progress 
                  percent={amount} 
                  showInfo={false}
                  status={amount < 40 ? "exception" : amount > 80 ? "success" : "active"}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard; 