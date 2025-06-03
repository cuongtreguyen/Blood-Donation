import React from 'react';
import { Table, Card, Button, Tag, Space, Input } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Search } = Input;

function DonorsPage() {
  const donors = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      bloodType: 'A+',
      lastDonation: '2024-03-01',
      donationCount: 5,
      healthStatus: 'good',
      nextEligibleDate: '2024-06-01'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      bloodType: 'O-',
      lastDonation: '2024-02-15',
      donationCount: 3,
      healthStatus: 'attention',
      nextEligibleDate: '2024-05-15'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      bloodType: 'B+',
      lastDonation: '2024-03-10',
      donationCount: 8,
      healthStatus: 'good',
      nextEligibleDate: '2024-06-10'
    }
  ];

  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Lần hiến gần nhất',
      dataIndex: 'lastDonation',
      key: 'lastDonation',
    },
    {
      title: 'Số lần hiến',
      dataIndex: 'donationCount',
      key: 'donationCount',
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
      title: 'Ngày đủ điều kiện tiếp',
      dataIndex: 'nextEligibleDate',
      key: 'nextEligibleDate',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary">Xem hồ sơ</Button>
          <Button>Lịch sử hiến máu</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý người hiến máu</h2>
      
      <Card>
        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm theo tên hoặc mã số"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={donors}
          rowKey="id"
          pagination={{
            total: donors.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} người hiến máu`,
          }}
        />
      </Card>
    </div>
  );
}

export default DonorsPage; 