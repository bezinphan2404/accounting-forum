# Trợ lý AI và Góp ý ở góc màn hình

Hai nút góc dưới bên phải thay thanh tiện ích ngang cho thành viên. Khung hỏi AI và gửi góp ý mở trên trang đang đọc, có nút đóng, Escape và trả focus về nút mở; không tự mở khung. Điện thoại ẩn bóng nhắc, co khung theo chiều rộng/chiều cao màn hình, phần nội dung khung cuộn riêng.

Các trang #/ai và #/feedback vẫn dùng được qua link trong khung. Trang trợ lý đầy đủ giữ chế độ biên tập cho admin và trang góp ý giữ danh sách/phản hồi/phân trang.

Khung dùng lại getAIStatus, findAIArticles, askAI và createFeedback. Không sửa API máy chủ, cấu hình model, hạn mức, consent, quyền đọc/ghi hay billing. Chỉ kiểm tra trạng thái AI khi thành viên mở khung; chưa sẵn sàng vẫn tìm bài được. Hỏi AI cần đồng ý việc gửi nội dung tới dịch vụ như trang cũ. Góp ý có nhắc tính công khai trong cộng đồng trước khi nhập/gửi.

Không thêm dữ liệu vào storage. Khung chỉ hiện với thành viên ngoài các trang đăng nhập/khôi phục. Phản hồi không được đưa trở lại giao diện nếu khung đã đóng, trang đã thay hoặc danh tính đã đổi. Thử gửi góp ý và trả lời AI bằng API giả trong kiểm tra; không gửi góp ý thử hoặc câu hỏi mô hình trên production.
