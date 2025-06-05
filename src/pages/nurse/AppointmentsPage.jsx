import React from 'react';
import { Card, Table, Button, Tag, Space, Calendar, Badge, Row, Col, Form, Select, DatePicker, TimePicker, Input } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

function AppointmentsPage() {
  const [form] = Form.useForm();

  const appointments = [
    {
      id: '1',
      donorName: 'Nguyễn Văn A',
      phone: '0123456789',
      date: '2024-03-20',
      time: '09:00',
      type: 'Hiến máu toàn phần',
      status: 'scheduled'
    },
    {
      id: '2',
      donorName: 'Trần Thị B',
      phone: '0987654321',
      date: '2024-03-20',
      time: '09:30',
      type: 'Hiến tiểu cầu',
      status: 'confirmed'
    },
    {
      id: '3',
      donorName: 'Lê Văn C',
      phone: '0369852147',
      date: '2024-03-20',
      time: '10:00',
      type: 'Hiến máu toàn phần',
      status: 'completed'
    }
  ];

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
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
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
      title: 'Loại hiến máu',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          scheduled: { color: 'processing', text: 'Đã đặt lịch' },
          confirmed: { color: 'warning', text: 'Đã xác nhận' },
          completed: { color: 'success', text: 'Hoàn thành' },
          cancelled: { color: 'error', text: 'Đã hủy' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'scheduled' && (
            <>
              <Button type="primary">Xác nhận</Button>
              <Button danger>Hủy</Button>
            </>
          )}
          {record.status === 'confirmed' && (
            <Button type="primary">Tiếp nhận</Button>
          )}
          <Button>Chi tiết</Button>
        </Space>
      ),
    },
  ];

  const getListData = (value) => {
    // Mock data for calendar
    const listData = [];
    if (value.date() === 20) {
      listData.push(
        { type: 'success', content: '09:00 - Nguyễn Văn A' },
        { type: 'warning', content: '09:30 - Trần Thị B' },
        { type: 'processing', content: '10:00 - Lê Văn C' }
      );
    }
    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản Lý Lịch Hẹn</h2>

      <Card>
        <Form
          form={form}
          layout="inline"
          className="mb-4"
        >
          <Form.Item name="dateRange" label="Thời gian">
            <RangePicker format="DD/MM/YYYY" />
          </Form.Item>
          
          <Form.Item name="status" label="Trạng thái">
            <Select
              style={{ width: 200 }}
              placeholder="Chọn trạng thái"
              allowClear
            >
              <Select.Option value="pending">Chờ xác nhận</Select.Option>
              <Select.Option value="confirmed">Đã xác nhận</Select.Option>
              <Select.Option value="completed">Đã hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<CalendarOutlined />}>
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          pagination={{
            total: appointments.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} lịch hẹn`,
          }}
        />
      </Card>

      <Row gutter={16}>
        <Col span={16}>
          <Card className="mb-6">
            <Form layout="vertical">
              <h3 className="text-lg font-semibold mb-4">Đặt lịch hẹn mới</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Người hiến máu" name="donorName" rules={[{ required: true }]}>
                    <Select
                      showSearch
                      placeholder="Chọn người hiến máu"
                      optionFilterProp="children"
                    >
                      <Option value="1">Nguyễn Văn A</Option>
                      <Option value="2">Trần Thị B</Option>
                      <Option value="3">Lê Văn C</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Loại hiến máu" name="donationType" rules={[{ required: true }]}>
                    <Select>
                      <Option value="whole">Hiến máu toàn phần</Option>
                      <Option value="platelets">Hiến tiểu cầu</Option>
                      <Option value="plasma">Hiến huyết tương</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Ngày hẹn" name="appointmentDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Giờ hẹn" name="appointmentTime" rules={[{ required: true }]}>
                    <TimePicker style={{ width: '100%' }} format="HH:mm" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea />
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<CalendarOutlined />}>
                  Đặt lịch hẹn
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Danh sách lịch hẹn">
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              pagination={{
                total: appointments.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} lịch hẹn`,
              }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Lịch hẹn trong tháng">
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AppointmentsPage; 