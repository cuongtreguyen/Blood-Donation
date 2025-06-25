import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Popconfirm, message, Tooltip } from 'antd';
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
  const bloodTypeOptions = [
    'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
    'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'
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
          status: "active",
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
          key: String(users.length + 1),
          id: `U${String(users.length + 1).padStart(3, '0')}`,
          ...values,
          joinDate: new Date().toLocaleDateString('vi-VN'),
          lastLogin: '-',
        };
        setUsers([...users, newUser]);
        await api.post('/api/users', newUser);
        toast.success('Thêm người dùng thành công!');
      } else {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.key === selectedUser.key ? { ...user, ...values } : user
        );
        setUsers(updatedUsers);
        await api.put(`/api/users/${selectedUser.id}`, values);
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

  const handleDelete = async (key) => {
    try {
      // Tìm user cần xóa từ danh sách users
      const userToDelete = users.find(user => user.key === key);
      if (!userToDelete) {
        toast.error('Không tìm thấy người dùng!');
        return;
      }

      // Cập nhật state để xóa user
      const updatedUsers = users.filter(user => user.key !== key);
      setUsers(updatedUsers);
      await api.delete(`/api/users/${userToDelete.id}`);
      toast.success('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      toast.error('Xóa người dùng thất bại. Vui lòng thử lại sau!');
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
      sorter: (a, b) => String(a.id).localeCompare(String(b.id)),
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Tooltip title={text}><span style={{ fontWeight: 500 }}>{text}</span></Tooltip>,
      width: 150,
    },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 140 }}>{text}</span></Tooltip>, width: 160 },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', align: 'center', width: 120 },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 120 }}>{text}</span></Tooltip>, width: 130 },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender', align: 'center', render: (gender) => gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender === 'OTHER' ? 'Khác' : '' },
    { title: 'Ngày sinh', dataIndex: 'birthdate', key: 'birthdate', align: 'center', render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '' },
    { title: 'Chiều cao', dataIndex: 'height', key: 'height', align: 'center', width: 90 },
    { title: 'Cân nặng', dataIndex: 'weight', key: 'weight', align: 'center', width: 90 },
    { title: 'Lần hiến máu gần nhất', dataIndex: 'lastDonation', key: 'lastDonation', align: 'center', render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '' },
    { title: 'Tiền sử bệnh', dataIndex: 'medicalHistory', key: 'medicalHistory', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 120 }}>{text}</span></Tooltip>, width: 130 },
    { title: 'Người liên hệ khẩn cấp', dataIndex: 'emergencyName', key: 'emergencyName', render: (text) => <Tooltip title={text}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 120 }}>{text}</span></Tooltip>, width: 130 },
    { title: 'SĐT khẩn cấp', dataIndex: 'emergencyPhone', key: 'emergencyPhone', align: 'center', width: 120 },
    { title: 'Nhóm máu', dataIndex: 'bloodType', key: 'bloodType', align: 'center', render: (type) => {
      if (!type) return '';
      const bloodMap = {
        'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
        'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
        'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-',
        'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-'
      };
      return <Tag color="geekblue" style={{ fontWeight: 500 }}>{bloodMap[type] || type}</Tag>;
    } },
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
          donor: 'blue', staff: 'green', doctor: 'purple', admin: 'red',
        };
        const labels = {
          donor: 'Người hiến máu', staff: 'Nhân viên', doctor: 'Bác sĩ', admin: 'Quản trị viên',
        };
        return <Tag color={colors[role]} style={{ fontWeight: 500 }}>{labels[role]}</Tag>;
      },
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
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
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="middle"
                shape="circle"
              />
            </Tooltip>
          </Popconfirm>
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
        <Table
          dataSource={filteredUsers} // Sử dụng dữ liệu đã lọc bởi searchText
          columns={columns} // Table sẽ tự áp dụng thêm lọc vai trò và trạng thái từ cấu hình cột
          rowKey="key"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 'max-content' }}
          style={{ background: '#fff', borderRadius: 12 }}
          size="middle"
        />
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
          <div style={{ flex: 1, minWidth: 280 }}>
            <Form.Item
              name="name"
              label={<b>Tên người dùng</b>}
              rules={[
                { required: true, message: 'Vui lòng nhập tên người dùng!' },
                { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
                { max: 100, message: 'Tên người dùng không được vượt quá 100 ký tự!' },
                { pattern: /^[a-zA-Z\sÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐđ]+$/, message: 'Tên người dùng chỉ được chứa chữ cái và khoảng trắng!' }
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
                { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)!' }
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
                {genderOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="birthdate" label={<b>Ngày sinh</b>}>
              <Input type="date" size="large" />
            </Form.Item>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <Form.Item name="height" label={<b>Chiều cao (cm)</b>}>
              <Input type="number" min={0} size="large" />
            </Form.Item>
            <Form.Item name="weight" label={<b>Cân nặng (kg)</b>}>
              <Input type="number" min={0} size="large" />
            </Form.Item>
            <Form.Item name="lastDonation" label={<b>Lần hiến máu gần nhất</b>}>
              <Input type="date" size="large" />
            </Form.Item>
            <Form.Item name="medicalHistory" label={<b>Tiền sử bệnh</b>}>
              <Input placeholder="Nhập tiền sử bệnh" size="large" />
            </Form.Item>
            <Form.Item name="emergencyName" label={<b>Người liên hệ khẩn cấp</b>}>
              <Input placeholder="Nhập tên người liên hệ khẩn cấp" size="large" />
            </Form.Item>
            <Form.Item name="emergencyPhone" label={<b>SĐT khẩn cấp</b>}>
              <Input placeholder="Nhập số điện thoại khẩn cấp" size="large" />
            </Form.Item>
            <Form.Item name="bloodType" label={<b>Nhóm máu</b>}>
              <Select placeholder="Chọn nhóm máu" size="large">
                {bloodTypeOptions.map(type => <Option key={type} value={type}>{type.replace('_', ' ')}</Option>)}
              </Select>
            </Form.Item>
            {modalMode === 'add' && (
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
            )}
            <Form.Item
              name="role"
              label={<b>Vai trò</b>}
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select placeholder="Chọn vai trò" size="large">
                <Option value="donor">Người hiến máu</Option>
                <Option value="staff">Nhân viên</Option>
                <Option value="doctor">Bác sĩ</Option>
                <Option value="admin">Quản trị viên</Option>
              </Select>
            </Form.Item>
            {modalMode === 'edit' && (
              <Form.Item
                name="status"
                label={<b>Trạng thái</b>}
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái" size="large">
                  <Option value="active">Đang hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminUsersPage; 