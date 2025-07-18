// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Table,
//   Statistic,
//   Tag,
//   Segmented,
//   message,
//   Spin,
//   Typography,
//   Space,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
// } from "antd";
// import {
//   WarningOutlined,
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";
// import {
//   getBloodRegisterByStatus,
//   updateBloodRegisterStatus,
//   completeBloodRegister,
// } from "../../../services/bloodRegisterService";
// import { getAllBloodInventory } from "../../../services/bloodInventoryService";
// import api from "../../../config/api";
// import dayjs from "dayjs";
// import HealthCheckForm from "../../../components/forms/HealthCheckForm";
// import "./DoctorDashboard.css";

// const { Title } = Typography;

// const statusColors = {
//   APPROVED: "blue",
//   COMPLETED: "green",
//   REJECTED: "red",
//   PENDING: "orange",
//   INCOMPLETED: "gray",
// };
// const statusIcons = {
//   APPROVED: <CheckCircleOutlined />,
//   COMPLETED: <CheckCircleOutlined />,
//   REJECTED: <CloseCircleOutlined />,
//   PENDING: <ClockCircleOutlined />,
//   INCOMPLETED: <WarningOutlined />,
// };

// const statusOptions = [
//   { label: "Tất cả", value: "ALL" },
//   { label: "Chờ duyệt", value: "PENDING" },
//   { label: "Đã duyệt", value: "APPROVED" },
//   { label: "Hoàn thành", value: "COMPLETED" },
//   { label: "Từ chối", value: "REJECTED" },
// ];

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
// --- KẾT THÚC DỮ LIỆU GỐC ---

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Statistic,
  Tag,
  Segmented,
  message,
  Spin,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Avatar,
} from "antd";
import {
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SearchOutlined,
  MedicineBoxOutlined, // SỬA LẠI: Thay StethoscopeOutlined bằng icon này
} from "@ant-design/icons";
import {
  getBloodRegisterByStatus,
  updateBloodRegisterStatus,
  completeBloodRegister,
} from "../../../services/bloodRegisterService";
import { getAllBloodInventory } from "../../../services/bloodInventoryService";
import api from "../../../config/api";
import dayjs from "dayjs";
import HealthCheckForm from "../../../components/forms/HealthCheckForm";

const { Title, Text } = Typography;

const statusColors = {
  APPROVED: "blue",
  COMPLETED: "green",
  REJECTED: "red",
  PENDING: "orange",
  INCOMPLETED: "gray",
};
const statusIcons = {
  APPROVED: <CheckCircleOutlined />,
  COMPLETED: <CheckCircleOutlined />,
  REJECTED: <CloseCircleOutlined />,
  PENDING: <ClockCircleOutlined />,
  INCOMPLETED: <WarningOutlined />,
};

const statusOptions = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Từ chối", value: "REJECTED" },
];

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
// --- KẾT THÚC DỮ LIỆU GỐC ---

