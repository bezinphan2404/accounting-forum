# Bài viết gồm nhiều phần

Một bài có một tiêu đề, một phần bình luận và các tab nội dung. Cú pháp lưu nội bộ:

```
:::tabs
:::tab Phần 1: Tên phần
Nội dung Markdown, bảng và khối :::columns.
:::tab Phần 2: Tên phần
Nội dung phần tiếp theo.
:::endtabs
```

Chỉ một tab được hiển thị. Bàn phím hỗ trợ trái/phải, Home/End. Nút trước/sau và URL `#/thread/<id>?part=2` chọn đúng phần; không tạo bài hay bình luận riêng. Nguồn, bảng, bullet và watermark được giữ trong phần đang đọc.

Với bài sát giới hạn 50.000 ký tự, URL nền lặp lại có thể lưu bằng `bzref:nguon-1#page=14`, khai báo một lần ở khối `:::references` / `:::endreferences` cuối nội dung: `nguon-1 https://.../van-ban.pdf`. Trình hiển thị khôi phục đúng URL HTTPS và số trang trước khi xử lý Markdown; nhãn nguồn đầy đủ giữ nguyên. Khối khai báo không hiển thị. Không tăng giới hạn dữ liệu hay cấp quyền mới.

Đợt 25/10/2026: bốn bài có 3, 5, 6 và 9 tab. 19 bản ghi phần đã tạo nhầm được giữ để phục hồi, loại khỏi danh sách, kết quả tìm kiếm, trang hồ sơ và số đếm qua `published-series.js`. Các URL cũ chuyển về tab tương ứng của bài chính. Không xóa dữ liệu, không đổi RLS/grants hay đưa nội dung thành viên vào mã JavaScript công khai. Việc đọc bản ghi giữ lại chỉ thực hiện sau xác thực, trong bộ nhớ; xóa khi đăng xuất và bỏ qua phản hồi cũ.

Phân trang dùng vị trí đọc dữ liệu thô riêng với vị trí hiển thị để không tạo trang trống. Số đếm loại đúng phần theo chuyên mục cha/con, tác giả và mẫu tìm kiếm hiện có. Danh sách ID này là cấu hình cho bốn bài được duyệt, không tự gộp bài có tiêu đề giống nhau.
