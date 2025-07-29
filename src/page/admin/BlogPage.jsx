// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Tag, Button, Modal, Descriptions, Input, Select, Space, Tooltip, Popconfirm, Form } from 'antd';
// import { EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '../../config/api';

// // const mockData = [
// //   {
// //     key: '1',
// //     title: 'Tầm quan trọng của hiến máu',
// //     author: 'Admin',
// //     date: '2024-05-01',
// //     category: 'Kiến thức',
// //     status: 'public',
// //     content: 'Nội dung bài viết về tầm quan trọng của hiến máu...',
// //   },
// //   {
// //     key: '2',
// //     title: 'Câu chuyện người hiến máu',
// //     author: 'Nguyễn Văn A',
// //     date: '2024-04-15',
// //     category: 'Câu chuyện',
// //     status: 'hidden',
// //     content: 'Một câu chuyện truyền cảm hứng về hiến máu...',
// //   },
// // ];

// const statusOptions = [
//   { value: 'all', label: 'Tất cả trạng thái' },
//   { value: 'public', label: 'Công khai' },
//   { value: 'hidden', label: 'Ẩn' },
// ];

// // const categoryOptions = [
// //   { value: 'Kiến thức', label: 'Kiến thức' },
// //   { value: 'Câu chuyện', label: 'Câu chuyện' },
// //   { value: 'Tin tức', label: 'Tin tức' },
// // ];

// function BlogPage() {
//   const [data, setData] = useState([]); // Chuẩn bị cho việc lấy danh sách từ API thật
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedViewRecord, setSelectedViewRecord] = useState(null);
  
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedEditRecord, setSelectedEditRecord] = useState(null);
//   const [addModalOpen, setAddModalOpen] = useState(false); // Modal thêm mới
//   const [addForm] = Form.useForm();

//   const [statusFilter, setStatusFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [form] = Form.useForm();

//   const filteredData = data.filter(item =>
//     (statusFilter === 'all' ? true : item.status === statusFilter) &&
//     (search === '' ? true : item.title.toLowerCase().includes(search.toLowerCase()))
//   );

//   // ================== API CALLS FOR BLOG ==================
//   // Lấy danh sách blog cho admin
//   const getAdminBlogs = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Không tìm thấy token xác thực!');
//         return null;
//       }
//       const res = await api.get('/blogs/admin', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       toast.error('Không thể lấy danh sách bài viết!');
//       console.log(error);
//       return null;
//     }
//   };

//   // Lấy chi tiết một blog
//   const getBlogDetail = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Không tìm thấy token xác thực!');
//         return null;
//       }
//       const res = await api.get(`/blogs/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       toast.error('Không thể lấy chi tiết bài viết!');
//       console.log(error);
//       return null;
//     }
//   };

//   // Cập nhật một blog
//   const updateBlog = async (id, values) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Không tìm thấy token xác thực!');
//         return null;
//       }
//       const res = await api.put(`/blogs/${id}`, values, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Cập nhật bài viết thành công!');
//       return res.data;
//     } catch (error) {
//       toast.error('Cập nhật bài viết thất bại!');
//       console.log(error);
//       return null;
//     }
//   };

//   // Xóa một blog (chuyển trạng thái sang DELETED)
//   const deleteBlog = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Không tìm thấy token xác thực!');
//         return false;
//       }
//       await api.delete(`/blogs/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Xóa bài viết thành công!');
//       return true;
//     } catch (error) {
//       toast.error('Xóa bài viết thất bại!');
//       console.log(error);
//       return false;
//     }
//   };

//   // Khôi phục blog bị xóa
//   const restoreBlog = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         toast.error('Không tìm thấy token xác thực!');
//         return false;
//       }
//       await api.put(`/blogs/${id}/restore`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Khôi phục bài viết thành công!');
//       return true;
//     } catch (error) {
//       toast.error('Khôi phục bài viết thất bại!');
//       console.log(error);
//       return false;
//     }
//   };

//   // Tìm kiếm blog
//   const searchBlogs = async (keyword) => {
//     try {
//       const res = await api.get(`/blogs/search?keyword=${encodeURIComponent(keyword)}`);
//       return res.data;
//     } catch (error) {
//       toast.error('Không thể tìm kiếm bài viết!');
//       console.log(error);
//       return null;
//     }
//   };

//   // Lấy danh sách blog cho admin khi load trang hoặc sau khi thêm mới
//   const fetchAdminBlogs = useCallback(async () => {
//     const blogs = await getAdminBlogs();
//     if (blogs) setData(blogs);
//   }, []);
//   useEffect(() => {
//     fetchAdminBlogs();
//   }, [fetchAdminBlogs]);

