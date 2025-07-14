// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Tag,
//   Button,
//   Space,
//   Segmented,
//   message,
//   Spin,
//   Typography,
//   Input,
//   Modal,
//   Form,
//   DatePicker,
//   TimePicker,
//   Checkbox,
//   Select,
// } from "antd";
// import {
//   getBloodReceiveByStatus,
//   createBloodReceive,
// } from "../../../services/bloodReceiveService";

// const { Title } = Typography;

// const statusOptions = [
//   { label: "Tất cả", value: "ALL" },
//   { label: "Chờ duyệt", value: "PENDING" },
//   { label: "Đã duyệt", value: "APPROVED" },
//   { label: "Hoàn thành", value: "COMPLETED" },
//   { label: "Từ chối", value: "REJECTED" },
//   { label: "Chưa hoàn thành", value: "INCOMPLETED" },
//   { label: "Đã hủy", value: "CANCELED" },
// ];

// const statusColors = {
//   APPROVED: "blue",
//   COMPLETED: "green",
//   REJECTED: "red",
//   PENDING: "orange",
//   INCOMPLETED: "gray",
// };

// const BloodReceivePage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("PENDING");
//   const [searchText, setSearchText] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const allStatuses = [
//           "PENDING",
//           "APPROVED",
//           "REJECTED",
//           "COMPLETED",
//           "INCOMPLETED",
//           "CANCELED",
//         ];
//         const statusArr = status === "ALL" ? allStatuses : [status];
//         const res = await getBloodReceiveByStatus(statusArr);
//         setData(res);
//       } catch {
//         message.error("Không thể tải danh sách nhận máu!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [status]);

//   let filteredData = data;
//   if (searchText) {
//     filteredData = filteredData.filter(
//       (item) =>
//         (item.bloodType &&
//           item.bloodType.toLowerCase().includes(searchText.toLowerCase())) ||
//         (item.address &&
//           item.address.toLowerCase().includes(searchText.toLowerCase()))
//     );
//   }

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//       width: 80,
//       render: (id) => <b>{id}</b>,
//     },
//     {
//       title: "Nhóm máu",
//       dataIndex: "bloodType",
//       key: "bloodType",
//       render: (bloodType) => (
//         <Tag color="magenta">{bloodType || "Chưa xác định"}</Tag>
//       ),
//     },
//     { title: "Số lượng", dataIndex: "unit", key: "unit" },
//     {
//       title: "Giờ",
//       dataIndex: "wantedHour",
//       key: "wantedHour",
//       render: (hour) =>
//         hour
//           ? typeof hour === "string"
//             ? hour
//             : `${hour.hour}:${hour.minute}`
//           : "",
//     },
//     {
//       title: "Ngày nhận",
//       dataIndex: "wantedDate",
//       key: "wantedDate",
//       render: (date) =>
//         date ? new Date(date).toLocaleDateString("vi-VN") : "",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
//     },
//     { title: "Thao tác", key: "action", render: () => null },
//   ];

//   return (
//     <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
//       <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
//         Danh sách đăng ký nhận máu
//       </Title>
//       <Space
//         style={{
//           width: "100%",
//           justifyContent: "space-between",
//           marginBottom: 16,
//         }}
//       >
//         <Segmented
//           options={statusOptions}
//           value={status}
//           onChange={setStatus}
//           style={{ background: "#f5f5f5" }}
//         />
//         <Input
//           placeholder="Tìm kiếm nhóm máu, địa chỉ..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ minWidth: 200 }}
//         />
//       </Space>

//       {loading ? (
//         <div style={{ padding: 48, textAlign: "center" }}>
//           <Spin size="large" tip="Đang tải..." />
//         </div>
//       ) : (
//         <Table
//           columns={columns}
//           dataSource={filteredData}
//           rowKey="id"
//           pagination={{ pageSize: 8, showSizeChanger: false }}
//           bordered
//           size="middle"
//           style={{ borderRadius: 12 }}
//         />
//       )}
//     </div>
//   );
// };

// export default BloodReceivePage;
import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Segmented,
  message,
  Spin,
  Typography,
  Input,
  Modal,
  Form,
  DatePicker,
  Select,
  Row,
  Col,
  Card,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  EyeOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  getBloodReceiveByStatus,
  createBloodReceive,
} from "../../../services/bloodReceiveService";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

const statusOptions = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Bị từ chối", value: "REJECTED" },
  { label: "Tất cả", value: "ALL" },
];

const statusColors = {
  APPROVED: "processing",
  COMPLETED: "success",
  REJECTED: "error",
  PENDING: "warning",
  INCOMPLETED: "default",
  CANCELED: "default",
};

const BloodReceivePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async (currentStatus) => {
    setLoading(true);
    try {
      const allStatuses = [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "COMPLETED",
        "INCOMPLETED",
        "CANCELED",
      ];
      const statusArr = currentStatus === "ALL" ? allStatuses : [currentStatus];
      const res = await getBloodReceiveByStatus(statusArr);
      setData(res || []);
    } catch (error) {
      console.error("Failed to fetch blood receive list:", error);
      message.error("Không thể tải danh sách đăng ký nhận máu!");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(status);
  }, [status]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleCreateRequest = async (values) => {
    setModalLoading(true);
    try {
      const payload = {
        ...values,
        wantedDate: values.wantedDate.format("YYYY-MM-DD"),
        // Giả sử API yêu cầu `wantedHour` là string hh:mm
        wantedHour: values.wantedDate.format("HH:mm"),
      };
      await createBloodReceive(payload);
      message.success("Tạo yêu cầu nhận máu thành công!");
      setIsModalOpen(false);
      form.resetFields();
      // Tải lại danh sách PENDING để thấy yêu cầu mới
      if (status !== "PENDING") {
        setStatus("PENDING");
      } else {
        fetchData("PENDING");
      }
    } catch (error) {
      console.error("Failed to create blood receive request:", error);
      message.error("Tạo yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const searchTextLower = searchText.toLowerCase();
    const patientName = (item.patientName || "").toLowerCase();
    const bloodType = (item.bloodType || "").toLowerCase();
    return (
      patientName.includes(searchTextLower) ||
      bloodType.includes(searchTextLower)
    );
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

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (name, record) => <b>{name || `Yêu cầu #${record.id}`}</b>,
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (bloodType) => (
        <Tag color="volcano">{bloodTypeMap[bloodType] || bloodType}</Tag>
      ),
    },
    {
      title: "Số lượng (ml)",
      dataIndex: "unit",
      key: "unit",
      align: "right",
    },
    {
      title: "Thời gian cần",
      dataIndex: "wantedDate",
      key: "wantedDate",
      render: (date, record) => {
        const wantedDateTime = moment(date);
        return wantedDateTime.isValid()
          ? wantedDateTime.format("HH:mm [ngày] DD/MM/YYYY")
          : "Không xác định";
      },
      sorter: (a, b) =>
        moment(a.wantedDate).unix() - moment(b.wantedDate).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>{status}</Tag>
      ),
      filters: Object.entries(statusColors).map(([key, value]) => ({
        text: key,
        value: key,
      })),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Button type="link" icon={<EyeOutlined />}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Card
        style={{
          marginBottom: 24,
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center" size="middle">
              <Avatar
                size={64}
                icon={<UsergroupAddOutlined />}
                style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  Danh sách đăng ký nhận máu
                </Title>
                <Text type="secondary">
                  Quản lý và theo dõi các yêu cầu nhận máu từ bệnh nhân.
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setIsModalOpen(true)}
            >
              Tạo yêu cầu mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row justify="space-between">
            <Col>
              <Segmented
                options={statusOptions}
                value={status}
                onChange={handleStatusChange}
                size="large"
              />
            </Col>
            <Col>
              <Input
                prefix={<SearchOutlined style={{ color: "#aaa" }} />}
                placeholder="Tìm tên bệnh nhân, nhóm máu..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            </Col>
          </Row>
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                pageSizeOptions: ["8", "15", "25"],
              }}
              scroll={{ x: "max-content" }}
              style={{ background: "#fff" }}
            />
            {!loading && filteredData.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "#8c8c8c",
                }}
              >
                <WarningOutlined
                  style={{ fontSize: "24px", marginBottom: "16px" }}
                />
                <br />
                Không tìm thấy dữ liệu phù hợp.
              </div>
            )}
          </Spin>
        </Space>
      </Card>

      <Modal
        title="Tạo yêu cầu nhận máu mới"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={modalLoading}
            onClick={() => form.submit()}
          >
            Tạo yêu cầu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateRequest}
          initialValues={{ unit: 250 }}
        >
          <Form.Item
            name="patientName"
            label="Tên bệnh nhân"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh nhân!" },
            ]}
          >
            <Input placeholder="Nhập tên đầy đủ của bệnh nhân" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bloodType"
                label="Nhóm máu yêu cầu"
                rules={[{ required: true, message: "Vui lòng chọn nhóm máu!" }]}
              >
                <Select placeholder="Chọn nhóm máu">
                  {Object.entries(bloodTypeMap).map(([key, value]) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="Số lượng (ml)"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <Input type="number" min={1} placeholder="ví dụ: 250" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="wantedDate"
            label="Thời gian cần máu"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <DatePicker
              showTime
              format="HH:mm DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Chọn ngày và giờ"
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ nhận"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập địa chỉ chi tiết của bệnh viện/cơ sở y tế"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodReceivePage;
