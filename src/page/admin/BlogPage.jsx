import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Descriptions, Input, Select, Space, Tooltip, Popconfirm, Form } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mockData = [
  {
    key: '1',
    title: 'Tầm quan trọng của hiến máu',
    author: 'Admin',
    date: '2024-05-01',
    category: 'Kiến thức',
    status: 'public',
    content: 'Nội dung bài viết về tầm quan trọng của hiến máu...',
  },
  {
    key: '2',
    title: 'Câu chuyện người hiến máu',
    author: 'Nguyễn Văn A',
    date: '2024-04-15',
    category: 'Câu chuyện',
    status: 'hidden',
    content: 'Một câu chuyện truyền cảm hứng về hiến máu...',
  },
];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'public', label: 'Công khai' },
  { value: 'hidden', label: 'Ẩn' },
];

const categoryOptions = [
  { value: 'Kiến thức', label: 'Kiến thức' },
  { value: 'Câu chuyện', label: 'Câu chuyện' },
  { value: 'Tin tức', label: 'Tin tức' },
];

function BlogPage() {
  const [data, setData] = useState(mockData);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState(null);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditRecord, setSelectedEditRecord] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    (statusFilter === 'all' ? true : item.status === statusFilter) &&
    (search === '' ? true : item.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedEditRecord(null);
    form.resetFields();
    setEditModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedEditRecord(record);
    form.setFieldsValue({ ...record });
    setEditModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (selectedEditRecord) {
        const updatedData = data.map(item => 
          item.key === selectedEditRecord.key ? { ...item, ...values } : item
        );
        setData(updatedData);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        const newBlog = {
          key: String(data.length + 1),
          title: values.title,
          author: 'Admin',
          date: new Date().toISOString().slice(0, 10),
          category: values.category,
          status: values.status,
          content: values.content,
        };
        setData([...data, newBlog]);
        toast.success('Thêm bài viết mới thành công!');
      }
      setEditModalOpen(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
      toast.error('Vui lòng điền đầy đủ thông tin!');
    });
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (key) => {
    try {
      setData(data.filter(item => item.key !== key));
      toast.success('Xóa bài viết thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      toast.error('Xóa bài viết thất bại. Vui lòng thử lại!');
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <span><FileTextOutlined style={{ color: '#d32f2f', marginRight: 6 }} />{title}</span>,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status === 'public' ? <Tag color="green">Công khai</Tag> : <Tag color="orange">Ẩn</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} size="small" onClick={() => { setSelectedViewRecord(record); setViewModalOpen(true); }} shape="circle" />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} size="small" style={{ color: '#d32f2f', borderColor: '#d32f2f' }} onClick={() => handleEdit(record)} shape="circle" />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.key)}
          >
            <Tooltip title="Xóa">
              <Button icon={<DeleteOutlined />} size="small" danger shape="circle" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý bài viết</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          style={{ width: 180 }}
        />
        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#d32f2f', borderColor: '#d32f2f' }} onClick={handleAdd}>
          Thêm bài viết
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredData} rowKey="key" />
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        title="Chi tiết bài viết"
        footer={null}
      >
        {selectedViewRecord && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tiêu đề">{selectedViewRecord.title}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{selectedViewRecord.author}</Descriptions.Item>
            <Descriptions.Item label="Ngày đăng">{selectedViewRecord.date}</Descriptions.Item>
            <Descriptions.Item label="Danh mục">{selectedViewRecord.category}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedViewRecord.status === 'public' ? 'Công khai' : 'Ẩn'}</Descriptions.Item>
            <Descriptions.Item label="Nội dung">{selectedViewRecord.content}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        open={editModalOpen}
        onCancel={handleEditCancel}
        title={selectedEditRecord ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        onOk={handleSave}
        okText={selectedEditRecord ? 'Lưu' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}> 
            <Select options={categoryOptions} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
            <Select options={statusOptions.filter(opt => opt.value !== 'all')} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}> 
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BlogPage; 