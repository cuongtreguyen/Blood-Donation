import React, { useState } from 'react';
import { Calendar, Card, Modal, Form, Input, TimePicker, Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const DonationSchedulePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    // TODO: Handle form submission
    setIsModalVisible(false);
    form.resetFields();
  };

  const dateCellRender = (value) => {
    // Mock data - replace with actual data
    const events = [
      {
        title: 'Hiến máu tại Bệnh viện A',
        time: '09:00',
        location: 'Phòng 201'
      }
    ];

    const listData = events.filter(
      event => value.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
    );

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index} style={{ 
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '2px',
            marginBottom: '2px',
            fontSize: '12px'
          }}>
            <div>{item.title}</div>
            <div>{item.time} - {item.location}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Lịch hiến máu</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm lịch hiến máu
        </Button>
      </div>

      <Card>
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      <Modal
        title="Thêm lịch hiến máu mới"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu lịch
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DonationSchedulePage; 