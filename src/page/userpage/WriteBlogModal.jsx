// ✅ WriteBlogModal.jsx
import React, { useState } from "react";
import { Modal, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../config/api";

const WriteBlogModal = ({ open, onClose, donationId, author }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/blogs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data);
      message.success("Tải ảnh lên thành công!");
    } catch (err) {
      message.error("Lỗi tải ảnh");
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      message.warning("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    setLoading(true);
    try {
      await api.post("/blogs", {
        title,
        content,
        img: imageUrl,
        author,
        donationId, // ✅ dùng đúng key donationId
      });

      message.success("Tạo blog thành công!");
      setTitle("");
      setContent("");
      setImageUrl("");
      onClose(true);
    } catch (err) {
      message.error("Tạo blog thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Viết blog chia sẻ"
      open={open}
      onCancel={() => onClose(false)}
      onOk={handleSubmit}
      okText="Đăng blog"
      confirmLoading={loading}
    >
      <Input
        placeholder="Tiêu đề blog"
        className="mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input.TextArea
        rows={5}
        placeholder="Nội dung chia sẻ"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-3">
        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Tải ảnh lên (tùy chọn)</Button>
        </Upload>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Blog"
            style={{ marginTop: 10, width: "100%", borderRadius: 8 }}
          />
        )}
      </div>
    </Modal>
  );
};

export default WriteBlogModal;