//   // Xử lý submit form thêm mới
//   const handleAddBlog = async () => {
//     try {
//       const values = await addForm.validateFields();
//       const currentUser = JSON.parse(localStorage.getItem('user'));
//       const authorName = currentUser?.fullName || currentUser?.username || 'Admin';
//       const payload = {
//         title: values.title,
//         content: values.content,
//         author: authorName,
//       };
//       const res = await api.post('/blogs', payload, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (res.data) {
//         toast.success('Thêm bài viết thành công!'); // Thông báo thành công
//         setAddModalOpen(false);
//         addForm.resetFields();
//         fetchAdminBlogs(); // Reload lại danh sách blog ngay
//       }
//     } catch (err) {
//       toast.error('Vui lòng điền đầy đủ thông tin!');
//       console.log(err);
//     }
//   };

//   // Xem chi tiết bài viết (gọi API)
//   const handleViewDetail = async (id) => {
//     const blogDetail = await getBlogDetail(id);
//     if (blogDetail) {
//       setSelectedViewRecord(blogDetail);
//       setViewModalOpen(true);
//     }
//   };

//   // Sửa bài viết (gọi API lấy chi tiết trước khi sửa)
//   const handleEdit = async (record) => {
//     const blogEdit = await getBlogDetail(record.id || record.key);
//     if (blogEdit) {
//       setSelectedEditRecord(blogEdit);
//       form.setFieldsValue({
//         title: blogEdit.title,
//         content: blogEdit.content,
//       });
//       setEditModalOpen(true);
//     }
//   };

//   // Lưu bài viết sau khi sửa (gọi API PUT)
//   const handleSave = () => {
//     form.validateFields().then(async (values) => {
//       if (!selectedEditRecord) return;
//       const payload = {
//         title: values.title,
//         content: values.content,
//         author: selectedEditRecord.author,
//       };
//       const updated = await updateBlog(selectedEditRecord.id || selectedEditRecord.key, payload);
//       if (updated) {
//         setEditModalOpen(false);
//         fetchAdminBlogs();
//       }
//     }).catch(() => {
//       toast.error('Vui lòng điền đầy đủ thông tin!');
//     });
//   };

//   // Xóa bài viết (gọi API DELETE)
//   const handleDelete = async (id) => {
//     const result = await deleteBlog(id);
//     if (result) {
//       fetchAdminBlogs(); // Reload lại danh sách ngay sau khi xóa thành công
//     }
//   };

//   const columns = [
//     {
//       title: 'Tiêu đề',
//       dataIndex: 'title',
//       key: 'title',
//       render: (title) => <span><FileTextOutlined style={{ color: '#d32f2f', marginRight: 6 }} />{title}</span>,
//     },
//     {
//       title: 'Tác giả',
//       dataIndex: 'author',
//       key: 'author',
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) =>
//         status === 'ACTIVE'
//           ? <Tag color="green">Công khai</Tag>
//           : status === 'DELETED'
//             ? <Tag color="red">Đã xóa</Tag>
//             : <Tag color="orange">Ẩn</Tag>,
//     },
//     {
//       title: 'Hành động',
//       key: 'action',
//       render: (_, record) => (
//         <Space size="small">
//           <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record.id || record.key)}>
//             Xem
//           </Button>
//           <Button icon={<EditOutlined />} size="small" style={{ color: '#d32f2f', borderColor: '#d32f2f', background: '#fff' }} onClick={() => handleEdit(record)}>
//             Sửa
//           </Button>
//           <Popconfirm
//             title="Bạn có chắc chắn muốn xóa bài viết này?"
//             okText="Xóa"
//             cancelText="Hủy"
//             okButtonProps={{ danger: true }}
//             onConfirm={() => handleDelete(record.id || record.key)}
//           >
//             <Button icon={<DeleteOutlined />} size="small" danger>
//               Xóa
//             </Button>
//           </Popconfirm>
//           {record.status === 'DELETED' && (
//             <Button
//               type="primary"
//               size="small"
//               style={{ background: '#52c41a', borderColor: '#52c41a' }}
//               onClick={async () => {
//                 const ok = await restoreBlog(record.id);
//                 if (ok) fetchAdminBlogs();
//               }}
//             >
//               Khôi phục
//             </Button>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   // Hàm xử lý tìm kiếm tiêu đề bằng API
//   const handleSearch = async (e) => {
//     const keyword = e.target.value;
//     setSearch(keyword);
//     if (keyword.trim() === '') {
//       fetchAdminBlogs();
//     } else {
//       const result = await searchBlogs(keyword);
//       if (result) setData(result.map(item => ({ ...item, key: item.id })));
//     }
//   };

