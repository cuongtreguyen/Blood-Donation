// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Table,
//   Card,
//   Button,
//   Tag,
//   Space,
//   Form,
//   Input,
//   Select,
//   Row,
//   Col,
//   DatePicker,
//   Modal,
//   Statistic,
//   Typography,
//   Avatar,
//   Spin,
//   Empty,
//   message,
//   Descriptions,
// } from "antd";
// import {
//   FileTextOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   SearchOutlined,
//   UserOutlined,
//   EditOutlined,
//   PlusOutlined,
//   DownloadOutlined,
//   PrinterOutlined,
// } from "@ant-design/icons";
// import {
//   getHealthCheckList,
//   createHealthCheck,
//   updateHealthCheck,
// } from "../../../services/healthCheckService";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import dayjs from "dayjs";

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

// // --- Helper Functions ---
// const bloodTypeMap = {
//   A_POSITIVE: "A+",
//   A_NEGATIVE: "A-",
//   B_POSITIVE: "B+",
//   B_NEGATIVE: "B-",
//   AB_POSITIVE: "AB+",
//   AB_NEGATIVE: "AB-",
//   O_POSITIVE: "O+",
//   O_NEGATIVE: "O-",
// };

// const displayBloodType = (type) => {
//   const label = bloodTypeMap[type] || type || "N/A";
//   if (label === "N/A") return <Tag>{label}</Tag>;
//   let color = ["O-", "AB-"].includes(label)
//     ? "gold"
//     : label.includes("+")
//     ? "red"
//     : "blue";
//   return <Tag color={color}>{label}</Tag>;
// };

