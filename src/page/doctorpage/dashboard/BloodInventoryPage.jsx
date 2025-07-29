/**
 * Trang Kho Máu (Quản lý tồn kho máu)
 *
 * Chức năng:
 * - Hiển thị danh sách các đơn vị máu trong kho
 * - Thêm mới đơn vị máu vào kho
 * - Cập nhật thông tin đơn vị máu
 * - Xóa đơn vị máu khỏi kho
 * - Theo dõi tình trạng tồn kho của từng nhóm máu
 * - Hiển thị cảnh báo khi lượng máu thấp
 * - Tìm kiếm và lọc đơn vị máu
 *
 * Giúp bác sĩ/nhân viên y tế:
 * - Quản lý tồn kho máu một cách hiệu quả
 * - Theo dõi số lượng máu theo từng nhóm máu
 * - Kiểm soát ngày hết hạn của các đơn vị máu
 * - Đảm bảo luôn có đủ máu cho các ca cấp cứu và phẫu thuật
 */

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
import moment from "moment";

const { Option } = Select;

// Một hình ảnh minh họa đẹp
const bloodDonationImageUrl =
  "https://www.redcross.org/content/dam/redcross/about-us/news/2020/blood-donors-needed-2-2020-1200x630.jpg";

// Hằng số để chuyển đổi giữa ml và đơn vị
const ML_PER_UNIT = 250;

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

  const getStatus = (quantityInUnits) => {
    if (quantityInUnits === 0) return "empty";
    if (quantityInUnits > 0 && quantityInUnits <= lowThreshold / 2)
      return "low";
    if (quantityInUnits > 0 && quantityInUnits <= lowThreshold) return "medium";
    return "normal";
  };

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBloodInventory();
      // Chuyển đổi dữ liệu từ ml sang đơn vị (1 đơn vị = 250ml)
      const updatedInventory = data.map((item) => {
        const totalInMl = item.total || 0;
        const units = totalInMl / ML_PER_UNIT;
        return {
          id: item.inventoryId,
          bloodType: item.bloodType,
          totalInMl: totalInMl, // Giữ lại giá trị gốc (ml)
          totalUnitsAvailable: units, // Giá trị đã chuyển đổi sang đơn vị
          backendStatus: item.status,
          status: getStatus(units),
          expirationDate: item.expirationDate
            ? moment(item.expirationDate)
            : null,
        };
      });
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

  const getStatusTag = (status) => {
    switch (status) {
      case "empty":
        return <Tag color="grey">Trống</Tag>;
      case "low":
        return <Tag color="red">Thấp</Tag>;
      case "medium":
        return <Tag color="gold">Trung bình</Tag>;
      default:
        return <Tag color="#52c41a">Đủ dùng</Tag>;
    }
  };

  const handleEdit = async (record) => {
    try {
      setEditingRecord(record);
      // Hiển thị giá trị theo đơn vị trong form
      form.setFieldsValue({
        ...record,
        type: record.bloodType,
        unitsAvailable: record.totalUnitsAvailable,
        expirationDate: record.expirationDate
          ? moment(record.expirationDate)
          : null,
      });
      setIsModalVisible(true);

      const fetchedRecord = await getBloodInventoryById(record.id);
      const units = (fetchedRecord.total || 0) / ML_PER_UNIT;
      const fullRecord = {
        ...fetchedRecord,
        totalUnitsAvailable: units,
      };
      setEditingRecord(fullRecord);
      form.setFieldsValue({
        type: fullRecord.bloodType,
        unitsAvailable: fullRecord.totalUnitsAvailable,
        expirationDate: fullRecord.expirationDate
          ? moment(fullRecord.expirationDate)
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
      // Chuyển đổi "đơn vị" từ form thành "ml" để gửi lên server
      const unitsFromForm = values.unitsAvailable;
      const mlToSend = unitsFromForm * ML_PER_UNIT;

      const apiData = {
        bloodType: values.type,
        // Giả sử API mong muốn nhận trường `total` hoặc `unitsAvailable` dưới dạng ml
        total: mlToSend,
        expirationDate: values.expirationDate
          ? values.expirationDate.toISOString()
          : null,
      };

      if (editingRecord && editingRecord.id) {
        await updateBloodInventory(editingRecord.id, apiData);
        message.success("Cập nhật kho máu thành công!");
      } else {
        await createBloodInventory(apiData);
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
  const emptyTypes = inventory.filter((item) => item.status === "empty").length;
  const warningTypes = inventory.filter(
    (item) => item.status === "low" || item.status === "medium"
  ).length;

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
    let color = "#1890ff";
    if (["A+", "B+", "O+", "AB+"].includes(label)) color = "#cf1322";
    if (["O-", "AB-"].includes(label)) color = "#d4af37";
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
      if (status === "empty") return "black";
      if (status === "low") return "orange";
      if (status === "medium") return "gold";
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
          if (text === "empty") return "Trống";
          if (text === "low") return "Thấp";
          if (text === "medium") return "Trung bình";
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
      // Hiển thị số nguyên hoặc số thập phân tùy bạn
      render: (units) => parseFloat(units.toFixed(2)),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Đủ dùng", value: "normal" },
        { text: "Trung bình", value: "medium" },
        { text: "Thấp", value: "low" },
        { text: "Trống", value: "empty" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    //   {
    //     title: "Thao tác",
    //     key: "action",
    //     render: (_, record) => (
    //       <Space>
    //         <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
    //         <Popconfirm
    //           title="Bạn có chắc chắn muốn xóa?"
    //           onConfirm={() => handleDelete(record)}
    //           okText="Xóa"
    //           cancelText="Hủy"
    //           okButtonProps={{ danger: true }}
    //         >
    //           <Button danger icon={<DeleteOutlined />} loading={loadingDelete} />
    //         </Popconfirm>
    //       </Space>
    //     ),
    //   },
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
      {/* Các phần JSX còn lại giữ nguyên */}
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
                {/* <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                >
                  Thêm mới
                </Button> */}
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
              precision={2}
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
              title="Nhóm máu đã hết"
              value={emptyTypes}
              valueStyle={{ color: "#262626" }}
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
              value={warningTypes}
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
              <Option value="medium">Trung bình</Option>
              <Option value="low">Thấp</Option>
              <Option value="empty">Trống</Option>
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
            label="Số lượng (đơn vị, 1 đơn vị = 250ml)"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập số lượng đơn vị máu"
            />
          </Form.Item>
          <Form.Item name="expirationDate" label="Ngày hết hạn">
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
