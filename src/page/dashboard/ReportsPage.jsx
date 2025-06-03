import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Select, Button, Table, Statistic, Space, message } from 'antd';
import { DownloadOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState(null);
  const [reportType, setReportType] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data for statistics
  const stats = {
    totalDonors: 1245,
    totalBloodVolume: 450000, // in ml
    totalCampaigns: 15,
    totalLocations: 8
  };

  // Mock data for blood type statistics
  const bloodTypeData = [
    { type: 'A+', amount: 85, percentage: 25 },
    { type: 'A-', amount: 45, percentage: 15 },
    { type: 'B+', amount: 76, percentage: 20 },
    { type: 'B-', amount: 30, percentage: 10 },
    { type: 'AB+', amount: 25, percentage: 8 },
    { type: 'AB-', amount: 15, percentage: 5 },
    { type: 'O+', amount: 92, percentage: 12 },
    { type: 'O-', amount: 38, percentage: 5 }
  ];

  // Mock data for donation history
  const donationHistory = [
    {
      date: '2024-03-20',
      totalDonations: 35,
      successfulDonations: 32,
      newDonors: 8,
      bloodCollected: 14400
    },
    {
      date: '2024-03-19',
      totalDonations: 42,
      successfulDonations: 40,
      newDonors: 12,
      bloodCollected: 18000
    },
    {
      date: '2024-03-18',
      totalDonations: 38,
      successfulDonations: 36,
      newDonors: 5,
      bloodCollected: 16200
    }
  ];

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tổng lượt hiến',
      dataIndex: 'totalDonations',
      key: 'totalDonations',
    },
    {
      title: 'Hiến thành công',
      dataIndex: 'successfulDonations',
      key: 'successfulDonations',
    },
    {
      title: 'Người hiến mới',
      dataIndex: 'newDonors',
      key: 'newDonors',
    },
    {
      title: 'Lượng máu thu được (ml)',
      dataIndex: 'bloodCollected',
      key: 'bloodCollected',
    }
  ];

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const handleTypeChange = (value) => {
    setReportType(value);
  };

  const handleExport = () => {
    message.success('Đang xuất báo cáo...');
    // TODO: Implement export functionality
    console.log('Exporting report...');
  };

  const handlePrint = () => {
    message.success('Đang chuẩn bị in báo cáo...');
    window.print();
  };

  const handleGenerateReport = () => {
    if (!dateRange) {
      message.error('Vui lòng chọn khoảng thời gian');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success('Đã tạo báo cáo thành công');
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Báo cáo thống kê</h1>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Xuất Excel
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            In báo cáo
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <RangePicker 
            style={{ width: 300 }} 
            onChange={handleDateChange}
          />
          <Select 
            defaultValue="all" 
            style={{ width: 200 }}
            onChange={handleTypeChange}
          >
            <Option value="all">Tất cả hình thức</Option>
            <Option value="voluntary">Hiến máu tình nguyện</Option>
            <Option value="replacement">Hiến máu thay thế</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleGenerateReport}
            loading={loading}
          >
            Tạo báo cáo
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người hiến máu"
              value={stats.totalDonors}
              suffix="người"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lượng máu"
              value={stats.totalBloodVolume}
              suffix="ml"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số chiến dịch"
              value={stats.totalCampaigns}
              suffix="chiến dịch"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số địa điểm"
              value={stats.totalLocations}
              suffix="địa điểm"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Thống kê theo nhóm máu">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bloodTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" name="Số lượng (đơn vị)" fill="#ff4d4f" />
                <Bar dataKey="percentage" name="Tỷ lệ (%)" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Lịch sử hiến máu">
            <Table
              dataSource={donationHistory}
              columns={columns}
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage; 