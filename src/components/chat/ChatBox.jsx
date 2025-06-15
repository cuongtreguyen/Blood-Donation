import React, { useState, useRef, useEffect } from "react";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import { useSelector } from "react-redux";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Thêm tin nhắn chào mừng khi mở chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          content:
            "Xin chào! Tôi là trợ lý của Dòng Máu Việt. Tôi có thể giúp gì cho bạn?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Giả lập API call - trong thực tế, bạn sẽ gọi API của mình ở đây
      const response = await simulateAIResponse(inputMessage);

      // Thêm tin nhắn từ bot
      const botMessage = {
        type: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Thêm tin nhắn lỗi
      const errorMessage = {
        type: "bot",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Hàm xử lý tin nhắn và trả về câu trả lời phù hợp
   * Phân tích nội dung tin nhắn và trả về câu trả lời dựa trên từ khóa
   * @param {string} message - Tin nhắn từ người dùng
   * @returns {string} Câu trả lời tương ứng
   */
  const handleMessage = (message) => {
    // Kiểm tra tin nhắn có chứa từ khóa về hiến máu
    if (message.toLowerCase().includes("hiến máu")) {
      return "Để hiến máu, bạn cần đảm bảo các điều kiện sau:\n- Độ tuổi từ 18-60\n- Cân nặng trên 45kg\n- Đủ sức khỏe\n- Không mắc các bệnh truyền nhiễm\n\nBạn có thể đăng ký hiến máu trực tiếp trên website của chúng tôi.";
    }

    // Kiểm tra tin nhắn về địa điểm hiến máu
    if (
      message.toLowerCase().includes("địa điểm") ||
      message.toLowerCase().includes("ở đâu")
    ) {
      return 'Các điểm hiến máu chính của chúng tôi:\n1.Bệnh viện Chợ Rẫy\n\nBạn có thể xem chi tiết địa chỉ trong mục "Tìm điểm hiến máu" trên website.';
    }

    // Kiểm tra tin nhắn về thời gian hiến máu
    if (message.toLowerCase().includes("thời gian")) {
      return "Thời gian hiến máu:\n- Thứ 2 - Thứ 6: 7:30 - 17:00\n- Thứ 7, Chủ nhật: 7:30 - 12:00\n\nBạn nên đến sớm và đảm bảo đã ăn đủ bữa trước khi hiến máu.";
    }
    if (
      message.toLowerCase().includes("bao lâu") ||
      message.toLowerCase().includes("tần suất")
    ) {
      return "Bạn có thể hiến máu toàn phần mỗi 12 tuần (3 tháng). Với tiểu cầu, khoảng cách có thể ngắn hơn. Cơ thể cần thời gian để phục hồi, vì vậy đừng lo lắng nếu chưa thể hiến lại ngay.";
    }
    if (
      message.toLowerCase().includes("bao lâu") ||
      message.toLowerCase().includes("tần suất")
    ) {
      return "Bạn có thể hiến máu toàn phần mỗi 12 tuần (3 tháng). Với tiểu cầu, khoảng cách có thể ngắn hơn. Cơ thể cần thời gian để phục hồi, vì vậy đừng lo lắng nếu chưa thể hiến lại ngay.";
    }
    if (
      message.toLowerCase().includes("lợi ích") ||
      message.toLowerCase().includes("tốt cho sức khỏe")
    ) {
      if (
        message.toLowerCase().includes("không được hiến") ||
        message.toLowerCase().includes("chống chỉ định") ||
        message.toLowerCase().includes("trường hợp không")
      ) {
        return "Bạn sẽ không được hiến máu nếu:\n- Mắc các bệnh truyền nhiễm như HIV, viêm gan B/C\n- Đang dùng thuốc kháng sinh hoặc điều trị bệnh\n- Phụ nữ đang mang thai hoặc cho con bú\n- Mới xăm hình dưới 6 tháng\nHãy kiểm tra sức khỏe trước khi đăng ký hiến máu nhé!";
      }

      return "Hiến máu không chỉ cứu người mà còn mang lại lợi ích cho bạn:\n- Kiểm tra sức khỏe miễn phí\n- Giảm sắt dư thừa trong máu\n- Kích thích tủy xương tạo máu mới\n- Cảm giác hạnh phúc vì hành động thiện nguyện 💖";
    }

    // Trả về câu trả lời mặc định nếu không tìm thấy từ khóa phù hợp
    return "Cảm ơn câu hỏi của bạn. Tôi có thể giúp bạn tìm hiểu về quy trình hiến máu, địa điểm hiến máu, hoặc các điều kiện cần thiết để hiến máu. Bạn muốn biết thêm thông tin gì?";
  };

  // Hàm giả lập phản hồi từ AI
  const simulateAIResponse = async (message) => {
    // Giả lập delay để tạo cảm giác thực
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return handleMessage(message);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-200 rounded-full p-2">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          className="border-none shadow-lg"
          style={{ 
            backgroundColor: '#f87171', 
            borderColor: '#f87171',
            color: 'white'
          }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f87171';
            e.currentTarget.style.borderColor = '#f87171';
          }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          }
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">Chăm Sóc Khách Hàng</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            />
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: "400px" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-75 block mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Nhập tin nhắn của bạn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                disabled={isTyping}
              />
              <Tooltip title="Gửi tin nhắn">
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  className="bg-red-600 hover:bg-red-700 border-none"
                  disabled={isTyping || !inputMessage.trim()}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
