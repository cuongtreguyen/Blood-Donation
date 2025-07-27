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




// import React, { useState, useRef, useEffect } from "react";
// import { Send, X, User, Bot, Heart, MessageSquare, MessageCircle  } from "lucide-react";
// import clsx from "clsx"; // Thư viện tiện ích để nối các class, cài đặt: npm install clsx

// // --- Custom Chat Icon ---
// // Biểu tượng mới kết hợp giữa chat và trái tim, thể hiện đúng tinh thần ChatIcon
// const ChatIcon = () => (
//   <div className="relative flex items-center justify-center">
//     <div className="relative">
//       <div 
//         className="rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg flex items-center justify-center"
//         style={{ width: 28, height: 28 }}
//       >
//         <MessageCircle 
//           size={17} 
//           className="text-white" 
//           fill="currentColor"
//         />
//       </div>
//       {/* Heart accent */}
//       <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-1 shadow-sm">
//         <Heart 
//           size={8} 
//           className="text-white" 
//           fill="currentColor"
//         />
//       </div>
//     </div>
//   </div>
// );
// // --- Chat Message Component ---
// // Tách ra component riêng để dễ quản lý và tái sử dụng
// const ChatMessage = ({ message }) => {
//   const isUser = message.type === "user";
//   return (
//     <div className={clsx("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
//       {!isUser && (
//         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white flex-shrink-0">
//           <Bot size={18} />
//         </div>
//       )}
//       <div
//         className={clsx(
//           "max-w-[80%] rounded-2xl px-4 py-3",
//           isUser
//             ? "rounded-br-lg bg-blue-500 text-white"
//             : "rounded-bl-lg bg-white text-gray-800 shadow-sm"
//         )}
//       >
//         {/* Dùng whitespace-pre-line để tự động render các dấu xuống dòng \n */}
//         <p className="text-sm whitespace-pre-line">{message.content}</p>
//       </div>
//        {isUser && (
//         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
//           <User size={18} />
//         </div>
//       )}
//     </div>
//   );
// };


// const ChatBox = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   // --- Knowledge Base (Cải tiến với định dạng rõ ràng hơn) ---
//   const knowledgeBase = {
//     "điều kiện hiến máu": {
//       keywords: ["điều kiện", "yêu cầu", "tiêu chuẩn"],
//       answer: "Để hiến máu, bạn cần đảm bảo các tiêu chuẩn sau:\n\n• Độ tuổi: Từ 18 đến 60.\n• Cân nặng: Trên 45kg đối với nữ và 50kg đối với nam.\n• Sức khỏe: Hoàn toàn tỉnh táo, khỏe mạnh.\n• Không mắc các bệnh truyền nhiễm qua đường máu (HIV, Viêm gan B, C,...).\n• Khoảng cách giữa 2 lần hiến máu toàn phần là 12 tuần."
//     },
//     "địa điểm hiến máu": {
//       keywords: ["địa điểm", "ở đâu", "chỗ nào", "nơi nào", "địa chỉ"],
//       answer: "Bạn có thể hiến máu tại các địa điểm cố định hoặc các điểm lưu động.\n\n📍 Viện Huyết học - Truyền máu Trung ương (Hà Nội).\n📍 Bệnh viện Chợ Rẫy (TP.HCM).\n📍 Trung tâm Hiến máu nhân đạo (TP.HCM).\n\n💡 Mẹo: Truy cập mục 'Lịch hiến máu' trên website để xem các điểm lưu động gần bạn nhất!"
//     },
//     "thời gian hiến máu": {
//       keywords: ["thời gian", "giờ", "khi nào", "lúc nào"],
//       answer: "⏰ Thời gian làm việc của các trung tâm thường là:\n\n• Thứ 2 - Thứ 6: 7:30 - 17:00\n• Thứ 7 & Chủ nhật: 8:00 - 12:00\n\nLưu ý: Thời gian có thể thay đổi, bạn nên gọi điện xác nhận trước khi đến nhé."
//     },
//     "tần suất hiến máu": {
//       keywords: ["bao lâu", "tần suất", "mấy lần", "khoảng cách"],
//       answer: "🩸 Tần suất hiến máu an toàn được khuyến cáo là:\n\n• Hiến máu toàn phần: Tối thiểu 12 tuần/lần.\n• Hiến tiểu cầu/huyết tương: Có thể ngắn hơn, khoảng 2-4 tuần/lần.\n\nCơ thể bạn cần thời gian để tái tạo lượng máu đã cho đi, hãy tuân thủ khoảng cách an toàn nhé!"
//     },
//      "lợi ích hiến máu": {
//       keywords: ["lợi ích", "tốt", "được gì"],
//       answer: "💖 Hiến máu không chỉ cứu người mà còn mang lại nhiều lợi ích cho chính bạn:\n\n• Được khám và tư vấn sức khỏe miễn phí.\n• Sàng lọc nhanh các bệnh về máu.\n• Giảm tải lượng sắt dư thừa trong cơ thể.\n• Kích thích cơ thể sản sinh máu mới.\n• Cảm giác tự hào và hạnh phúc khi làm việc tốt."
//     },
//     "chuẩn bị hiến máu": {
//       keywords: ["chuẩn bị", "trước khi", "cần làm gì"],
//       answer: "🎯 Để buổi hiến máu diễn ra thuận lợi, bạn cần:\n\n• Đêm trước: Ngủ đủ giấc (ít nhất 6 tiếng).\n• Bữa ăn: Ăn nhẹ, không ăn đồ nhiều dầu mỡ.\n• Nước: Uống nhiều nước hoặc trà đường.\n• Tinh thần: Thoải mái, vui vẻ.\n• Giấy tờ: Mang theo CMND/CCCD hoặc giấy tờ tùy thân có ảnh."
//     },
//     "sau khi hiến máu": {
//       keywords: ["sau khi", "làm gì sau", "lưu ý sau"],
//       answer: "🔄 Những điều cần làm sau khi hiến máu:\n\n• Nghỉ tại chỗ 10-15 phút.\n• Uống nhiều nước để bổ sung lại thể tích tuần hoàn.\n• Chỉ tháo băng sau 4-6 giờ, giữ vết chích sạch sẽ.\n• Tránh làm việc nặng hoặc các hoạt động gắng sức trong ngày.\n• Nếu thấy chóng mặt, buồn nôn, hãy nằm nghỉ, kê cao chân."
//     },
//      "quy trình hiến máu": {
//       keywords: ["quy trình", "các bước", "thủ tục"],
//       answer: "📋 Quy trình hiến máu rất đơn giản và nhanh chóng:\n\n1. Đăng ký & điền thông tin.\n2. Khám sức khỏe & tư vấn.\n3. Xét nghiệm máu nhanh.\n4. Tiến hành hiến máu (chỉ 5-10 phút).\n5. Nghỉ ngơi, nhận đồ ăn nhẹ và giấy chứng nhận.\n\nToàn bộ quy trình thường mất khoảng 45 phút."
//     },
//   };

