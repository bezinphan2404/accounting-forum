# Hạn chế sao chép ở vùng đọc bài

Theo yêu cầu Zin ngày25/10/2026 sau khi kiểm tra bằng tài khoản thành viên, vùng `.thread-detail-content` của trang đọc bài hạn chế bôi đen, chọn toàn bộ, sao chép/cắt, kéo thả và menu chuột phải trên chữ. Theo yêu cầu Zin bổ sung ngày25/10/2026, **Admin đã đăng nhập được bôi đen, chọn toàn bộ, sao chép/cắt và dùng menu chuột phải bình thường** để biên tập và làm video. Khách, thành viên thường và moderator vẫn bị hạn chế. Vai trò lấy từ hồ sơ hiện hành đã được xác thực qua data layer; không thêm nút bật quyền hay thay đổi vai trò ở máy chủ. Các tab phần, liên kết pháp lý, ảnh biểu mẫu và thao tác mở liên kết vẫn hoạt động.

Trình sửa bài, tạo bài, tìm kiếm, bình luận, đăng nhập và các ô nhập không bị hạn chế. Sự kiện copy/cut có vùng chọn chạm vào bài sẽ bị hủy, kể cả vùng chọn bắt đầu ngoài bài. Phím Ctrl/Cmd+A bị chặn trên trang đọc khi focus ngoài ô nhập. Khi điều hướng khỏi trang đọc, không còn vùng được đánh dấu nên trình xử lý không can thiệp. Listener dùng chung một lần cho mỗi document; thông báo bị giới hạn để không lặp dồn.

Không đọc hoặc ghi clipboard, không lưu lịch sử thao tác hay gửi dữ liệu ra ngoài. Không sửa quyền đọc, RLS, tài khoản hoặc nội dung đã đăng. Đây là hạn chế thao tác thông thường ở trình duyệt, không phải DRM; không thể bảo đảm chống trích xuất bằng công cụ phát triển, JavaScript bị tắt, tính năng trợ năng, OCR, lưu/in qua trình duyệt hoặc chụp màn hình. Watermark cá nhân tiếp tục giúp nhận diện bản chụp.

Tham chiếu API: [copy event và preventDefault](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event), [user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/user-select), [Range.intersectsNode](https://developer.mozilla.org/en-US/docs/Web/API/Range/intersectsNode). CSS không tự chặn được mọi vùng chọn nên có thêm xử lý sự kiện copy/cut.

Kiểm tra: copy vùng bài/vùng toàn trang, Ctrl/Cmd+A/C/X và Ctrl+Insert, chọn chữ/kéo thả/menu chữ; link nguồn và ảnh vẫn mở; ô tìm kiếm/bình luận/trình sửa không bị chặn; điều hướng và mount lại không làm lặp listener hoặc chặn nhầm trang khác. Kiểm tra UI thật trên1280px và390px, không đọc clipboard của người dùng.

Kiểm tra bổ sung: Admin sao chép và Ctrl/Cmd+A không bị hủy; remount từ guest/member sang Admin xóa lớp CSS chặn, từ Admin sang member/guest áp dụng lại hạn chế. Watermark, quyền đọc công khai, tài liệu riêng và bình luận giữ nguyên.
