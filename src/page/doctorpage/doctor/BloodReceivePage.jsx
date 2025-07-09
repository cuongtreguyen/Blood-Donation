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
  TimePicker,
  Checkbox,
  Select,
} from "antd";
import {
  getBloodReceiveByStatus,
  createBloodReceive,
} from "../../../services/bloodReceiveService";

const { Title } = Typography;

const statusOptions = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "APPROVED" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Từ chối", value: "REJECTED" },
  { label: "Chưa hoàn thành", value: "INCOMPLETED" },
  { label: "Đã hủy", value: "CANCELED" },
];

const statusColors = {
  APPROVED: "blue",
  COMPLETED: "green",
  REJECTED: "red",
  PENDING: "orange",
  INCOMPLETED: "gray",
};

const BloodReceivePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
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
        const statusArr = status === "ALL" ? allStatuses : [status];
        const res = await getBloodReceiveByStatus(statusArr);
        setData(res);
      } catch {
        message.error("Không thể tải danh sách nhận máu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [status]);

  let filteredData = data;
  if (searchText) {
    filteredData = filteredData.filter(
      (item) =>
        (item.bloodType &&
          item.bloodType.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.address &&
          item.address.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

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
        <Tag color="magenta">{bloodType || "Chưa xác định"}</Tag>
      ),
    },
    { title: "Số lượng", dataIndex: "unit", key: "unit" },
    {
      title: "Giờ",
      dataIndex: "wantedHour",
      key: "wantedHour",
      render: (hour) =>
        hour
          ? typeof hour === "string"
            ? hour
            : `${hour.hour}:${hour.minute}`
          : "",
    },
    {
      title: "Ngày nhận",
      dataIndex: "wantedDate",
      key: "wantedDate",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    { title: "Thao tác", key: "action", render: () => null },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Danh sách đăng ký nhận máu
      </Title>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Segmented
          options={statusOptions}
          value={status}
          onChange={setStatus}
          style={{ background: "#f5f5f5" }}
        />
        <Input
          placeholder="Tìm kiếm nhóm máu, địa chỉ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ minWidth: 200 }}
        />
      </Space>

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
    </div>
  );
};

export default BloodReceivePage;
