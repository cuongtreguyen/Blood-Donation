import React from 'react';
import { Table, Card, Button, Tag, Space, Statistic, Row, Col } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

function BloodInventoryPage() {
  const bloodInventory = [
    {
      id: '1',
      bloodType: 'A+',
      quantity: 50,
      status: 'normal',
      lastUpdated: '2024-03-15',
      expiryDate: '2024-04-15',
      location: 'Kho 1'
    },
    {
      id: '2',
      bloodType: 'O-',
      quantity: 10,
      status: 'low',
      lastUpdated: '2024-03-15',
      expiryDate: '2024-04-15',
      location: 'Kho 2'
    },
    {
      id: '3',
      bloodType: 'B+',
      quantity: 30,
      status: 'normal',
      lastUpdated: '2024-03-14',
      expiryDate: '2024-04-14',
      location: 'Kho 1'
    }
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
    },
    {
      title: 'Số lượng (đơn vị)',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = {
          normal: { color: 'success', text: 'Bình thường', icon: <CheckCircleOutlined /> },
          low: { color: 'warning', text: 'Sắp hết', icon: <WarningOutlined /> },
        };
        const { color, text, icon } = config[status] || {};
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Vị trí lưu trữ',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary">Xuất kho</Button>
          <Button>Xem chi tiết</Button>
        </Space>
      ),
    },
  ];

  // Tính toán thống kê
  const totalUnits = bloodInventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const lowStock = bloodInventory.filter(item => item.status === 'low').length;//đếm số luong nhom mau sắp hết

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý kho máu</h2>
      
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn vị máu"
              value={totalUnits}
              suffix="đơn vị"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhóm máu sắp hết"
              value={lowStock}
              suffix="nhóm"
              valueStyle={{ color: lowStock > 0 ? '#faad14' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={bloodInventory}
          rowKey="id"
          pagination={{
            total: bloodInventory.length,
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