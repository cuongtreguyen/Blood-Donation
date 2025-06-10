import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Popconfirm, Tooltip } from 'antd';
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import BankOutlined from '@ant-design/icons/lib/icons/BankOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import GlobalOutlined from '@ant-design/icons/lib/icons/GlobalOutlined';
import EnvironmentOutlined from '@ant-design/icons/lib/icons/EnvironmentOutlined';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const AdminBloodBanksPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedBloodBank, setSelectedBloodBank] = useState(null);
  const [form] = Form.useForm();

  // Mock data for blood banks
  const [bloodBanks, setBloodBanks] = useState([
    {
      key: 'BB001',
      id: 'BB001',
      name: 'Bệnh viện Chợ Rẫy',
      address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM',
      phone: '028 3855 4137',
      email: 'contact@choray.vn',
      website: 'www.choray.vn',
      status: 'active',
      createdAt: '2023-01-01',
    },
    {
      key: 'BB002',
      id: 'BB002',
      name: 'Bệnh viện Nhân dân 115',
      address: '527 Sư Vạn Hạnh, Quận 10, TP.HCM',
      phone: '028 3865 4249',
      email: 'info@benhvien115.com.vn',
      website: 'www.benhvien115.com.vn',
      status: 'active',
      createdAt: '2023-01-02',
    },
    {
      key: 'BB003',
      id: 'BB003',
      name: 'Bệnh viện Đại học Y Dược',
      address: '215 Hồng Bàng, Quận 5, TP.HCM',
      phone: '028 3855 8412',
      email: 'contact@umc.edu.vn',
      website: 'www.umc.edu.vn',
      status: 'inactive',
      createdAt: '2023-01-03',
    },
    {
      key: 'BB004',
      id: 'BB004',
      name: 'Bệnh viện Quân y 175',
      address: '786 Nguyễn Kiệm, Gò Vấp, TP.HCM',
      phone: '028 3894 6563',
      email: 'info@benhvien175.com',
      website: 'www.benhvien175.com',
      status: 'active',
      createdAt: '2023-01-04',
    },
    {
      key: 'BB005',
      id: 'BB005',
      name: 'Viện Huyết học - Truyền máu Trung ương',
      address: 'Phố Phạm Ngọc Thạch, Đống Đa, Hà Nội',
      phone: '024 3868 6008',
      email: 'vhhtmtu@nihbt.org.vn',
      website: 'www.nihbt.org.vn',
      status: 'active',
      createdAt: '2023-01-05',
    },
    {
      key: 'BB006',
      id: 'BB006',
      name: 'Bệnh viện Truyền máu Huyết học TP.HCM',
      address: '118 Hùng Vương, Quận 5, TP.HCM',
      phone: '028 3957 1342',
      email: 'tmhh@hcm.vnn.vn',
      website: 'www.tmhh.vn',
      status: 'active',
      createdAt: '2023-01-06',
    },
  ]);

  const showModal = (mode, bloodBank = null) => {
    setModalMode(mode);
    setSelectedBloodBank(bloodBank);
    setIsModalVisible(true);

    if (mode === 'edit' && bloodBank) {
      form.setFieldsValue(bloodBank);
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (modalMode === 'add') {
        const newId = `BB${String(bloodBanks.length + 1).padStart(3, '0')}`;
        setBloodBanks([...bloodBanks, { key: newId, id: newId, ...values }]);
        toast.success('Thêm ngân hàng máu thành công!');
      } else {
        setBloodBanks(bloodBanks.map(bank => 
          bank.key === selectedBloodBank.key ? { ...bank, ...values } : bank
        ));
        toast.success('Cập nhật ngân hàng máu thành công!');
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
    setBloodBanks(bloodBanks.filter(bank => bank.key !== key));
    toast.success('Xóa ngân hàng máu thành công!');
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
      width: 50,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 110,
      ellipsis: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 90,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 110,
      ellipsis: true,
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
      width: 90,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      width: 90,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA.getTime() - dateB.getTime();
      },
      width: 90,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined style={{ color: 'white' }} />}
              onClick={() => showModal('edit', record)}
              type="primary"
              size="small"
              style={{ color: '#d32f2f', borderColor: '#d32f2f' }}
              shape="circle"
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ngân hàng máu này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                shape="circle"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BankOutlined />
            Quản Lý Ngân Hàng Máu
          </div>
        }
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm ngân hàng máu..."
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
              Thêm Ngân Hàng Máu
            </Button>
          </Space>
        }
        bordered={false}
      >
        <Table
          columns={columns}
          dataSource={filteredBloodBanks}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <Modal
        title={modalMode === 'add' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusOutlined /> Thêm Ngân Hàng Máu
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <EditOutlined /> Cập Nhật Ngân Hàng Máu
          </div>
        )}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" style={{ background: '#d32f2f', borderColor: '#d32f2f' }} onClick={handleOk}>
            {modalMode === 'add' ? 'Thêm' : 'Cập Nhật'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="bloodBankForm"
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            name="name"
            label="Tên Ngân Hàng Máu"
            rules={[
              { required: true, message: 'Vui lòng nhập tên ngân hàng máu!' },
              { min: 3, message: 'Tên ngân hàng máu phải có ít nhất 3 ký tự!' },
              { max: 100, message: 'Tên ngân hàng máu không được vượt quá 100 ký tự!' }
            ]}
          >
            <Input prefix={<BankOutlined />} placeholder="Nhập tên ngân hàng máu" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ!' },
              { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự!' },
              { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự!' }
            ]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
              { 
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)!'
              }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[
              { required: true, message: 'Vui lòng nhập website!' },
              { 
                pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Website phải có định dạng hợp lệ (ví dụ: www.example.com)!'
              }
            ]}
          >
            <Input prefix={<GlobalOutlined />} placeholder="Nhập website" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBloodBanksPage; 