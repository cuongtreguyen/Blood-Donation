import React from 'react';
import { Tabs, Form, Input, Button, Switch, Select, Card, message, InputNumber } from 'antd';
import { SaveOutlined, BellOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const SettingsPage = () => {
  const [generalForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const handleGeneralSubmit = (values) => {
    console.log('General settings:', values);
    message.success('Đã lưu thông tin chung');
  };

  const handleNotificationSubmit = (values) => {
    console.log('Notification settings:', values);
    message.success('Đã lưu cài đặt thông báo');
  };

  const handleSecuritySubmit = (values) => {
    console.log('Security settings:', values);
    message.success('Đã lưu cài đặt bảo mật');
  };

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Cài đặt hệ thống</h1>

      <Card>
        <Tabs defaultActiveKey="general">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Thông tin chung
              </span>
            }
            key="general"
          >
            <Form
              form={generalForm}
              layout="vertical"
              onFinish={handleGeneralSubmit}
              initialValues={{
                organizationName: 'Trung tâm hiến máu nhân đạo',
                email: 'contact@blooddonation.org',
                phone: '1900 1234',
                address: 'Số 1 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'
              }}
            >
              <Form.Item
                name="organizationName"
                label="Tên tổ chức"
                rules={[{ required: true, message: 'Vui lòng nhập tên tổ chức' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email liên hệ"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Lưu thông tin
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Thông báo
              </span>
            }
            key="notifications"
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSubmit}
              initialValues={{
                emailNotifications: true,
                smsNotifications: true,
                notificationFrequency: 'daily'
              }}
            >
              <Form.Item
                name="emailNotifications"
                label="Thông báo qua email"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="emailSettings"
                label="Cài đặt email"
                rules={[{ required: true, message: 'Vui lòng chọn loại email' }]}
              >
                <Select mode="multiple">
                  <Option value="appointments">Lịch hẹn</Option>
                  <Option value="campaigns">Chiến dịch mới</Option>
                  <Option value="reports">Báo cáo</Option>
                  <Option value="updates">Cập nhật hệ thống</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="smsNotifications"
                label="Thông báo qua SMS"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="smsSettings"
                label="Cài đặt SMS"
                rules={[{ required: true, message: 'Vui lòng chọn loại SMS' }]}
              >
                <Select mode="multiple">
                  <Option value="appointments">Lịch hẹn</Option>
                  <Option value="reminders">Nhắc nhở</Option>
                  <Option value="urgent">Thông báo khẩn cấp</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="notificationFrequency"
                label="Tần suất thông báo"
              >
                <Select>
                  <Option value="realtime">Thời gian thực</Option>
                  <Option value="daily">Hàng ngày</Option>
                  <Option value="weekly">Hàng tuần</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Lưu cài đặt
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Bảo mật
              </span>
            }
            key="security"
          >
            <Form
              form={securityForm}
              layout="vertical"
              onFinish={handleSecuritySubmit}
              initialValues={{
                twoFactorAuth: false,
                sessionTimeout: 30,
                passwordExpiration: 90,
                loginAttempts: 5
              }}
            >
              <Form.Item
                name="twoFactorAuth"
                label="Xác thực hai lớp"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="Thời gian hết phiên (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian hết phiên' }]}
              >
                <InputNumber min={5} max={120} />
              </Form.Item>

              <Form.Item
                name="passwordExpiration"
                label="Thời hạn mật khẩu (ngày)"
                rules={[{ required: true, message: 'Vui lòng nhập thời hạn mật khẩu' }]}
              >
                <InputNumber min={30} max={180} />
              </Form.Item>

              <Form.Item
                name="loginAttempts"
                label="Số lần đăng nhập thất bại tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số lần đăng nhập thất bại tối đa' }]}
              >
                <InputNumber min={3} max={10} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Lưu cài đặt
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage; 