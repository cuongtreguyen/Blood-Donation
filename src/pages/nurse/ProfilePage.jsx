import React from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, Upload, Tabs, Table, Tag } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined, HistoryOutlined } from '@ant-design/icons';

function ProfilePage() {
  const nurseInfo = {
    name: 'Y tá Nguyễn Thị X',
    email: 'nguyenthix@hospital.com',
    phone: '0123456789',
    department: 'Khoa Huyết học',
    position: 'Y tá chính',
    licenseNumber: 'YT12345',
    joinDate: '2021-01-01',
  };

  const activityHistory = [
    {
      id: '1',
      action: 'Tiếp nhận người hiến máu',
      date: '2024-03-15 09:30',
      details: 'Tiếp nhận và đo chỉ số cho Nguyễn Văn A',
      status: 'success'
    },
    {
      id: '2',
      action: 'Đặt lịch hẹn',
      date: '2024-03-15 10:15',
      details: 'Đặt lịch hẹn hiến máu cho Trần Thị B',
      status: 'info'
    },
    {
      id: '3',
      action: 'Chăm sóc sau hiến máu',
      date: '2024-03-14 15:45',
      details: 'Theo dõi và chăm sóc sau hiến máu cho Lê Văn C',
      status: 'success'
    }
  ];

  const activityColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          success: { color: 'success', text: 'Thành công' },
          info: { color: 'processing', text: 'Thông tin' },
          warning: { color: 'warning', text: 'Cảnh báo' },
          error: { color: 'error', text: 'Lỗi' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>

      <Tabs
        defaultActiveKey="info"
        items={[
          {
            key: 'info',
            label: (
              <span>
                <UserOutlined />
                Thông tin cơ bản
              </span>
            ),
            children: (
              <Card>
                <Row gutter={24}>
                  <Col span={6}>
                    <div className="text-center mb-4">
                      <Avatar size={120} icon={<UserOutlined />} />
                      <div className="mt-4">
                        <Upload>
                          <Button icon={<UploadOutlined />}>Đổi ảnh đại diện</Button>
                        </Upload>
                      </div>
                    </div>
                  </Col>
                  <Col span={18}>
                    <Form layout="vertical" initialValues={nurseInfo}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Họ và tên" name="name">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Email" name="email">
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Số điện thoại" name="phone">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Khoa" name="department">
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Vị trí" name="position">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Số giấy phép" name="licenseNumber">
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Button type="primary">Cập nhật thông tin</Button>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: 'security',
            label: (
              <span>
                <LockOutlined />
                Bảo mật
              </span>
            ),
            children: (
              <Card>
                <Form layout="vertical">
                  <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>

                  <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>

                  <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary">Đổi mật khẩu</Button>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'activity',
            label: (
              <span>
                <HistoryOutlined />
                Lịch sử hoạt động
              </span>
            ),
            children: (
              <Card>
                <Table
                  columns={activityColumns}
                  dataSource={activityHistory}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng số ${total} hoạt động`,
                  }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}

export default ProfilePage; 