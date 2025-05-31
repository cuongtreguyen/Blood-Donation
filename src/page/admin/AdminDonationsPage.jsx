import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, DatePicker, message } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined, HeartOutlined, BankOutlined, CalendarOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

function AdminDonationsPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [form] = Form.useForm();

  // Mock data for donations
  const [donations, setDonations] = useState([
    {
      key: '1',
      id: 'D001',
      donorName: 'Nguyễn Văn A',
      donorId: 'U001',
      bloodType: 'A+',
      bloodBank: 'Bệnh viện Đa khoa Trung ương',
      bloodBankId: 'BB001',
      amount: 350,
      status: 'completed',
      donationDate: '15/10/2023',
      nextDonationDate: '15/04/2024',
      notes: 'Hiến máu lần đầu',
    },
    {
      key: '2',
      id: 'D002',
      donorName: 'Trần Thị B',
      donorId: 'U002',
      bloodType: 'O+',
      bloodBank: 'Trung tâm Huyết học Quốc gia',
      bloodBankId: 'BB002',
      amount: 450,
      status: 'completed',
      donationDate: '14/10/2023',
      nextDonationDate: '14/04/2024',
      notes: 'Hiến máu định kỳ',
    },
    {
      key: '3',
      id: 'D003',
      donorName: 'Lê Văn C',
      donorId: 'U003',
      bloodType: 'B+',
      bloodBank: 'Bệnh viện Chợ Rẫy',
      bloodBankId: 'BB003',
      amount: 400,
      status: 'cancelled',
      donationDate: '13/10/2023',
      nextDonationDate: '13/04/2024',
      notes: 'Hủy do sức khỏe không đảm bảo',
    },
    {
      key: '4',
      id: 'D004',
      donorName: 'Phạm Thị D',
      donorId: 'U004',
      bloodType: 'AB+',
      bloodBank: 'Bệnh viện Đa khoa Trung ương',
      bloodBankId: 'BB001',
      amount: 350,
      status: 'scheduled',
      donationDate: '20/10/2023',
      nextDonationDate: '20/04/2024',
      notes: 'Đã đặt lịch hiến máu',
    },
  ]);

  const showModal = (mode, donation = null) => {
    setModalMode(mode);
    setSelectedDonation(donation);
    setIsModalVisible(true);

    if (mode === 'edit' && donation) {
      form.setFieldsValue({
        status: donation.status,
        notes: donation.notes,
      });
    } else if (mode === 'view' && donation) {
      form.setFieldsValue({
        donorName: donation.donorName,
        bloodType: donation.bloodType,
        bloodBank: donation.bloodBank,
        amount: donation.amount,
        status: donation.status,
        donationDate: donation.donationDate,
        nextDonationDate: donation.nextDonationDate,
        notes: donation.notes,
      });
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const updatedDonations = donations.map(donation => 
        donation.key === selectedDonation.key ? { ...donation, ...values } : donation
      );
      setDonations(updatedDonations);
      message.success('Cập nhật thông tin thành công!');
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch sử hiến máu này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setDonations(donations.filter(donation => donation.key !== key));
        message.success('Xóa lịch sử hiến máu thành công!');
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Người hiến máu',
      dataIndex: 'donorName',
      key: 'donorName',
      sorter: (a, b) => a.donorName.localeCompare(b.donorName),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.donorName.toLowerCase().includes(value.toLowerCase()) ||
          record.bloodBank.toLowerCase().includes(value.toLowerCase()) ||
          record.bloodType.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (bloodType) => (
        <Tag color="red" icon={<HeartOutlined />}>
          {bloodType}
        </Tag>
      ),
      filters: [
        { text: 'A+', value: 'A+' },
        { text: 'A-', value: 'A-' },
        { text: 'B+', value: 'B+' },
        { text: 'B-', value: 'B-' },
        { text: 'AB+', value: 'AB+' },
        { text: 'AB-', value: 'AB-' },
        { text: 'O+', value: 'O+' },
        { text: 'O-', value: 'O-' },
      ],
      onFilter: (value, record) => record.bloodType === value,
    },
    {
      title: 'Ngân hàng máu',
      dataIndex: 'bloodBank',
      key: 'bloodBank',
      render: (bloodBank) => (
        <Tag icon={<BankOutlined />}>
          {bloodBank}
        </Tag>
      ),
    },
    {
      title: 'Lượng máu (ml)',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          completed: 'green',
          cancelled: 'red',
          scheduled: 'blue',
        };
        const labels = {
          completed: 'Hoàn thành',
          cancelled: 'Đã hủy',
          scheduled: 'Đã lên lịch',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
      filters: [
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
        { text: 'Đã lên lịch', value: 'scheduled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày hiến máu',
      dataIndex: 'donationDate',
      key: 'donationDate',
      sorter: (a, b) => {
        const dateA = a.donationDate.split('/').reverse().join('');
        const dateB = b.donationDate.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      },
    },
    {
      title: 'Ngày hiến máu tiếp theo',
      dataIndex: 'nextDonationDate',
      key: 'nextDonationDate',
      render: (date) => (
        <Tag icon={<CalendarOutlined />}>
          {date}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showModal('view', record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal('edit', record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Quản lý lịch sử hiến máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên, ngân hàng máu, nhóm máu..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Space>
        }
      >
        <Table
          dataSource={donations}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === 'view' ? 'Chi tiết lịch sử hiến máu' : 'Chỉnh sửa thông tin'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'view' ? 'Đóng' : 'Lưu'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          {modalMode === 'view' ? (
            <>
              <Form.Item name="donorName" label="Người hiến máu">
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>
              <Form.Item name="bloodType" label="Nhóm máu">
                <Input prefix={<HeartOutlined />} disabled />
              </Form.Item>
              <Form.Item name="bloodBank" label="Ngân hàng máu">
                <Input prefix={<BankOutlined />} disabled />
              </Form.Item>
              <Form.Item name="amount" label="Lượng máu (ml)">
                <Input disabled />
              </Form.Item>
              <Form.Item name="donationDate" label="Ngày hiến máu">
                <Input prefix={<CalendarOutlined />} disabled />
              </Form.Item>
              <Form.Item name="nextDonationDate" label="Ngày hiến máu tiếp theo">
                <Input prefix={<CalendarOutlined />} disabled />
              </Form.Item>
              <Form.Item name="notes" label="Ghi chú">
                <Input.TextArea rows={4} disabled />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="scheduled">Đã lên lịch</Option>
                </Select>
              </Form.Item>
              <Form.Item name="notes" label="Ghi chú">
                <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default AdminDonationsPage; 