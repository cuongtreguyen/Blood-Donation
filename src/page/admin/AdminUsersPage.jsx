import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Popconfirm, Tooltip } from 'antd';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import LockOutlined from '@ant-design/icons/lib/icons/LockOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import api from '../../config/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

function AdminUsersPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  // Mock data for users
  const [users, setUsers] = useState([]);
  const genderOptions = [
    { label: 'Nam', value: 'MALE' },
    { label: 'Nữ', value: 'FEMALE' },
    { label: 'Khác', value: 'OTHER' },
  ];

  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (!token) {
          toast.error('Không tìm thấy token xác thực!');
          return;
        }
        const res = await api.get('/user/get-user-by-role', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersFromApi = res.data.map((user, idx) => ({
          key: user.id || idx + 1,
          id: user.id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role === "MEMBER" ? "donor" : user.role?.toLowerCase(),
          status: user.status, // lấy đúng trường status từ API
          joinDate: user.joinDate || (user.birthdate ? new Date(user.birthdate).toLocaleDateString('vi-VN') : "-"),
          lastLogin: "-",
          address: user.address || '',
          gender: user.gender || '',
          birthdate: user.birthdate || '',
          height: user.height || '',
          weight: user.weight || '',
          lastDonation: user.lastDonation || '',
          medicalHistory: user.medicalHistory || '',
          emergencyName: user.emergencyName || '',
          emergencyPhone: user.emergencyPhone || '',
          bloodType: user.bloodType || '',
        }));
        setUsers(usersFromApi);
      } catch (err) {
        console.error('Error fetching users by role:', err);
        toast.error('Không thể lấy danh sách người dùng!');
      }
    };
    fetchUsersByRole();
  }, []);

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
        address: user.address,
        gender: user.gender,
        birthdate: user.birthdate,
        height: user.height,
        weight: user.weight,
        lastDonation: user.lastDonation,
        medicalHistory: user.medicalHistory,
        emergencyName: user.emergencyName,
        emergencyPhone: user.emergencyPhone,
        bloodType: user.bloodType,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'add') {
        // Add new user
        const newUser = {
          fullName: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          address: values.address,
          bloodType: values.bloodType,
          status: 'ACTIVE', // Mặc định là hoạt động
        };
        await api.post('/register', newUser);
        toast.success('Thêm người dùng thành công!');
      } else {
        // Update existing user (KHÔNG gọi updateUserStatus ở đây nữa)
        const updatedUsers = users.map(user => 
          user.key === selectedUser.key ? { ...user, ...values } : user
        );
        setUsers(updatedUsers);
        // Chuẩn hóa dữ liệu gửi lên
        const requestBody = {
          id: selectedUser.id,
          fullName: values.name,
          phone: values.phone,
          address: values.address,
          gender: values.gender,
          birthdate: values.birthdate,
          height: values.height || 0,
          weight: values.weight || 0,
          lastDonation: values.lastDonation || null,
          medicalHistory: values.medicalHistory || null,
          emergencyName: values.emergencyName,
          emergencyPhone: values.emergencyPhone,
          bloodType: values.bloodType,
          role: values.role === 'staff' ? 'STAFF' : values.role === 'donor' ? 'MEMBER' : values.role
        };
        await api.put(`/user/update-user`, requestBody);
        toast.success('Cập nhật thông tin thành công!');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      toast.error('Cập nhật thông tin người dùng thất bại. Vui lòng thử lại sau!');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Khi bấm nút xóa, đổi trạng thái thành không hoạt động
  const handleDelete = async (key) => {
    try {
      const userToDelete = users.find(user => user.key === key);
      if (!userToDelete) {
        toast.error('Không tìm thấy người dùng!');
        return;
      }
      // Gọi API đổi trạng thái
      const ok = await updateUserStatus(userToDelete.id, 'INACTIVE');
      if (ok) {
        // Cập nhật lại users trong state
        setUsers(users.map(u => u.key === key ? { ...u, status: 'INACTIVE' } : u));
        toast.success('Đã chuyển trạng thái người dùng sang không hoạt động!');
      }
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái người dùng:', error);
      toast.error('Chuyển trạng thái người dùng thất bại. Vui lòng thử lại sau!');
    }
  };

  // Thêm hàm xử lý đổi trạng thái
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const ok = await updateUserStatus(user.id, newStatus);
    if (ok) {
      setUsers(users.map(u => u.key === user.key ? { ...u, status: newStatus } : u));
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc dữ liệu chỉ dựa trên searchText trước khi truyền vào Table
  const filteredUsers = users.filter((user) => {
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
      sorter: (a, b) => String(a.id).localeCompare(String(b.id)),
      align: 'center',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Tooltip title={text}><span style={{ fontWeight: 500 }}>{text}</span></Tooltip>,
      width: 150,
      fixed: 'left',
    },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 140 }}>{text}</span></Tooltip>, width: 160 },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', align: 'center', width: 120 },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 120 }}>{text}</span></Tooltip>, width: 130 },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', align: 'center', width: 100, render: (gender) => gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender === 'OTHER' ? 'Khác' : '' },
    { title: 'Ngày sinh', dataIndex: 'birthdate', key: 'birthdate', align: 'center', width: 120, render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '' },
    { title: 'Người liên hệ khẩn cấp', dataIndex: 'emergencyName', key: 'emergencyName', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 120 }}>{text}</span></Tooltip>, width: 130 },
    { title: 'SĐT khẩn cấp', dataIndex: 'emergencyPhone', key: 'emergencyPhone', align: 'center', width: 120 },
    { title: 'Nhóm máu', dataIndex: 'bloodType', key: 'bloodType', align: 'center', width: 100, render: (type) => {
      if (!type) return '';
      const bloodMap = {
        'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
        'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
        'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
        'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-',
      };
      return <Tag color="geekblue" style={{ fontWeight: 500 }}>{bloodMap[type] || type}</Tag>;
    } },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 140,
      filters: [
        { text: 'Người hiến máu', value: 'donor' },
        { text: 'Nhân viên', value: 'staff' },
        { text: 'Bác sĩ', value: 'doctor' },
        { text: 'Quản trị viên', value: 'admin' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        const colors = {
          donor: 'blue', staff: 'green', doctor: 'purple', admin: 'red',
        };
        const labels = {
          donor: 'Người hiến máu', staff: 'Nhân viên', doctor: 'Bác sĩ', admin: 'Quản trị viên',
        };
        return (
          <Tag
            color={colors[role]}
            style={{
              fontWeight: 500,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              textAlign: 'center',
              width: '100%',
              display: 'block',
              margin: 0,
            }}
          >
            {labels[role]}
          </Tag>
        );
      },
      align: 'center',
    },
    // Thêm cột trạng thái ngay sau vai trò
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        let color = 'green', text = status;
        if (status === 'ACTIVE' || status === null) { // Thêm điều kiện status === null
          color = 'green'; text = 'Đang hoạt động';
        } else {
          color = 'red'; text = 'Không hoạt động';
        }
        return (
          <Tag color={color} style={{ fontWeight: 500 }}>{text}</Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="middle"
              onClick={() => showModal('edit', record)}
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
              shape="circle"
            />
          </Tooltip>
          {/* Đã ẩn nút xóa ở đây */}
          {/* Nút đổi trạng thái */}
          <Tooltip title={record.status === 'ACTIVE' ? "Khóa tài khoản" : "Mở khóa tài khoản"}>
            <Button
              icon={<LockOutlined />}
              size="middle"
              onClick={() => handleToggleStatus(record)}
              style={{ background: record.status === 'ACTIVE' ? '#faad14' : '#52c41a', borderColor: record.status === 'ACTIVE' ? '#faad14' : '#52c41a', color: '#fff' }}
              shape="circle"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={<span style={{ fontWeight: 700, fontSize: 22 }}>Quản lý người dùng</span>}
        extra={
          <Space>
            {/* Input Tìm kiếm */}
            <Input
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              prefix={<SearchOutlined style={{ fontSize: 18 }} />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 320, borderRadius: 24, boxShadow: '0 2px 8px #e0e0e0' }}
              size="large"
            />
            {/* Nút Thêm người dùng */}
            <Button
              type="primary"
              icon={<PlusOutlined style={{ fontSize: 20 }} />}
              onClick={() => showModal('add')}
              style={{ background: '#d32f2f', borderColor: '#d32f2f', borderRadius: 24, fontWeight: 600 }}
              size="large"
            >
              Thêm người dùng
            </Button>
          </Space>
        }
        style={{ borderRadius: 18, boxShadow: '0 4px 24px #e0e0e0', marginBottom: 32 }}
        bodyStyle={{ padding: 24 }}
      >
        <div className="table-wrapper" style={{ overflowX: 'auto', background: '#fff', borderRadius: 12 }}>
          <Table
            dataSource={filteredUsers} // Sử dụng dữ liệu đã lọc bởi searchText
            columns={columns} // Table sẽ tự áp dụng thêm lọc vai trò và trạng thái từ cấu hình cột
            rowKey="key"
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 1800 }}
            style={{ minWidth: 1000 }}
            size="middle"
          />
        </div>
      </Card>

      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 20 }}>{modalMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa thông tin người dùng'}</span>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={700}
        bodyStyle={{ padding: 24 }}
        style={{ top: 40 }}
        okButtonProps={{ style: { background: '#d32f2f', borderColor: '#d32f2f' } }}
      >
        <Form
          form={form}
          layout="vertical"
          name="userForm"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}
        >
          {modalMode === 'add' ? (
            <>
              <div style={{ flex: 1, minWidth: 280 }}>
                <Form.Item
                  name="name"
                  label={<b>Tên người dùng</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên người dùng!' },
                    { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
                    { max: 100, message: 'Tên người dùng không được vượt quá 100 ký tự!' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" size="large" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={<b>Email</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={<b>Số điện thoại</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9+]{10,15}$/, message: 'Số điện thoại phải hợp lệ!' }
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>
                <Form.Item name="address" label={<b>Địa chỉ</b>}>
                  <Input placeholder="Nhập địa chỉ" size="large" />
                </Form.Item>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <Form.Item name="bloodType" label={<b>Nhóm máu</b>} rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}> 
                  <Select placeholder="Chọn nhóm máu" size="large">
                    <Option value="A_POSITIVE">A+</Option>
                    <Option value="A_NEGATIVE">A-</Option>
                    <Option value="B_POSITIVE">B+</Option>
                    <Option value="B_NEGATIVE">B-</Option>
                    <Option value="O_POSITIVE">O+</Option>
                    <Option value="O_NEGATIVE">O-</Option>
                    <Option value="AB_POSITIVE">AB+</Option>
                    <Option value="AB_NEGATIVE">AB-</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="password"
                  label={<b>Mật khẩu</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                    { max: 50, message: 'Mật khẩu không được vượt quá 50 ký tự!' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
                </Form.Item>
                <Form.Item name="role" label={<b>Vai trò</b>} rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}> 
                  <Select placeholder="Chọn vai trò" size="large">
                    <Option value="donor">Người hiến máu</Option>
                    <Option value="staff">Nhân viên</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status" label={<b>Trạng thái</b>} rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}> 
                  <Select>
                    <Option value="ACTIVE">Đang hoạt động</Option>
                    <Option value="INACTIVE">Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </div>
            </>
          ) : (
            // Sửa: hiển thị tất cả trường, chia đều 2 cột, không lặp, không hiển thị mật khẩu, lần hiến máu cuối và trạng thái
            <>
              <div style={{ flex: 1, minWidth: 280 }}>
                <Form.Item
                  name="name"
                  label={<b>Tên người dùng</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên người dùng!' },
                    { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
                    { max: 100, message: 'Tên người dùng không được vượt quá 100 ký tự!' }
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" size="large" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={<b>Email</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={<b>Số điện thoại</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9+]{10,15}$/, message: 'Số điện thoại phải hợp lệ!' }
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>
                <Form.Item name="address" label={<b>Địa chỉ</b>}>
                  <Input placeholder="Nhập địa chỉ" size="large" />
                </Form.Item>
                <Form.Item name="gender" label={<b>Giới tính</b>}>
                  <Select placeholder="Chọn giới tính" size="large">
                    {genderOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="birthdate" label={<b>Ngày sinh</b>}>
                  <Input type="date" size="large" />
                </Form.Item>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <Form.Item name="bloodType" label={<b>Nhóm máu</b>} rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}> 
                  <Select placeholder="Chọn nhóm máu" size="large">
                    <Option value="A_POSITIVE">A+</Option>
                    <Option value="A_NEGATIVE">A-</Option>
                    <Option value="B_POSITIVE">B+</Option>
                    <Option value="B_NEGATIVE">B-</Option>
                    <Option value="O_POSITIVE">O+</Option>
                    <Option value="O_NEGATIVE">O-</Option>
                    <Option value="AB_POSITIVE">AB+</Option>
                    <Option value="AB_NEGATIVE">AB-</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="role" label={<b>Vai trò</b>} rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}> 
                  <Select placeholder="Chọn vai trò" size="large">
                    <Option value="donor">Người hiến máu</Option>
                    <Option value="staff">Nhân viên</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="emergencyName" label={<b>Tên người liên hệ khẩn cấp</b>}>
                  <Input placeholder="Nhập tên người liên hệ khẩn cấp" size="large" />
                </Form.Item>
                <Form.Item name="emergencyPhone" label={<b>SĐT người liên hệ khẩn cấp</b>}>
                  <Input placeholder="Nhập SĐT người liên hệ khẩn cấp" size="large" />
                </Form.Item>
                {/* ĐÃ ẨN Form.Item name='status' ở đây */}
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

const updateUserStatus = async (userId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Không tìm thấy token xác thực!');
      return false;
    }
    await api.put('/user/update-status', { userId, status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Cập nhật trạng thái thành công!');
    return true;
  } catch {
    toast.error('Cập nhật trạng thái thất bại!');
    return false;
  }
};

export default AdminUsersPage; 