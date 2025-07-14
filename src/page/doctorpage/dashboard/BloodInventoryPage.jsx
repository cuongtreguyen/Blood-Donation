// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Row,
//   Col,
//   Statistic,
//   Tag,
//   Space,
//   message,
//   Spin,
//   DatePicker,
//   Popconfirm,
// } from "antd";
// import {
//   PlusOutlined,
//   EditOutlined,
//   WarningOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import {
//   getBloodInventoryById,
//   getAllBloodInventory,
//   createBloodInventory,
//   updateBloodInventory,
//   deleteBloodInventory,
// } from "../../../services/bloodInventoryService";

// const { Option } = Select;

// const BloodInventoryPage = () => {
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [form] = Form.useForm();
//   const [loadingDelete, setLoadingDelete] = useState(false);

//   // Lấy cài đặt ngưỡng cảnh báo từ localStorage
//   const systemSettings = JSON.parse(
//     localStorage.getItem("systemSettings") || "{}"
//   );
//   const lowThreshold =
//     systemSettings?.notificationSettings?.lowBloodStockThreshold || 20;

//   // Thêm state cho tìm kiếm & lọc
//   const [searchText, setSearchText] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const fetchInventory = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getAllBloodInventory();
//       const updatedInventory = data.map((item) => ({
//         id: item.inventoryId, // Sử dụng đúng trường id từ backend
//         bloodType: item.bloodType,
//         totalUnitsAvailable: item.unitsAvailable,
//         backendStatus: item.status, // lấy status gốc từ backend
//         status: getStatus(item.unitsAvailable), // status để hiển thị màu
//       }));
//       setInventory(updatedInventory);
//     } catch (err) {
//       setError("Không thể tải dữ liệu kho máu.");
//       message.error("Không thể tải dữ liệu kho máu.");
//       console.error("Error fetching all blood inventory:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []); // Tải dữ liệu khi component mount

//   // Cập nhật trạng thái dựa trên ngưỡng khi inventory hoặc lowThreshold thay đổi
//   useEffect(() => {
//     if (inventory.length > 0) {
//       const updatedInventory = inventory.map((item) => ({
//         ...item,
//         status: getStatus(item.totalUnitsAvailable),
//       }));
//       setInventory(updatedInventory);
//     }
//   }, [lowThreshold]);

//   const getStatus = (quantity) => {
//     if (quantity <= lowThreshold / 2) return "critical";
//     if (quantity <= lowThreshold) return "low";
//     return "normal";
//   };

//   const getStatusTag = (status) => {
//     switch (status) {
//       case "critical":
//         return <Tag color="red">Cực kỳ thấp</Tag>;
//       case "low":
//         return <Tag color="orange">Sắp hết</Tag>;
//       default:
//         return <Tag color="green">Đủ dùng</Tag>;
//     }
//   };

//   const handleEdit = async (record) => {
//     if (!record.id) {
//       // Nếu không có id, chỉ mở modal với dữ liệu hiện tại để test UI
//       setEditingRecord(record);
//       form.setFieldsValue({
//         ...record,
//         type: record.bloodType,
//         unitsAvailable: record.totalUnitsAvailable,
//       });
//       setIsModalVisible(true);
//       return;
//     }
//     // Nếu có id, gọi API như cũ
//     try {
//       const fetchedRecord = await getBloodInventoryById(record.id);
//       setEditingRecord(fetchedRecord);
//       form.setFieldsValue({
//         ...fetchedRecord,
//         type: fetchedRecord.bloodType,
//         unitsAvailable: fetchedRecord.unitsAvailable,
//       });
//       setIsModalVisible(true);
//     } catch (error) {
//       message.error("Không thể tải thông tin kho máu. Vui lòng thử lại.");
//       console.error("Failed to fetch blood inventory for edit:", error);
//     }
//   };

