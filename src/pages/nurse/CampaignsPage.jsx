import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, DatePicker, Row, Col, Calendar, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

function CampaignsPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data - sẽ được thay thế bằng API call
  const campaignsData = [
    {
      id: 'CP001',
      name: 'Hiến máu nhân đạo đợt 1/2024',
      location: 'Trường Đại học Y Hà Nội',
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      status: 'upcoming',
      targetUnits: 100,
      registeredDonors: 45,
      organizer: 'Hội Chữ thập đỏ Hà Nội',
      description: 'Chiến dịch hiến máu thường niên tại trường Đại học Y Hà Nội'
    },
    {
      id: 'CP002',
      name: 'Chủ nhật đỏ 2024',
      location: 'Nhà Văn hóa Thanh niên',
      startDate: '2024-03-15',
      endDate: '2024-03-15',
      status: 'completed',
      targetUnits: 200,
      registeredDonors: 180,
      organizer: 'Thành đoàn TP.HCM',
      description: 'Ngày hội hiến máu lớn nhất năm'
    },
    {
      id: 'CP003',
      name: 'Giọt hồng yêu thương',
      location: 'Công viên Lê Văn Tám',
      startDate: '2024-04-01',
      endDate: '2024-04-02',
      status: 'upcoming',
      targetUnits: 150,
      registeredDonors: 30,
      organizer: 'Hội Chữ thập đỏ TP.HCM',
      description: 'Chiến dịch hiến máu tình nguyện'
    }
  ];

  const columns = [
    {
      title: 'Mã chiến dịch',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => (
        <span>{record.startDate} - {record.endDate}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        let text = 'Sắp diễn ra';
        if (status === 'completed') {
          color = 'green';
          text = 'Đã hoàn thành';
        } else if (status === 'ongoing') {
          color = 'orange';
          text = 'Đang diễn ra';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Số lượng đăng ký',
      key: 'donors',
      render: (_, record) => (
        <span>{record.registeredDonors}/{record.targetUnits}</span>
      ),
    },
    {
      title: 'Đơn vị tổ chức',
      dataIndex: 'organizer',
      key: 'organizer',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="primary">Sửa</Button>
          <Button icon={<DeleteOutlined />} danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  const handleAddCampaign = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Success:', values);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // Tạo dữ liệu cho lịch
  const getCalendarData = (value) => {
    const listData = campaignsData.filter(campaign => {
      const campaignDate = new Date(campaign.startDate);
      return (
        campaignDate.getDate() === value.date() &&
        campaignDate.getMonth() === value.month() &&
        campaignDate.getFullYear() === value.year()
      );
    });

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getCalendarData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.id}>
            <Tag color="blue">{item.name}</Tag>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý chiến dịch hiến máu</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCampaign}>
          Thêm chiến dịch mới
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={16}>
          <Card>
            <Table
              columns={columns}
              dataSource={campaignsData}
              rowKey="id"
              pagination={{
                total: campaignsData.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} chiến dịch`,
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Thêm chiến dịch mới"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên chiến dịch"
                rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Địa điểm"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="targetUnits"
                label="Chỉ tiêu (đơn vị máu)"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ tiêu' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="organizer"
            label="Đơn vị tổ chức"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị tổ chức' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CampaignsPage; 