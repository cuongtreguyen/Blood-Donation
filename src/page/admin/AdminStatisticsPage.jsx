import React from 'react';
import { Card, Row, Col, Typography, Space, Tag } from 'antd';
import { UserOutlined, TeamOutlined, HeartOutlined, BarChartOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const { Title, Text } = Typography;

const AdminStatisticsPage = () => {
  // Mock data for statistics
  const stats = {
    totalUsers: 1500,
    totalDonors: 1200,
    totalBloodBanks: 50,
    totalDonations: 3500,
  };

  // Mock data for charts (example: monthly donations)
  const monthlyDonations = [
    { month: 'Tháng 1', donations: 400 },
    { month: 'Tháng 2', donations: 300 },
    { month: 'Tháng 3', donations: 500 },
    { month: 'Tháng 4', donations: 450 },
    { month: 'Tháng 5', donations: 600 },
    { month: 'Tháng 6', donations: 550 },
  ];

  // Mock data for recent activities (more detailed)
  const recentActivities = [
    { id: 1, type: 'Đăng ký', description: 'Người dùng Nguyễn Văn A đã đăng ký.', time: '2 giờ trước' },
    { id: 2, type: 'Cập nhật', description: 'Ngân hàng máu Chợ Rẫy đã cập nhật thông tin.', time: '1 ngày trước' },
    { id: 3, type: 'Hiến máu', description: 'Có 1 lượt hiến máu mới được ghi nhận.', time: '3 ngày trước' },
    { id: 4, type: 'Đăng nhập', description: 'Nhân viên Trần Thị B đã đăng nhập hệ thống.', time: '4 ngày trước' },
    { id: 5, type: 'Thêm mới', description: 'Thêm ngân hàng máu Bệnh viện 115.', time: '1 tuần trước' },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Thống kê tổng quan</Title>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <UserOutlined style={{ fontSize: '30px', color: '#1890ff' }} />
              <div>
                <Text type="secondary">Tổng số người dùng</Text>
                <Title level={4} style={{ margin: 0 }}>{stats.totalUsers}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <HeartOutlined style={{ fontSize: '30px', color: '#f5222d' }} />
              <div>
                <Text type="secondary">Tổng số người hiến máu</Text>
                <Title level={4} style={{ margin: 0 }}>{stats.totalDonors}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <TeamOutlined style={{ fontSize: '30px', color: '#52c41a' }} />
              <div>
                <Text type="secondary">Tổng số ngân hàng máu</Text>
                <Title level={4} style={{ margin: 0 }}>{stats.totalBloodBanks}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <BarChartOutlined style={{ fontSize: '30px', color: '#fa8c16' }} />
              <div>
                <Text type="secondary">Tổng số lượt hiến máu</Text>
                <Title level={4} style={{ margin: 0 }}>{stats.totalDonations}</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts and Recent Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Thống kê lượt hiến máu theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#8884d8" name="Lượt hiến máu" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây">
            <ul>
              {recentActivities.map(activity => (
                <li key={activity.id} style={{ marginBottom: '8px' }}>
                  <Space>
                    <Tag color={activity.type === 'Đăng ký' ? 'blue' : activity.type === 'Hiến máu' ? 'red' : 'default'}>
                      {activity.type}
                    </Tag>
                    <Text>{activity.description}</Text>
                    <Text type="secondary">{activity.time}</Text>
                  </Space>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStatisticsPage; 