//   const handleAdd = () => {
//     setEditingRecord(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const handleSubmit = async (values) => {
//     try {
//       const commonData = {
//         bloodType: values.type,
//         unitsAvailable: values.unitsAvailable,
//         expirationDate: values.expirationDate ? values.expirationDate.toISOString() : null, // Thêm kiểm tra null
//       };
//       if (editingRecord && editingRecord.id) {
//         await updateBloodInventory(editingRecord.id, commonData);
//         message.success("Cập nhật kho máu thành công!");
//       } else {
//         await createBloodInventory(commonData);
//         message.success("Thêm nhóm máu mới thành công!");
//       }
//       fetchInventory();
//       setIsModalVisible(false);
//       form.resetFields();
//     } catch (error) {
//       message.error("Có lỗi xảy ra khi thực hiện thao tác. Vui lòng thử lại.");
//       console.error("Error in handleSubmit:", error);
//     }
//   };

//   const handleDelete = async (record) => {
//     setLoadingDelete(true);
//     try {
//       await deleteBloodInventory(record.id);
//       message.success(`Đã xóa nhóm máu ${record.bloodType}`);
//       await fetchInventory();
//     } catch (error) {
//       message.error("Có lỗi xảy ra khi xóa kho máu. Vui lòng thử lại.");
//       console.error("Error deleting blood inventory:", error);
//     } finally {
//       setLoadingDelete(false);
//     }
//   };

//   // Tính toán thống kê
//   const totalUnits = inventory.reduce(
//     (sum, item) => sum + item.totalUnitsAvailable,
//     0
//   );
//   const criticalTypes = inventory.filter(
//     (item) => item.status === "critical"
//   ).length;
//   const lowTypes = inventory.filter((item) => item.status === "low").length;

//   // Lọc dữ liệu inventory
//   const filteredInventory = inventory.filter((item) => {
//     // Ẩn các bản ghi đã bị xóa từ backend
//     if (item.backendStatus && item.backendStatus.toUpperCase() === "DELETED") return false;
//     const matchSearch = item.bloodType
//       .toLowerCase()
//       .includes(searchText.toLowerCase());
//     const matchStatus =
//       filterStatus === "all" ? true : item.status === filterStatus;
//     return matchSearch && matchStatus;
//   });

//   const bloodTypeMap = {
//     A_POSITIVE: 'A+',
//     A_NEGATIVE: 'A-',
//     B_POSITIVE: 'B+',
//     B_NEGATIVE: 'B-',
//     AB_POSITIVE: 'AB+',
//     AB_NEGATIVE: 'AB-',
//     O_POSITIVE: 'O+',
//     O_NEGATIVE: 'O-',
//   };
//   const displayBloodType = (type) => {
//     const label = bloodTypeMap[type] || type || '-';
//     if (label === '-') return label;
//     let color = 'default';
//     if (['A+', 'B+', 'O+', 'AB+'].includes(label)) color = 'red';
//     else if (['A-', 'B-', 'O-', 'AB-'].includes(label)) color = 'blue';
//     if (['O-', 'AB-'].includes(label)) color = 'gold';
//     return <Tag color={color}>{label}</Tag>;
//   };

//   const columns = [
//     {
//       title: "Nhóm máu",
//       dataIndex: "bloodType",
//       key: "bloodType",
//       render: displayBloodType,
//     },
//     {
//       title: "Số lượng (đơn vị)",
//       dataIndex: "totalUnitsAvailable",
//       key: "totalUnitsAvailable",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => getStatusTag(status),
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//           >
//             Sửa
//           </Button>
//           <Popconfirm
//             title="Bạn có chắc chắn muốn xóa nhóm máu này không?"
//             onConfirm={() => handleDelete(record)}
//             okText="Xóa"
//             cancelText="Hủy"
//             okButtonProps={{ danger: true }}
//           >
//             <Button danger icon={<DeleteOutlined />} disabled={loadingDelete || !record.id || typeof record.id !== 'number' || record.id <= 0} loading={loadingDelete}>
//               Xóa
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   if (loading && inventory.length === 0) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100%",
//         }}
//       >
//         <Spin size="large" tip="Đang tải dữ liệu kho máu..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
//         <p>{error}</p>
//         <Button onClick={fetchInventory}>Thử lại</Button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Quản lý kho máu</h1>

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col>
//           <Input
//             placeholder="Tìm kiếm nhóm máu..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//             style={{ width: 200 }}
//           />
//         </Col>
//         <Col>
//           <Select
//             value={filterStatus}
//             onChange={(value) => setFilterStatus(value)}
//             style={{ width: 180 }}
//           >
//             <Option value="all">Tất cả trạng thái</Option>
//             <Option value="normal">Đủ dùng</Option>
//             <Option value="low">Sắp hết</Option>
//             <Option value="critical">Cực kỳ thấp</Option>
//           </Select>
//         </Col>
//       </Row>

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={6}>
//           <Card>
//             <Statistic
//               title="Tổng số đơn vị máu"
//               value={totalUnits}
//               suffix="đơn vị"
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card>
//             <Statistic
//               title="Nhóm máu cực kỳ thấp"
//               value={criticalTypes}
//               valueStyle={{ color: "#cf1322" }}
//               suffix="nhóm"
//               prefix={<WarningOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card>
//             <Statistic
//               title="Nhóm máu sắp hết"
//               value={lowTypes}
//               valueStyle={{ color: "#faad14" }}
//               suffix="nhóm"
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card>
//             <Statistic
//               title="Ngưỡng cảnh báo"
//               value={lowThreshold}
//               suffix="đơn vị"
//             />
//           </Card>
//         </Col>
//       </Row>

