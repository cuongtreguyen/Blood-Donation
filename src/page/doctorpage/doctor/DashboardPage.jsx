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
import { createBloodInventory } from "../../../services/bloodInventoryService";
import api from "../../../config/api";

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

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [searchText, setSearchText] = useState("");

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
              name: userInfo.fullName || item.fullName || item.name || "",
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
              wantedHour: item.wantedHour || (item.blood && item.blood.wantedHour) || item.hour || "",
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

  const handleComplete = async (record) => {
    try {
      console.log("Completing with:", record);
      await completeBloodRegister({
        bloodId: record.id,
        implementationDate: new Date().toISOString().split("T")[0],
        unit: record.quantity,
      });
      // Sau khi complete, thêm vào kho máu
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 35); // máu toàn phần thường bảo quản 35 ngày
      await createBloodInventory({
        bloodType: record.bloodType,
        unitsAvailable: record.quantity,
        expirationDate: expiration.toISOString(),
      });
      message.success("Đã đánh dấu hoàn thành và thêm vào kho máu!");
      const updatedData = data.map((item) =>
        item.id === record.id ? { ...item, status: "COMPLETED" } : item
      );
      setData(updatedData);
    } catch (err) {
      console.error("Complete error:", err);
      message.error(
        "Lỗi khi hoàn thành đăng ký hoặc thêm vào kho máu: " +
          (err?.response?.data?.message || "Unknown error")
      );
    }
  };

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
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại!");
      console.error("Incomplete error:", err?.response?.data || err);
    }
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
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (bloodType) => (
        <Tag color="magenta" style={{ fontWeight: 500, fontSize: 14 }}>
          {bloodType || "Chưa xác định"}
        </Tag>
      ),
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
              <Button type="primary" onClick={() => handleComplete(record)}>
                Hoàn thành
              </Button>
              <Button danger onClick={() => handleIncomplete(record)}>
                Chưa hoàn thành
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
      <Row gutter={16} style={{ marginBottom: 24 }} justify="center">
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
              style={{
                marginLeft: 16,
                padding: 4,
                borderRadius: 6,
                border: "1px solid #ddd",
                minWidth: 180,
              }}
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
          />
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
