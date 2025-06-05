import React, { useState } from 'react';
import { Table, Card, Button, Tag, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'C001',
      name: 'Hiến máu nhân đạo 2024',
      location: 'Trung tâm Huyết học',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      status: 'upcoming',
      target: 1000,
      current: 0,
      description: 'Chiến dịch hiến máu nhân đạo đầu năm 2024'
    },
    {
      id: 'C002',
      name: 'Ngày hội hiến máu',
      location: 'Đại học Y Dược',
      startDate: '2024-04-01',
      endDate: '2024-04-02',
      status: 'upcoming',
      target: 500,
      current: 0,
      description: 'Ngày hội hiến máu dành cho sinh viên y khoa'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();

  const columns = [
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
        <span>{record.startDate} đến {record.endDate}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        let text = 'Sắp diễn ra';
        
        if (status === 'active') {
          color = 'green';
          text = 'Đang diễn ra';
        } else if (status === 'completed') {
          color = 'gray';
          text = 'Đã kết thúc';
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_, record) => (
        <span>{record.current}/{record.target} đơn vị</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    form.setFieldsValue({
      ...campaign,
      time: [campaign.startDate, campaign.endDate],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa chiến dịch',
      content: 'Bạn có chắc chắn muốn xóa chiến dịch này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
        message.success('Đã xóa chiến dịch');
      },
    });
  };

  const handleSubmit = (values) => {
    const [startDate, endDate] = values.time;
    const campaignData = {
      ...values,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      status: 'upcoming',
      current: 0,
    };

    if (editingCampaign) {
      setCampaigns(prev =>
        prev.map(campaign =>
          campaign.id === editingCampaign.id
            ? { ...campaign, ...campaignData }
            : campaign
        )
      );
      message.success('Đã cập nhật chiến dịch');
    } else {
      setCampaigns(prev => [
        ...prev,
        {
          ...campaignData,
          id: `C${String(prev.length + 1).padStart(3, '0')}`,
        },
      ]);
      message.success('Đã tạo chiến dịch mới');
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingCampaign(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Quản lý chiến dịch hiến máu</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCampaign(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Tạo chiến dịch mới
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={campaigns}
          rowKey="id"
        />
      </Card>

      <Modal
        title={editingCampaign ? 'Chỉnh sửa chiến dịch' : 'Tạo chiến dịch mới'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCampaign(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên chiến dịch"
            rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}
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

          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="target"
            label="Mục tiêu (đơn vị)"
            rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingCampaign(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCampaign ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CampaignsPage; 