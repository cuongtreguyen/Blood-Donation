import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, DatePicker, Row, Col, Statistic, Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

function ReportsPage() {
  const [dateRange, setDateRange] = useState(null);
  const [reportType, setReportType] = useState('donations');

  // Mock data - sẽ được thay thế bằng API call
  const donationStats = [
    { name: 'A+', donations: 25, requests: 20 },
    { name: 'A-', donations: 15, requests: 18 },
    { name: 'B+', donations: 30, requests: 28 },
    { name: 'B-', donations: 12, requests: 15 },
    { name: 'O+', donations: 40, requests: 45 },
    { name: 'O-', donations: 18, requests: 22 },
    { name: 'AB+', donations: 10, requests: 8 },
    { name: 'AB-', donations: 5, requests: 7 },
  ];

  const donationRecords = [
    {
      id: 'DON001',
      date: '2024-03-15',
      donor: 'Nguyễn Văn A',
      bloodType: 'A+',
      quantity: 450,
      status: 'completed',
      location: 'Trung tâm hiến máu 1',
      nurse: 'Y tá Thị B'
    },
    {
      id: 'DON002',
      date: '2024-03-15',
      donor: 'Trần Thị C',
      bloodType: 'O+',
      quantity: 350,
      status: 'completed',
      location: 'Trung tâm hiến máu 2',
      nurse: 'Y tá Văn D'
    },
    {
      id: 'DON003',
      date: '2024-03-14',
      donor: 'Lê Văn E',
      bloodType: 'B+',
      quantity: 450,
      status: 'cancelled',
      location: 'Trung tâm hiến máu 1',
      nurse: 'Y tá Thị B'
    },
  ];

  const columns = {
    donations: [
      {
        title: 'Mã hiến máu',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
      },
      {
        title: 'Người hiến máu',
        dataIndex: 'donor',
        key: 'donor',
      },
      {
        title: 'Nhóm máu',
        dataIndex: 'bloodType',
        key: 'bloodType',
        render: (text) => <Tag color="red">{text}</Tag>,
      },
      {
        title: 'Số lượng (ml)',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'completed' ? 'green' : 'red'}>
            {status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
          </Tag>
        ),
      },
      {
        title: 'Địa điểm',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Y tá phụ trách',
        dataIndex: 'nurse',
        key: 'nurse',
      },
    ],
  };

  // Tính toán thống kê
  const stats = {
    totalDonations: donationRecords.length,
    completedDonations: donationRecords.filter(record => record.status === 'completed').length,
    cancelledDonations: donationRecords.filter(record => record.status === 'cancelled').length,
    totalBloodCollected: donationRecords
      .filter(record => record.status === 'completed')
      .reduce((sum, record) => sum + record.quantity, 0),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Báo cáo thống kê</h2>

      {/* Thống kê tổng quan */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng số lượt hiến máu" 
              value={stats.totalDonations} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Hoàn thành" 
              value={stats.completedDonations}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Đã hủy" 
              value={stats.cancelledDonations}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng lượng máu (ml)" 
              value={stats.totalBloodCollected}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ thống kê */}
      <Card title="Thống kê theo nhóm máu">
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={donationStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donations" name="Số lượt hiến" fill="#1890ff" />
              <Bar dataKey="requests" name="Số yêu cầu" fill="#ff4d4f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bảng báo cáo chi tiết */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 200 }}
            >
              <Option value="donations">Báo cáo hiến máu</Option>
              <Option value="inventory">Báo cáo kho máu</Option>
              <Option value="requests">Báo cáo yêu cầu máu</Option>
            </Select>
            <RangePicker 
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Space>
          <Button type="primary">Xuất báo cáo</Button>
        </div>

        <Table
          columns={columns[reportType]}
          dataSource={donationRecords.filter(record => {
            if (!dateRange) return true;
            const recordDate = new Date(record.date);
            return recordDate >= dateRange[0] && recordDate <= dateRange[1];
          })}
          rowKey="id"
          pagination={{
            total: donationRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} bản ghi`,
          }}
        />
      </Card>
    </div>
  );
}

export default ReportsPage; 