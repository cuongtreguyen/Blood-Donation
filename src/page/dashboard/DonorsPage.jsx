import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

function DonorsPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [form] = Form.useForm();

  // Mock data for donors
  const [donors, setDonors] = useState([
    {
      key: '1',
      id: 'D001',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@example.com',
      bloodType: 'A+',
      lastDonation: '15/09/2023',
      totalDonations: 5,
      status: 'active',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      dateOfBirth: '05/12/1990',
      gender: 'Nam',
    },
    {
      key: '2',
      id: 'D002',
      name: 'Trần Thị B',
      phone: '0909876543',
      email: 'tranthib@example.com',
      bloodType: 'O-',
      lastDonation: '20/08/2023',
      totalDonations: 3,
      status: 'inactive',
      address: '456 Lê Lợi, Quận 5, TP.HCM',
      dateOfBirth: '10/05/1995',
      gender: 'Nữ',
    },
    {
      key: '3',
      id: 'D003',
      name: 'Lê Văn C',
      phone: '0912345678',
      email: 'levanc@example.com',
      bloodType: 'B+',
      lastDonation: '05/10/2023',
      totalDonations: 8,
      status: 'active',
      address: '789 Điện Biên Phủ, Quận 3, TP.HCM',
      dateOfBirth: '15/03/1988',
      gender: 'Nam',
    },
    {
      key: '4',
      id: 'D004',
      name: 'Phạm Thị D',
      phone: '0987654321',
      email: 'phamthid@example.com',
      bloodType: 'AB+',
      lastDonation: '30/07/2023',
      totalDonations: 2,
      status: 'active',
      address: '101 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',
      dateOfBirth: '20/11/1992',
      gender: 'Nữ',
    },
  ]);

  const showModal = (mode, donor = null) => {
    setModalMode(mode);
    setSelectedDonor(donor);
    setIsModalVisible(true);

    if (mode === 'edit' && donor) {
      form.setFieldsValue({
        name: donor.name,
        phone: donor.phone,
        email: donor.email,
        bloodType: donor.bloodType,
        address: donor.address,
        gender: donor.gender,
        status: donor.status,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (modalMode === 'add') {
        // Add new donor
        const newDonor = {
          key: `D${donors.length + 1}`,
          id: `D00${donors.length + 1}`,
          name: values.name,
          phone: values.phone,
          email: values.email,
          bloodType: values.bloodType,
          lastDonation: 'Chưa hiến máu',
          totalDonations: 0,
          status: values.status || 'active',
          address: values.address,
          dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('DD/MM/YYYY') : '',
          gender: values.gender,
        };
        setDonors([...donors, newDonor]);
      } else {
        // Edit existing donor
        const updatedDonors = donors.map((donor) => {
          if (donor.key === selectedDonor.key) {
            return {
              ...donor,
              name: values.name,
              phone: values.phone,
              email: values.email,
              bloodType: values.bloodType,
              address: values.address,
              gender: values.gender,
              status: values.status,
            };
          }
          return donor;
        });
        setDonors(updatedDonors);
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người hiến máu này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const updatedDonors = donors.filter((donor) => donor.key !== key);
        setDonors(updatedDonors);
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
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) ||
          record.email.toLowerCase().includes(value.toLowerCase()) ||
          record.phone.includes(value);
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (text) => <Tag color="red">{text}</Tag>,
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
      title: 'Lần hiến máu gần nhất',
      dataIndex: 'lastDonation',
      key: 'lastDonation',
      sorter: (a, b) => {
        const dateA = a.lastDonation.split('/').reverse().join('');
        const dateB = b.lastDonation.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      },
    },
    {
      title: 'Tổng lượt hiến',
      dataIndex: 'totalDonations',
      key: 'totalDonations',
      sorter: (a, b) => a.totalDonations - b.totalDonations,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
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
        title="Quản lý người hiến máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal('add')}
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
            >
              Thêm người hiến máu
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={donors}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === 'add' ? 'Thêm người hiến máu' : 'Chỉnh sửa thông tin'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'add' ? 'Thêm' : 'Lưu'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
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
          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
          >
            <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DonorsPage; 