//   return (
//     <div>
//       <h2>Quản lý bài viết</h2>
//       <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
//         <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
//           <Input.Search
//             placeholder="Tìm kiếm theo tiêu đề"
//             value={search}
//             onChange={handleSearch}
//             style={{ width: 220 }}
//           />
//           <Select
//             value={statusFilter}
//             onChange={setStatusFilter}
//             options={statusOptions}
//             style={{ width: 180 }}
//           />
//         </div>
//         <Button type="primary" danger onClick={() => setAddModalOpen(true)}
//           style={{ background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 }}
//         >
//           Thêm bài viết
//         </Button>
//       </div>
//       <Table columns={columns} dataSource={filteredData} rowKey="key" />
//       <Modal
//         open={viewModalOpen}
//         onCancel={() => setViewModalOpen(false)}
//         title="Chi tiết bài viết"
//         footer={null}
//       >
//         {selectedViewRecord && (
//           <Descriptions bordered column={1} size="small">
//             <Descriptions.Item label="ID">{selectedViewRecord.id}</Descriptions.Item>
//             <Descriptions.Item label="Tiêu đề">{selectedViewRecord.title}</Descriptions.Item>
//             <Descriptions.Item label="Tác giả">{selectedViewRecord.author}</Descriptions.Item>
//             <Descriptions.Item label="Trạng thái">{selectedViewRecord.status}</Descriptions.Item>
//             <Descriptions.Item label="Ngày tạo">{selectedViewRecord.createdAt ? new Date(selectedViewRecord.createdAt).toLocaleString('vi-VN') : ''}</Descriptions.Item>
//             <Descriptions.Item label="Ngày cập nhật">{selectedViewRecord.updatedAt ? new Date(selectedViewRecord.updatedAt).toLocaleString('vi-VN') : ''}</Descriptions.Item>
//             <Descriptions.Item label="Nội dung">{selectedViewRecord.content}</Descriptions.Item>
//             {selectedViewRecord.img && <Descriptions.Item label="Ảnh"><img src={selectedViewRecord.img} alt="Ảnh blog" style={{maxWidth: 200}} /></Descriptions.Item>}
//           </Descriptions>
//         )}
//       </Modal>
//       <Modal
//         open={editModalOpen}
//         onCancel={() => setEditModalOpen(false)}
//         title={selectedEditRecord ? 'Sửa bài viết' : 'Thêm bài viết mới'}
//         onOk={handleSave}
//         okText={selectedEditRecord ? 'Lưu' : 'Thêm'}
//         okButtonProps={selectedEditRecord ? { style: { background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 } } : {}}
//         cancelText="Hủy"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item 
//             name="title" 
//             label="Tiêu đề" 
//             rules={[
//               { required: true, message: 'Vui lòng nhập tiêu đề!' },
//               { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
//               { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
//             ]}
//           > 
//             <Input />
//           </Form.Item>
//           <Form.Item 
//             name="content" 
//             label="Nội dung" 
//             rules={[
//               { required: true, message: 'Vui lòng nhập nội dung!' },
//               { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự!' },
//               { max: 5000, message: 'Nội dung không được vượt quá 5000 ký tự!' }
//             ]}
//           > 
//             <Input.TextArea rows={4} />
//           </Form.Item>
//         </Form>
//       </Modal>
//       {/* Modal thêm mới bài viết */}
//       <Modal
//         open={addModalOpen}
//         onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
//         title="Thêm bài viết mới"
//         onOk={handleAddBlog}
//         okText="Thêm"
//         cancelText="Hủy"
//         okButtonProps={{ style: { background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 } }}
//       >
//         <Form form={addForm} layout="vertical">
//           <Form.Item 
//             name="title" 
//             label="Tiêu đề" 
//             rules={[
//               { required: true, message: 'Vui lòng nhập tiêu đề!' },
//               { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
//               { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
//             ]}
//           > 
//             <Input />
//           </Form.Item>
//           <Form.Item 
//             name="content" 
//             label="Nội dung" 
//             rules={[
//               { required: true, message: 'Vui lòng nhập nội dung!' },
//               { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự!' },
//               { max: 5000, message: 'Nội dung không được vượt quá 5000 ký tự!' }
//             ]}
//           > 
//             <Input.TextArea rows={4} />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// export default BlogPage; 

import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Button, Modal, Descriptions, Input, Select, Space, Tooltip, Popconfirm, Form } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../config/api';