//       <Card
//         title="Kho máu"
//         extra={
//           <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
//             Thêm mới
//           </Button>
//         }
//       >
//         <Table
//           columns={columns}
//           dataSource={filteredInventory}
//           rowKey="id"
//           loading={loading}
//         />
//       </Card>

//       <Modal
//         title={editingRecord ? "Cập nhật số lượng máu" : "Thêm nhóm máu mới"}
//         visible={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//         }}
//         onOk={form.submit}
//       >
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             name="type"
//             label="Nhóm máu"
//             rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
//           >
//             <Select disabled={!!editingRecord}>
//               <Option value="A_POSITIVE">A+</Option>
//               <Option value="A_NEGATIVE">A-</Option>
//               <Option value="B_POSITIVE">B+</Option>
//               <Option value="B_NEGATIVE">B-</Option>
//               <Option value="O_POSITIVE">O+</Option>
//               <Option value="O_NEGATIVE">O-</Option>
//               <Option value="AB_POSITIVE">AB+</Option>
//               <Option value="AB_NEGATIVE">AB-</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             name="unitsAvailable"
//             label="Số lượng (đơn vị)"
//             rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
//           >
//             <InputNumber min={0} step={1} style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item
//             name="expirationDate"
//             label="Ngày hết hạn"
//             rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
//           >
//             <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default BloodInventoryPage;
import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Spin,
  DatePicker,
  Popconfirm,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  WarningOutlined,
  DeleteOutlined,
  HeartFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import {
  getBloodInventoryById,
  getAllBloodInventory,
  createBloodInventory,
  updateBloodInventory,
  deleteBloodInventory,
} from "../../../services/bloodInventoryService";
import moment from "moment"; // Cần import moment để xử lý ngày tháng

const { Option } = Select;

