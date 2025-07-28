

// import React, { useEffect, useState } from 'react';
// import { Card, Row, Col, Typography, Space, Tag } from 'antd';
// import { UserOutlined, TeamOutlined, HeartOutlined, BarChartOutlined } from '@ant-design/icons';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import api from '../../config/api';

// const { Title, Text } = Typography;

// const AdminStatisticsPage = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalDonors: 0,
//     totalBloodBanks: 0,
//     totalDonations: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Hàm lấy dữ liệu thống kê người dùng từ API khi trang được tải
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get('/user/get-user-by-role');
//         let allUsers = [];
//         if (Array.isArray(res.data)) {
//           allUsers = res.data;
//         } else if (typeof res.data === 'object') {
//           allUsers = Object.values(res.data).flat();
//         }
//         setStats({
//           totalUsers: allUsers.length,
//           totalDonors: allUsers.filter(u => u.role === 'donor' || u.role === 'MEMBER').length,
//           totalBloodBanks: allUsers.filter(u => u.role === 'bloodbank').length, // nếu có role này
//           totalDonations: allUsers.reduce((sum, u) => sum + (u.donationsCount || 0), 0), // nếu có trường này
//         });
//       } catch {
//         setStats({ totalUsers: 0, totalDonors: 0, totalBloodBanks: 0, totalDonations: 0 });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   // Dữ liệu mẫu cho biểu đồ lượt hiến máu theo tháng
//   const monthlyDonations = [
//     { month: 'Tháng 1', donations: 400 },
//     { month: 'Tháng 2', donations: 300 },
//     { month: 'Tháng 3', donations: 500 },
//     { month: 'Tháng 4', donations: 450 },
//     { month: 'Tháng 5', donations: 600 },
//     { month: 'Tháng 6', donations: 550 },
//     { month: 'Tháng 7', donations: 480 },
//     { month: 'Tháng 8', donations: 520 },
//     { month: 'Tháng 9', donations: 610 },
//     { month: 'Tháng 10', donations: 570 },
//     { month: 'Tháng 11', donations: 530 },
//     { month: 'Tháng 12', donations: 590 },
//   ];

//   // Dữ liệu mẫu cho hoạt động gần đây
//   // const recentActivities = [
//   //   { id: 1, type: 'Đăng ký', description: 'Người dùng Nguyễn Văn A đã đăng ký.', time: '2 giờ trước' },
//   //   { id: 2, type: 'Cập nhật', description: 'Ngân hàng máu Chợ Rẫy đã cập nhật thông tin.', time: '1 ngày trước' },
//   //   { id: 3, type: 'Hiến máu', description: 'Có 1 lượt hiến máu mới được ghi nhận.', time: '3 ngày trước' },
//   //   { id: 4, type: 'Đăng nhập', description: 'Nhân viên Trần Thị B đã đăng nhập hệ thống.', time: '4 ngày trước' },
//   //   { id: 5, type: 'Thêm mới', description: 'Thêm ngân hàng máu Bệnh viện 115.', time: '1 tuần trước' },
//   // ];

//   return (
//     <div className="p-6">
//       <Title level={2}>Thống kê tổng quan</Title>

//       {/* Thẻ tổng hợp số liệu nhanh */}
//       <Row gutter={[16, 16]} className="mb-6">
//         <Col xs={24} sm={12} lg={8}>
//           <Card>
//             <Space direction="horizontal" size="large" align="start">
//               <UserOutlined style={{ fontSize: '30px', color: '#1890ff' }} />
//               <div>
//                 <Text type="secondary">Tổng số người dùng</Text>
//                 <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalUsers}</Title>
//               </div>
//             </Space>
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={8}>
//           <Card>
//             <Space direction="horizontal" size="large" align="start">
//               <HeartOutlined style={{ fontSize: '30px', color: '#f5222d' }} />
//               <div>
//                 <Text type="secondary">Tổng số người hiến máu</Text>
//                 <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalDonors}</Title>
//               </div>
//             </Space>
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={8}>
//           <Card>
//             <Space direction="horizontal" size="large" align="start">
//               <BarChartOutlined style={{ fontSize: '30px', color: '#fa8c16' }} />
//               <div>
//                 <Text type="secondary">Tổng số lượt hiến máu</Text>
//                 <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalDonations}</Title>
//               </div>
//             </Space>
//           </Card>
//         </Col>
//       </Row>

