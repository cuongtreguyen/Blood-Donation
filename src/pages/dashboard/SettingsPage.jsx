import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, message, Tabs, TimePicker, InputNumber } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialSettings = {
    hospitalInfo: {
      name: 'Bệnh viện Đa khoa Trung ương',
      address: '1 Đường Giải Phóng, Hà Nội',
      phone: '024.3868.xxxx',
      email: 'contact@bvdktw.vn',
      website: 'www.bvdktw.vn'
    },
    donationSettings: {
      minAge: 18,
      maxAge: 60,
      minWeight: 45,
      minHemoglobin: 12,
      minDaysBetweenDonations: 90,
      operatingHoursStart: '08:00',
      operatingHoursEnd: '17:00',
      maxDailyAppointments: 50
    },
    notificationSettings: {
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      reminderBeforeDays: 1,
      enableLowBloodStockAlerts: true,
      lowBloodStockThreshold: 10
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Giả lập API call để lưu settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Lưu vào localStorage để demo
      localStorage.setItem('systemSettings', JSON.stringify(values));
      
      message.success('Đã lưu cài đặt thành công');
    } catch {
      message.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Cài đặt hệ thống</h1>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialSettings}
        onFinish={handleSubmit}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin bệnh viện" key="1">
            <Card>
              <Form.Item
                name={['hospitalInfo', 'name']}
                label="Tên bệnh viện"
                rules={[{ required: true, message: 'Vui lòng nhập tên bệnh viện' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={['hospitalInfo', 'address']}
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={['hospitalInfo', 'phone']}
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={['hospitalInfo', 'email']}
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={['hospitalInfo', 'website']}
                label="Website"
              >
                <Input />
              </Form.Item>
            </Card>
          </TabPane>

          <TabPane tab="Quy định hiến máu" key="2">
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Form.Item
                  name={['donationSettings', 'minAge']}
                  label="Tuổi tối thiểu"
                  rules={[{ required: true, message: 'Vui lòng nhập tuổi tối thiểu' }]}
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'maxAge']}
                  label="Tuổi tối đa"
                  rules={[{ required: true, message: 'Vui lòng nhập tuổi tối đa' }]}
                >
                  <InputNumber min={0} max={100} />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'minWeight']}
                  label="Cân nặng tối thiểu (kg)"
                  rules={[{ required: true, message: 'Vui lòng nhập cân nặng tối thiểu' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'minHemoglobin']}
                  label="Hemoglobin tối thiểu (g/dL)"
                  rules={[{ required: true, message: 'Vui lòng nhập hemoglobin tối thiểu' }]}
                >
                  <InputNumber min={0} step={0.1} />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'minDaysBetweenDonations']}
                  label="Số ngày tối thiểu giữa các lần hiến"
                  rules={[{ required: true, message: 'Vui lòng nhập số ngày tối thiểu' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'maxDailyAppointments']}
                  label="Số lượng cuộc hẹn tối đa mỗi ngày"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng cuộc hẹn tối đa' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'operatingHoursStart']}
                  label="Giờ mở cửa"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ mở cửa' }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>

                <Form.Item
                  name={['donationSettings', 'operatingHoursEnd']}
                  label="Giờ đóng cửa"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ đóng cửa' }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </div>
            </Card>
          </TabPane>

          <TabPane tab="Thông báo" key="3">
            <Card>
              <Form.Item
                name={['notificationSettings', 'enableEmailNotifications']}
                valuePropName="checked"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                <span style={{ marginLeft: 8 }}>Gửi thông báo qua email</span>
              </Form.Item>

              <Form.Item
                name={['notificationSettings', 'enableSMSNotifications']}
                valuePropName="checked"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                <span style={{ marginLeft: 8 }}>Gửi thông báo qua SMS</span>
              </Form.Item>

              <Form.Item
                name={['notificationSettings', 'reminderBeforeDays']}
                label="Số ngày gửi nhắc trước lịch hẹn"
              >
                <InputNumber min={0} max={30} />
              </Form.Item>

              <Form.Item
                name={['notificationSettings', 'enableLowBloodStockAlerts']}
                valuePropName="checked"
              >
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                <span style={{ marginLeft: 8 }}>Cảnh báo khi máu sắp hết</span>
              </Form.Item>

              <Form.Item
                name={['notificationSettings', 'lowBloodStockThreshold']}
                label="Ngưỡng cảnh báo máu sắp hết (đơn vị)"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Card>
          </TabPane>
        </Tabs>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            htmlType="submit"
          >
            Lưu cài đặt
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SettingsPage; 