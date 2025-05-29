import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Tag, Progress, List, Avatar } from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

function DashboardPage() {
  // In a real app, this would come from authentication context
  const [userRole, setUserRole] = useState('staff');

  // Mock data for dashboard
  const [stats, setStats] = useState({
    totalDonors: 1245,
    totalDonations: 856,
    pendingAppointments: 32,
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
    appointmentTrend: +8.3,
  });

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      key: '1',
      name: 'Nguyễn Văn A',
      date: '15/10/2023',
      time: '09:00 AM',
      bloodType: 'A+',
      status: 'confirmed',
    },
    {
      key: '2',
      name: 'Trần Thị B',
      date: '15/10/2023',
      time: '10:30 AM',
      bloodType: 'O-',
      status: 'pending',
    },
    {
      key: '3',
      name: 'Lê Văn C',
      date: '16/10/2023',
      time: '02:00 PM',
      bloodType: 'B+',
      status: 'confirmed',
    },
    {
      key: '4',
      name: 'Phạm Thị D',
      date: '17/10/2023',
      time: '11:15 AM',
      bloodType: 'AB+',
      status: 'pending',
    },
  ];

  // Mock data for recent donations
  const recentDonations = [
    {
      key: '1',
      name: 'Hoàng Văn X',
      date: '12/10/2023',
      bloodType: 'A+',
      amount: '450ml',
      status: 'completed',
    },
    {
      key: '2',
      name: 'Ngô Thị Y',
      date: '11/10/2023',
      bloodType: 'B-',
      amount: '450ml',
      status: 'completed',
    },
    {
      key: '3',
      name: 'Đặng Văn Z',
      date: '10/10/2023',
      bloodType: 'O+',
      amount: '350ml',
      status: 'completed',
    },
  ];

  // Mock data for medical records (doctor view)
  const medicalRecords = [
    {
      key: '1',
      donorId: 'D001',
      name: 'Nguyễn Văn A',
      lastDonation: '15/09/2023',
      bloodType: 'A+',
      healthStatus: 'good',
      notes: 'No issues',
    },
    {
      key: '2',
      donorId: 'D002',
      name: 'Trần Thị B',
      lastDonation: '20/08/2023',
      bloodType: 'O-',
      healthStatus: 'attention',
      notes: 'Low iron levels',
    },
    {
      key: '3',
      donorId: 'D003',
      name: 'Lê Văn C',
      lastDonation: '05/10/2023',
      bloodType: 'B+',
      healthStatus: 'good',
      notes: 'Regular donor',
    },
  ];

  // Mock data for blood inventory (doctor view)
  const bloodInventoryData = Object.entries(stats.bloodInventory).map(([type, amount]) => ({
    key: type,
    bloodType: type,
    amount: amount,
    status: amount < 40 ? 'low' : amount > 80 ? 'high' : 'normal',
  }));

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      action: 'đã đăng ký hiến máu',
      time: '2 giờ trước',
    },
    {
      id: 2,
      user: 'Trần Thị B',
      action: 'đã hoàn thành hiến máu',
      time: '3 giờ trước',
    },
    {
      id: 3,
      user: 'Bác sĩ Hoàng',
      action: 'đã cập nhật hồ sơ y tế',
      time: '5 giờ trước',
    },
    {
      id: 4,
      user: 'Nhân viên Lan',
      action: 'đã tạo chiến dịch mới',
      time: '1 ngày trước',
    },
  ];

  // Columns for appointments table
  const appointmentColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'confirmed' ? 'green' : 'orange'}>
          {status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">
          {record.status === 'confirmed' ? 'Chi tiết' : 'Xác nhận'}
        </Button>
      ),
    },
  ];

  // Columns for donations table
  const donationColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Lượng máu',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <Tag color="green">Hoàn thành</Tag>
      ),
    },
  ];

  // Columns for medical records table (doctor view)
  const medicalRecordsColumns = [
    {
      title: 'ID',
      dataIndex: 'donorId',
      key: 'donorId',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lần hiến máu gần nhất',
      dataIndex: 'lastDonation',
      key: 'lastDonation',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Tình trạng sức khỏe',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status) => (
        <Tag color={status === 'good' ? 'green' : 'orange'}>
          {status === 'good' ? 'Tốt' : 'Cần chú ý'}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          Chi tiết
        </Button>
      ),
    },
  ];

  // Columns for blood inventory table (doctor view)
  const bloodInventoryColumns = [
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount} đơn vị`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'low' ? 'orange' : status === 'high' ? 'green' : 'blue'}>
          {status === 'low' ? 'Thấp' : status === 'high' ? 'Cao' : 'Bình thường'}
        </Tag>
      ),
    },
  ];

  // For demo purposes - toggle between staff and doctor view
  const toggleRole = () => {
    setUserRole(userRole === 'staff' ? 'doctor' : 'staff');
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Tổng quan {userRole === 'staff' ? 'Nhân viên' : 'Bác sĩ'}</h1>
        {/* For demo purposes only */}
        <Button type="primary" onClick={toggleRole} style={{ background: '#d32f2f', borderColor: '#d32f2f' }}>
          Chuyển sang {userRole === 'staff' ? 'Bác sĩ' : 'Nhân viên'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người hiến máu"
              value={stats.totalDonors}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
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
              title="Lịch hẹn chờ xác nhận"
              value={stats.pendingAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={
                <span style={{ fontSize: '0.5em', marginLeft: 8 }}>
                  <ArrowUpOutlined style={{ color: '#3f8600' }} /> {stats.appointmentTrend}%
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={userRole === 'staff' ? "Chiến dịch đang diễn ra" : "Mẫu máu cần kiểm tra"}
              value={userRole === 'staff' ? 3 : 12}
              prefix={userRole === 'staff' ? <HeartOutlined /> : <ClockCircleOutlined />}
              valueStyle={{ color: userRole === 'staff' ? '#1890ff' : '#d32f2f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main content - different for staff and doctor */}
      {userRole === 'staff' ? (
        <>
          {/* Staff View */}
          <Row gutter={16}>
            <Col xs={24} lg={16}>
              <Card title="Lịch hẹn sắp tới" extra={<Button type="link">Xem tất cả</Button>} style={{ marginBottom: 24 }}>
                <Table 
                  dataSource={upcomingAppointments} 
                  columns={appointmentColumns} 
                  pagination={false}
                  size="small"
                />
              </Card>
              <Card title="Hiến máu gần đây" extra={<Button type="link">Xem tất cả</Button>}>
                <Table 
                  dataSource={recentDonations} 
                  columns={donationColumns} 
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
        </>
      ) : (
        <>
          {/* Doctor View */}
          <Row gutter={16}>
            <Col xs={24} lg={16}>
              <Card title="Hồ sơ y tế" extra={<Button type="link">Xem tất cả</Button>} style={{ marginBottom: 24 }}>
                <Table 
                  dataSource={medicalRecords} 
                  columns={medicalRecordsColumns} 
                  pagination={false}
                  size="small"
                />
              </Card>
              <Card title="Lịch hẹn khám sức khỏe" extra={<Button type="link">Xem tất cả</Button>}>
                <Table 
                  dataSource={upcomingAppointments} 
                  columns={appointmentColumns} 
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Kho máu" style={{ marginBottom: 24 }}>
                <Table 
                  dataSource={bloodInventoryData} 
                  columns={bloodInventoryColumns} 
                  pagination={false}
                  size="small"
                />
              </Card>
              <Card title="Hoạt động gần đây">
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
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default DashboardPage; 