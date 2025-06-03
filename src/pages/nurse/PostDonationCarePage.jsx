import React from 'react';
import { Table, Button, Tag, Space, Card, Input, Form, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function PostDonationCarePage() {
  const [form] = Form.useForm();

  // Mock data - sẽ được thay thế bằng dữ liệu từ API
  const donors = [
    {
      id: '1',
      donorName: 'Nguyễn Văn A',
      phoneNumber: '0901234567',
      donationDate: '2024-03-15',
      bloodType: 'A+',
      followUpDate: '2024-03-22',
      status: 'pending'
    },
    {
      id: '2',
      donorName: 'Trần Thị B',
      phoneNumber: '0901234568',
      donationDate: '2024-03-15',
      bloodType: 'O+',
      followUpDate: '2024-03-22',
      status: 'completed'
    },
    {
      id: '3',
      donorName: 'Lê Văn C',
      phoneNumber: '0901234569',
      donationDate: '2024-03-16',
      bloodType: 'B+',
      followUpDate: '2024-03-23',
      status: 'scheduled'
    }
  ];

  const columns = [
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Ngày hiến máu',
      dataIndex: 'donationDate',
      key: 'donationDate',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
    },
    {
      title: 'Ngày theo dõi',
      dataIndex: 'followUpDate',
      key: 'followUpDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'warning', text: 'Chờ theo dõi' },
          scheduled: { color: 'processing', text: 'Đã lên lịch' },
          completed: { color: 'success', text: 'Đã hoàn thành' },
          issue: { color: 'error', text: 'Có vấn đề' }
        };
        return <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small">Cập nhật</Button>
          <Button size="small">Lịch sử</Button>
          {record.status === 'issue' && (
            <Button danger size="small">Báo cáo</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Chăm Sóc Sau Hiến Máu</h2>

      <Card>
        <Form
          form={form}
          layout="inline"
          className="mb-4"
        >
          <Form.Item name="search">
            <Input
              placeholder="Tìm kiếm theo tên hoặc số điện thoại"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select
              style={{ width: 200 }}
              placeholder="Chọn trạng thái"
              allowClear
            >
              <Select.Option value="pending">Chờ theo dõi</Select.Option>
              <Select.Option value="scheduled">Đã lên lịch</Select.Option>
              <Select.Option value="completed">Đã hoàn thành</Select.Option>
              <Select.Option value="issue">Có vấn đề</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary">
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={donors}
          rowKey="id"
          pagination={{
            total: donors.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} người hiến máu`,
          }}
        />
      </Card>
    </div>
  );
}

export default PostDonationCarePage; 