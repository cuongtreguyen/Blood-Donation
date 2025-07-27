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
  Descriptions,
  Popconfirm,
  InputNumber,
  Tooltip, // Thêm Tooltip để giải thích cho các button
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  WarningOutlined,
  FireFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ApartmentOutlined, // Icon mới cho tiêu đề
} from "@ant-design/icons";
import {
  getBloodReceiveByStatus,
  createBloodReceive,
  updateBloodReceiveStatus,
  setCompleteBloodReceive,
  getBloodReceiveHistory,
} from "../../../services/bloodReceiveService";
import moment from "moment";

// --- Giữ nguyên các hằng số và service của bạn ---
const { Title, Text } = Typography;
const { Option } = Select;
const { useForm } = Form;

const statusOptions = [
  { label: "Chờ duyệt", value: "PENDING", icon: <WarningOutlined /> },
  { label: "Đã duyệt", value: "APPROVED", icon: <CheckCircleOutlined /> },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Chưa hoàn thành", value: "INCOMPLETED" },
  { label: "Tất cả", value: "ALL" },
  { label: "Lịch sử", value: "HISTORY" },
];

const statusColors = {
  APPROVED: "blue",
  COMPLETED: "success",
  REJECTED: "error",
  PENDING: "warning",
  INCOMPLETED: "default",
  CANCELED: "default",
};

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
// ---------------------------------------------------