//       {/* Biểu đồ và hoạt động gần đây */}
//       <Row gutter={[16, 16]}>
//         <Col xs={24} lg={24}>
//           <Card title="Thống kê lượt hiến máu theo tháng">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={monthlyDonations}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" interval={0} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="donations" fill="#8884d8" name="Lượt hiến máu" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default AdminStatisticsPage; 

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Space, Tag, Select } from 'antd';
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
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Tháng 1', donations: 0, receives: 0 },
    { month: 'Tháng 2', donations: 0, receives: 0 },
    { month: 'Tháng 3', donations: 0, receives: 0 },
    { month: 'Tháng 4', donations: 0, receives: 0 },
    { month: 'Tháng 5', donations: 0, receives: 0 },
    { month: 'Tháng 6', donations: 0, receives: 0 },
    { month: 'Tháng 7', donations: 0, receives: 0 },
    { month: 'Tháng 8', donations: 0, receives: 0 },
    { month: 'Tháng 9', donations: 0, receives: 0 },
    { month: 'Tháng 10', donations: 0, receives: 0 },
    { month: 'Tháng 11', donations: 0, receives: 0 },
    { month: 'Tháng 12', donations: 0, receives: 0 },
  ]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const totalYearlyDonations = monthlyData.reduce((sum, m) => sum + (m.donations || 0), 0);
  const totalYearlyReceives = monthlyData.reduce((sum, m) => sum + (m.receives || 0), 0);

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
        // Lọc chỉ những người dùng đang hoạt động
        const activeUsers = allUsers.filter(user => user.status === 'active' || user.status === 'ACTIVE');
        
        setStats({
          totalUsers: activeUsers.length,
          totalDonors: activeUsers.filter(u => u.role === 'donor' || u.role === 'MEMBER').length,
          totalBloodBanks: activeUsers.filter(u => u.role === 'bloodbank').length, // nếu có role này
          totalDonations: activeUsers.reduce((sum, u) => sum + (u.donationsCount || 0), 0), // nếu có trường này
        });
      } catch {
        setStats({ totalUsers: 0, totalDonors: 0, totalBloodBanks: 0, totalDonations: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Gọi lại API khi selectedYear thay đổi
  useEffect(() => {
    const fetchMonthlyData = async (year) => {
      try {
        // Gọi API cho đơn hiến máu đã duyệt
        const donationsRes = await api.get(`/blood-register/completed-monthly/${year}`);
        const donationsData = Array.isArray(donationsRes.data) ? donationsRes.data : [];
        
        // Gọi API cho đơn nhận máu đã duyệt và hoàn thành
        const receivesRes = await api.get(`/blood-receive/monthly-completed?year=${year}`);
        const receivesData = Array.isArray(receivesRes.data) ? receivesRes.data : [];
        
        const months = Array.from({ length: 12 }, (_, i) => {
          const foundDonation = donationsData.find(item => item.month === i + 1);
          const foundReceive = receivesData.find(item => item.month === i + 1);
          return {
            month: `Tháng ${i + 1}`,
            donations: foundDonation ? foundDonation.totalCompletedRequests : 0,
            receives: foundReceive ? foundReceive.totalCompletedReceives : 0
          };
        });
        setMonthlyData(months);
      } catch (e) {
        console.log(e);
        setMonthlyData(Array.from({ length: 12 }, (_, i) => ({ 
          month: `Tháng ${i + 1}`, 
          donations: 0,
          receives: 0
        })));
      }
    };
    fetchMonthlyData(selectedYear);
  }, [selectedYear]);

  // Dữ liệu mẫu cho hoạt động gần đây
  // const recentActivities = [
  //   { id: 1, type: 'Đăng ký', description: 'Người dùng Nguyễn Văn A đã đăng ký.', time: '2 giờ trước' },
  //   { id: 2, type: 'Cập nhật', description: 'Ngân hàng máu Chợ Rẫy đã cập nhật thông tin.', time: '1 ngày trước' },
  //   { id: 3, type: 'Hiến máu', description: 'Có 1 lượt hiến máu mới được ghi nhận.', time: '3 ngày trước' },
  //   { id: 4, type: 'Đăng nhập', description: 'Nhân viên Trần Thị B đã đăng nhập hệ thống.', time: '4 ngày trước' },
  //   { id: 5, type: 'Thêm mới', description: 'Thêm ngân hàng máu Bệnh viện 115.', time: '1 tuần trước' },
  // ];

  return (
    <div className="p-6">
      <Title level={2}>Thống kê tổng quan</Title>

      {/* Thẻ tổng hợp số liệu nhanh */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Space direction="horizontal" size="large" align="start" style={{ width: '100%' }}>
              <UserOutlined style={{ fontSize: '30px', color: '#1890ff' }} />
              <div style={{ flex: 1 }}>
                <Text type="secondary">Tổng số người dùng</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalUsers}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Space direction="horizontal" size="large" align="start" style={{ width: '100%' }}>
              <HeartOutlined style={{ fontSize: '30px', color: '#f5222d' }} />
              <div style={{ flex: 1 }}>
                <Text type="secondary">Tổng người hiến máu</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : stats.totalDonors}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Space direction="horizontal" size="large" align="start" style={{ width: '100%' }}>
              <BarChartOutlined style={{ fontSize: '30px', color: '#fa8c16' }} />
              <div style={{ flex: 1 }}>
                <Text type="secondary">Tổng đơn hiến máu</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : totalYearlyDonations}</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ height: '100%' }}>
            <Space direction="horizontal" size="large" align="start" style={{ width: '100%' }}>
              <BarChartOutlined style={{ fontSize: '30px', color: '#52c41a' }} />
              <div style={{ flex: 1 }}>
                <Text type="secondary">Tổng đơn nhận máu</Text>
                <Title level={4} style={{ margin: 0 }}>{loading ? '...' : totalYearlyReceives}</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ và hoạt động gần đây */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card title="Thống kê đơn hiến máu và nhận máu theo tháng">
            <div style={{ marginBottom: 16 }}>
              <span>Chọn năm: </span>
              <Select
                value={selectedYear}
                style={{ width: 120 }}
                onChange={value => setSelectedYear(value)}
              >
                {[...Array(6)].map((_, idx) => {
                  const year = new Date().getFullYear() - idx;
                  return <Select.Option key={year} value={year}>{year}</Select.Option>;
                })}
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData} margin={{ bottom: 80, left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  interval={0}
                  height={80}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickFormatter={(value) => Math.round(value)}
                  domain={[0, 'dataMax + 1']}
                />
                <Tooltip formatter={(value) => [Math.round(value), '']} />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#fa8c16" strokeWidth={3} name="Đơn hiến máu" />
                <Line type="monotone" dataKey="receives" stroke="#52c41a" strokeWidth={3} name="Đơn nhận máu" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminStatisticsPage; 