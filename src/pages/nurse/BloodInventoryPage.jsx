import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, DatePicker, Row, Col, Statistic } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

function BloodInventoryPage() {
  const [searchText, setSearchText] = useState('');

  // Mock data - sẽ được thay thế bằng API call
  const inventoryData = [
    {
      id: 'INV001',
      bloodType: 'A+',
      component: 'Whole Blood',
      quantity: 450,
      location: 'Tủ lạnh 01',
      collectionDate: '2024-03-15',
      expirationDate: '2024-04-14',
      status: 'available',
      donor: 'Nguyễn Văn A'
    },
    {
      id: 'INV002',
      bloodType: 'O-',
      component: 'Plasma',
      quantity: 250,
      location: 'Tủ lạnh 02',
      collectionDate: '2024-03-14',
      expirationDate: '2024-04-13',
      status: 'reserved',
      donor: 'Trần Thị B'
    },
    {
      id: 'INV003',
      bloodType: 'B+',
      component: 'Platelets',
      quantity: 200,
      location: 'Tủ lạnh 01',
      collectionDate: '2024-03-13',
      expirationDate: '2024-03-20',
      status: 'available',
      donor: 'Lê Văn C'
    },
  ];

  const columns = [
    {
      title: 'Mã đơn vị máu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
      filters: [
        { text: 'A+', value: 'A+' },
        { text: 'A-', value: 'A-' },
        { text: 'B+', value: 'B+' },
        { text: 'B-', value: 'B-' },
        { text: 'O+', value: 'O+' },
        { text: 'O-', value: 'O-' },
        { text: 'AB+', value: 'AB+' },
        { text: 'AB-', value: 'AB-' },
      ],
      onFilter: (value, record) => record.bloodType === value,
    },
    {
      title: 'Thành phần',
      dataIndex: 'component',
      key: 'component',
      filters: [
        { text: 'Whole Blood', value: 'Whole Blood' },
        { text: 'Plasma', value: 'Plasma' },
        { text: 'Platelets', value: 'Platelets' },
      ],
      onFilter: (value, record) => record.component === value,
    },
    {
      title: 'Số lượng (ml)',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Vị trí lưu trữ',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Ngày thu thập',
      dataIndex: 'collectionDate',
      key: 'collectionDate',
      sorter: (a, b) => new Date(a.collectionDate) - new Date(b.collectionDate),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      sorter: (a, b) => new Date(a.expirationDate) - new Date(b.expirationDate),
      render: (text) => {
        const daysUntilExpiry = Math.ceil((new Date(text) - new Date()) / (1000 * 60 * 60 * 24));
        let color = 'green';
        if (daysUntilExpiry <= 7) color = 'orange';
        if (daysUntilExpiry <= 3) color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'orange'}>
          {status === 'available' ? 'Có sẵn' : 'Đã đặt trước'}
        </Tag>
      ),
      filters: [
        { text: 'Có sẵn', value: 'available' },
        { text: 'Đã đặt trước', value: 'reserved' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Người hiến máu',
      dataIndex: 'donor',
      key: 'donor',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="primary">Chi tiết</Button>
          <Button>Cập nhật</Button>
        </Space>
      ),
    },
  ];

  // Tính toán thống kê
  const stats = {
    totalUnits: inventoryData.length,
    availableUnits: inventoryData.filter(item => item.status === 'available').length,
    reservedUnits: inventoryData.filter(item => item.status === 'reserved').length,
    expiringUnits: inventoryData.filter(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7;
    }).length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản lý kho máu</h2>
      
      {/* Thống kê */}
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng số đơn vị máu" value={stats.totalUnits} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đơn vị có sẵn" value={stats.availableUnits} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đơn vị đã đặt trước" value={stats.reservedUnits} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Sắp hết hạn (7 ngày)" value={stats.expiringUnits} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      {/* Bảng kho máu */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button icon={<FilterOutlined />}>Lọc</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={inventoryData}
          rowKey="id"
          pagination={{
            total: inventoryData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} đơn vị máu`,
          }}
        />
      </Card>
    </div>
  );
}

export default BloodInventoryPage; 