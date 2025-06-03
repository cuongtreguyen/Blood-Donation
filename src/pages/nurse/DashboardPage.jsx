import React from 'react';
import { Card, Row, Col, Table, Button, Tag, Space, Statistic } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, HeartOutlined, CalendarOutlined, DashboardOutlined } from '@ant-design/icons';

function DashboardPage() {
  const appointments = [
    {
      id: '1',
      donorName: 'Nguyễn Văn A',
      time: '09:00',
      type: 'Hiến máu toàn phần',
      status: 'waiting'
    },
    {
      id: '2',
      donorName: 'Trần Thị B',
      time: '09:30',
      type: 'Hiến tiểu cầu',
      status: 'in_progress'
    },
    {
      id: '3',
      donorName: 'Lê Văn C',
      time: '10:00',
      type: 'Hiến máu toàn phần',
      status: 'completed'
    }
  ];

  const donationQueue = [
    {
      id: '1',
      donorName: 'Nguyễn Văn A',
      bloodType: 'A+',
      stage: 'registration',
      waitTime: '5 phút'
    },
    {
      id: '2',
      donorName: 'Trần Thị B',
      bloodType: 'O-',
      stage: 'vital_check',
      waitTime: '10 phút'
    },
    {
      id: '3',
      donorName: 'Lê Văn C',
      bloodType: 'B+',
      stage: 'donation',
      waitTime: '15 phút'
    }
  ];

  const appointmentColumns = [
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Loại hiến máu',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          waiting: { color: 'default', text: 'Chờ đến' },
          in_progress: { color: 'processing', text: 'Đang thực hiện' },
          completed: { color: 'success', text: 'Hoàn thành' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small">Tiếp nhận</Button>
          <Button size="small">Chi tiết</Button>
        </Space>
      ),
    },
  ];

  const queueColumns = [
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Giai đoạn',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage) => {
        const stageConfig = {
          registration: { text: 'Đăng ký' },
          vital_check: { text: 'Đo chỉ số' },
          donation: { text: 'Hiến máu' }
        };
        return stageConfig[stage].text;
      },
    },
    {
      title: 'Thời gian chờ',
      dataIndex: 'waitTime',
      key: 'waitTime',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Button type="primary" size="small">Xử lý</Button>
      ),
    },
  ];

  // Mock data - sẽ được thay thế bằng dữ liệu thực từ API
  const stats = {
    totalDonors: 150,
    appointmentsToday: 25,
    bloodUnitsCollected: 45,
    activeCampaigns: 3
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tổng Quan</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng Người Hiến Máu"
              value={stats.totalDonors}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lịch Hẹn Hôm Nay"
              value={stats.appointmentsToday}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn Vị Máu Đã Thu"
              value={stats.bloodUnitsCollected}
              prefix={<DashboardOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chiến Dịch Đang Diễn Ra"
              value={stats.activeCampaigns}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Lịch hẹn hôm nay"
              value={8}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={3}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang hiến máu"
              value={2}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành hôm nay"
              value={5}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Lịch hẹn hôm nay" extra={<Button type="link">Xem tất cả</Button>}>
            <Table
              columns={appointmentColumns}
              dataSource={appointments}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Hàng chờ hiện tại" extra={<Button type="link">Xem tất cả</Button>}>
            <Table
              columns={queueColumns}
              dataSource={donationQueue}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage; 