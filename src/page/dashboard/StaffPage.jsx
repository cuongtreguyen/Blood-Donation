import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { getStaffList, addStaffMember, updateStaffMember, deleteStaffMember } from '../../services/staffService';

const { Option } = Select;

const StaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  // Tải danh sách nhân viên
  const loadStaffList = () => {
    const list = getStaffList();
    setStaffList(list);
  };

  useEffect(() => {
    loadStaffList();
  }, []);

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (email) => {
    try {
      deleteStaffMember(email);
      message.success('Đã xóa nhân viên thành công');
      loadStaffList();
    } catch (err) {
      message.error('Có lỗi xảy ra khi xóa nhân viên');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStaff) {
        // Cập nhật nhân viên
        const success = updateStaffMember({
          ...editingStaff,
          ...values
        });
        
        if (success) {
          message.success('Đã cập nhật thông tin nhân viên');
        } else {
          throw new Error('Không thể cập nhật thông tin nhân viên');
        }
      } else {
        // Thêm nhân viên mới
        const newStaff = {
          ...values,
          joinDate: new Date().toISOString(),
          password: '123456', // Mật khẩu mặc định
        };
        
        addStaffMember(newStaff);
        message.success('Đã thêm nhân viên mới');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      loadStaffList();
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi lưu thông tin');
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Khoa/Phòng',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Vai trò',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.email)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAdd}
        >
          Thêm nhân viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={staffList}
        rowKey="email"
      />

      <Modal
        title={editingStaff ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
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
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input disabled={!!editingStaff} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="Khoa/Phòng"
            rules={[{ required: true, message: 'Vui lòng chọn khoa/phòng' }]}
          >
            <Select>
              <Option value="Khoa Huyết học">Khoa Huyết học</Option>
              <Option value="Khoa Xét nghiệm">Khoa Xét nghiệm</Option>
              <Option value="Khoa Nội">Khoa Nội</Option>
              <Option value="Phòng Điều dưỡng">Phòng Điều dưỡng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="position"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="Bác sĩ">Bác sĩ</Option>
              <Option value="Y tá">Y tá</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: 'right', gap: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStaff ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffPage; 