// // --- Main Component ---
// function MedicalRecordsPage() {
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [form] = Form.useForm();

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await getHealthCheckList();
//       // SỬA LẠI Ở ĐÂY: Dữ liệu nằm trong `res.data` theo đúng code gốc của bạn
//       setMedicalRecords(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       message.error("Không thể tải danh sách hồ sơ y tế!");
//       console.error(err);
//       setMedicalRecords([]); // Đảm bảo medicalRecords là mảng rỗng khi có lỗi
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const stats = useMemo(
//     () => ({
//       total: medicalRecords.length,
//       passed: medicalRecords.filter((r) => r.status).length,
//       failed: medicalRecords.filter((r) => !r.status).length,
//     }),
//     [medicalRecords]
//   );

//   const handleOpenEditModal = (record) => {
//     setEditingRecord(record);
//     form.setFieldsValue({
//       ...record,
//       checkDate: record.checkDate ? dayjs(record.checkDate) : null,
//     });
//     setIsModalVisible(true);
//   };

//   const handleOpenCreateModal = () => {
//     setEditingRecord(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };
// const handleOpenViewModal = (record) => {
//     setSelectedRecord(record);
//     setIsViewModalVisible(true);
//   };

//   const handleFormSubmit = async (values) => {
//     const payload = {
//       ...values,
//       checkDate: values.checkDate.format("YYYY-MM-DD"),
//     };
//     try {
//       if (editingRecord) {
//         await updateHealthCheck(editingRecord.id, payload);
//         message.success("Cập nhật hồ sơ thành công!");
//       } else {
//         await createHealthCheck(payload);
//         message.success("Tạo hồ sơ mới thành công!");
//       }
//       setIsModalVisible(false);
//       fetchData();
//     } catch (error) {
//       message.error("Thao tác thất bại. Vui lòng thử lại.");
//     }
//   };

//   const generatePdf = (record) => {
//     const doc = new jsPDF();
//     doc.addFont("Helvetica", "normal");

//     // Header
//     doc.setFontSize(18);
//     doc.text("PHIẾU KẾT QUẢ KHÁM SỨC KHỎE HIẾN MÁU", 105, 22, {
//       align: "center",
//     });
//     doc.setFontSize(12);
//     doc.text(`Mã hồ sơ: ${record.id}`, 105, 30, { align: "center" });
//     doc.setLineWidth(0.5);
//     doc.line(20, 35, 190, 35);

//     // Body with autoTable
//     const tableData = [
//       ["Họ và tên", record.fullName || "N/A"],
//       [
//         "Ngày khám",
//         record.checkDate ? dayjs(record.checkDate).format("DD/MM/YYYY") : "N/A",
//       ],
//       ["Bác sĩ khám", record.staffName || "N/A"],
//       ["ID ĐK hiến máu", record.bloodRegisterId || "N/A"],
//       ["Nhóm máu", bloodTypeMap[record.bloodType] || "N/A"],
//       ["Chiều cao", `${record.height || "N/A"} cm`],
//       ["Cân nặng", `${record.weight || "N/A"} kg`],
//       ["Nhiệt độ", `${record.temperature || "N/A"} °C`],
//       ["Huyết áp", record.bloodPressure || "N/A"],
//       ["Tiền sử bệnh", record.medicalHistory || "Không có"],
//     ];

//     autoTable(doc, {
//       startY: 45,
//       head: [["Thông tin", "Chi tiết"]],
//       body: tableData,
//       theme: "grid",
//       headStyles: { fillColor: [207, 19, 34] },
//     });

//     // Result
//     const finalY = doc.lastAutoTable.finalY;
//     doc.setFontSize(14);
//     doc.text("KẾT LUẬN:", 20, finalY + 15);
//     doc.setFont(undefined, "bold");
//     doc.setTextColor(record.status ? "#28a745" : "#dc3545");
//     doc.text(
//       record.status ? "ĐỦ ĐIỀU KIỆN HIẾN MÁU" : "KHÔNG ĐỦ ĐIỀU KIỆN HIẾN MÁU",
//       20,
//       finalY + 25
//     );
//     if (!record.status) {
//       doc.setFont(undefined, "normal");
//       doc.setTextColor(0, 0, 0);
//       doc.setFontSize(11);
//       doc.text(
//         `Lý do: ${record.reason || "Không có ghi chú"}`,
//         20,
//         finalY + 35
//       );
//     }

//     // Footer
//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text("Bác sĩ ký tên", 150, finalY + 60, { align: "center" });

//     doc.save(`HoSoKham_${record.id}_${record.fullName}.pdf`);
//   };

//   const handlePrint = (record) => {
//     const printWindow = window.open("", "_blank");
//     const content = `
//       <html>
//         <head><title>Hồ sơ ${record.id}</title></head>
// <body style="font-family: Arial, sans-serif; padding: 20px;">
//             <h2 style="text-align: center;">PHIẾU KẾT QUẢ KHÁM SỨC KHỎE HIẾN MÁU</h2>
//             <p><strong>Mã hồ sơ:</strong> ${record.id}</p>
//             <p><strong>Người hiến máu:</strong> ${record.fullName}</p>
//             <p><strong>Ngày khám:</strong> ${dayjs(record.checkDate).format(
//               "DD/MM/YYYY"
//             )}</p>
//             <hr />
//             <h3>Kết quả khám</h3>
//             <p><strong>Nhóm máu:</strong> ${
//               bloodTypeMap[record.bloodType] || "N/A"
//             }</p>
//             <p><strong>Cân nặng / Chiều cao:</strong> ${record.weight}kg / ${
//       record.height
//     }cm</p>
//             <p><strong>Huyết áp:</strong> ${record.bloodPressure}</p>
//             <hr />
//             <h3>Kết luận: <span style="color: ${
//               record.status ? "green" : "red"
//             };">${record.status ? "Đạt" : "Không đạt"}</span></h3>
//             ${
//               !record.status
//                 ? `<p><strong>Lý do:</strong> ${record.reason || "N/A"}</p>`
//                 : ""
//             }
//             <script>
//                 window.onload = function() {
//                     window.print();
//                     window.onafterprint = function() { window.close(); };
//                 }
//             </script>
//         </body>
//       </html>
//     `;
//     printWindow.document.write(content);
//     printWindow.document.close();
//   };

//   const columns = [
//     { title: "Mã HS", dataIndex: "id", key: "id", width: 80 },
//     {
//       title: "Người hiến máu",
//       dataIndex: "fullName",
//       key: "fullName",
//       render: (name) => (
//         <Space>
//           <Avatar icon={<UserOutlined />}>{name?.[0]}</Avatar>
//           <Text>{name}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "Ngày khám",
//       dataIndex: "checkDate",
//       key: "checkDate",
//       render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
//     },
//     {
//       title: "Nhóm máu",
//       dataIndex: "bloodType",
//       key: "bloodType",
//       render: displayBloodType,
//     },
//     { title: "Bác sĩ khám", dataIndex: "staffName", key: "staffName" },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) =>
//         status ? (
//           <Tag icon={<CheckCircleOutlined />} color="success">
//             Đạt
//           </Tag>
//         ) : (
//           <Tag icon={<CloseCircleOutlined />} color="error">
//             Không đạt
//           </Tag>
//         ),
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       fixed: "right",
//       width: 120,
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={(e) => {
//               e.stopPropagation();
//               handleOpenEditModal(record);
//             }}
//           />
//           <Button
//             type="link"
//             icon={<DownloadOutlined />}
// onClick={(e) => {
//               e.stopPropagation();
//               generatePdf(record);
//             }}
//           />
//         </Space>
//       ),
//     },
//   ];

//   const sortedMedicalRecords = medicalRecords.slice().sort((a, b) => new Date(b.checkDate) - new Date(a.checkDate));

//   return (
//     <div style={{ padding: "24px", background: "#f0f2f5" }}>
//       <Card style={{ marginBottom: 24, borderRadius: "8px" }}>
//         <Row align="middle" justify="space-between">
//           <Col>
//             <Space align="center" size="middle">
//               <Avatar
//                 size={64}
//                 icon={<FileTextOutlined />}
//                 style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
//               />
//               <div>
//                 <Title level={2} style={{ margin: 0 }}>
//                   Quản lý Hồ sơ Y tế
//                 </Title>
//                 <Text type="secondary">
//                   Theo dõi, kiểm tra và duyệt hồ sơ khám sức khỏe của người hiến
//                   máu.
//                 </Text>
//               </div>
//             </Space>
//           </Col>
//         </Row>
//       </Card>

//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Tổng số hồ sơ"
//               value={stats.total}
//               prefix={<FileTextOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Hồ sơ đạt"
//               value={stats.passed}
//               valueStyle={{ color: "#3f8600" }}
//               prefix={<CheckCircleOutlined />}
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card>
//             <Statistic
//               title="Hồ sơ không đạt"
//               value={stats.failed}
//               valueStyle={{ color: "#cf1322" }}
//               prefix={<CloseCircleOutlined />}
//             />
//           </Card>
//         </Col>
//       </Row>

//       <Card bordered={false} style={{ borderRadius: "8px" }}>
//         <Row justify="space-between" style={{ marginBottom: 24 }}>
//           <Col>
//             <Space>
//               <Input
//                 placeholder="Tìm theo tên hoặc mã hồ sơ"
//                 prefix={<SearchOutlined />}
//                 style={{ width: 250 }}
//                 allowClear
//               />
//               <Select
//                 defaultValue="all"
//                 style={{ width: 150 }}
//               >
//                 <Option value="all">Tất cả trạng thái</Option>
//                 <Option value="passed">Đạt</Option>
//                 <Option value="failed">Không đạt</Option>
//               </Select>
//               <RangePicker
//                 onChange={(dates) =>
//                   setFilters((f) => ({ ...f, dateRange: dates }))
//                 }
//               />
//             </Space>
//           </Col>
//           <Col>
              
//             <Button
//               type="primary"
// icon={<PlusOutlined />}
//               onClick={handleOpenCreateModal}
//             >
//               Tạo hồ sơ mới
//             </Button>
//           </Col>
//         </Row>

//         <Spin spinning={loading}>
//           <Table
//             columns={columns}
//             dataSource={sortedMedicalRecords}
//             rowKey="id"
//             pagination={{
//               total: medicalRecords.length,
//               pageSize: 10,
//               showSizeChanger: true,
//               showTotal: (total) => `Tổng số ${total} hồ sơ`,
//             }}
//             scroll={{ x: 1200 }}
//             onRow={(record) => ({
//               onClick: () => handleOpenViewModal(record),
//               style: { cursor: "pointer" }
//             })}
//           />
//         </Spin>
//       </Card>

//       <Modal
//         title={
//           editingRecord
//             ? `Sửa hồ sơ #${editingRecord.id}`
//             : "Tạo hồ sơ y tế mới"
//         }
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         width={800}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="fullName"
//                 label="Người hiến máu"
//                 rules={[{ required: true, message: "Vui lòng nhập tên" }]}
//               >
//                 <Input placeholder="Nhập tên người hiến máu" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="bloodType"
//                 label="Nhóm máu"
//                 rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
//               >
//                 <Select
//                   placeholder="Chọn nhóm máu"
//                   options={Object.entries(bloodTypeMap).map(([k, v]) => ({
//                     value: k,
//                     label: v,
//                   }))}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 label="Chiều cao (cm)"
//                 name="height"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="number" placeholder="VD: 170" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 label="Cân nặng (kg)"
//                 name="weight"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="number" placeholder="VD: 65" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 label="Nhiệt độ (°C)"
//                 name="temperature"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="number" step="0.1" placeholder="VD: 36.5" />
//               </Form.Item>
//             </Col>
// </Row>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 label="Huyết áp"
//                 name="bloodPressure"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="VD: 120/80" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item label="Tiền sử bệnh" name="medicalHistory">
//                 <Input placeholder="Nhập tiền sử bệnh (nếu có)" />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 label="Ngày khám"
//                 name="checkDate"
//                 rules={[{ required: true }]}
//               >
//                 <DatePicker
//                   style={{ width: "100%" }}
//                   placeholder="Chọn ngày khám"
//                   format="YYYY-MM-DD"
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 label="Bác sĩ khám"
//                 name="staffName"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Nhập tên bác sĩ khám" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label="ID ĐK hiến máu"
//                 name="bloodRegisterId"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="number" placeholder="VD: 1" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Form.Item
//             label="Trạng thái"
//             name="status"
//             rules={[{ required: true }]}
//           >
//             <Select>
//               <Option value={true}>Đạt</Option>
//               <Option value={false}>Không đạt</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item
//             label="Lý do không đạt"
//             name="reason"
//             rules={[
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (getFieldValue("status") === false && !value) {
//                     return Promise.reject("Vui lòng nhập lý do nếu không đạt!");
//                   }
//                   return Promise.resolve();
//                 },
//               }),
//             ]}
//           >
//             <Input.TextArea
//               rows={2}
//               placeholder="Nhập lý do nếu trạng thái là 'Không đạt'"
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Lưu
//             </Button>
//             <Button
//               htmlType="button"
//               onClick={() => form.resetFields()}
//               style={{ marginLeft: 8 }}
//             >
//               Làm mới
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         title={
// <Title level={4}>Chi tiết hồ sơ y tế #{selectedRecord?.id}</Title>
//         }
//         open={isViewModalVisible}
//         onCancel={() => setIsViewModalVisible(false)}
//         footer={[
//           <Button
//             key="print"
//             icon={<PrinterOutlined />}
//             onClick={() => handlePrint(selectedRecord)}
//           >
//             In
//           </Button>,
//           <Button
//             key="download"
//             type="primary"
//             icon={<DownloadOutlined />}
//             onClick={() => generatePdf(selectedRecord)}
//           >
//             Tải PDF
//           </Button>,
//         ]}
//         width={800}
//       >
//         {selectedRecord && (
//           <Descriptions bordered column={2} size="small">
//             <Descriptions.Item label="Họ tên">
//               {selectedRecord.fullName}
//             </Descriptions.Item>
//             <Descriptions.Item label="Ngày khám">
//               {dayjs(selectedRecord.checkDate).format("DD/MM/YYYY")}
//             </Descriptions.Item>
//             <Descriptions.Item label="ID Đăng ký">
//               {selectedRecord.bloodRegisterId}
//             </Descriptions.Item>
//             <Descriptions.Item label="Bác sĩ khám">
//               {selectedRecord.staffName}
//             </Descriptions.Item>
//             <Descriptions.Item label="Trạng thái" span={2}>
//               {selectedRecord.status ? (
//                 <Tag icon={<CheckCircleOutlined />} color="success">
//                   ĐỦ ĐIỀU KIỆN HIẾN MÁU
//                 </Tag>
//               ) : (
//                 <Tag icon={<CloseCircleOutlined />} color="error">
//                   KHÔNG ĐỦ ĐIỀU KIỆN
//                 </Tag>
//               )}
//             </Descriptions.Item>
//             {!selectedRecord.status && (
//               <Descriptions.Item label="Lý do" span={2}>
//                 {selectedRecord.reason || "Không có ghi chú"}
//               </Descriptions.Item>
//             )}
//             <Descriptions.Item label="Nhóm máu">
//               {displayBloodType(selectedRecord.bloodType)}
//             </Descriptions.Item>
//             <Descriptions.Item label="Huyết áp">
//               {selectedRecord.bloodPressure}
//             </Descriptions.Item>
//             <Descriptions.Item label="Chiều cao">
//               {selectedRecord.height} cm
//             </Descriptions.Item>
//             <Descriptions.Item label="Cân nặng">
//               {selectedRecord.weight} kg
//             </Descriptions.Item>
//             <Descriptions.Item label="Nhiệt độ">
//               {selectedRecord.temperature} °C
//             </Descriptions.Item>
//             <Descriptions.Item label="Tiền sử bệnh">
//               {selectedRecord.medicalHistory || "Không có"}
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default MedicalRecordsPage;




import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Modal,
  Statistic,
  Typography,
  Avatar,
  Spin,
  Empty,
  message,
  Descriptions,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  getHealthCheckList,
  createHealthCheck,
  updateHealthCheck,
} from "../../../services/healthCheckService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// --- Helper Functions ---
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
  const label = bloodTypeMap[type] || type || "N/A";
  if (label === "N/A") return <Tag>{label}</Tag>;
  let color = ["O-", "AB-"].includes(label)
    ? "gold"
    : label.includes("+")
    ? "red"
    : "blue";
  return <Tag color={color}>{label}</Tag>;
};

// --- Main Component ---
function MedicalRecordsPage() {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getHealthCheckList();
      setMedicalRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error("Không thể tải danh sách hồ sơ y tế!");
      console.error(err);
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(
    () => ({
      total: medicalRecords.length,
      passed: medicalRecords.filter((r) => r.status).length,
      failed: medicalRecords.filter((r) => !r.status).length,
    }),
    [medicalRecords]
  );

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      checkDate: record.checkDate ? dayjs(record.checkDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      checkDate: values.checkDate.format("YYYY-MM-DD"),
    };
    try {
      if (editingRecord) {
        await updateHealthCheck(editingRecord.id, payload);
        message.success("Cập nhật hồ sơ thành công!");
      } else {
        await createHealthCheck(payload);
        message.success("Tạo hồ sơ mới thành công!");
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      message.error("Thao tác thất bại. Vui lòng thử lại.");
    }
  };

  const generatePdf = (record) => {
    const doc = new jsPDF();
    doc.addFont("Helvetica", "normal");

    // Header
    doc.setFontSize(18);
    doc.text("PHIẾU KẾT QUẢ KHÁM SỨC KHỎE HIẾN MÁU", 105, 22, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text(`Mã hồ sơ: ${record.id}`, 105, 30, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Body with autoTable
    const tableData = [
      ["Họ và tên", record.fullName || "N/A"],
      [
        "Ngày khám",
        record.checkDate ? dayjs(record.checkDate).format("DD/MM/YYYY") : "N/A",
      ],
      ["Bác sĩ khám", record.staffName || "N/A"],
      ["ID ĐK hiến máu", record.bloodRegisterId || "N/A"],
      ["Nhóm máu", bloodTypeMap[record.bloodType] || "N/A"],
      ["Chiều cao", `${record.height || "N/A"} cm`],
      ["Cân nặng", `${record.weight || "N/A"} kg`],
      ["Nhiệt độ", `${record.temperature || "N/A"} °C`],
      ["Huyết áp", record.bloodPressure || "N/A"],
      ["Tiền sử bệnh", record.medicalHistory || "Không có"],
    ];

    autoTable(doc, {
      startY: 45,
      head: [["Thông tin", "Chi tiết"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [207, 19, 34] },
    });

    // Result
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text("KẾT LUẬN:", 20, finalY + 15);
    doc.setFont(undefined, "bold");
    doc.setTextColor(record.status ? "#28a745" : "#dc3545");
    doc.text(
      record.status ? "ĐỦ ĐIỀU KIỆN HIẾN MÁU" : "KHÔNG ĐỦ ĐIỀU KIỆN HIẾN MÁU",
      20,
      finalY + 25
    );
    if (!record.status) {
      doc.setFont(undefined, "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(
        `Lý do: ${record.reason || "Không có ghi chú"}`,
        20,
        finalY + 35
      );
    }

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Bác sĩ ký tên", 150, finalY + 60, { align: "center" });

    doc.save(`HoSoKham_${record.id}_${record.fullName}.pdf`);
  };

  const handlePrint = (record) => {
    const printWindow = window.open("", "_blank");
    const content = `
      <html>
        <head><title>Hồ sơ ${record.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="text-align: center;">PHIẾU KẾT QUẢ KHÁM SỨC KHỎE HIẾN MÁU</h2>
          <p><strong>Mã hồ sơ:</strong> ${record.id}</p>
          <p><strong>Người hiến máu:</strong> ${record.fullName}</p>
          <p><strong>Ngày khám:</strong> ${dayjs(record.checkDate).format("DD/MM/YYYY")}</p>
          <hr />
          <h3>Kết quả khám</h3>
          <p><strong>Nhóm máu:</strong> ${bloodTypeMap[record.bloodType] || "N/A"}</p>
          <p><strong>Cân nặng / Chiều cao:</strong> ${record.weight}kg / ${record.height}cm</p>
          <p><strong>Huyết áp:</strong> ${record.bloodPressure}</p>
          <hr />
          <h3>Kết luận: <span style="color: ${record.status ? "green" : "red"};">${record.status ? "Đạt" : "Không đạt"}</span></h3>
          ${!record.status ? `<p><strong>Lý do:</strong> ${record.reason || "N/A"}</p>` : ""}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const columns = [
    { title: "Mã HS", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Người hiến máu",
      dataIndex: "fullName",
      key: "fullName",
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />}>{name?.[0]}</Avatar>
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "checkDate",
      key: "checkDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: displayBloodType,
    },
    { title: "Bác sĩ khám", dataIndex: "staffName", key: "staffName" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đạt
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Không đạt
          </Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(record);
            }}
          />
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              generatePdf(record);
            }}
          />
        </Space>
      ),
    },
  ];

  const sortedMedicalRecords = medicalRecords.slice().sort((a, b) => new Date(b.checkDate) - new Date(a.checkDate));

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Card style={{ marginBottom: 24, borderRadius: "8px" }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center" size="middle">
              <Avatar
                size={64}
                icon={<FileTextOutlined />}
                style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Quản lý Hồ sơ Y tế
                </Title>
                <Text type="secondary">
                  Theo dõi, kiểm tra và duyệt hồ sơ khám sức khỏe của người hiến máu.
                </Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số hồ sơ"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Hồ sơ đạt"
              value={stats.passed}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Hồ sơ không đạt"
              value={stats.failed}
              valueStyle={{ color: "#cf1322" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: "8px" }}>
        <Row justify="space-between" style={{ marginBottom: 24 }}>
          <Col>
            <Space>
              <Input
                placeholder="Tìm theo tên hoặc mã hồ sơ"
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                allowClear
              />
              <Select
                defaultValue="all"
                style={{ width: 150 }}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="passed">Đạt</Option>
                <Option value="failed">Không đạt</Option>
              </Select>
              <RangePicker
                onChange={(dates) => {
                  // Handle date range change if needed
                  console.log('Date range changed:', dates);
                }}
              />
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
            >
              Tạo hồ sơ mới
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={sortedMedicalRecords}
            rowKey="id"
            pagination={{
              total: medicalRecords.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} hồ sơ`,
            }}
            scroll={{ x: 1200 }}
            onRow={(record) => ({
              onClick: () => handleOpenViewModal(record),
              style: { cursor: "pointer" }
            })}
          />
        </Spin>
      </Card>

      <Modal
        title={
          editingRecord
            ? `Sửa hồ sơ #${editingRecord.id}`
            : "Tạo hồ sơ y tế mới"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Người hiến máu"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Nhập tên người hiến máu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bloodType"
                label="Nhóm máu"
                rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
              >
                <Select
                  placeholder="Chọn nhóm máu"
                  options={Object.entries(bloodTypeMap).map(([k, v]) => ({
                    value: k,
                    label: v,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Chiều cao (cm)"
                name="height"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="VD: 170" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Cân nặng (kg)"
                name="weight"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="VD: 65" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Nhiệt độ (°C)"
                name="temperature"
                rules={[{ required: true }]}
              >
                <Input type="number" step="0.1" placeholder="VD: 36.5" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Huyết áp"
                name="bloodPressure"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: 120/80" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tiền sử bệnh" name="medicalHistory">
                <Input placeholder="Nhập tiền sử bệnh (nếu có)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày khám"
                name="checkDate"
                rules={[{ required: true }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày khám"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bác sĩ khám"
                name="staffName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập tên bác sĩ khám" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ID ĐK hiến máu"
                name="bloodRegisterId"
                rules={[{ required: true }]}
              >
                <Input type="number" placeholder="VD: 1" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value={true}>Đạt</Option>
              <Option value={false}>Không đạt</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Lý do không đạt"
            name="reason"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue("status") === false && !value) {
                    return Promise.reject("Vui lòng nhập lý do nếu không đạt!");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập lý do nếu trạng thái là 'Không đạt'"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button
              htmlType="button"
              onClick={() => form.resetFields()}
              style={{ marginLeft: 8 }}
            >
              Làm mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <Title level={4}>Chi tiết hồ sơ y tế #{selectedRecord?.id}</Title>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button
            key="print"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(selectedRecord)}
          >
            In
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => generatePdf(selectedRecord)}
          >
            Tải PDF
          </Button>,
        ]}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Họ tên">
              {selectedRecord.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khám">
              {dayjs(selectedRecord.checkDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="ID Đăng ký">
              {selectedRecord.bloodRegisterId}
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ khám">
              {selectedRecord.staffName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              {selectedRecord.status ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  ĐỦ ĐIỀU KIỆN HIẾN MÁU
                </Tag>
              ) : (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  KHÔNG ĐỦ ĐIỀU KIỆN
                </Tag>
              )}
            </Descriptions.Item>
            {!selectedRecord.status && (
              <Descriptions.Item label="Lý do" span={2}>
                {selectedRecord.reason || "Không có ghi chú"}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Nhóm máu">
              {displayBloodType(selectedRecord.bloodType)}
            </Descriptions.Item>
            <Descriptions.Item label="Huyết áp">
              {selectedRecord.bloodPressure}
            </Descriptions.Item>
            <Descriptions.Item label="Chiều cao">
              {selectedRecord.height} cm
            </Descriptions.Item>
            <Descriptions.Item label="Cân nặng">
              {selectedRecord.weight} kg
            </Descriptions.Item>
            <Descriptions.Item label="Nhiệt độ">
              {selectedRecord.temperature} °C
            </Descriptions.Item>
            <Descriptions.Item label="Tiền sử bệnh">
              {selectedRecord.medicalHistory || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default MedicalRecordsPage;