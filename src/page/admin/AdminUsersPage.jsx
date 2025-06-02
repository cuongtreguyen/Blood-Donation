import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, message, Popconfirm } from 'antd';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import LockOutlined from '@ant-design/icons/lib/icons/LockOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import api from '../../config/api';

const { Option } = Select;

function AdminUsersPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Mock data for users
  const [users, setUsers] = useState([
    {
      key: '1',
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      role: 'donor',
      status: 'active',
      joinDate: '15/09/2023',
      lastLogin: '15/10/2023',
    },
    {
      key: '2',
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0909876543',
      role: 'staff',
      status: 'active',
      joinDate: '20/08/2023',
      lastLogin: '14/10/2023',
    },
    {
      key: '3',
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0912345678',
      role: 'doctor',
      status: 'inactive',
      joinDate: '05/10/2023',
      lastLogin: '10/10/2023',
    },
    {
      key: '4',
      id: '4',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0987654321',
      role: 'admin',
      status: 'active',
      joinDate: '01/01/2023',
      lastLogin: '15/10/2023',
    },
  ]);

  const showModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setIsModalVisible(true);

    if (mode === 'edit' && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (modalMode === 'add') {
        // Add new user
        const newUser = {
          key: String(users.length + 1),
          id: `U${String(users.length + 1).padStart(3, '0')}`,
          ...values,
          joinDate: new Date().toLocaleDateString('vi-VN'),
          lastLogin: '-',
        };
        setUsers([...users, newUser]);
        message.success('Thêm người dùng thành công!');
      } else {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.key === selectedUser.key ? { ...user, ...values } : user
        );
        setUsers(updatedUsers);
        message.success('Cập nhật thông tin thành công!');
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (key) => {
    try {
      // Tìm user cần xóa từ danh sách users
      const userToDelete = users.find(user => user.key === key);
      if (!userToDelete) {
        message.error('Không tìm thấy người dùng!');
        return;
      }

      // Cập nhật state để xóa user
      const updatedUsers = users.filter(user => user.key !== key);
      setUsers(updatedUsers);
      message.success('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      message.error('Xóa người dùng thất bại. Vui lòng thử lại!');
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc dữ liệu chỉ dựa trên searchText trước khi truyền vào Table
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.phone.includes(searchText);
    return matchesSearch;
  });

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
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Người hiến máu', value: 'donor' },
        { text: 'Nhân viên', value: 'staff' },
        { text: 'Bác sĩ', value: 'doctor' },
        { text: 'Quản trị viên', value: 'admin' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        const colors = {
          donor: 'blue',
          staff: 'green',
          doctor: 'purple',
          admin: 'red',
        };
        const labels = {
          donor: 'Người hiến máu',
          staff: 'Nhân viên',
          doctor: 'Bác sĩ',
          admin: 'Quản trị viên',
        };
        return <Tag color={colors[role]}>{labels[role]}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => {
        const dateA = a.joinDate.split('/').reverse().join('');
        const dateB = b.joinDate.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      },
    },
    {
      title: 'Đăng nhập gần nhất',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
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
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Quản lý người dùng"
        extra={
          <Space>
            {/* Input Tìm kiếm */}
            <Input
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            {/* Nút Thêm người dùng */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal('add')}
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
            >
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredUsers} // Sử dụng dữ liệu đã lọc bởi searchText
          columns={columns} // Table sẽ tự áp dụng thêm lọc vai trò và trạng thái từ cấu hình cột
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa thông tin'}
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
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          {modalMode === 'add' && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="donor">Người hiến máu</Option>
              <Option value="staff">Nhân viên</Option>
              <Option value="doctor">Bác sĩ</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
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

export default AdminUsersPage; 