const BloodReceivePage = () => {
  // --- Toàn bộ State và Logic của bạn được giữ nguyên ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("PENDING");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form] = useForm();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeForm] = useForm();

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
    } catch {
      message.error("Không thể tải danh sách đăng ký nhận máu!");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getBloodReceiveHistory();
      setHistoryData(res || []);
    } catch {
      message.error("Không thể tải lịch sử nhận máu!");
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (status === "HISTORY") {
      fetchHistory();
    } else {
      fetchData(status);
    }
  }, [status]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleCreateRequest = async (values) => {
    setModalLoading(true);
    try {
      const payload = {
        ...values,
        fullName: values.fullName,
        wantedDate: values.wantedDate.format("YYYY-MM-DD"),
        wantedHour: values.wantedDate.format("HH:mm:ss"),
      };
      await createBloodReceive(payload);
      message.success("Tạo yêu cầu nhận máu thành công!");
      setIsModalOpen(false);
      form.resetFields();
      if (status !== "PENDING") {
        setStatus("PENDING");
      } else {
        fetchData("PENDING");
      }
    } catch {
      message.error("Tạo yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleOpenCompleteModal = (record) => {
    setSelectedRecord(record);
    setIsCompleteModalOpen(true);
    completeForm.setFieldsValue({
      implementationDate: moment(),
      unit: record.unit || 1,
    });
  };

  const handleCompleteSubmit = async () => {
    if (!selectedRecord) return;
    try {
      const values = await completeForm.validateFields();
      setCompleteLoading(true);
      await setCompleteBloodReceive({
        bloodID: selectedRecord.id,
        implementationDate: values.implementationDate.format("YYYY-MM-DD"),
        unit: values.unit,
      });
      message.success(
        `Đã cập nhật yêu cầu #${selectedRecord.id} thành HOÀN THÀNH`
      );
      setData((prev) => prev.filter((item) => item.id !== selectedRecord.id));
      setIsCompleteModalOpen(false);
    } catch (err) {
      if (err && err.errorFields) return;
      message.error("Cập nhật thất bại!");
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleIncomplete = async (record) => {
    try {
      await updateBloodReceiveStatus(record.id, "INCOMPLETED");
      message.info(`Đã cập nhật yêu cầu #${record.id} thành CHƯA HOÀN THÀNH`);
      setData((prev) => prev.filter((item) => item.id !== record.id));
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };
  // --- Kết thúc phần logic ---

  const columns = [
    {
      title: "Mã ID",
      dataIndex: "id",
      key: "id",
      width: 90,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: "Người nhận máu",
      dataIndex: "fullName",
      key: "fullName",
      render: (name, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
            {name?.charAt(0)?.toUpperCase() || "B"}
          </Avatar>
          <Text strong>{name || `Yêu cầu #${record.id}`}</Text>
          {record.emergency && (
            <Tooltip title="Yêu cầu khẩn cấp">
              <Tag icon={<FireFilled />} color="error-inverse">
                Khẩn cấp
              </Tag>
            </Tooltip>
          )}
        </Space>
      ),
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
      title: "Thời gian cần",
      dataIndex: "wantedDate",
      key: "wantedDate",
      render: (_, record) => (
        <Text>
          {record.wantedHour ? record.wantedHour.substring(0, 5) : ""}{" "}
          {record.wantedDate
            ? moment(record.wantedDate).format("DD/MM/YYYY")
            : "N/A"}
        </Text>
      ),
      sorter: (a, b) =>
        moment(a.wantedDate).unix() - moment(b.wantedDate).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"} bordered={false}>
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
              <Tooltip title="Đánh dấu là đã hoàn thành">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleOpenCompleteModal(record)}
                >
                  Hoàn thành
                </Button>
              </Tooltip>
              <Tooltip title="Không thể thực hiện yêu cầu này">
                <Popconfirm
                  title="Xác nhận từ chối yêu cầu?"
                  description="Hành động này sẽ chuyển trạng thái sang 'CHƯA HOÀN THÀNH'."
                  onConfirm={() => handleIncomplete(record)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button danger icon={<CloseCircleOutlined />}>
                    Từ chối
                  </Button>
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        }
        return (
          <Tooltip title="Xem chi tiết yêu cầu">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        );
      },
    },
  ];

  const historyColumns = [
    {
      title: "Mã ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodType",
      key: "bloodType",
      render: (type) => <Tag color="volcano">{bloodTypeMap[type] || type}</Tag>,
    },
    {
      title: "Ngày nhận",
      dataIndex: "receiveDate",
      key: "receiveDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Số lượng (ml)",
      dataIndex: "unit",
      key: "unit",
      render: (unit) => `${unit} ml`,
    },
  ];

  // Logic filter giữ nguyên
  const filteredData =
    status === "HISTORY"
      ? historyData.filter((item) => {
          if (!searchText) return true;
          return (
            String(item.id).includes(searchText) ||
            (bloodTypeMap[item.bloodType] || item.bloodType)
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          );
        })
      : data.filter((item) =>
          item.fullName?.toLowerCase().includes(searchText.toLowerCase())
        );

  return (
    <div style={{ padding: "24px" }}>
      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* --- Header Mới --- */}
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Space align="center" size="middle">
              <Avatar
                size={50}
                icon={<ApartmentOutlined />}
                style={{ backgroundColor: "#e6f4ff", color: "#1677ff" }}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Quản lý Yêu cầu Nhận máu
                </Title>
                <Text type="secondary">
                  Theo dõi, phê duyệt và quản lý các yêu cầu nhận máu.
                </Text>
              </div>
            </Space>
          </Col>
          {/* <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              onClick={() => setIsModalOpen(true)}
            >
              Tạo yêu cầu mới
            </Button>
          </Col> */}
        </Row>

        {/* --- Toolbar Mới --- */}
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Segmented
              options={statusOptions}
              value={status}
              onChange={handleStatusChange}
              size="middle"
            />
          </Col>
          <Col>
            <Input
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              placeholder={
                status === "HISTORY"
                  ? "Tìm theo mã, nhóm máu..."
                  : "Tìm tên người nhận máu..."
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Col>
        </Row>

        {/* --- Bảng Dữ liệu --- */}
        <Spin
          spinning={status === "HISTORY" ? historyLoading : loading}
          tip="Đang tải dữ liệu..."
        >
          <Table
            columns={status === "HISTORY" ? historyColumns : columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "15", "25"],
              position: ["bottomRight"],
            }}
            scroll={{ x: "max-content" }}
            style={{ background: "#fff" }}
            rowClassName={() => "custom-table-row"}
          />
        </Spin>
      </Card>

      {/* --- Các Modal giữ nguyên logic, chỉ chỉnh sửa nhỏ về giao diện --- */}

      {/* Modal tạo yêu cầu mới */}
      <Modal
        title={<Title level={5}>Tạo Yêu Cầu Nhận Máu Mới</Title>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
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
            name="fullName"
            label="Người nhận máu"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh nhân!" },
            ]}
          >
            <Input placeholder="Nhập tên đầy đủ của người nhận máu" />
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
                <InputNumber
                  min={1}
                  placeholder="ví dụ: 250"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="wantedDate"
            label="Thời gian cần máu"
            rules={[{ required: true, message: "Vui lòng chọn thời gian!" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD-MM-YYYY HH:mm"
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

      {/* Modal xem chi tiết - Giao diện 2 cột */}
      <Modal
        title={`Chi tiết yêu cầu #${selectedRecord?.id}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedRecord && (
          <Descriptions bordered layout="vertical" column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="người nhận máu">
              <Text strong>{selectedRecord.fullName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColors[selectedRecord.status] || "default"}>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cần">
              {moment(selectedRecord.wantedDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ cần">
              {selectedRecord.wantedHour?.substring(0, 5)}
            </Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">
              {bloodTypeMap[selectedRecord?.bloodType] ||
                selectedRecord?.bloodType}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {selectedRecord.unit ? `${selectedRecord.unit} ml` : "Chưa rõ"}
            </Descriptions.Item>
            <Descriptions.Item label="Mức độ khẩn cấp" span={2}>
              {selectedRecord.emergency ? "CÓ" : "KHÔNG"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {selectedRecord.address || "Chưa cung cấp"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal xác nhận hoàn thành */}
      <Modal
        title={<Title level={5}>Xác nhận hoàn thành yêu cầu</Title>}
        open={isCompleteModalOpen}
        onCancel={() => setIsCompleteModalOpen(false)}
        destroyOnClose
        footer={null}
      >
        <Form
          form={completeForm}
          layout="vertical"
          onFinish={handleCompleteSubmit}
        >
          <p>
            Xác nhận hoàn thành yêu cầu <b>#{selectedRecord?.id}</b> cho người
            nhận máu <b>{selectedRecord?.fullName}</b>?
          </p>
          <Form.Item
            label="Ngày thực hiện"
            name="implementationDate"
            rules={[
              { required: true, message: "Vui lòng chọn ngày thực hiện!" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            label="Số lượng máu đã nhận (ml)"
            name="unit"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng máu!" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setIsCompleteModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={completeLoading}
              >
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BloodReceivePage;
