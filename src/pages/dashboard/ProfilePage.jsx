import React, { useState } from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, Upload, message, Divider, DatePicker } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useUser } from '../../contexts/UserContext';
import moment from 'moment';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => ({
        ...prev,
        ...values,
      }));
      
      message.success('Đã cập nhật thông tin thành công');
      setEditing(false);
    } catch {
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...user,
      joinDate: moment(user.joinDate)
    });
    setEditing(true);
  };

  return (
    <div>
      <h1>Thông tin cá nhân</h1>
      
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={user.avatar}
                style={{ marginBottom: 16 }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ được tải lên file ảnh!');
                    return false;
                  }
                  // Giả lập upload ảnh
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setUser(prev => ({
                      ...prev,
                      avatar: e.target.result
                    }));
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </div>

            <Divider />

            <div>
              <p><strong>Vai trò:</strong> {user.position}</p>
              <p><strong>Ngày vào làm:</strong> {moment(user.joinDate).format('DD/MM/YYYY')}</p>
              <p><strong>Khoa/Phòng:</strong> {user.department}</p>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card
            title="Thông tin chi tiết"
            extra={
              !editing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              ) : null
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                ...user,
                joinDate: moment(user.joinDate)
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input disabled={!editing} />
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
                    <Input disabled={!editing} />
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
                    <Input disabled={!editing} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="department"
                    label="Khoa/Phòng"
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input.TextArea rows={3} disabled={!editing} />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <div style={{ textAlign: 'right', gap: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setEditing(false)}>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
          </Card>

          <Card title="Bảo mật" style={{ marginTop: 16 }}>
            <Button type="primary" danger>
              Đổi mật khẩu
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage; 