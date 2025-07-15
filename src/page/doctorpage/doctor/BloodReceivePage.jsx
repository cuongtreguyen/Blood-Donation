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
  Popconfirm, // Thêm Popconfirm để xác nhận
  InputNumber,
  Form as AntForm,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  EyeOutlined,
  WarningOutlined,
  FireFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  getBloodReceiveByStatus,
  createBloodReceive,
  // Giả sử bạn có hàm này trong service, nếu không, bạn cần tạo nó
  updateBloodReceiveStatus,
  setCompleteBloodReceive,
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

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // --- STATE MỚI ĐỂ XỬ LÝ VIỆC HOÀN THÀNH ---
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  // ------------------------------------------

  const [completeForm] = AntForm.useForm();

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
        fullName: values.fullName, // Đảm bảo gửi đúng tên trường
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

  // --- HÀM MỚI ĐỂ XỬ LÝ CÁC NÚT ---
  const handleOpenCompleteModal = (record) => {
    setSelectedRecord(record);
    setIsCompleteModalOpen(true);
    // Set mặc định cho form: ngày hôm nay và số lượng của yêu cầu
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
        requestId: selectedRecord.id,
        implementationDate: values.implementationDate.format("YYYY-MM-DD"),
        unit: values.unit,
      });
      message.success(
        `Đã cập nhật yêu cầu #${selectedRecord.id} thành HOÀN THÀNH`
      );
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id
            ? { ...item, status: "COMPLETED" }
            : item
        )
      );
      setIsCompleteModalOpen(false);
    } catch (err) {
      // Nếu là lỗi validate thì không báo lỗi chung
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
      setData((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, status: "INCOMPLETED" } : item
        )
      );
    } catch {
      message.error("Cập nhật thất bại!");
    }
  };
  // ------------------------------------

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
      title: "Mã YC",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <b>#{id}</b>,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "fullName",
      key: "fullName",
      render: (name, record) => (
        <Space>
          {record.emergency && (
            <Tag icon={<FireFilled />} color="error">
              Khẩn cấp
            </Tag>
          )}
          <b>{name || `Yêu cầu #${record.id}`}</b>
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
      title: "Giờ cần",
      dataIndex: "wantedHour",
      key: "wantedHour",
      render: (hour) => (hour ? hour.substring(0, 5) : "N/A"),
    },
    {
      title: "Ngày cần",
      dataIndex: "wantedDate",
      key: "wantedDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
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
    },
    {
      title: "Thao tác",
      key: "action",
      // --- SỬA: HIỂN THỊ NÚT THEO ĐIỀU KIỆN ---
      render: (_, record) => {
        if (record.status === "APPROVED") {
          return (
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleOpenCompleteModal(record)}
              >
                Hoàn thành
              </Button>
              <Popconfirm
                title="Xác nhận chưa hoàn thành?"
                description="Hành động này sẽ đổi trạng thái yêu cầu."
                onConfirm={() => handleIncomplete(record)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button danger icon={<CloseCircleOutlined />}>
                  Chưa hoàn thành
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        // Với các trạng thái khác, vẫn có thể xem chi tiết
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Xem chi tiết
          </Button>
        );
      },
      // ------------------------------------------
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
                placeholder="Tìm tên bệnh nhân..."
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
              dataSource={data}
              rowKey="id"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                pageSizeOptions: ["8", "15", "25"],
              }}
              scroll={{ x: "max-content" }}
              style={{ background: "#fff" }}
            />
          </Spin>
        </Space>
      </Card>

      {/* Modal tạo yêu cầu mới */}
      <Modal
        title="Tạo yêu cầu nhận máu mới"
        open={isModalOpen}
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
            name="fullName"
            label="Tên bệnh nhân"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tên đầy đủ của bệnh nhân" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bloodType"
                label="Nhóm máu yêu cầu"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn nhóm máu">
                  {Object.entries(bloodTypeMap).map(([key, value]) => (
                    <Option key={key} value={key}>{value}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="Số lượng (ml)"
                rules={[{ required: true }]}
              >
                <Input type="number" min={1} placeholder="ví dụ: 250" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="wantedDate"
            label="Thời gian cần máu"
            rules={[{ required: true }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
              placeholder="Chọn ngày và giờ"
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ nhận"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập địa chỉ chi tiết của bệnh viện/cơ sở y tế"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
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
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã yêu cầu">
              <b>#{selectedRecord.id}</b>
            </Descriptions.Item>
            <Descriptions.Item label="Bệnh nhân">
              {selectedRecord.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ cần">
              {selectedRecord.wantedHour?.substring(0, 5)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cần">
              {moment(selectedRecord.wantedDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">
              {bloodTypeMap[selectedRecord?.bloodType] || selectedRecord?.bloodType}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {selectedRecord.unit ? `${selectedRecord.unit} ml` : "Chưa rõ"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColors[selectedRecord.status] || "default"}>
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mức độ khẩn cấp">
              {selectedRecord.emergency ? "CÓ" : "KHÔNG"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedRecord.address || "Chưa cung cấp"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* --- MODAL XÁC NHẬN HOÀN THÀNH --- */}
      <Modal
        title="Xác nhận hoàn thành yêu cầu"
        open={isCompleteModalOpen}
        onCancel={() => setIsCompleteModalOpen(false)}
        footer={null}
      >
        <AntForm
          form={completeForm}
          layout="vertical"
          onFinish={handleCompleteSubmit}
        >
          <p>
            Bạn có chắc chắn muốn đánh dấu yêu cầu <b>#{selectedRecord?.id}</b>{" "}
            của bệnh nhân <b>{selectedRecord?.fullName}</b> là đã hoàn thành không?
          </p>
          <AntForm.Item
            label="Ngày thực hiện"
            name="implementationDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày thực hiện!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </AntForm.Item>
          <AntForm.Item
            label="Số lượng máu (đơn vị)"
            name="unit"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng máu!" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
              () => ({
                validator(_, value) {
                  if (!value || !selectedRecord) return Promise.resolve();
                  // Giả sử selectedRecord.bloodType là key, kiểm tra inventory nếu có
                  // TODO: Nếu có inventory thực tế, kiểm tra số lượng tồn kho ở đây
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </AntForm.Item>
          <AntForm.Item>
            <Button onClick={() => setIsCompleteModalOpen(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={completeLoading}>
              Xác nhận
            </Button>
          </AntForm.Item>
        </AntForm>
      </Modal>
      {/* ---------------------------------- */}
    </div>
  );
};

export default BloodReceivePage;
