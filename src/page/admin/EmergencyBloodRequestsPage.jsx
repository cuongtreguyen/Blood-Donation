import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Popconfirm, DatePicker, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, SafetyOutlined, UserOutlined, PhoneOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import api from '../../config/api';

const { Option } = Select;
const { TextArea } = Input;

const mockRequests = [
  {
    key: 'REQ001',
    id: 'REQ001',
    patientName: 'Nguyễn Văn A',
    bloodType: 'A+',
    component: 'Whole Blood',
    quantity: 2,
    priority: 'High',
    requestDate: '2024-05-01',
    dueDate: '2024-05-02',
    status: 'Pending',
    contactInfo: '0901234567',
    hospital: 'Bệnh viện Chợ Rẫy',
    reason: 'Phẫu thuật khẩn cấp'
  },
  {
    key: 'REQ002',
    id: 'REQ002',
    patientName: 'Trần Thị B',
    bloodType: 'O-',
    component: 'Plasma',
    quantity: 1,
    priority: 'Medium',
    requestDate: '2024-04-28',
    dueDate: '2024-05-05',
    status: 'Approved',
    contactInfo: '0908765432',
    hospital: 'Bệnh viện Nhân dân 115',
    reason: 'Thiếu máu cấp tính'
  },
  {
    key: 'REQ003',
    id: 'REQ003',
    patientName: 'Lê Văn C',
    bloodType: 'B+',
    component: 'Red Blood Cells',
    quantity: 3,
    priority: 'Urgent',
    requestDate: '2024-05-02',
    dueDate: '2024-05-02',
    status: 'Rejected',
    contactInfo: '0912345678',
    hospital: 'Bệnh viện Đại học Y Dược',
    reason: 'Tai nạn giao thông'
  },
];

const EmergencyBloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const showModal = (mode, request = null) => {
    setModalMode(mode);
    setSelectedRequest(request);
    setIsModalVisible(true);

    if (mode === 'edit' && request) {
      form.setFieldsValue({
        ...request,
        requestDate: request.requestDate ? dayjs(request.requestDate) : null,
        dueDate: request.dueDate ? dayjs(request.dueDate) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newRequest = {
        ...values,
        requestDate: values.requestDate ? values.requestDate.format('YYYY-MM-DD') : null,
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
      };

      if (modalMode === 'add') {
        const newId = `REQ${String(requests.length + 1).padStart(3, '0')}`;
        setRequests([...requests, { key: newId, id: newId, status: 'Pending', ...newRequest }]);
        toast.success('Thêm yêu cầu máu khẩn cấp thành công!');
      } else {
        setRequests(requests.map(req =>
          req.key === selectedRequest.key ? { ...req, ...newRequest } : req
        ));
        toast.success('Cập nhật yêu cầu máu khẩn cấp thành công!');
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
    setRequests(requests.filter(req => req.key !== key));
    toast.success('Xóa yêu cầu máu khẩn cấp thành công!');
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                          request.bloodType.toLowerCase().includes(searchText.toLowerCase()) ||
                          request.hospital.toLowerCase().includes(searchText.toLowerCase()) ||
                          request.contactInfo.includes(searchText);
    return matchesSearch;
  });

  const columns = [
    {
      title: 'ID Yêu cầu',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 120,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Nhóm máu',
      dataIndex: 'bloodType',
      key: 'bloodType',
      filters: [
        { text: 'A+', value: 'A+' }, { text: 'A-', value: 'A-' },
        { text: 'B+', value: 'B+' }, { text: 'B-', value: 'B-' },
        { text: 'AB+', value: 'AB+' }, { text: 'AB-', value: 'AB-' },
        { text: 'O+', value: 'O+' }, { text: 'O-', value: 'O-' },
      ],
      onFilter: (value, record) => record.bloodType === value,
      width: 100,
    },
    {
      title: 'Thành phần',
      dataIndex: 'component',
      key: 'component',
      filters: [
        { text: 'Whole Blood', value: 'Whole Blood' },
        { text: 'Plasma', value: 'Plasma' },
        { text: 'Red Blood Cells', value: 'Red Blood Cells' },
        { text: 'Platelets', value: 'Platelets' },
      ],
      onFilter: (value, record) => record.component === value,
      width: 120,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
      width: 80,
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: 'Khẩn cấp', value: 'Urgent' },
        { text: 'Cao', value: 'High' },
        { text: 'Trung bình', value: 'Medium' },
        { text: 'Thấp', value: 'Low' },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority) => {
        let color = '';
        let text = '';
        if (priority === 'High') {
          color = 'volcano';
          text = 'Cao';
        } else if (priority === 'Medium') {
          color = 'geekblue';
          text = 'Trung bình';
        } else if (priority === 'Urgent') {
          color = 'red';
          text = 'Khẩn cấp';
        } else if (priority === 'Low') {
          color = 'green';
          text = 'Thấp';
        }
        return <Tag color={color}>{text}</Tag>;
      },
      width: 100,
    },
    {
      title: 'Ngày đến hạn',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang chờ', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Đã từ chối', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = '';
        if (status === 'Pending') {
          color = 'orange';
        } else if (status === 'Approved') {
          color = 'green';
        } else if (status === 'Rejected') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'Pending' && (
            <>
              <Popconfirm
                title="Bạn có chắc chắn muốn duyệt yêu cầu này?"
                onConfirm={() => handleUpdateStatus(record.id, 'Approved')}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{ type: 'primary', style: { background: '#52c41a', borderColor: '#52c41a' } }}
              >
                <Tooltip title="Duyệt">
                  <Button
                    icon={<SafetyOutlined style={{ color: 'white' }} />}
                    type="primary"
                    size="small"
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    shape="circle"
                  />
                </Tooltip>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn muốn từ chối yêu cầu này?"
                onConfirm={() => handleUpdateStatus(record.id, 'Rejected')}
                okText="Từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Từ chối">
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    size="small"
                    shape="circle"
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
          {record.status !== 'Pending' && (
            <Tag color={record.status === 'Approved' ? 'green' : 'red'}>
              {record.status === 'Approved' ? 'Đã duyệt' : 'Đã từ chối'}
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/blood-register/list-all');
        setRequests(response.data);
      } catch (err) {
        setRequests(mockRequests);
        toast.warn('Không thể lấy dữ liệu thật, đang hiển thị dữ liệu mẫu!');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/api/blood-register/update-status/${id}`, { status });
      setRequests((prev) => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success('Cập nhật trạng thái thành công!');
    } catch (err) {
      setRequests((prev) => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.error('API lỗi, chỉ cập nhật trên dữ liệu mẫu!');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Quản Lý Yêu Cầu Máu Khẩn Cấp"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân, nhóm máu, bệnh viện..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              style={{ width: 400 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal('add')}
              style={{ background: '#d32f2f', borderColor: '#d32f2f' }}
            >
              Thêm Yêu Cầu
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredRequests}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 1300 }}
        />
      </Card>

      <Modal
        title={modalMode === 'add' ? 'Thêm Yêu Cầu Máu Khẩn Cấp Mới' : 'Chỉnh Sửa Yêu Cầu Máu Khẩn Cấp'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'add' ? 'Thêm' : 'Lưu'}
        cancelText="Hủy"
        width={700}
        okButtonProps={{ style: { background: '#d32f2f', borderColor: '#d32f2f' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="patientName" 
            label="Tên bệnh nhân" 
            rules={[
              { required: true, message: 'Vui lòng nhập tên bệnh nhân!' },
              { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Tên bệnh nhân chỉ được chứa chữ cái và khoảng trắng!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên bệnh nhân" />
          </Form.Item>
          <Form.Item 
            name="contactInfo" 
            label="Thông tin liên hệ" 
            rules={[
              { required: true, message: 'Vui lòng nhập thông tin liên hệ!' },
              { 
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // Kiểm tra nếu là email
                  if (value.includes('@')) {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(value)) {
                      return Promise.reject('Email không hợp lệ!');
                    }
                  } else {
                    // Kiểm tra nếu là số điện thoại
                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(value)) {
                      return Promise.reject('Số điện thoại phải có 10 chữ số!');
                    }
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại hoặc Email" />
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
            name="component" 
            label="Thành phần" 
            rules={[{ required: true, message: 'Vui lòng chọn thành phần!' }]}
          >
            <Select placeholder="Chọn thành phần">
              <Option value="Whole Blood">Whole Blood</Option>
              <Option value="Plasma">Plasma</Option>
              <Option value="Red Blood Cells">Red Blood Cells</Option>
              <Option value="Platelets">Platelets</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="quantity" 
            label="Số lượng (đơn vị)" 
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
              { type: 'number', max: 10, message: 'Số lượng không được vượt quá 10 đơn vị!' }
            ]}
          >
            <Input type="number" placeholder="Số lượng" />
          </Form.Item>
          <Form.Item 
            name="priority" 
            label="Mức độ ưu tiên" 
            rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
          >
            <Select placeholder="Chọn mức độ ưu tiên">
              <Option value="Urgent">Khẩn cấp</Option>
              <Option value="High">Cao</Option>
              <Option value="Medium">Trung bình</Option>
              <Option value="Low">Thấp</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="requestDate" 
            label="Ngày yêu cầu" 
            rules={[
              { required: true, message: 'Vui lòng chọn ngày yêu cầu!' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const today = dayjs().startOf('day');
                  const selectedDate = value.startOf('day');
                  if (selectedDate.isBefore(today)) {
                    return Promise.reject('Ngày yêu cầu không thể là ngày trong quá khứ!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item 
            name="dueDate" 
            label="Ngày đến hạn" 
            rules={[
              { required: true, message: 'Vui lòng chọn ngày đến hạn!' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const today = dayjs().startOf('day');
                  const selectedDate = value.startOf('day');
                  if (selectedDate.isBefore(today)) {
                    return Promise.reject('Ngày đến hạn không thể là ngày trong quá khứ!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item 
            name="reason" 
            label="Lý do" 
            rules={[
              { required: true, message: 'Vui lòng nhập lý do yêu cầu!' },
              { min: 10, message: 'Lý do phải có ít nhất 10 ký tự!' },
              { max: 500, message: 'Lý do không được vượt quá 500 ký tự!' }
            ]}
          >
            <TextArea rows={3} placeholder="Lý do yêu cầu" />
          </Form.Item>
          {modalMode === 'edit' && (
            <Form.Item 
              name="status" 
              label="Trạng thái" 
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Pending">Đang chờ</Option>
                <Option value="Approved">Đã duyệt</Option>
                <Option value="Rejected">Đã từ chối</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default EmergencyBloodRequestsPage; 