//   const suggestions = [
//     "Điều kiện để hiến máu là gì?",
//     "Cần chuẩn bị gì trước khi hiến máu?",
//     "Hiến máu ở đâu?",
//     "Hiến máu có lợi ích gì không?",
//   ];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setTimeout(() => {
//         setMessages([
//           {
//             type: "bot",
//             content: "Xin chào! Tôi là Trợ lý ảo của Dòng Máu Việt 🩸\n\nTôi có thể giúp gì cho bạn về việc hiến máu?",
//             timestamp: new Date(),
//           },
//         ]);
//       }, 300);
//     }
//   }, [isOpen]);

//   const findAnswer = (message) => {
//     const lowerMessage = message.toLowerCase().trim();
//     let bestMatch = null;
//     let highestScore = 0;

//     for (const topic in knowledgeBase) {
//         const { keywords } = knowledgeBase[topic];
//         let currentScore = 0;
//         for (const keyword of keywords) {
//             if (lowerMessage.includes(keyword)) {
//                 currentScore++;
//             }
//         }
//         if (currentScore > highestScore) {
//             highestScore = currentScore;
//             bestMatch = knowledgeBase[topic].answer;
//         }
//     }

//     if (bestMatch) {
//       return bestMatch;
//     }
    
//     return "Rất tiếc, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi tôi về:\n\n• Điều kiện hiến máu\n• Địa điểm và thời gian\n• Chuẩn bị trước & sau khi hiến máu\n• Lợi ích của việc hiến máu\n\nHãy thử hỏi lại bằng một câu hỏi khác nhé!";
//   };

//   const handleSendMessage = async (messageText = inputMessage) => {
//     const trimmedMessage = messageText.trim();
//     if (!trimmedMessage) return;

//     const userMessage = { type: "user", content: trimmedMessage };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputMessage("");
//     setIsTyping(true);

//     await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));

//     const response = findAnswer(trimmedMessage);
//     const botMessage = { type: "bot", content: response };
//     setMessages((prev) => [...prev, botMessage]);
//     setIsTyping(false);
//   };
  
//   return (
//     <div className="fixed bottom-5 right-5 z-50 font-sans">
//       {/* --- Chat Button --- */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={clsx(
//           "bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110",
//            isOpen ? "w-12 h-12" : "w-16 h-16 animate-pulse-slow"
//         )}
//         aria-label="Mở hộp thoại"
//       >
//         {isOpen ? <X size={24} /> : <ChatIcon />}
//       </button>

//       {/* --- Chat Window --- */}
//       <div
//         className={clsx(
//           "fixed bottom-24 right-5 w-[calc(100vw-40px)] max-w-sm h-[70vh] max-h-[580px] bg-gray-50 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out",
//           isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
//         )}
//       >
//         {/* Header */}
//         <div className="flex-shrink-0 p-4 border-b bg-white rounded-t-2xl">
//           <h3 className="text-lg font-bold text-gray-800">Trợ lý Dòng Máu Việt</h3>
//           <p className="text-sm text-green-600 flex items-center gap-1.5">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//             Đang hoạt động
//           </p>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
          
//           {isTyping && (
//              <div className="flex items-end gap-2 justify-start">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white flex-shrink-0">
//                     <Bot size={18} />
//                 </div>
//                  <div className="max-w-[80%] rounded-2xl px-4 py-3 rounded-bl-lg bg-white text-gray-800 shadow-sm">
//                     <div className="flex items-center gap-1.5">
//                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
//                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
//                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
//                     </div>
//                 </div>
//             </div>
//           )}

//           {messages.length <= 1 && !isTyping && (
//             <div className="pt-4 space-y-2">
//                 <p className="text-xs font-medium text-gray-500 uppercase">Gợi ý cho bạn</p>
//                 {suggestions.map((s, i) => (
//                     <button key={i} onClick={() => handleSendMessage(s)} className="w-full text-left text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 transition-colors hover:bg-blue-100">
//                         {s}
//                     </button>
//                 ))}
//             </div>
//           )}
          
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         <div className="flex-shrink-0 p-3 border-t bg-white rounded-b-2xl">
//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               placeholder="Nhập câu hỏi của bạn..."
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//               disabled={isTyping}
//               className="flex-1 w-full bg-gray-100 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60"
//             />
//             <button
//               onClick={() => handleSendMessage()}
//               disabled={isTyping || !inputMessage.trim()}
//               className="flex-shrink-0 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
//               aria-label="Gửi tin nhắn"
//             >
//               <Send size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;