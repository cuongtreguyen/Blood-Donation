import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Row, Col, Avatar, Upload, message, Divider, Modal, Select } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import moment from 'moment';
import { updateStaffMember, updatePassword, initializeUserData } from '../../services/staffService';
import { useUser } from '../../contexts/UserContext';

const { Option } = Select;

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Khởi tạo dữ liệu người dùng
  useEffect(() => {
    if (user) {
      // Khởi tạo dữ liệu người dùng trong danh sách nhân viên
      const initializedUser = initializeUserData(user);
      setUser(initializedUser);
      
      // Cập nhật form
      form.setFieldsValue({
        name: initializedUser.name,
        email: initializedUser.email,
        phone: initializedUser.phone,
        department: initializedUser.department,
        address: initializedUser.address
      });
    }
  }, [user?.email]); // Chỉ chạy khi email thay đổi

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Cập nhật thông tin
      const result = updateStaffMember({
        ...user,
        ...values,
      });

      if (typeof result === 'object') {
        // Nếu là người dùng hiện tại, result sẽ là object chứa thông tin đã cập nhật
        setUser(result);
        message.success('Đã cập nhật thông tin thành công');
        setEditing(false);
      } else if (result === true) {
        // Cập nhật thành công nhưng không phải người dùng hiện tại
        setUser(prev => ({
          ...prev,
          ...values
        }));
        message.success('Đã cập nhật thông tin thành công');
        setEditing(false);
      } else {
        throw new Error('Không thể cập nhật thông tin');
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    try {
      // Cập nhật mật khẩu mới
      const result = await updatePassword(user.email, values.oldPassword, values.newPassword);
      
      if (result) {
        message.success('Đã đổi mật khẩu thành công');
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        throw new Error('Mật khẩu cũ không đúng');
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được tải lên file ảnh!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const base64Image = reader.result;
          
          // Cập nhật ảnh
          const result = updateStaffMember({
            ...user,
            avatar: base64Image
          });

          if (typeof result === 'object') {
            // Nếu là người dùng hiện tại
            setUser(result);
            message.success('Đã cập nhật ảnh đại diện');
          } else if (result === true) {
            setUser(prev => ({
              ...prev,
              avatar: base64Image
            }));
            message.success('Đã cập nhật ảnh đại diện');
          } else {
            throw new Error('Không thể cập nhật ảnh đại diện');
          }
        } catch (err) {
          message.error(err.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện');
        }
      };
      
      reader.onerror = () => {
        message.error('Có lỗi xảy ra khi đọc file ảnh');
      };
      
      reader.readAsDataURL(file);
      return false; // Prevent default upload
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi xử lý ảnh');
      return false;
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      ...user
    });
    setEditing(true);
  };

  // Kiểm tra xem có dữ liệu người dùng không
  if (!user) {
    return <div>Đang tải...</div>;
  }

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
                beforeUpload={handleImageUpload}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </div>

            <Divider />

            <div>
              <p><strong>Vai trò:</strong> {user.position || 'Chưa cập nhật'}</p>
              <p><strong>Ngày vào làm:</strong> {moment(user.joinDate).format('DD/MM/YYYY')}</p>
              <p><strong>Khoa/Phòng:</strong> {user.department || 'Chưa cập nhật'}</p>
            </div>

            <Divider />

            <Button 
              type="primary" 
              icon={<LockOutlined />} 
              onClick={() => setIsPasswordModalVisible(true)}
              block
            >
              Đổi mật khẩu
            </Button>
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
                    <Input disabled={true} />
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
                    rules={[{ required: true, message: 'Vui lòng chọn khoa/phòng' }]}
                  >
                    <Select disabled={!editing}>
                      <Option value="Khoa Huyết học">Khoa Huyết học</Option>
                      <Option value="Khoa Xét nghiệm">Khoa Xét nghiệm</Option>
                      <Option value="Khoa Nội">Khoa Nội</Option>
                      <Option value="Khoa Ngoại">Khoa Ngoại</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input.TextArea disabled={!editing} rows={4} />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                    Lưu thay đổi
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>
                    Hủy
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Đổi mật khẩu"
        visible={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu cũ' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={passwordLoading}>
              Xác nhận
            </Button>
            <Button 
              style={{ marginLeft: 8 }} 
              onClick={() => {
                setIsPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage; 