import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Popconfirm, Tooltip, Dropdown } from 'antd';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import LockOutlined from '@ant-design/icons/lib/icons/LockOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
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

  // Helper function to refresh users data from API
  const refreshUsersData = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
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
        status: (user.status || '').toUpperCase(), // CHUẨN HÓA về in hoa
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
  const genderOptions = [
    { label: 'Nam', value: 'MALE' },
    { label: 'Nữ', value: 'FEMALE' },
    { label: 'Khác', value: 'OTHER' },
  ];

  useEffect(() => {
    refreshUsersData();
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
        };
        await api.post('/register', newUser);
        await refreshUsersData();
        toast.success('Thêm người dùng thành công!');
      } else {
        // Chỉ cập nhật vai trò nếu có thay đổi
        if (values.role && selectedUser?.role !== values.role) {
          // Chuyển đổi role sang đúng giá trị backend
          let backendRole = values.role === 'staff' ? 'STAFF' : values.role === 'donor' ? 'MEMBER' : values.role.toUpperCase();
          await setUserRole(selectedUser.email, backendRole);
          await refreshUsersData();
          toast.success('Cập nhật vai trò thành công!');
        } else {
          toast.info('Không có thay đổi nào được thực hiện!');
        }
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      if (error.response?.data?.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else {
      toast.error('Cập nhật thông tin người dùng thất bại. Vui lòng thử lại sau!');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Khi bấm nút xóa, đổi trạng thái thành không hoạt động
  // const handleDelete = async (key) => {
  //   try {
  //     const userToDelete = users.find(user => user.key === key);
  //     if (!userToDelete) {
  //       toast.error('Không tìm thấy người dùng!');
  //       return;
  //     }
  //     // Gọi API đổi trạng thái
  //     const ok = await updateUserStatus(userToDelete.id, 'INACTIVE');
  //     if (ok) {
  //       // Refresh lại dữ liệu từ API
  //       await refreshUsersData();
  //       toast.success('Đã chuyển trạng thái người dùng sang không hoạt động!');
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi đổi trạng thái người dùng:', error);
  //     toast.error('Chuyển trạng thái người dùng thất bại. Vui lòng thử lại sau!');
  //   }
  // };

  // Thêm hàm xử lý đổi trạng thái
  // const handleToggleStatus = async (user) => {
  //   try {
  //     const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  //     const ok = await updateUserStatus(user.id, newStatus);
  //     if (ok) {
  //       refreshUsersData(); // Reload lại danh sách ngay sau khi đổi trạng thái thành công
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi đổi trạng thái người dùng:', error);
  //     toast.error('Chuyển trạng thái người dùng thất bại. Vui lòng thử lại sau!');
  //   }
  // };

  // Hàm xử lý thay đổi trạng thái từ dropdown
  const handleStatusChange = async (user, newStatus) => {
    try {
      const ok = await updateUserStatus(user.id, newStatus);
      if (ok) {
        refreshUsersData(); // Reload lại danh sách ngay sau khi đổi trạng thái thành công
      }
    } catch (error) {
      console.error('Lỗi khi đổi trạng thái người dùng:', error);
      toast.error('Chuyển trạng thái người dùng thất bại. Vui lòng thử lại sau!');
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

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return false;
      }
      console.log('Gửi update status:', { userId: Number(userId), status });
      await api.put('/user/update-status', { userId: Number(userId), status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Cập nhật trạng thái thành công!');
      return true;
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại!');
      console.log(err);
      return false;
    }
  };
  
  // Thêm hàm gọi API phân quyền
  const setUserRole = async (email, role) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return false;
      }
      await api.put(`/set-role?email=${encodeURIComponent(email)}&role=${role}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Cập nhật vai trò thành công!');
      return true;
    } catch (err) {
      toast.error('Cập nhật vai trò thất bại!');
      console.log(err);
      return false;
    }
  };

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
      filters: [
        { text: 'Đang hoạt động', value: 'ACTIVE' },
        { text: 'Không hoạt động', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'green', text = 'Đang hoạt động';
        if (status === 'INACTIVE') {
          color = 'red'; 
          text = 'Không hoạt động';
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
      width: 240,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            onClick={() => showModal('edit', record)}
            style={{ background: '#d32f2f', borderColor: '#d32f2f', fontWeight: 500 }}
          >
            Chỉnh sửa
          </Button>
          {/* Đã ẩn nút xóa ở đây */}
          {/* Nút đổi trạng thái với dropdown */}
          <Dropdown
            overlay={
              <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: 8 }}>
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer', 
                    borderRadius: 4,
                    backgroundColor: record.status === 'ACTIVE' ? '#f6ffed' : '#fff',
                    color: record.status === 'ACTIVE' ? '#52c41a' : '#666',
                    fontWeight: record.status === 'ACTIVE' ? 600 : 400,
                    border: record.status === 'ACTIVE' ? '1px solid #b7eb8f' : '1px solid transparent',
                  }}
                  onClick={() => handleStatusChange(record, 'ACTIVE')}
                >
                  <span style={{ marginRight: 8 }}>✓</span>
                  Đang hoạt động
                </div>
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer', 
                    borderRadius: 4,
                    backgroundColor: record.status === 'INACTIVE' ? '#fff2f0' : '#fff',
                    color: record.status === 'INACTIVE' ? '#ff4d4f' : '#666',
                    fontWeight: record.status === 'INACTIVE' ? 600 : 400,
                    border: record.status === 'INACTIVE' ? '1px solid #ffccc7' : '1px solid transparent',
                    marginTop: 4,
                  }}
                  onClick={() => handleStatusChange(record, 'INACTIVE')}
                >
                  <span style={{ marginRight: 8 }}>✗</span>
                  Không hoạt động
                </div>
              </div>
            }
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              style={{ 
                background: '#faad14',
                borderColor: '#faad14',
                color: '#fff',
                fontWeight: 500,
              }}
            >
              Đổi trạng thái
            </Button>
          </Dropdown>
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
                    { max: 100, message: 'Tên người dùng không được vượt quá 100 ký tự!' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" size="large" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={<b>Email</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={<b>Số điện thoại</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9+]{10,15}$/, message: 'Số điện thoại phải hợp lệ!' },
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>
                <Form.Item 
                  name="address" 
                  label={<b>Địa chỉ</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ!' },
                    { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' },
                    { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự!' },
                  ]}
                >
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
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                    { max: 20, message: 'Mật khẩu không được vượt quá 20 ký tự!' },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!',
                    },
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
                </Form.Item>
                {/* Ẩn mục vai trò trong form thêm người dùng */}
                {/* <Form.Item name="role" label={<b>Vai trò</b>} rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}> 
                  <Select placeholder="Chọn vai trò" size="large">
                    <Option value="donor">Người hiến máu</Option>
                    <Option value="staff">Nhân viên</Option>
                  </Select>
                </Form.Item> */}
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
                    { max: 100, message: 'Tên người dùng không được vượt quá 100 ký tự!' },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" size="large" disabled />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={<b>Email</b>}
                  style={{ display: 'none' }}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label={<b>Số điện thoại</b>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9+]{10,15}$/, message: 'Số điện thoại phải hợp lệ!' },
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" disabled />
                </Form.Item>
                <Form.Item name="address" label={<b>Địa chỉ</b>}>
                  <Input placeholder="Nhập địa chỉ" size="large" disabled />
                </Form.Item>
                <Form.Item name="gender" label={<b>Giới tính</b>}>
                  <Select placeholder="Chọn giới tính" size="large" disabled>
                    {genderOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="birthdate" label={<b>Ngày sinh</b>}>
                  <Input type="date" size="large" disabled />
                </Form.Item>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <Form.Item name="bloodType" label={<b>Nhóm máu</b>} rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}> 
                  <Select placeholder="Chọn nhóm máu" size="large" disabled>
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
                  <Input placeholder="Nhập tên người liên hệ khẩn cấp" size="large" disabled />
                </Form.Item>
                <Form.Item name="emergencyPhone" label={<b>SĐT người liên hệ khẩn cấp</b>}>
                  <Input placeholder="Nhập SĐT người liên hệ khẩn cấp" size="large" disabled />
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



export default AdminUsersPage; 

