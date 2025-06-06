import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Popconfirm } from 'antd';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import BankOutlined from '@ant-design/icons/lib/icons/BankOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import GlobalOutlined from '@ant-design/icons/lib/icons/GlobalOutlined';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;
const { TextArea } = Input;

function AdminBloodBanksPage() {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedBloodBank, setSelectedBloodBank] = useState(null);
  const [form] = Form.useForm();

  // Mock data for blood banks
  const [bloodBanks, setBloodBanks] = useState([
    {
      key: '1',
      id: 'BB001',
      name: 'Bệnh viện Đa khoa Trung ương',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '028 1234 5678',
      email: 'contact@bvtw.edu.vn',
      website: 'www.bvtw.edu.vn',
      status: 'active',
      bloodInventory: {
        'A+': 85,
        'A-': 45,
        'B+': 76,
        'B-': 30,
        'AB+': 25,
        'AB-': 15,
        'O+': 92,
        'O-': 38,
      },
      lastUpdate: '15/10/2023',
    },
    {
      key: '2',
      id: 'BB002',
      name: 'Trung tâm Huyết học Quốc gia',
      address: '456 Lê Duẩn, Quận 1, TP.HCM',
      phone: '028 2345 6789',
      email: 'info@huyethoc.vn',
      website: 'www.huyethoc.vn',
      status: 'active',
      bloodInventory: {
        'A+': 65,
        'A-': 35,
        'B+': 56,
        'B-': 25,
        'AB+': 20,
        'AB-': 10,
        'O+': 72,
        'O-': 28,
      },
      lastUpdate: '14/10/2023',
    },
    {
      key: '3',
      id: 'BB003',
      name: 'Bệnh viện Chợ Rẫy',
      address: '789 Nguyễn Chí Thanh, Quận 5, TP.HCM',
      phone: '028 3456 7890',
      email: 'contact@choray.vn',
      website: 'www.choray.vn',
      status: 'inactive',
      bloodInventory: {
        'A+': 45,
        'A-': 25,
        'B+': 36,
        'B-': 15,
        'AB+': 15,
        'AB-': 5,
        'O+': 52,
        'O-': 18,
      },
      lastUpdate: '13/10/2023',
    },
  ]);

  const showModal = (mode, bloodBank = null) => {
    setModalMode(mode);
    setSelectedBloodBank(bloodBank);
    setIsModalVisible(true);

    if (mode === 'edit' && bloodBank) {
      form.setFieldsValue({
        name: bloodBank.name,
        address: bloodBank.address,
        phone: bloodBank.phone,
        email: bloodBank.email,
        website: bloodBank.website,
        status: bloodBank.status,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (modalMode === 'add') {
        // Add new blood bank
        const newBloodBank = {
          key: String(bloodBanks.length + 1),
          id: `BB${String(bloodBanks.length + 1).padStart(3, '0')}`,
          ...values,
          bloodInventory: {
            'A+': 0,
            'A-': 0,
            'B+': 0,
            'B-': 0,
            'AB+': 0,
            'AB-': 0,
            'O+': 0,
            'O-': 0,
          },
          lastUpdate: new Date().toLocaleDateString('vi-VN'),
        };
        setBloodBanks([...bloodBanks, newBloodBank]);
        toast.success('Thêm ngân hàng máu thành công!');
      } else {
        // Update existing blood bank
        const updatedBloodBanks = bloodBanks.map(bloodBank => 
          bloodBank.key === selectedBloodBank.key ? { ...bloodBank, ...values } : bloodBank
        );
        setBloodBanks(updatedBloodBanks);
        toast.success('Cập nhật thông tin thành công!');
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
      // Tìm blood bank cần xóa từ danh sách
      const bloodBankToDelete = bloodBanks.find(bank => bank.key === key);
      if (!bloodBankToDelete) {
        toast.error('Không tìm thấy ngân hàng máu!');
        return;
      }

      // Cập nhật state để xóa blood bank
      const updatedBloodBanks = bloodBanks.filter(bank => bank.key !== key);
      setBloodBanks(updatedBloodBanks);
      toast.success('Xóa ngân hàng máu thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa ngân hàng máu:', error);
      toast.error('Xóa ngân hàng máu thất bại. Vui lòng thử lại!');
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredBloodBanks = bloodBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         bank.address.toLowerCase().includes(searchText.toLowerCase()) ||
                         bank.phone.includes(searchText) ||
                         bank.email.toLowerCase().includes(searchText.toLowerCase());
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
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
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
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website) => (
        <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      ),
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
      title: 'Cập nhật gần nhất',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      sorter: (a, b) => {
        const dateA = a.lastUpdate.split('/').reverse().join('');
        const dateB = b.lastUpdate.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      },
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
            description="Bạn có chắc chắn muốn xóa ngân hàng máu này?"
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
        title="Quản lý ngân hàng máu"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên, địa chỉ, SĐT, email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal('add')}
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
            >
              Thêm ngân hàng máu
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredBloodBanks}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === 'add' ? 'Thêm ngân hàng máu mới' : 'Chỉnh sửa thông tin'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'add' ? 'Thêm' : 'Lưu'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên ngân hàng máu"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng máu!' }]}
          >
            <Input placeholder="Nhập tên ngân hàng máu" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <TextArea
              placeholder="Nhập địa chỉ đầy đủ"
              autoSize={{ minRows: 2, maxRows: 4 }}
              prefix={<BankOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
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
            name="website"
            label="Website"
            rules={[{ required: true, message: 'Vui lòng nhập website!' }]}
          >
            <Input prefix={<GlobalOutlined />} placeholder="Nhập website" />
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

export default AdminBloodBanksPage; 