// Một hình ảnh minh họa đẹp
const bloodDonationImageUrl =
  "https://www.redcross.org/content/dam/redcross/about-us/news/2020/blood-donors-needed-2-2020-1200x630.jpg";

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const systemSettings = JSON.parse(
    localStorage.getItem("systemSettings") || "{}"
  );
  const lowThreshold =
    systemSettings?.notificationSettings?.lowBloodStockThreshold || 20;

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBloodInventory();
      const updatedInventory = data.map((item) => ({
        id: item.inventoryId,
        bloodType: item.bloodType,
        totalUnitsAvailable: item.unitsAvailable,
        backendStatus: item.status,
        status: getStatus(item.unitsAvailable),
        expirationDate: item.expirationDate
          ? moment(item.expirationDate)
          : null,
      }));
      setInventory(updatedInventory);
    } catch (err) {
      setError("Không thể tải dữ liệu kho máu.");
      message.error("Không thể tải dữ liệu kho máu.");
      console.error("Error fetching all blood inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (inventory.length > 0) {
      const updatedInventory = inventory.map((item) => ({
        ...item,
        status: getStatus(item.totalUnitsAvailable),
      }));
      setInventory(updatedInventory);
    }
  }, [lowThreshold]);

  const getStatus = (quantity) => {
    if (quantity === 0) return "critical";
    if (quantity <= lowThreshold / 2) return "critical";
    if (quantity <= lowThreshold) return "low";
    return "normal";
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "critical":
        return <Tag color="#f5222d">Cực kỳ thấp</Tag>;
      case "low":
        return <Tag color="#faad14">Sắp hết</Tag>;
      default:
        return <Tag color="#52c41a">Đủ dùng</Tag>;
    }
  };

  const handleEdit = async (record) => {
    try {
      // Dùng dữ liệu đã có để modal hiện lên nhanh hơn, sau đó fetch lại nếu cần
      setEditingRecord(record);
      form.setFieldsValue({
        ...record,
        type: record.bloodType,
        unitsAvailable: record.totalUnitsAvailable,
        expirationDate: record.expirationDate
          ? moment(record.expirationDate)
          : null,
      });
      setIsModalVisible(true);

      // Fetch dữ liệu mới nhất từ server
      const fetchedRecord = await getBloodInventoryById(record.id);
      setEditingRecord(fetchedRecord);
      form.setFieldsValue({
        ...fetchedRecord,
        type: fetchedRecord.bloodType,
        unitsAvailable: fetchedRecord.unitsAvailable,
        expirationDate: fetchedRecord.expirationDate
          ? moment(fetchedRecord.expirationDate)
          : null,
      });
    } catch (error) {
      message.error("Không thể tải thông tin chi tiết. Vui lòng thử lại.");
      console.error("Failed to fetch blood inventory for edit:", error);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const commonData = {
        bloodType: values.type,
        unitsAvailable: values.unitsAvailable,
        expirationDate: values.expirationDate
          ? values.expirationDate.toISOString()
          : null,
      };
      if (editingRecord && editingRecord.id) {
        await updateBloodInventory(editingRecord.id, commonData);
        message.success("Cập nhật kho máu thành công!");
      } else {
        await createBloodInventory(commonData);
        message.success("Thêm nhóm máu mới thành công!");
      }
      fetchInventory();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Thao tác thất bại. Vui lòng thử lại.");
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleDelete = async (record) => {
    setLoadingDelete(true);
    try {
      await deleteBloodInventory(record.id);
      message.success(`Đã xóa nhóm máu ${record.bloodType}`);
      await fetchInventory();
    } catch (error) {
      message.error("Xóa thất bại. Vui lòng thử lại.");
      console.error("Error deleting blood inventory:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const totalUnits = inventory.reduce(
    (sum, item) => sum + item.totalUnitsAvailable,
    0
  );
  const criticalTypes = inventory.filter(
    (item) => item.status === "critical"
  ).length;
  const lowTypes = inventory.filter((item) => item.status === "low").length;

  const filteredInventory = inventory.filter((item) => {
    if (item.backendStatus && item.backendStatus.toUpperCase() === "DELETED")
      return false;
    const matchSearch = item.bloodType
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const bloodTypeMap = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };

  const displayBloodType = (type) => {
    const label = bloodTypeMap[type] || type || "-";
    if (label === "-") return label;
    let color = "#1890ff"; // Default blue
    if (["A+", "B+", "O+", "AB+"].includes(label)) color = "#cf1322"; // Red for Rh+
    if (["O-", "AB-"].includes(label)) color = "#d4af37"; // Gold for universal donor/recipient
    return <Tag color={color}>{label}</Tag>;
  };

  const chartData = filteredInventory.map((item) => ({
    type: bloodTypeMap[item.bloodType] || item.bloodType,
    value: item.totalUnitsAvailable,
    status: item.status,
  }));

  const chartConfig = {
    data: chartData,
    xField: "type",
    yField: "value",
    seriesField: "status",
    color: ({ status }) => {
      if (status === "critical") return "#f5222d";
      if (status === "low") return "#faad14";
      return "#52c41a";
    },
    label: {
      position: "top",
      content: (originData) => originData.value,
      style: { fill: "#666" },
    },
    xAxis: { title: { text: "Nhóm máu" } },
    yAxis: { title: { text: "Số lượng (đơn vị)" } },
    legend: {
      position: "top-right",
      itemName: {
        formatter: (text) => {
          if (text === "critical") return "Cực kỳ thấp";
          if (text === "low") return "Sắp hết";
          return "Đủ dùng";
        },
      },
    },
  };

  const columns = [
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: displayBloodType,
      sorter: (a, b) => a.bloodType.localeCompare(b.bloodType),
    },
    {
      title: "Số lượng (đơn vị)",
      dataIndex: "totalUnitsAvailable",
      key: "totalUnitsAvailable",
      sorter: (a, b) => a.totalUnitsAvailable - b.totalUnitsAvailable,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (date) => (date ? date.format("DD/MM/YYYY") : "N/A"),
      sorter: (a, b) => a.expirationDate - b.expirationDate,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Đủ dùng", value: "normal" },
        { text: "Sắp hết", value: "low" },
        { text: "Cực kỳ thấp", value: "critical" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} loading={loadingDelete} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && inventory.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu kho máu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <WarningOutlined style={{ fontSize: "48px", color: "red" }} />
        <h2 style={{ color: "red", marginTop: "20px" }}>{error}</h2>
        <p>Đã có lỗi xảy ra trong quá trình kết nối đến máy chủ.</p>
        <Button type="primary" onClick={fetchInventory}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              borderRadius: "8px",
            }}
          >
            <Row align="middle" justify="space-between">
              <Col>
                <Space align="center">
                  <Avatar
                    size={48}
                    icon={<HeartFilled style={{ color: "#cf1322" }} />}
                    style={{ backgroundColor: "#fff1f0" }}
                  />
                  <div>
                    <h1 style={{ margin: 0, fontSize: "24px" }}>
                      Quản lý Kho máu
                    </h1>
                    <p style={{ margin: 0, color: "#8c8c8c" }}>
                      Tổng quan và quản lý số lượng máu dự trữ.
                    </p>
                  </div>
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                >
                  Thêm mới
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            style={{
              backgroundImage: `url(${bloodDonationImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              borderRadius: "8px",
            }}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Tổng số đơn vị máu"
              value={totalUnits}
              suffix="đơn vị"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Nhóm máu cực kỳ thấp"
              value={criticalTypes}
              valueStyle={{ color: "#f5222d" }}
              prefix={<WarningOutlined />}
              suffix="nhóm"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Nhóm máu sắp hết"
              value={lowTypes}
              valueStyle={{ color: "#faad14" }}
              suffix="nhóm"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              borderRadius: "8px",
            }}
          >
            <Statistic
              title="Ngưỡng cảnh báo"
              value={lowThreshold}
              suffix="đơn vị"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Biểu đồ tổng quan kho máu"
        style={{
          marginTop: 24,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
          borderRadius: "8px",
        }}
      >
        <Column {...chartConfig} height={300} />
      </Card>

      <Card
        style={{
          marginTop: 24,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
          borderRadius: "8px",
        }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              placeholder="Tìm kiếm theo nhóm máu (ví dụ: A+)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="normal">Đủ dùng</Option>
              <Option value="low">Sắp hết</Option>
              <Option value="critical">Cực kỳ thấp</Option>
            </Select>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredInventory}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingRecord ? "Cập nhật thông tin máu" : "Thêm đơn vị máu mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={form.submit}
        okText={editingRecord ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="type"
            label="Nhóm máu"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          >
            <Select placeholder="Chọn nhóm máu" disabled={!!editingRecord}>
              <Option value="A_POSITIVE">A+</Option>{" "}
              <Option value="A_NEGATIVE">A-</Option>
              <Option value="B_POSITIVE">B+</Option>{" "}
              <Option value="B_NEGATIVE">B-</Option>
              <Option value="O_POSITIVE">O+</Option>{" "}
              <Option value="O_NEGATIVE">O-</Option>
              <Option value="AB_POSITIVE">AB+</Option>{" "}
              <Option value="AB_NEGATIVE">AB-</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="unitsAvailable"
            label="Số lượng (đơn vị)"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập số lượng đơn vị máu"
            />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Ngày hết hạn"
            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodInventoryPage;