const DashboardPage = () => {
  // --- STATE GỐC CỦA BẠN (GIỮ NGUYÊN) ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeRecord, setCompleteRecord] = useState(null);
  const [completeForm] = Form.useForm();
  const [_inventory, setInventory] = useState([]);
  const [healthCheckModalOpen, setHealthCheckModalOpen] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState(null);
  // --- KẾT THÚC STATE GỐC ---

  // --- LOGIC GỐC CỦA BẠN (GIỮ NGUYÊN 100%) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = [];

        if (status === "ALL") {
          const allStatuses = statusOptions
            .map((opt) => opt.value)
            .filter((v) => v !== "ALL");
          res = await getBloodRegisterByStatus(allStatuses);
        } else {
          res = await getBloodRegisterByStatus(status);
        }

        // Lấy danh sách donor đầy đủ info
        const dataWithUser = await Promise.all(
          (res || []).map(async (item) => {
            let userInfo = {};
            if (item.user_id) {
              try {
                const userRes = await api.get(`/user/${item.user_id}`);
                userInfo = userRes.data || {};
              } catch {
                userInfo = {};
              }
            }

            return {
              id: item.id,
              name:
                userInfo.fullName || item.fullName || item.name || "Chưa có",
              bloodType:
                item.bloodType ||
                item.blood?.bloodType ||
                userInfo.bloodType ||
                "Chưa xác định",
              quantity: item.blood?.unit || item.quantity || item.amount || 1,
              wantedHour:
                item.wantedHour || item.blood?.wantedHour || item.hour || "",
              wantedDate:
                item.wantedDate ||
                item.blood?.donationDate ||
                item.registerDate ||
                item.created_at ||
                "",
              status: item.status,
              address: userInfo.address || item.address || "",
            };
          })
        );

        setData(dataWithUser.slice().sort((a, b) => b.id - a.id));
      } catch {
        message.error("Không thể tải danh sách đăng ký!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const handleIncomplete = async (record) => {
    try {
      await updateBloodRegisterStatus(record.id, "INCOMPLETED");
      message.success("Đã đánh dấu chưa hoàn thành!");
      setData((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, status: "INCOMPLETED" } : item
        )
      );
      setStatus("ALL");
    } catch {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleOpenCompleteModal = (record) => {
    setCompleteRecord(record);
    setCompleteModalOpen(true);
    completeForm.setFieldsValue({
      implementationDate: dayjs(),
      unit: record.quantity,
    });
  };

  const handleCompleteSubmit = async (values) => {
    setCompleteLoading(true);
    try {
      await completeBloodRegister({
        bloodId: completeRecord.id,
        implementationDate: values.implementationDate.format("YYYY-MM-DD"),
        unit: values.unit,
      });
      message.success("Đã đánh dấu hoàn thành!");
      setData((prev) =>
        prev.map((item) =>
          item.id === completeRecord.id
            ? { ...item, status: "COMPLETED" }
            : item
        )
      );
      const inventoryData = await getAllBloodInventory();
      setInventory(inventoryData);
      setCompleteModalOpen(false);
      setCompleteRecord(null);
      completeForm.resetFields();
    } catch {
      message.error("Lỗi khi hoàn thành đăng ký!");
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleOpenHealthCheckModal = async (record) => {
    let merged = { ...record };
    if (record.user_id) {
      try {
        const userRes = await api.get(`/user/${record.user_id}`);
        const userInfo = userRes.data || {};
        merged = { ...merged, ...userInfo };
      } catch {
        // Nếu lỗi thì bỏ qua, dùng record gốc
      }
    }
    setSelectedRegister(merged);
    setHealthCheckModalOpen(true);
  };
  // --- KẾT THÚC LOGIC GỐC ---

  // --- BỘ LỌC VÀ THỐNG KÊ (GIỮ NGUYÊN LOGIC) ---
  const stats = data.reduce(
    (acc, cur) => {
      acc.total++;
      if (cur.status === "PENDING") acc.pending++;
      if (cur.status === "COMPLETED") acc.completed++;
      if (cur.status === "REJECTED") acc.rejected++;
      if (cur.status === "APPROVED") acc.approved++;
      return acc;
    },
    { total: 0, pending: 0, completed: 0, rejected: 0, approved: 0 }
  );

  let filteredData =
    status === "ALL" ? data : data.filter((item) => item.status === status);

  if (searchText) {
    filteredData = filteredData.filter(
      (item) =>
        (item.name &&
          item.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.address &&
          item.address.toLowerCase().includes(searchText.toLowerCase()))
    );
  }
  // --- KẾT THÚC BỘ LỌC VÀ THỐNG KÊ ---

  // --- CÁC CỘT CỦA BẢNG (CHỈ CẬP NHẬT GIAO DIỆN) ---
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />}>{name?.[0]}</Avatar>
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text) => <Tag color="red">{bloodTypeMap[text] || text}</Tag>,
    },
    {
      title: "Thời gian",
      dataIndex: "wantedDate",
      key: "time",
      render: (date, record) => (
        <div>
          <Text>
            {record.wantedHour ? record.wantedHour.substring(0, 5) : "N/A"}
          </Text>
          <br />
          <Text type="secondary">
            {date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} icon={statusIcons[status]}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => {
        if (record.status === "APPROVED") {
          return (
            <Space>
              <Button
                type="primary"
                onClick={() => handleOpenCompleteModal(record)}
              >
                Hoàn thành
              </Button>
              <Button danger onClick={() => handleIncomplete(record)}>
                chưa hoàn thành
              </Button>
              <Button onClick={() => handleOpenHealthCheckModal(record)}>
                Khám SK
              </Button>
            </Space>
          );
        }
        return <Text type="secondary">N/A</Text>;
      },
    },
  ];
  // --- KẾT THÚC CÁC CỘT ---

  // --- RETURN GIAO DIỆN ĐÃ ĐƯỢC LÀM ĐẸP ---
  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Card style={{ marginBottom: 24, borderRadius: "8px" }}>
        <Row align="middle">
          <Space align="center" size="large">
            {/* SỬA LẠI: Dùng icon MedicineBoxOutlined */}
            <Avatar
              size={64}
              icon={<MedicineBoxOutlined />}
              style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
            />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Tổng quan Đăng ký Hiến máu
              </Title>
              <Text type="secondary">
                Quản lý, duyệt và theo dõi các đơn đăng ký hiến máu từ người
                dùng.
              </Text>
            </div>
          </Space>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
          >
            <Statistic title="Tổng Đơn" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
          >
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
          >
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
          >
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.09)" }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Segmented
              options={statusOptions}
              value={status}
              onChange={setStatus}
              size="large"
            />
          </Col>
          <Col>
            <Input
              placeholder="Tìm theo tên, địa chỉ..."
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Col>
        </Row>
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={
              filteredData.slice().sort((a, b) => b.id - a.id)
            }
            rowKey="id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>

      <Modal
        open={completeModalOpen}
        title="Xác nhận hoàn thành đăng ký"
        onCancel={() => setCompleteModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={completeForm}
          layout="vertical"
          onFinish={handleCompleteSubmit}
        >
          <Form.Item
            label="Ngày thực hiện"
            name="implementationDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số lượng (đơn vị)"
            name="unit"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={completeLoading}
              block
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={healthCheckModalOpen}
        title="Phiếu kiểm tra sức khỏe người hiến máu"
        onCancel={() => setHealthCheckModalOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedRegister && (
          <HealthCheckForm
            donorInfo={selectedRegister}
            onSuccess={() => setHealthCheckModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
