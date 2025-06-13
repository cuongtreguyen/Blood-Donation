import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Select, DatePicker, Button, Checkbox, Radio, Space, Card, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EnvironmentOutlined, HeartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import api from '../../config/api';
import { login } from "../../redux/features/userSlice";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;
const { TextArea } = Input;

function BloodRequestForm() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user) || {};

  // Kiểm tra đăng nhập khi component được mount
  useEffect(() => {
    // Kiểm tra nếu không có userData hoặc userData không có id (chưa đăng nhập)
    if (!userData || !userData.id) {
      // Lưu đường dẫn hiện tại để chuyển lại sau khi đăng nhập
      localStorage.setItem('redirectAfterLogin', '/blood-request');
      
      // Hiển thị thông báo
      toast.error('Vui lòng đăng nhập để tiếp tục!', {
        position: "top-right",
        autoClose: 3000
      });
      
      // Chuyển hướng đến trang đăng nhập
      navigate('/login');
    }
  }, [userData, navigate]);

  const onFinish = async (values) => {
    // Map form values to API-compatible field names
    const formData = {
      // ... code hiện tại giữ nguyên
      request_type: values.requestType,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      date_of_birth: values.date_of_birth ? moment(values.date_of_birth).format('YYYY-MM-DD') : '',
      gender: values.gender,
      address: values.address,
      city: values.city,
      blood_type: values.blood_type,
      weight: values.weight,
      height: values.height,
      last_donation_date: values.last_donation_date ? moment(values.last_donation_date).format('YYYY-MM-DD') : '',
      medical_history: values.medical_history || '',
      has_chronic_disease: values.chronic_disease || false,
      is_taking_medication: values.taking_medication || false,
      has_recent_surgery: values.recent_surgery || false,
      preferred_date: values.preferred_date ? moment(values.preferred_date).format('YYYY-MM-DD') : '',
      preferred_time: values.preferred_time,
      preferred_location: values.preferred_location,
      emergency_contact: values.emergency_contact,
      emergency_phone: values.emergency_phone,
      agrees_to_terms: values.agreement,
    };

    // Validation
    const today = new Date();
    const birthDate = new Date(formData.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18 || age > 60) {
      toast.error('Tuổi yêu cầu máu phải từ 18 đến 60 tuổi!');
      return;
    }

    if (formData.weight && parseInt(formData.weight) < 45) {
      toast.error('Cân nặng tối thiểu để yêu cầu máu là 45kg!');
      return;
    }

    try {
      // Update user data if new values were entered
      const updatedUserFields = {};
      ['full_name', 'email', 'phone', 'date_of_birth', 'gender', 'address', 'city'].forEach((field) => {
        if (formData[field] && !userData[field]) {
          updatedUserFields[field] = formData[field];
        }
      });

      if (Object.keys(updatedUserFields).length > 0 && userData.id) {
        const response = await api.put(`/users/${userData.id}`, updatedUserFields);
        dispatch(login({ ...userData, ...response.data }));
        localStorage.setItem('user', JSON.stringify({ ...userData, ...response.data }));
      }

      // Submit blood request
      await api.post('/blood-requests', formData);
      console.log('Blood request submitted:', formData);
      toast.success(`Cảm ơn ${formData.full_name}! Yêu cầu cần máu của bạn đã được gửi thành công.`);
      form.resetFields();
    } catch (err) {
      console.error('Error submitting blood request:', err);
      toast.error('Đăng ký thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="Đăng Ký Nhận Máu" styles={{ header: { backgroundColor: '#d32f2f', color: 'white', fontSize: '20px', fontWeight: 'bold' } }}>
        {userData && Object.keys(userData).length > 0 && (
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            Xin chào <strong>{userData.full_name || 'Người dùng'}</strong>! Thông tin cá nhân của bạn đã được điền sẵn.
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{

            request_type: 'normal',
            full_name: userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            date_of_birth: userData.date_of_birth ? moment(userData.date_of_birth) : null,
            gender: userData.gender || 'male',
            address: userData.address || '',
            city: userData.city || '',
            blood_type: userData.blood_type || '',
            weight: userData.weight || '',
            height: userData.height || '',
            last_donation_date: userData.last_donation_date ? moment(userData.last_donation_date) : null,
            emergency_contact: userData.emergency_contact || '',
            emergency_phone: userData.emergency_phone || '',

          }}
        >
          <Form.Item
            name="request_type"
            label="Loại yêu cầu"
            rules={[{ required: true, message: 'Vui lòng chọn loại yêu cầu!' }]}
          >
            <Radio.Group>
              <Radio value="normal">Thông thường</Radio>
              <Radio value="urgent">Khẩn cấp</Radio>
            </Radio.Group>
          </Form.Item>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Thông Tin Cá Nhân
          </h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập họ tên đầy đủ"
                  readOnly={!!userData.full_name}
                  style={{ backgroundColor: userData.full_name ? '#f5f5f5' : 'white' }}
                />
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
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập địa chỉ email"
                  readOnly={!!userData.email}
                  style={{ backgroundColor: userData.email ? '#f5f5f5' : 'white' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  readOnly={!!userData.phone}
                  style={{ backgroundColor: userData.phone ? '#f5f5f5' : 'white' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="date_of_birth"
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
                <DatePicker
                  style={{ width: '100%', backgroundColor: userData.date_of_birth ? '#f5f5f5' : 'white' }}
                  format="DD/MM/YYYY"
                  placeholder="dd/mm/yyyy"
                  disabled={!!userData.date_of_birth}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  disabled={!!userData.gender}
                  style={{ backgroundColor: userData.gender ? '#f5f5f5' : 'white' }}
                >
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
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Số nhà, tên đường"
                  readOnly={!!userData.address}
                  style={{ backgroundColor: userData.address ? '#f5f5f5' : 'white' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="Thành phố"
                rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
              >
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="Thành phố"
                  readOnly={!!userData.city}
                  style={{ backgroundColor: userData.city ? '#f5f5f5' : 'white' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}>
            <HeartOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Thông Tin Sức Khỏe
          </h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="blood_type"
                label="Nhóm máu"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
              >
                <Select placeholder="Chọn nhóm máu">
                  <Option value="A_POSITIVE">A+</Option>
                  <Option value="A_NEGATIVE">A-</Option>
                  <Option value="B_POSITIVE">B+</Option>
                  <Option value="B_NEGATIVE">B-</Option>
                  <Option value="AB_POSITIVE">AB+</Option>
                  <Option value="AB_NEGATIVE">AB-</Option>
                  <Option value="O_POSITIVE">O+</Option>
                  <Option value="O_NEGATIVE">O-</Option>
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
            name="last_donation_date"
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
            name="medical_history"
            label="Tiền sử bệnh (nếu có)"
          >
            <TextArea
              placeholder="Mô tả các bệnh đã từng mắc hoặc đang điều trị"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="has_chronic_disease" valuePropName="checked">
                <Checkbox>Có bệnh mãn tính</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_taking_medication" valuePropName="checked">
                <Checkbox>Đang dùng thuốc</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="has_recent_surgery" valuePropName="checked">
                <Checkbox>Phẫu thuật gần đây</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}>
            <CalendarOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Lịch Hẹn Nhận Máu
          </h3>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="preferred_date"
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
                name="preferred_time"
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
                name="preferred_location"
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

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '30px' }}>
            <PhoneOutlined style={{ marginRight: '8px', color: '#d32f2f' }} />Người Liên Hệ Khẩn Cấp
          </h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="emergency_contact"
                label="Họ tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên người liên hệ khẩn cấp!' }]}
              >
                <Input placeholder="Tên người thân" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emergency_phone"
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
            name="agrees_to_terms"
            valuePropName="checked"
            rules={[{ validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error('Vui lòng xác nhận thông tin!'))) }]}
          >
            <Checkbox>
              Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với <a href="#">điều khoản nhận máu</a> và <a href="#">chính sách bảo mật</a>.
            </Checkbox>
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