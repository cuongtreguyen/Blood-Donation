import React from 'react';
import { Card, Avatar, Button, Form, Input, Row, Col, Divider, Tag, Upload, Tabs, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, IdcardOutlined, TrophyOutlined, UploadOutlined, LockOutlined, HistoryOutlined } from '@ant-design/icons';
import { useUser } from '../../../contexts/UserContext';


function ProfilePage() {
  const { user } = useUser();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Updated values:', values);
    // Add update profile logic here
  };

  const achievements = [
    {
      title: 'Bác sĩ xuất sắc 2023',
      date: '12/2023',
      description: 'Đạt thành tích xuất sắc trong công tác khám và điều trị',
    },
    {
      title: '1000 ca khám thành công',
      date: '10/2023',
      description: 'Đạt mốc 1000 ca khám và tư vấn cho người hiến máu',
    },
    {
      title: 'Nghiên cứu xuất sắc',
      date: '06/2023',
      description: 'Công trình nghiên cứu về cải thiện quy trình hiến máu',
    },
  ];

  const activityHistory = [
    {
      id: '1',
      action: 'Duyệt hồ sơ hiến máu',
      date: '2024-03-15 09:30',
      details: 'Duyệt hồ sơ hiến máu của Nguyễn Văn A',
      status: 'success'
    },
    {
      id: '2',
      action: 'Cập nhật kho máu',
      date: '2024-03-15 10:15',
      details: 'Cập nhật số lượng máu nhóm O+',
      status: 'info'
    },
    {
      id: '3',
      action: 'Tạo báo cáo',
      date: '2024-03-14 15:45',
      details: 'Tạo báo cáo hiến máu tháng 3/2024',
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <Avatar
            size={128}
            icon={<UserOutlined />}
            src={user?.avatar}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold">BS. {user?.name}</h2>
          <p className="text-gray-500">{user?.position} - {user?.department}</p>
          <div className="mt-2">
            <Tag color="blue">Chuyên khoa Huyết học</Tag>
            <Tag color="green">10 năm kinh nghiệm</Tag>
            <Tag color="purple">Thành viên hội đồng y khoa</Tag>
          </div>
        </div>

        <Divider />

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
                      <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                          name: user?.name,
                          email: user?.email,
                          phone: '0901234567',
                          address: 'Số 123 Đường ABC, Quận XYZ, TP.HCM',
                          employeeId: 'DOC001',
                          department: user?.department,
                          position: user?.position,
                          joinDate: user?.joinDate,
                          specialization: 'Huyết học',
                          degree: 'Tiến sĩ Y khoa',
                          certifications: 'Chứng chỉ hành nghề số 12345',
                        }}
                        onFinish={onFinish}
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="name"
                              label="Họ và tên"
                              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                              <Input prefix={<UserOutlined />} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="email"
                              label="Email"
                              rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' }
                              ]}
                            >
                              <Input prefix={<MailOutlined />} />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="phone"
                              label="Số điện thoại"
                              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                              <Input prefix={<PhoneOutlined />} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="employeeId"
                              label="Mã bác sĩ"
                            >
                              <Input prefix={<IdcardOutlined />} disabled />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="address"
                          label="Địa chỉ"
                          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                          <Input prefix={<HomeOutlined />} />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="specialization"
                              label="Chuyên khoa"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="degree"
                              label="Học vị"
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="certifications"
                          label="Chứng chỉ hành nghề"
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item>
                          <div className="flex justify-end space-x-4">
                            <Button type="primary" htmlType="submit">
                              Cập nhật thông tin
                            </Button>
                          </div>
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
      </Card>
    </div>
  );
}

export default ProfilePage; 