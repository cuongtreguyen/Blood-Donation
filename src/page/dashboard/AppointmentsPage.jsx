import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, DatePicker, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const AppointmentsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [form] = Form.useForm();

  // Mock data for appointments
  const [appointments, setAppointments] = useState([
    {
      id: 'APT001',
      donorName: 'Nguyễn Văn A',
      date: '2024-03-25',
      time: '09:00',
      bloodType: 'A+',
      status: 'pending',
      phone: '0901234567',
      location: 'Trung tâm hiến máu quận 1'
    },
    {
      id: 'APT002',
      donorName: 'Trần Thị B',
      date: '2024-03-25',
      time: '10:30',
      bloodType: 'O+',
      status: 'confirmed',
      phone: '0909876543',
      location: 'Trung tâm hiến máu quận 3'
    }
  ]);

  const showModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedAppointment(record);
    setIsModalVisible(true);
    if (mode === 'edit' && record) {
      form.setFieldsValue({
        ...record,
        datetime: moment(record.date + ' ' + record.time)
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch hẹn này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const newAppointments = appointments.filter(item => item.id !== record.id);
        setAppointments(newAppointments);
        message.success('Đã xóa lịch hẹn');
      },
    });
  };

  const handleSubmit = (values) => {
    const datetime = values.datetime;
    const formattedDate = datetime.format('YYYY-MM-DD');
    const formattedTime = datetime.format('HH:mm');

    const appointmentData = {
      ...values,
      date: formattedDate,
      time: formattedTime
    };

    if (modalMode === 'add') {
      const newAppointment = {
        id: `APT${appointments.length + 1}`.padStart(6, '0'),
        ...appointmentData,
        status: 'pending'
      };
      setAppointments([...appointments, newAppointment]);
      message.success('Đã thêm lịch hẹn mới');
    } else {
      const newAppointments = appointments.map(item =>
        item.id === selectedAppointment.id ? { ...item, ...appointmentData } : item
      );
      setAppointments(newAppointments);
      message.success('Đã cập nhật lịch hẹn');
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleStatusChange = (record, newStatus) => {
    const newAppointments = appointments.map(item =>
      item.id === record.id ? { ...item, status: newStatus } : item
    );
    setAppointments(newAppointments);
    message.success(`Đã ${newStatus === 'confirmed' ? 'xác nhận' : 'hủy'} lịch hẹn`);
  };

  const columns = [
    {
      title: 'Mã lịch hẹn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gold';
        let text = 'Chờ xác nhận';
        
        if (status === 'confirmed') {
          color = 'green';
          text = 'Đã xác nhận';
        } else if (status === 'cancelled') {
          color = 'red';
          text = 'Đã hủy';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => handleStatusChange(record, 'confirmed')}
              >
                Xác nhận
              </Button>
              <Button
                type="default"
                danger
                size="small"
                onClick={() => handleStatusChange(record, 'cancelled')}
              >
                Hủy
              </Button>
            </>
          )}
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal('edit', record)}
          >
            Sửa
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Quản lý lịch hẹn</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('add')}>
          Thêm lịch hẹn
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          pagination={{
            total: appointments.length,
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} lịch hẹn`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={modalMode === 'add' ? 'Thêm lịch hẹn mới' : 'Chỉnh sửa lịch hẹn'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="donorName"
            label="Tên người hiến máu"
            rules={[{ required: true, message: 'Vui lòng nhập tên người hiến máu' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="datetime"
            label="Ngày và giờ"
            rules={[{ required: true, message: 'Vui lòng chọn ngày và giờ' }]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="bloodType"
            label="Nhóm máu"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm máu' }]}
          >
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

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {modalMode === 'add' ? 'Thêm lịch hẹn' : 'Cập nhật'}
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage; 