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
} from "antd";
import {
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getBloodRegisterByStatus,
  updateBloodRegisterStatus,
  completeBloodRegister,
} from "../../../services/bloodRegisterService";
import { getAllBloodInventory } from "../../../services/bloodInventoryService";
// import { createBloodInventory } from "../../../services/bloodInventoryService";
import api from "../../../config/api";
import dayjs from "dayjs";
import HealthCheckForm from "../../../components/forms/HealthCheckForm";
import "./DoctorDashboard.css";

const { Title } = Typography;

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

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeRecord, setCompleteRecord] = useState(null);
  const [completeForm] = Form.useForm();
  const [_inventory, setInventory] = useState([]); // Đổi tên biến để tránh unused linter error
  const [healthCheckModalOpen, setHealthCheckModalOpen] = useState(false);
  const [selectedRegisterId, setSelectedRegisterId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res = [];
        if (status === "ALL") {
          const allStatuses = statusOptions
            .map((option) => option.value)
            .filter((value) => value !== "ALL");

          const responses = await Promise.all(
            allStatuses.map((s) =>
              getBloodRegisterByStatus(s).catch((e) => {
                console.error(`Failed to fetch status ${s}`, e);
                return [];
              })
            )
          );
          res = responses.flat();
        } else {
          res = await getBloodRegisterByStatus(status);
        }
        console.log("API APPROVED response:", res);
        // Mapping dữ liệu từ API
        const dataWithUser = await Promise.all(
          res.map(async (item) => {
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
                userInfo.fullName || item.fullName || item.name || "chưa có",
              bloodType:
                item.bloodType ||
                (item.blood && item.blood.bloodType) ||
                userInfo.bloodType ||
                userInfo.blood_type ||
                "Chưa xác định",
              quantity:
                (item.blood && item.blood.unit) ||
                item.quantity ||
                item.amount ||
                1,
              wantedHour:
                item.wantedHour ||
                (item.blood && item.blood.wantedHour) ||
                item.hour ||
                "",
              wantedDate:
                item.wantedDate ||
                (item.blood && item.blood.donationDate) ||
                item.registerDate ||
                item.created_at ||
                item.date ||
                "",
              status: item.status,
              address: userInfo.address || item.address || "",
            };
          })
        );
        console.log(dataWithUser);
        setData(dataWithUser);
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
      // Sau khi hoàn thành đơn, reload lại kho máu
      const inventoryData = await getAllBloodInventory();
      setInventory(inventoryData);
      console.log("Cập nhật kho máu:", inventoryData); // Tránh lỗi unused
      setCompleteModalOpen(false);
      setCompleteRecord(null);
      completeForm.resetFields();
    } catch (err) {
      console.error(err); // Log lỗi để tránh unused
      message.error("Lỗi khi hoàn thành đăng ký!");
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleOpenHealthCheckModal = (record) => {
    setSelectedRegisterId(record.id);
    setHealthCheckModalOpen(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <b>{id}</b>,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (text) => bloodTypeMap[text] || text,
    },
    {
      title: "Số lượng (đơn vị)",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giờ",
      dataIndex: "wantedHour",
      key: "wantedHour",
      render: (hour) => {
        if (!hour) return "";
        const [h, m] = hour.split(":");
        return `${h}:${m}`;
      },
    },
    {
      title: "Ngày hiến",
      dataIndex: "wantedDate",
      key: "wantedDate",
      width: 130,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={statusColors[status]}
          icon={statusIcons[status]}
          style={{ fontWeight: 500, fontSize: 14 }}
          className="doctor-status-tag"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
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
                Chưa hoàn thành
              </Button>
              <Button
                type="primary"
                onClick={() => handleOpenHealthCheckModal(record)}
              >
                Kiểm tra sức khỏe
              </Button>
            </Space>
          );
        }
        return null;
      },
    },
  ];

  // Thống kê số lượng theo trạng thái (luôn có đủ các trạng thái)
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

  // Lọc data theo trạng thái nếu không phải ALL
  let filteredData =
    status === "ALL" ? data : data.filter((item) => item.status === status);

  // Thêm chức năng search kết hợp filter
  if (searchText) {
    filteredData = filteredData.filter(
      (item) =>
        (item.bloodType &&
          item.bloodType.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.address &&
          item.address.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Tổng quan đăng ký hiến máu
      </Title>
      <Row gutter={16} style={{ marginBottom: 24 }} justify="center" className="doctor-dashboard-cards">
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic title="Tổng đăng ký" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              valueStyle={{ color: "#1890ff" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 12 }}>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#cf1322" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card
        bordered
        style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2" }}
        bodyStyle={{ padding: 0 }}
        className="doctor-dashboard-table"
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 18 }}>
              Danh sách đăng ký hiến máu
            </span>
            <Segmented
              options={statusOptions}
              value={status}
              onChange={setStatus}
              style={{ background: "#f5f5f5" }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm nhóm máu, địa chỉ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="doctor-dashboard-search"
            />
          </Space>
        }
      >
        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <Spin size="large" tip="Đang tải..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            bordered
            size="middle"
            style={{ borderRadius: 12 }}
            className="doctor-dashboard-table"
          />
        )}
      </Card>
      <Modal
        open={completeModalOpen}
        title="Xác nhận hoàn thành đăng ký hiến máu"
        onCancel={() => {
          setCompleteModalOpen(false);
          setCompleteRecord(null);
          completeForm.resetFields();
        }}
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
            rules={[{ required: true, message: "Chọn ngày thực hiện" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Số lượng (đơn vị)"
            name="unit"
            rules={[{ required: true, message: "Nhập số lượng" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={completeLoading}
              style={{ width: "100%" }}
            >
              Xác nhận hoàn thành
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={healthCheckModalOpen}
        title="Kiểm tra sức khỏe người hiến máu"
        onCancel={() => {
          setHealthCheckModalOpen(false);
          setSelectedRegisterId(null);
        }}
        footer={null}
        destroyOnClose
      >
        {selectedRegisterId && (
          <HealthCheckForm
            bloodRegisterId={selectedRegisterId}
            onSuccess={() => setHealthCheckModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
