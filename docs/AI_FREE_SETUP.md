# Bật AI miễn phí cho BZ Forum

Kiểm tra tài liệu chính thức ngày 24/10/2026. Bản tích hợp chọn `gemini-3.5-flash-lite`, chỉ gọi văn bản thông thường, không dùng tìm kiếm Google trả phí, file, hình ảnh hoặc dịch vụ dự phòng có phí.

**Chỉ bật nếu dự án Google của Zin có Free Tier và chưa gắn thanh toán.** Google không bảo đảm mọi tài khoản/dự án đều được dùng Free Tier. Nếu thấy “Free tier unavailable”, “Payment needed” hoặc yêu cầu bật billing, dừng lại; không thêm thẻ, không nạp tiền và không nâng gói trong nhiệm vụ này.

## Zin tự làm ba bước

1. Mở [Google AI Studio](https://aistudio.google.com/) bằng tài khoản của Zin. Xem phần API keys/Projects và kiểm tra dự án có ghi **Free Tier**, chưa gắn tài khoản thanh toán. Zin tự đọc/chấp thuận điều khoản nếu Google yêu cầu. Zin tự tạo khóa cho dự án miễn phí đó. Không gửi khóa vào chat, ảnh chụp, bài viết hoặc file trong repo.
2. Mở [dự án BZ Forum trên Vercel](https://vercel.com/bezinphan/accounting-forum), vào Settings → Environment Variables. Zin tự nhập ba biến cho môi trường Production bên dưới. Giá trị khóa cần để ở chế độ ẩn/bí mật; không thêm tiền tố `VITE_`.
3. Lưu và triển khai lại bản main mới nhất (Deployments → bản main → Redeploy). Sau đó mở BZ Forum, đăng nhập và chọn **Trợ lý AI**. Thử một câu không chứa dữ liệu riêng, ví dụ “GTGT nông sản ở khâu thương mại”.

| Tên biến | Giá trị Zin tự nhập |
| --- | --- |
| GEMINI_API_KEY | Khóa Gemini của đúng dự án Free Tier; Mi không cần biết giá trị này |
| AI_ENABLED | true |
| AI_FREE_TIER_CONFIRMED | true, chỉ khi Zin đã kiểm tra dự án thực sự ở Free Tier và không gắn thanh toán |

Nếu chỉ muốn tắt AI, đặt `AI_ENABLED=false` và triển khai lại. Việc tìm bài liên quan và Góp ý vẫn hoạt động.

## Những gì có thể dùng

- Thành viên: hỏi đáp dựa trên tối đa 4 bài liên quan của diễn đàn, kèm link để mở lại nguồn. Nếu chưa có nguồn phù hợp, hệ thống nói rõ và không gọi mô hình để bịa câu trả lời.
- Admin: thêm chế độ hỗ trợ biên tập bản nháp. AI hỗ trợ cách diễn đạt/bố cục và đánh dấu điểm cần kiểm chứng; không tự lưu hoặc đăng bài.
- Khi chưa nhập khóa, trang AI ghi rõ đang chờ kết nối. Nút **Tìm bài liên quan** vẫn dùng được, không cần khóa AI.

## Hạn mức và dữ liệu

Giới hạn ban đầu ở cơ sở dữ liệu: thành viên 5 yêu cầu/ngày; admin 10; toàn forum 20/ngày, tối đa 3/phút và mỗi tài khoản chờ 10 giây giữa hai lần. Đây là số lần thử gọi AI, kể cả khi dịch vụ không hoàn tất. Google có thể áp dụng hạn mức thấp hơn, thay đổi theo tài khoản/dự án; không cam kết một số lượt miễn phí cố định từ Google. Khi hết quota hoặc dự án không đủ điều kiện miễn phí, hệ thống báo dừng; không đổi sang mô hình/dịch vụ trả phí.

Gemini miễn phí có điều khoản cho phép Google sử dụng dữ liệu gửi và đầu ra để cải thiện sản phẩm, có thể có người đánh giá. Chỉ dùng nội dung kiến thức chung; không nhập thông tin riêng tư, hồ sơ nhân sự, tài chính công ty, mật khẩu hoặc tài liệu training nội bộ. Form yêu cầu người gửi xác nhận nội dung phù hợp trước khi gửi AI.

Ứng dụng không lưu lịch sử AI vào DB; chỉ lưu bộ đếm tài khoản/ngày. Gửi `store:false` để không dùng lịch sử tương tác phía API; điều này **không** có nghĩa là dịch vụ miễn phí không xử lý/giữ dữ liệu theo điều khoản của Google.

## Kết quả kiểm tra và giới hạn

Đã thử API bằng phản hồi giả có kiểm soát để kiểm tra xác thực, quyền admin, hạn mức, không lộ khóa, lọc nguồn, lỗi quota và không gọi dự phòng có phí. **Chưa xác nhận một câu trả lời Gemini thật** khi chưa có khóa do Zin tự cấu hình. Không coi phản hồi giả trong kiểm tra là chất lượng thực tế của mô hình.

Sau khi cấu hình, cần thử một câu hỏi và một yêu cầu biên tập thực tế không chứa dữ liệu riêng. Nếu không được cấp Free Tier, giữ AI tắt và dùng tìm bài/Góp ý; Mi sẽ cùng Zin chọn phương án khác miễn phí, không tự chuyển sang thanh toán.

Nguồn chính thức: [Giá và Free Tier](https://ai.google.dev/gemini-api/docs/pricing), [điều kiện thanh toán](https://ai.google.dev/gemini-api/docs/billing), [giới hạn tài khoản](https://ai.google.dev/gemini-api/docs/rate-limits), [Free Tier không khả dụng](https://ai.google.dev/gemini-api/docs/troubleshooting), [điều khoản dữ liệu](https://ai.google.dev/gemini-api/terms), [mô hình đang dùng](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite).
