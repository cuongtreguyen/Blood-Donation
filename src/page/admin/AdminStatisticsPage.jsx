import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Tag } from 'antd';
import { UserOutlined, TeamOutlined, HeartOutlined, BarChartOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../config/api';

const { Title, Text } = Typography;

const AdminStatisticsPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalBloodBanks: 0,
    totalDonations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm lấy dữ liệu thống kê người dùng từ API khi trang được tải
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/user/get-user-by-role');
        let allUsers = [];
        if (Array.isArray(res.data)) {
          allUsers = res.data;
        } else if (typeof res.data === 'object') {
          allUsers = Object.values(res.data).flat();
        }
        setStats({
          totalUsers: allUsers.length,
          totalDonors: allUsers.filter(u => u.role === 'donor' || u.role === 'MEMBER').length,
          totalBloodBanks: allUsers.filter(u => u.role === 'bloodbank').length, // nếu có role này
          totalDonations: allUsers.reduce((sum, u) => sum + (u.donationsCount || 0), 0), // nếu có trường này
        });
      } catch {
        setStats({ totalUsers: 0, totalDonors: 0, totalBloodBanks: 0, totalDonations: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Dữ liệu mẫu cho biểu đồ lượt hiến máu theo tháng
  const monthlyDonations = [
    { month: 'Tháng 1', donations: 400 },
    { month: 'Tháng 2', donations: 300 },
    { month: 'Tháng 3', donations: 500 },
    { month: 'Tháng 4', donations: 450 },
    { month: 'Tháng 5', donations: 600 },
    { month: 'Tháng 6', donations: 550 },
  ];

  // Dữ liệu mẫu cho hoạt động gần đây
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

      {/* Thẻ tổng hợp số liệu nhanh */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <UserOutlined style={{ fontSize: '30px', color: '#1890ff' }} />
              <div>
                <Text type="secondary">Tổng số người dùng</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalUsers}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <HeartOutlined style={{ fontSize: '30px', color: '#f5222d' }} />
              <div>
                <Text type="secondary">Tổng số người hiến máu</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalDonors}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Space direction="horizontal" size="large" align="start">
              <BarChartOutlined style={{ fontSize: '30px', color: '#fa8c16' }} />
              <div>
                <Text type="secondary">Tổng số lượt hiến máu</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalDonations}</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ và hoạt động gần đây */}
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