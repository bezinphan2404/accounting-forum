# Biểu mẫu được phép phát hành — hồ sơ thiết kế

Cập nhật 25/10/2026: quyền khách đã thay đổi theo yêu cầu mới của Zin. Khách được đọc bài và tìm bài; tệp đính kèm vẫn chỉ dành cho thành viên đăng nhập. Nền tảng bucket private, metadata, phê duyệt và xem/tải đã được triển khai trong `009_guest_read_attachments.sql`, `js/attachments.js` và `js/remote-data.js`; xem [GUEST_ACCESS.md](GUEST_ACCESS.md). Chưa phát hành tệp nào trong đợt cập nhật này. Các mục dưới là hồ sơ thiết kế trước đó, không thay yêu cầu mới. Giao diện upload cho admin và lịch sử phê duyệt đầy đủ vẫn là phần phát triển sau.

Ngày 24/10/2026. Đây là thiết kế, **chưa phải tính năng đã triển khai**. Repo hiện không có viewer, storage bucket, bảng đính kèm hay chức năng upload/download. Bản thay đổi danh mục/quyền đọc không tự đưa bất kỳ tài liệu nào lên web.

## Hành vi đã chốt

- Thành viên đăng nhập mới xem nội dung và danh mục tài liệu.
- Template/biểu mẫu chỉ được tải khi Zin đã duyệt đúng file, phiên bản và quyền phát hành.
- Trang tài liệu ghi tên, mô tả, nguồn trực tiếp, chủ sở hữu bản quyền, điều kiện sử dụng và editor bản gốc. Không tự gán giấy phép Creative Commons hoặc quyền tái phát hành nếu nguồn chưa cho phép.
- Bản gốc trên website giữ editor và lịch sử phiên bản ở cơ sở dữ liệu. Người tải không có quyền sửa metadata hoặc thay file gốc qua API.
- File đã tải có thể bị sửa tên editor; watermark, chữ ký hay checksum chỉ hỗ trợ ghi nhận/xác minh. Không hứa ngăn tuyệt đối sao chép, trích xuất hoặc ảnh chụp màn hình.

## Cấu trúc phù hợp với Vite + Supabase hiện tại

1. Thêm bảng `forum_resources`: mã, tiêu đề, mô tả, category_id, bài liên quan, trạng thái draft/approved/withdrawn, source_url HTTPS, copyright_holder, license_text, original_editor_id và original_editor_name chụp tại lúc tạo. Các trường phê duyệt do DB ghi: approved_by và approved_at.
2. Thêm bảng `forum_resource_versions`: resource_id, số phiên bản, storage_path, tên file, MIME, kích thước, SHA-256 và ngày phát hành. Mỗi phiên bản có đường dẫn riêng, không cho ghi đè file cũ.
3. Dùng bucket **private** `forum-resources`; không đặt file trong public/ hoặc dùng URL public. Không dùng secret/service_role ở trình duyệt. Giới hạn đuôi/MIME/kích thước ở bucket và kiểm tra lại trước khi duyệt; không nhận file thực thi, macro hoặc HTML tùy ý.
4. Chỉ admin hiện có được tạo bản nháp, tải file lên và phê duyệt/rút phát hành. Không tạo vai trò đặc quyền mới cho thành viên. Thành viên chỉ đọc metadata của bản approved; chính sách storage SELECT phải đối chiếu đúng đường dẫn phiên bản thuộc tài liệu approved và được phép tải. Khách không đọc được bảng, RPC hay storage.
5. Dùng thao tác `storage.download` có xác thực rồi tạo Blob cho nút tải trong trình duyệt. Ưu tiên cách này để không có liên kết tải mang quyền truy cập tồn tại sau đăng xuất. Nếu sau này cần signed URL cho xem trước, chỉ cấp thời hạn ngắn và phải giải thích rằng URL còn dùng được cho tới hết hạn.
6. Tên editor bản gốc do hàm DB lấy từ hồ sơ lúc tạo, không nhận một tên tùy ý từ client. Thu hồi quyền UPDATE các cột gốc; trigger ngăn thay original_editor_id/name ở mọi luồng cập nhật thông thường. Sửa nguồn/giấy phép hoặc phát hành phiên bản mới phải có bản ghi lịch sử admin. Thay đổi tên hồ sơ sau này không viết lại tên editor của phiên bản cũ.

Với tài liệu chỉ đọc, ưu tiên nội dung HTML đã biên tập trong bài thành viên hiện có. Không gắn một file nguyên bản rồi gọi việc ẩn nút tải là bảo vệ file. Việc làm viewer chuyên biệt cần phạm vi và tài liệu được duyệt riêng.

## Giao diện cần bổ sung khi có file được duyệt

Admin: tạo tài liệu nháp → nhập nguồn/bản quyền/quyền dùng → tải đúng file → xem trước thông tin và phiên bản → xác nhận phát hành. Thành viên: mở trang tài liệu → xem nguồn, điều kiện dùng, editor và phiên bản → tải biểu mẫu được phép. Hiển thị trạng thái rút phát hành khi bản cũ không còn được cung cấp; không xóa âm thầm lịch sử.

## Kiểm tra bắt buộc trước khi đưa chức năng này lên thật

- Khách và thành viên chưa được cấp quyền không tải bằng đường dẫn đoán được, REST, RPC hay Storage API.
- Thành viên không tự duyệt tài liệu, đổi editor, sửa nguồn/giấy phép hoặc ghi đè file bằng API trực tiếp.
- Admin phát hành/rút bản nháp được; chỉ bản approved được tải. Sau rút phát hành hoặc đăng xuất, yêu cầu tải mới phải bị chặn.
- Kiểm tra loại file, giới hạn dung lượng, tên file và nguồn HTTPS; xem trang và nút tải trên điện thoại.
- Kiểm tra checksum và metadata của file thật đã được Zin duyệt; không dùng PDF training nội bộ làm dữ liệu thử production.

## Còn phụ thuộc Zin

Cần đúng file được phép phát hành, người/chủ sở hữu quyền, nguồn, điều kiện sử dụng, tên editor gốc và phạm vi cho phép người nhận sửa/tái phân phối. Chưa có đầu vào này trong nhiệm vụ kỹ thuật hiện tại. Không tự truy cập ổ G hoặc lấy PDF trong Input để đưa vào catalog.