// const mockData = [
//   {
//     key: '1',
//     title: 'Tầm quan trọng của hiến máu',
//     author: 'Admin',
//     date: '2024-05-01',
//     category: 'Kiến thức',
//     status: 'public',
//     content: 'Nội dung bài viết về tầm quan trọng của hiến máu...',
//   },
//   {
//     key: '2',
//     title: 'Câu chuyện người hiến máu',
//     author: 'Nguyễn Văn A',
//     date: '2024-04-15',
//     category: 'Câu chuyện',
//     status: 'hidden',
//     content: 'Một câu chuyện truyền cảm hứng về hiến máu...',
//   },
// ];

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Công khai' },
  { value: 'DELETED', label: 'Ẩn' },
];

// const categoryOptions = [
//   { value: 'Kiến thức', label: 'Kiến thức' },
//   { value: 'Câu chuyện', label: 'Câu chuyện' },
//   { value: 'Tin tức', label: 'Tin tức' },
// ];

function BlogPage() {
  const [data, setData] = useState([]); // Chuẩn bị cho việc lấy danh sách từ API thật
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = useState(null);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditRecord, setSelectedEditRecord] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false); // Modal thêm mới
  const [addForm] = Form.useForm();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    (statusFilter === 'all' ? true : item.status === statusFilter) &&
    (search === '' ? true : item.title.toLowerCase().includes(search.toLowerCase()))
  );

  // ================== API CALLS FOR BLOG ==================
  // Lấy danh sách blog cho admin
  const getAdminBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return null;
      }
      const res = await api.get('/blogs/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      toast.error('Không thể lấy danh sách bài viết!');
      console.log(error);
      return null;
    }
  };

  // Lấy chi tiết một blog
  const getBlogDetail = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return null;
      }
      const res = await api.get(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      toast.error('Không thể lấy chi tiết bài viết!');
      console.log(error);
      return null;
    }
  };

  // Cập nhật một blog
  const updateBlog = async (id, values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return null;
      }
      const res = await api.put(`/blogs/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Cập nhật bài viết thành công!');
      return res.data;
    } catch (error) {
      toast.error('Cập nhật bài viết thất bại!');
      console.log(error);
      return null;
    }
  };

  // Ẩn một blog (chuyển trạng thái sang DELETED)
  const hideBlog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return false;
      }
      await api.delete(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Ẩn bài viết thành công!');
      return true;
    } catch (error) {
      toast.error('Ẩn bài viết thất bại!');
      console.log(error);
      return false;
    }
  };

  // Khôi phục blog bị xóa
  const restoreBlog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Không tìm thấy token xác thực!');
        return false;
      }
      await api.put(`/blogs/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Khôi phục bài viết thành công!');
      return true;
    } catch (error) {
      toast.error('Khôi phục bài viết thất bại!');
      console.log(error);
      return false;
    }
  };

  // Tìm kiếm blog
  const searchBlogs = async (keyword) => {
    try {
      const res = await api.get(`/blogs/search?keyword=${encodeURIComponent(keyword)}`);
      return res.data;
    } catch (error) {
      toast.error('Không thể tìm kiếm bài viết!');
      console.log(error);
      return null;
    }
  };

  // Lấy danh sách blog cho admin khi load trang hoặc sau khi thêm mới
  const fetchAdminBlogs = useCallback(async () => {
    const blogs = await getAdminBlogs();
    if (blogs) setData(blogs);
  }, []);
  useEffect(() => {
    fetchAdminBlogs();
  }, [fetchAdminBlogs]);

  // Xử lý submit form thêm mới
  const handleAddBlog = async () => {
    try {
      const values = await addForm.validateFields();
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const authorName = currentUser?.fullName || currentUser?.username || 'Admin';
      const payload = {
        title: values.title,
        content: values.content,
        author: authorName,
      };
      const res = await api.post('/blogs', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data) {
        toast.success('Thêm bài viết thành công!'); // Thông báo thành công
        setAddModalOpen(false);
        addForm.resetFields();
        fetchAdminBlogs(); // Reload lại danh sách blog ngay
      }
    } catch (err) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      console.log(err);
    }
  };

  // Xem chi tiết bài viết (gọi API)
  const handleViewDetail = async (id) => {
    const blogDetail = await getBlogDetail(id);
    if (blogDetail) {
      setSelectedViewRecord(blogDetail);
      setViewModalOpen(true);
    }
  };

  // Sửa bài viết (gọi API lấy chi tiết trước khi sửa)
  const handleEdit = async (record) => {
    const blogEdit = await getBlogDetail(record.id || record.key);
    if (blogEdit) {
      setSelectedEditRecord(blogEdit);
      form.setFieldsValue({
        title: blogEdit.title,
        content: blogEdit.content,
      });
      setEditModalOpen(true);
    }
  };

  // Lưu bài viết sau khi sửa (gọi API PUT)
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      if (!selectedEditRecord) return;
      const payload = {
        title: values.title,
        content: values.content,
        author: selectedEditRecord.author,
      };
      const updated = await updateBlog(selectedEditRecord.id || selectedEditRecord.key, payload);
      if (updated) {
        setEditModalOpen(false);
        fetchAdminBlogs();
      }
    }).catch(() => {
      toast.error('Vui lòng điền đầy đủ thông tin!');
    });
  };

  // Ẩn bài viết (gọi API DELETE)
  const handleHide = async (id) => {
    const result = await hideBlog(id);
    if (result) {
      fetchAdminBlogs(); // Reload lại danh sách ngay sau khi ẩn thành công
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'ACTIVE'
          ? <Tag color="green">Công khai</Tag>
          : status === 'DELETED'
            ? <Tag color="red">Ẩn</Tag>
            : <Tag color="orange">Ẩn</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record.id || record.key)}>
            Xem
          </Button>
          <Button icon={<EditOutlined />} size="small" style={{ color: '#d32f2f', borderColor: '#d32f2f', background: '#fff' }} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          {record.status !== 'DELETED' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn ẩn bài viết này?"
              okText="Ẩn"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleHide(record.id || record.key)}
            >
              <Button icon={<DeleteOutlined />} size="small" danger>
                Ẩn
              </Button>
            </Popconfirm>
          )}
          {record.status === 'DELETED' && (
            <Button
              type="primary"
              size="small"
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              onClick={async () => {
                const ok = await restoreBlog(record.id);
                if (ok) fetchAdminBlogs();
              }}
            >
              Khôi phục
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Hàm xử lý tìm kiếm tiêu đề bằng API
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    if (keyword.trim() === '') {
      fetchAdminBlogs();
    } else {
      const result = await searchBlogs(keyword);
      if (result) setData(result.map(item => ({ ...item, key: item.id })));
    }
  };

  return (
    <div>
      <h2>Quản lý bài viết</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề"
            value={search}
            onChange={handleSearch}
            style={{ width: 220 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ width: 180 }}
          />
        </div>
        <Button type="primary" danger onClick={() => setAddModalOpen(true)}
          style={{ background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 }}
        >
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
            <Descriptions.Item label="ID">{selectedViewRecord.id}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{selectedViewRecord.title}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{selectedViewRecord.author}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedViewRecord.status}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{selectedViewRecord.createdAt ? new Date(selectedViewRecord.createdAt).toLocaleString('vi-VN') : ''}</Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">{selectedViewRecord.updatedAt ? new Date(selectedViewRecord.updatedAt).toLocaleString('vi-VN') : ''}</Descriptions.Item>
            <Descriptions.Item label="Nội dung">{selectedViewRecord.content}</Descriptions.Item>
            {selectedViewRecord.img && <Descriptions.Item label="Ảnh"><img src={selectedViewRecord.img} alt="Ảnh blog" style={{maxWidth: 200}} /></Descriptions.Item>}
          </Descriptions>
        )}
      </Modal>
      <Modal
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        title={selectedEditRecord ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        onOk={handleSave}
        okText={selectedEditRecord ? 'Lưu' : 'Thêm'}
        okButtonProps={selectedEditRecord ? { style: { background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 } } : {}}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="title" 
            label="Tiêu đề" 
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
              { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
            ]}
          > 
            <Input />
          </Form.Item>
          <Form.Item 
            name="content" 
            label="Nội dung" 
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung!' },
              { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự!' },
              { max: 5000, message: 'Nội dung không được vượt quá 5000 ký tự!' }
            ]}
          > 
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal thêm mới bài viết */}
      <Modal
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
        title="Thêm bài viết mới"
        onOk={handleAddBlog}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#d32f2f', borderColor: '#d32f2f', color: '#fff', fontWeight: 600 } }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item 
            name="title" 
            label="Tiêu đề" 
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
              { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
            ]}
          > 
            <Input />
          </Form.Item>
          <Form.Item 
            name="content" 
            label="Nội dung" 
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung!' },
              { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự!' },
              { max: 5000, message: 'Nội dung không được vượt quá 5000 ký tự!' }
            ]}
          > 
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BlogPage; 