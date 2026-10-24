# BZ Forum

Diễn đàn kế toán và tài chính dùng Vite và Supabase.

## Chạy trên máy

Yêu cầu Node.js 24. Chạy `npm ci`, `npm run dev`. Tạo bản phát hành bằng `npm run build`, xem thử bằng `npm run preview`.

## Dữ liệu và tài khoản

`js/remote-data.js` kết nối Supabase bằng publishable key dành cho trình duyệt. Không đưa secret key hoặc service_role key vào mã nguồn. Supabase Auth quản lý mật khẩu và xác nhận email. Hồ sơ công khai chỉ gồm tên hiển thị, giới thiệu và ngày tham gia.

Các cấu trúc trong `supabase/` đã được áp dụng lên dự án hiện tại; không chạy lại trên dự án đang có bảng. Quyền admin lưu trong `forum_roles`, chỉ quản lý qua cơ sở dữ liệu. Thành viên không có quyền tự cấp vai trò. Mọi nội dung forum chỉ dành cho thành viên đăng nhập bằng Google/email; khách không có quyền SELECT bảng hay thực thi RPC nội dung. Thành viên được tạo bài và bình luận; tác giả được sửa bài của mình, admin được sửa bài và bình luận. Lượt thích giới hạn một lượt mỗi tài khoản cho mỗi bài.

Đăng ký cần xác nhận email trước khi đăng nhập. Trong Supabase Authentication / URL Configuration, Site URL cần là tên miền chính thức. Chỉ thêm redirect URL của môi trường tin cậy.

## Đăng web

Vercel đã liên kết nhánh `main` và tự đăng sau khi cập nhật GitHub. `vercel.json` dùng lệnh `npm run build` và thư mục `dist`. GitHub Actions kiểm tra bản dựng; không cần tạo Vercel token mới. GitHub Pages có quy trình đăng riêng. Vite dùng đường dẫn tài nguyên tương đối để hỗ trợ cả hai nơi.

## Kiểm tra đã thực hiện

Bản dựng thành công; npm audit không còn cảnh báo tại thời điểm kiểm tra. Đã thử đăng nhập, admin, tạo bài, bình luận, sửa bài và đọc dữ liệu Supabase. Đã kiểm chứng chính sách cơ sở dữ liệu: không cho khách ghi dữ liệu, không cho giả tác giả hoặc tự nâng quyền, không cho thành viên sửa bài người khác.

## Phạm vi hiện tại

Chức năng gồm danh mục, tìm kiếm, sắp xếp, đăng ký/đăng nhập, bài viết, bình luận, lượt thích, trang cá nhân và quản trị sửa nội dung. Chưa có tải tệp đính kèm, xóa tài khoản, đo lượt xem hoặc công cụ cấp vai trò trong giao diện. Làm mới trang để nhận dữ liệu mới từ các trình duyệt khác. Bài mẫu cũ không tự chuyển vào dữ liệu thật.

## Quên mật khẩu

Trang đăng nhập có nút Quên mật khẩu. Supabase gửi liên kết về https://accounting-forum.vercel.app/?recovery=1; địa chỉ này đã được thêm vào danh sách cho phép. Chỉ phiên đã xác thực mới được đặt mật khẩu mới. Sau khi lưu thành công, người dùng đăng nhập lại. Liên kết hết hạn sẽ dẫn tới hướng dẫn yêu cầu liên kết mới. Không thay đổi mật khẩu hoặc khóa bí mật trong trang quản lý Supabase để hỗ trợ người dùng.

## Bài viết dạng cột

Có thể xem mẫu trong articles/vat-agriculture-2026.md. Khối :::columns kết thúc bằng :::endcolumns; tiêu đề cấp 3 chia cột và tiêu đề cấp 4 chia các bước. Nút Xem trước kiểm tra bố cục trước khi đăng. Trên màn hình nhỏ các cột xếp dọc.

## Danh mục chuyên sâu và quyền đọc (24/10/2026)

Migration `005_member_read_categories.sql` thêm parent_id/sort_order, giữ 8 mã nhóm cũ, tạo 38 chuyên mục con và đặt Hỏi đáp cuối. Nhóm mẹ lọc và đếm cả bài trực tiếp lẫn bài trong nhóm con. Migration 006 sau đó xếp hai bài hiện có có chủ đề rõ vào Thuế GTGT và BHXH; giữ nguyên nội dung/tác giả. Bài tổng hợp nhiều sắc thuế vẫn ở nhóm mẹ. Giao diện có nhóm mở/thu gọn, đường dẫn nhóm mẹ, breadcrumb và chọn nhóm khi tạo/sửa.

005 thu hồi quyền đọc cả bảng/cột của PUBLIC và anon; thay chính sách SELECT theo vai trò thành viên và kiểm tra danh tính trong mọi RPC trả nội dung. Tài khoản Auth ẩn danh không được coi là thành viên. Các quyền sửa/tác giả và bảo mật 003/004 vẫn được giữ. Đăng nhập/đăng ký Google và email, quên/đặt lại mật khẩu và privacy.html vẫn công khai.

Client không tải dữ liệu forum khi là khách. Đăng xuất, sự kiện đăng xuất từ tab khác, hết phiên và đổi tài khoản đều xóa cache; phản hồi đang tải dở không được phục hồi cache cũ. Đăng xuất dùng scope local để giữ phiên ở các thiết bị khác. Deep link được đưa qua đăng nhập rồi trở lại nội dung.

Áp dụng **migration 005, rồi 006** trên production đã có 001–004; không chạy lại schema ban đầu. Migration có transaction, áp dụng lặp được. Sau đó triển khai frontend mới, kiểm tra API khách bị chặn, thành viên đọc được và giao diện điện thoại. Không đưa khóa bí mật vào quá trình này.

Phần biểu mẫu chưa có storage/viewer/upload/download. Thiết kế triển khai tiếp nằm trong [docs/RESOURCES_DESIGN.md](docs/RESOURCES_DESIGN.md); chỉ phát hành file được Zin duyệt riêng.
