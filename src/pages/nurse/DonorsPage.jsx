import React from 'react';
import { Card, Table, Button, Tag, Space, Form, Input, Row, Col, Select, DatePicker } from 'antd';
import { UserOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';

const { Option } = Select;

function DonorsPage() {
  const donors = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      bloodType: 'A+',
      lastDonation: '2024-03-01',
      status: 'eligible',
      nextDonation: '2024-06-01'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      phone: '0987654321',
      bloodType: 'O-',
      lastDonation: '2024-02-15',
      status: 'ineligible',
      nextDonation: '2024-05-15'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      phone: '0369852147',
      bloodType: 'B+',
      lastDonation: '2024-01-10',
      status: 'eligible',
      nextDonation: '2024-04-10'
    }
  ];

  const columns = [
    {
      title: 'Mã người hiến',
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
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined />
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          eligible: { color: 'success', text: 'Đủ điều kiện' },
          ineligible: { color: 'error', text: 'Chưa đủ điều kiện' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: 'Lần hiến tiếp theo',
      dataIndex: 'nextDonation',
      key: 'nextDonation',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary">Đặt lịch hẹn</Button>
          <Button>Xem hồ sơ</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý người hiến máu</h2>

      <Card className="mb-6">
        <Form layout="vertical">
          <h3 className="text-lg font-semibold mb-4">Đăng ký người hiến máu mới</h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="CMND/CCCD" name="idNumber" rules={[{ required: true }]}>
                <Input prefix={<IdcardOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Ngày sinh" name="birthDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Nhóm máu" name="bloodType">
                <Select>
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
                <Select>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary">Đăng ký</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Danh sách người hiến máu">
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