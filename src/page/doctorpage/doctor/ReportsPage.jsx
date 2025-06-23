import React from "react";
import { Card, Table, Button, DatePicker, Space, Select, Row, Col } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

function ReportsPage() {
  const reports = [
    {
      id: "1",
      title: "Báo cáo hiến máu tháng 3/2024",
      type: "monthly",
      date: "2024-03-15",
      status: "completed",
      author: "Bs. Hoàng Văn X",
    },
    {
      id: "2",
      title: "Báo cáo sàng lọc Q1/2024",
      type: "quarterly",
      date: "2024-03-31",
      status: "pending",
      author: "Bs. Hoàng Văn X",
    },
    {
      id: "3",
      title: "Báo cáo khẩn cấp - Thiếu máu nhóm O-",
      type: "urgent",
      date: "2024-03-14",
      status: "completed",
      author: "Bs. Nguyễn Thị Y",
    },
  ];

  const columns = [
    {
      title: "Mã báo cáo",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Space>
          <FileTextOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Loại báo cáo",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const types = {
          monthly: "Tháng",
          quarterly: "Quý",
          urgent: "Khẩn cấp",
        };
        return types[type] || type;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          completed: { color: "#52c41a", text: "Hoàn thành" },
          pending: { color: "#faad14", text: "Đang xử lý" },
        };
        return (
          <span style={{ color: statusConfig[status]?.color }}>
            {statusConfig[status]?.text}
          </span>
        );
      },
    },
    {
      title: "Người tạo",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <Space>
          <Button icon={<DownloadOutlined />}>Tải xuống</Button>
          <Button type="primary">Xem</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quản lý báo cáo</h2>

      <Card className="mb-6">
        <Row gutter={16}>
          <Col span={8}>
            <div className="mb-4">
              <label className="block mb-2">Thời gian</label>
              <RangePicker style={{ width: "100%" }} />
            </div>
          </Col>
          <Col span={8}>
            <div className="mb-4">
              <label className="block mb-2">Loại báo cáo</label>
              <Select defaultValue="all" style={{ width: "100%" }}>
                <Option value="all">Tất cả</Option>
                <Option value="monthly">Báo cáo tháng</Option>
                <Option value="quarterly">Báo cáo quý</Option>
                <Option value="urgent">Báo cáo khẩn cấp</Option>
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <div className="mb-4">
              <label className="block mb-2">Trạng thái</label>
              <Select defaultValue="all" style={{ width: "100%" }}>
                <Option value="all">Tất cả</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="pending">Đang xử lý</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <div className="flex justify-end">
          <Button type="primary" icon={<FileTextOutlined />}>
            Tạo báo cáo mới
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={{
            total: reports.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} báo cáo`,
          }}
        />
      </Card>
    </div>
  );
}

export default ReportsPage;
