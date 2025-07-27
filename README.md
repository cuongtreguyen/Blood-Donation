# Blood Donation Management System

## Mô tả
Hệ thống quản lý hiến máu với các tính năng quản lý người hiến máu, lịch sử hiến máu, và tạo giấy chứng nhận.

## Tính năng chính
- Quản lý danh sách người hiến máu
- Xem lịch sử hiến máu chi tiết
- Tạo giấy chứng nhận hiến máu
- Thống kê và báo cáo

## Xử lý dữ liệu hiến máu

### Vấn đề thường gặp
Có thể xảy ra sự không nhất quán giữa:
- **Số lần hiến hiển thị**: Lấy từ API `/blood-register/get-list-donation` (trường `unitDonation`)
- **Lịch sử hiến máu thực tế**: Lấy từ API `/blood-register/history/${userId}`

### Nguyên nhân
1. **Bản ghi chưa hoàn thành**: Có thể có các bản ghi hiến máu đã được tạo nhưng chưa có ngày hoàn thành (`completedDate` = null)
2. **Dữ liệu không hợp lệ**: Một số bản ghi có thể có `unit` = 0 hoặc dữ liệu không đầy đủ
3. **Đồng bộ hóa dữ liệu**: Hai API có thể trả về dữ liệu khác nhau

### Giải pháp đã áp dụng
1. **Lọc dữ liệu**: Chỉ hiển thị các bản ghi có `completedDate` và `unit > 0`
2. **Thông báo cảnh báo**: Hiển thị cảnh báo khi có sự khác biệt giữa số lần hiến hiển thị và thực tế
3. **Thông báo giải thích**: Thêm thông báo trong modal để người dùng hiểu rõ về việc lọc dữ liệu

### Cách sử dụng
- Khi xem lịch sử hiến máu, hệ thống sẽ tự động lọc và chỉ hiển thị các lần hiến đã hoàn thành
- Nếu có sự khác biệt, hệ thống sẽ hiển thị cảnh báo để người dùng biết
- Thông báo trong modal giải thích rằng chỉ hiển thị các lần hiến máu đã hoàn thành với dữ liệu đầy đủ

## Cài đặt và chạy

```bash
npm install
npm run dev
```

## Cấu trúc dự án
- `src/page/doctorpage/doctor/DonationHistoryPage.jsx`: Trang lịch sử hiến máu (doctor)
- `src/page/doctorpage/dashboard/DonorsPage.jsx`: Trang quản lý người hiến máu (dashboard)
- `src/services/donorsService.js`: Service xử lý dữ liệu người hiến máu
