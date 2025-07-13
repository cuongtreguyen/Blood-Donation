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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  WarningOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getBloodInventoryById,
  getAllBloodInventory,
  createBloodInventory,
  updateBloodInventory,
  deleteBloodInventory,
} from "../../../services/bloodInventoryService";

const { Option } = Select;

const BloodInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Lấy cài đặt ngưỡng cảnh báo từ localStorage
  const systemSettings = JSON.parse(
    localStorage.getItem("systemSettings") || "{}"
  );
  const lowThreshold =
    systemSettings?.notificationSettings?.lowBloodStockThreshold || 20;

  // Thêm state cho tìm kiếm & lọc
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBloodInventory();
      const updatedInventory = data.map((item) => ({
        id: item.inventoryId, // Sử dụng đúng trường id từ backend
        bloodType: item.bloodType,
        totalUnitsAvailable: item.unitsAvailable,
        backendStatus: item.status, // lấy status gốc từ backend
        status: getStatus(item.unitsAvailable), // status để hiển thị màu
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
  }, []); // Tải dữ liệu khi component mount

  // Cập nhật trạng thái dựa trên ngưỡng khi inventory hoặc lowThreshold thay đổi
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
    if (quantity <= lowThreshold / 2) return "critical";
    if (quantity <= lowThreshold) return "low";
    return "normal";
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "critical":
        return <Tag color="red">Cực kỳ thấp</Tag>;
      case "low":
        return <Tag color="orange">Sắp hết</Tag>;
      default:
        return <Tag color="green">Đủ dùng</Tag>;
    }
  };

  const handleEdit = async (record) => {
    if (!record.id) {
      // Nếu không có id, chỉ mở modal với dữ liệu hiện tại để test UI
      setEditingRecord(record);
      form.setFieldsValue({
        ...record,
        type: record.bloodType,
        unitsAvailable: record.totalUnitsAvailable,
      });
      setIsModalVisible(true);
      return;
    }
    // Nếu có id, gọi API như cũ
    try {
      const fetchedRecord = await getBloodInventoryById(record.id);
      setEditingRecord(fetchedRecord);
      form.setFieldsValue({
        ...fetchedRecord,
        type: fetchedRecord.bloodType,
        unitsAvailable: fetchedRecord.unitsAvailable,
      });
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể tải thông tin kho máu. Vui lòng thử lại.");
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
        expirationDate: values.expirationDate ? values.expirationDate.toISOString() : null, // Thêm kiểm tra null
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
      message.error("Có lỗi xảy ra khi thực hiện thao tác. Vui lòng thử lại.");
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
      message.error("Có lỗi xảy ra khi xóa kho máu. Vui lòng thử lại.");
      console.error("Error deleting blood inventory:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Tính toán thống kê
  const totalUnits = inventory.reduce(
    (sum, item) => sum + item.totalUnitsAvailable,
    0
  );
  const criticalTypes = inventory.filter(
    (item) => item.status === "critical"
  ).length;
  const lowTypes = inventory.filter((item) => item.status === "low").length;

  // Lọc dữ liệu inventory
  const filteredInventory = inventory.filter((item) => {
    // Ẩn các bản ghi đã bị xóa từ backend
    if (item.backendStatus && item.backendStatus.toUpperCase() === "DELETED") return false;
    const matchSearch = item.bloodType
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const bloodTypeMap = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
  };
  const displayBloodType = (type) => {
    const label = bloodTypeMap[type] || type || '-';
    if (label === '-') return label;
    let color = 'default';
    if (['A+', 'B+', 'O+', 'AB+'].includes(label)) color = 'red';
    else if (['A-', 'B-', 'O-', 'AB-'].includes(label)) color = 'blue';
    if (['O-', 'AB-'].includes(label)) color = 'gold';
    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: displayBloodType,
    },
    {
      title: "Số lượng (đơn vị)",
      dataIndex: "totalUnitsAvailable",
      key: "totalUnitsAvailable",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhóm máu này không?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} disabled={loadingDelete || !record.id || typeof record.id !== 'number' || record.id <= 0} loading={loadingDelete}>
              Xóa
            </Button>
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
          height: "100%",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu kho máu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
        <p>{error}</p>
        <Button onClick={fetchInventory}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Quản lý kho máu</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Tìm kiếm nhóm máu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 200 }}
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

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn vị máu"
              value={totalUnits}
              suffix="đơn vị"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhóm máu cực kỳ thấp"
              value={criticalTypes}
              valueStyle={{ color: "#cf1322" }}
              suffix="nhóm"
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhóm máu sắp hết"
              value={lowTypes}
              valueStyle={{ color: "#faad14" }}
              suffix="nhóm"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ngưỡng cảnh báo"
              value={lowThreshold}
              suffix="đơn vị"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Kho máu"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredInventory}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingRecord ? "Cập nhật số lượng máu" : "Thêm nhóm máu mới"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="type"
            label="Nhóm máu"
            rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          >
            <Select disabled={!!editingRecord}>
              <Option value="A_POSITIVE">A+</Option>
              <Option value="A_NEGATIVE">A-</Option>
              <Option value="B_POSITIVE">B+</Option>
              <Option value="B_NEGATIVE">B-</Option>
              <Option value="O_POSITIVE">O+</Option>
              <Option value="O_NEGATIVE">O-</Option>
              <Option value="AB_POSITIVE">AB+</Option>
              <Option value="AB_NEGATIVE">AB-</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="unitsAvailable"
            label="Số lượng (đơn vị)"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Ngày hết hạn"
            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodInventoryPage;
