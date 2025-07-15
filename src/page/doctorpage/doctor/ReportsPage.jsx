import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  DatePicker,
  Space,
  Select,
  Row,
  Col,
  message,
  Modal,
  Form,
  Input,
  Typography,
  Descriptions,
  ConfigProvider,
  Tooltip,
} from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  EyeOutlined,
  ClearOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import viVN from "antd/locale/vi_VN";
import {
  getReportList,
  createReport,
  deleteReport,
} from "../../../services/reportService";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

const formatReportType = (type) => {
  const types = {
    monthly: "Báo cáo tháng",
    quarterly: "Báo cáo quý",
    urgent: "Báo cáo khẩn cấp",
  };
  return types[type] || type;
};

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [filters, setFilters] = useState({ dateRange: null, type: "all" });

  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReportList();
      setReports(res.data || []);
      console.log("Dữ liệu trả về từ getReportList:", res.data);
    } catch (error) {
      message.error("Lấy danh sách báo cáo thất bại!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    // Lọc bỏ báo cáo đã xóa (is_deleted === 1)
    return reports.filter(
      (report) => report.is_deleted !== 1 && report.is_deleted !== "1"
    ).filter((report) => {
      const { dateRange, type } = filters;
      if (type !== "all" && report.type !== type) return false;
      if (dateRange && dateRange.length === 2) {
        const reportDate = new Date(report.createdAt);
        const [startDate, endDate] = dateRange;
        if (
          !startDate ||
          !endDate ||
          reportDate < startDate.startOf("day") ||
          reportDate > endDate.endOf("day")
        )
          return false;
      }
      return true;
    });
  }, [reports, filters]);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };
  const handleOpenViewModal = (record) => {
    setCurrentReport(record);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => setIsViewModalOpen(false);

  const handleCreateReport = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);
      await createReport(values);
      message.success("Tạo báo cáo thành công!");
      handleCloseCreateModal();
      fetchReports();
    } catch (error) {
      if (error.errorFields)
        message.warning("Vui lòng điền đầy đủ các trường bắt buộc.");
      else message.error("Tạo báo cáo thất bại!");
    } finally {
      setModalLoading(false);
    }
  };

  const handleFilterChange = (_, allValues) => setFilters(allValues);
  const handleClearFilters = () => {
    filterForm.resetFields();
    setFilters({ dateRange: null, type: "all" });
    message.success("Đã xóa bộ lọc!");
  };

  const handleDownload = (record) => {
    message.loading({ content: "Đang tạo file...", key: "download" });
    try {
      const fileContent = `BÁO CÁO\n\nTiêu đề: ${record.title}\nNội dung: ${record.content}`;
      const blob = new Blob([`\uFEFF${fileContent}`], {
        type: "text/plain;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `BaoCao_${record.id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      message.success({ content: "Đã tạo file thành công!", key: "download" });
    } catch (error) {
      message.error({ content: "Tạo file thất bại!", key: "download" });
    }
  };

  const handleDelete = useCallback(
    (record) => {
      console.log("Chuẩn bị gọi Modal.confirm", record);
      Modal.confirm({
        title: "Bạn có chắc chắn muốn xóa báo cáo này?",
        content: `Hành động này không thể hoàn tác. Báo cáo "${record.title}" sẽ bị xóa vĩnh viễn.`,
        icon: <DeleteOutlined style={{ color: "red" }} />,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        getContainer: false,
        onOk: async () => {
          try {
            message.loading({ content: "Đang xóa...", key: "delete" });
            const res = await deleteReport(Number(record.id));
            console.log("Kết quả xóa:", res);
            message.success({ content: "Đã xóa thành công!", key: "delete" });
            await fetchReports();
            setTimeout(() => {
              console.log("Danh sách sau khi fetch:", reports);
            }, 1000);
          } catch (error) {
            message.error({ content: "Xóa báo cáo thất bại.", key: "delete" });
            console.error("Lỗi khi xóa báo cáo:", error);
          }
        },
      });
    },
    [fetchReports]
  );

  const columns = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "id",
        key: "id",
        width: 80,
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 150,
        render: (type) => formatReportType(type),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (date) =>
          date ? new Date(date).toLocaleDateString("vi-VN") : "—",
      },
      {
        title: "Người tạo",
        dataIndex: "createdBy",
        key: "createdBy",
        width: 200,
      },
      {
        title: "Thao tác",
        key: "action",
        fixed: "right",
        width: 120,
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined style={{ color: "#1890ff" }} />}
                onClick={() => handleOpenViewModal(record)}
              />
            </Tooltip>
            <Tooltip title="Tải xuống">
              <Button
                type="text"
                icon={<DownloadOutlined style={{ color: "#52c41a" }} />}
                onClick={() => handleDownload(record)}
              />
            </Tooltip>
            <Tooltip title="Xóa báo cáo">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  console.log("Bấm nút xóa", record);
                  handleDelete(record);
                }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ padding: "24px", background: "#f5f5f5" }}>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Quản lý báo cáo
        </Title>
        <Card style={{ marginBottom: 24 }}>
          <Form
            form={filterForm}
            onValuesChange={handleFilterChange}
            layout="vertical"
            initialValues={{ type: "all" }}
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item name="dateRange" label="Lọc theo khoảng thời gian">
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="type" label="Lọc theo loại báo cáo">
                  <Select placeholder="Chọn một loại báo cáo">
                    <Option value="all">Tất cả</Option>
                    <Option value="monthly">Báo cáo tháng</Option>
                    <Option value="quarterly">Báo cáo quý</Option>
                    <Option value="urgent">Báo cáo khẩn cấp</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
            <Col>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleOpenCreateModal}
              >
                Tạo báo cáo mới
              </Button>
            </Col>
            <Col>
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            columns={columns}
            dataSource={filteredReports}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} trên ${total} báo cáo`,
            }}
            scroll={{ x: "max-content" }}
          />
        </Card>

        {/* FIX: Thay destroyOnClose bằng destroyOnHidden */}
        <Modal
          title="Tạo báo cáo mới"
          open={isCreateModalOpen}
          onCancel={handleCloseCreateModal}
          onOk={handleCreateReport}
          confirmLoading={modalLoading}
          okText="Tạo mới"
          cancelText="Hủy"
          destroyOnHidden
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Ví dụ: Báo cáo tổng kết quý 3 năm 2025" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả ngắn"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Mô tả ngắn gọn về mục đích của báo cáo này"
              />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại báo cáo"
              rules={[
                { required: true, message: "Vui lòng chọn loại báo cáo" },
              ]}
            >
              <Select placeholder="Chọn một loại báo cáo">
                <Option value="monthly">Báo cáo tháng</Option>
                <Option value="quarterly">Báo cáo quý</Option>
                <Option value="urgent">Báo cáo khẩn cấp</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung chi tiết"
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập nội dung đầy đủ của báo cáo tại đây..."
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Chi tiết báo cáo"
          open={isViewModalOpen}
          onCancel={handleCloseViewModal}
          footer={[
            <Button
              key="download"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(currentReport)}
            >
              Tải file .txt
            </Button>,
            <Button key="back" onClick={handleCloseViewModal}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          {currentReport && (
            // FIX: Thay bordered bằng variant="bordered"
            <Descriptions layout="vertical" variant="bordered">
              <Descriptions.Item label="Mã báo cáo" span={1}>
                {currentReport.id}
              </Descriptions.Item>
              <Descriptions.Item label="Tiêu đề" span={2}>
                {currentReport.title}
              </Descriptions.Item>
              <Descriptions.Item label="Loại báo cáo" span={1}>
                {formatReportType(currentReport.type)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                {new Date(currentReport.createdAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo" span={3}>
                {currentReport.createdBy}
              </Descriptions.Item>
              <Descriptions.Item label="Nội dung chi tiết" span={3}>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {currentReport.content}
                </div>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default ReportsPage;
