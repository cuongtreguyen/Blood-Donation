import React from 'react';
import { Form, Input, Select, DatePicker, Button, Checkbox, Radio, Space, Card, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EnvironmentOutlined, HeartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

function BloodRequestForm() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    toast.success('Yêu cầu cần máu của bạn đã được gửi thành công!');
    form.resetFields();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="Đăng Ký Nhận Máu" styles={{ header: { backgroundColor: '#d32f2f', color: 'white', fontSize: '20px', fontWeight: 'bold' } }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            requestType: 'normal',
            gender: 'male' // Giá trị mặc định cho giới tính
          }}
        >
          <Form.Item
            name="requestType"
            label="Loại yêu cầu"
            rules={[{ required: true, message: 'Vui lòng chọn loại yêu cầu!' }]}
          >
            <Radio.Group>
              <Radio value="normal">Thông thường</Radio>
              <Radio value="urgent">Khẩn cấp</Radio>
            </Radio.Group>
          </Form.Item>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}><UserOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Thông Tin Cá Nhân</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input placeholder="Nhập họ tên đầy đủ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                  { 
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)!'
                  }
                ]}
              >
                <Input placeholder="Nhập địa chỉ email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày sinh!' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const age = dayjs().diff(value, 'year');
                      if (age < 18) {
                        return Promise.reject('Bạn phải từ 18 tuổi trở lên!');
                      }
                      if (age > 65) {
                        return Promise.reject('Bạn phải dưới 65 tuổi!');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input placeholder="Số nhà, tên đường" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Thành phố"
                rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
              >
                <Input placeholder="Thành phố" />
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}><HeartOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Thông Tin Sức Khỏe</h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bloodType"
                label="Nhóm máu"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
              >
                <Select placeholder="Chọn nhóm máu">
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="weight"
                label="Cân nặng (kg)"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
              >
                <Input type="number" placeholder="Cân nặng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="height"
                label="Chiều cao (cm)"
                rules={[{ required: true, message: 'Vui lòng nhập chiều cao!' }]}
              >
                <Input type="number" placeholder="Chiều cao" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="lastDonationDate"
            label="Lần hiến máu gần nhất"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const today = dayjs().startOf('day');
                  const selectedDate = value.startOf('day');
                  if (selectedDate.isAfter(today)) {
                    return Promise.reject('Ngày hiến máu không thể là ngày trong tương lai!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
          </Form.Item>
          <Form.Item
            name="medicalHistory"
            label="Tiền sử bệnh (nếu có)"
          >
            <TextArea
              placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="chronicDisease" valuePropName="checked">
                <Checkbox>Có bệnh mãn tính</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="takingMedication" valuePropName="checked">
                <Checkbox>Đang dùng thuốc</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="recentSurgery" valuePropName="checked">
                <Checkbox>Phẫu thuật gần đây</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}><CalendarOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Lịch Hẹn Nhận Máu</h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="desiredDate"
                label="Ngày mong muốn"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày mong muốn!' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const today = dayjs().startOf('day');
                      const selectedDate = value.startOf('day');
                      if (selectedDate.isBefore(today)) {
                        return Promise.reject('Ngày mong muốn không thể là ngày trong quá khứ!');
                      }
                      if (selectedDate.isAfter(today.add(30, 'day'))) {
                        return Promise.reject('Ngày mong muốn không thể quá 30 ngày trong tương lai!');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="desiredTime"
                label="Giờ mong muốn"
                rules={[{ required: true, message: 'Vui lòng chọn giờ mong muốn!' }]}
              >
                <Select placeholder="Chọn giờ">
                  <Option value="morning">Sáng (8h-12h)</Option>
                  <Option value="afternoon">Chiều (13h-17h)</Option>
                  <Option value="evening">Tối (18h-21h)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="desiredLocation"
                label="Địa điểm"
                rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
              >
                <Select placeholder="Chọn địa điểm">
                  <Option value="hospital1">Bệnh viện Đa khoa Trung ương</Option>
                  <Option value="center1">Trung tâm Huyết học Quốc gia</Option>
                  <Option value="hospital2">Bệnh viện Chợ Rẫy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}><PhoneOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Người Liên Hệ Khẩn Cấp</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emergencyContactName"
                label="Họ tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên người liên hệ khẩn cấp!' }]}
              >
                <Input placeholder="Tên người thân" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emergencyContactPhone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại người liên hệ khẩn cấp!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                ]}
              >
                <Input placeholder="Số điện thoại người thân" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vui lòng xác nhận thông tin!')) }]}
          >
            <Checkbox>Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với <a href="#">điều khoản nhận máu</a> và <a href="#">chính sách bảo mật</a>.</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" style={{ background: '#d32f2f', borderColor: '#d32f2f' }}>
                Đăng Ký Nhận Máu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default BloodRequestForm; 