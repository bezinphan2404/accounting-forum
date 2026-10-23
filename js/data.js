// ====================================
// BZ Accounting Forum – Data Layer
// Mock database using localStorage
// ====================================

const DB_KEY = 'bz_forum_db';

// ---------- seed data ----------------

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Kế toán tổng hợp', icon: '📊', color: '#457b9d', description: 'Thảo luận chung về nghiệp vụ kế toán' },
  { id: 'cat-2', name: 'Thuế',             icon: '🧾', color: '#e76f51', description: 'Thuế GTGT, TNCN, TNDN và các loại thuế khác' },
  { id: 'cat-3', name: 'Kế toán quản trị', icon: '📈', color: '#2a9d8f', description: 'Phân tích, dự toán, kiểm soát chi phí' },
  { id: 'cat-4', name: 'Kiểm toán',        icon: '🔍', color: '#9b8ec4', description: 'Kiểm toán nội bộ và kiểm toán độc lập' },
  { id: 'cat-5', name: 'Tài liệu & Biểu mẫu', icon: '📁', color: '#e9c46a', description: 'Chia sẻ file, mẫu biểu, template' },
  { id: 'cat-6', name: 'Hỏi đáp',          icon: '💬', color: '#f4a261', description: 'Đặt câu hỏi và giải đáp thắc mắc' },
  { id: 'cat-7', name: 'Excel & Phần mềm', icon: '💻', color: '#7ec8a0', description: 'Tips Excel, VBA, phần mềm kế toán' },
  { id: 'cat-8', name: 'Luật & Quy định',  icon: '⚖️', color: '#e07a8f', description: 'Cập nhật luật, nghị định, thông tư' },
];

const DEFAULT_USERS = [
  { id: 'user-1', name: 'Phan Thị Bezin', email: 'bezin@bzforum.vn',  password: 'bezin123', avatar: 'BZ', role: 'admin',     bio: 'Khối Tài chính – Kế toán | Dược Phẩm Hoàng Vũ | Founder BZ Forum', joinDate: '2024-01-15' },
  { id: 'user-2', name: 'Nguyễn Hương',   email: 'huong@example.com', password: 'demo123',  avatar: 'NH', role: 'member',    bio: 'Kế toán trưởng, 10 năm kinh nghiệm',          joinDate: '2024-02-20' },
  { id: 'user-3', name: 'Trần Minh',      email: 'minh@example.com',  password: 'demo123',  avatar: 'TM', role: 'member',    bio: 'Chuyên viên thuế tại Big4',                    joinDate: '2024-03-10' },
  { id: 'user-4', name: 'Lê Thảo',        email: 'thao@example.com',  password: 'demo123',  avatar: 'LT', role: 'moderator', bio: 'Kiểm toán viên, CPA',                         joinDate: '2024-04-05' },
  { id: 'user-5', name: 'Phạm Đức',       email: 'duc@example.com',   password: 'demo123',  avatar: 'PĐ', role: 'member',    bio: 'Kế toán quản trị, MBA',                       joinDate: '2024-05-12' },
];

const DEFAULT_THREADS = [
  {
    id: 'thread-tax-q3-2026',
    title: 'Cẩm nang kê khai thuế GTGT và TNCN Quý 3/2026 theo gói pháp luật mới 01/07/2026 (Luật QLT 108/2025, NĐ 252, TT 89/2026, NĐ 253, NĐ 254)',
    content: `Chào tất cả các anh chị em đồng nghiệp kế toán - tài chính trên BZ Forum!

Kỳ kê khai **Quý 3/2026** (tháng 10/2026) là kỳ tính thuế đầu tiên áp dụng toàn diện **Gói pháp luật mới có hiệu lực từ 01/07/2026** (Luật Quản lý thuế số 108/2025/QH15, Nghị định 252, Thông tư 89, Nghị định 254, Thông tư 91, Luật TNCN 109, Nghị định 253...). 

Để giúp các bạn nắm bắt nhanh nhất, tránh bị rối mắt bởi các văn bản pháp luật dày đặc, **chị Phan Thị Bezin (Dược Phẩm Hoàng Vũ)** đã hệ thống hóa toàn bộ dưới dạng **CÁC BẢNG ĐỐI CHIẾU & TRA CỨU TRỰC QUAN** dưới đây:

---

### PHẦN I: ⚖️ BẢNG ĐỐI CHIẾU CĂN CỨ PHÁP LÝ & QUY ĐỊNH MỚI ÁP DỤNG TỪ 01/07/2026

| Nội dung | Căn cứ cũ | Quy định MỚI 2026 áp dụng Quý 3 | Căn cứ pháp lý mới |
| :--- | :--- | :--- | :--- |
| **Quản lý thuế & Kê khai** | Luật QLT 38/2019<br>NĐ 126/2020<br>TT 80/2021 | Kê khai theo chuẩn dữ liệu XML mới; thời hạn nộp tờ khai Quý 3 là 31/10/2026; khai bổ sung trong vòng 05 năm (cũ 10 năm) | **Luật QLT 108/2025/QH15**<br>**Nghị định 252/2026/NĐ-CP**<br>**Thông tư 89/2026/TT-BTC** |
| **Hóa đơn điện tử (HĐĐT)** | NĐ 123/2020<br>TT 78/2021 | Hóa đơn đặt in của CQT hết giá trị sử dụng từ 01/07/2026. Hóa đơn ghi "Bán cho người tiêu dùng" không được tính chi phí. Sai tên/địa chỉ chỉ nộp Mẫu 04/SS | **Nghị định 254/2026/NĐ-CP**<br>**Thông tư 91/2026/TT-BTC** (Điều 10, Điều 43) |
| **Ngưỡng thanh toán KDTM (GTGT)** | 20.000.000 đ | **Từ 5.000.000 đ trở lên** (đã gồm thuế) bắt buộc phải thanh toán KDTM. Cùng người bán trong cùng ngày tổng ≥ 5 triệu bắt buộc KDTM cho toàn bộ | **Điều 26 NĐ 181/2025/NĐ-CP** (khoản 3) |
| **Hàng mua trả chậm, trả góp** | Chưa rõ ràng | Khấu trừ ngay trong Quý 3; đến hạn theo HĐ không có chứng từ KDTM thì điều chỉnh **GIẢM tại chỉ tiêu [37]**; khi có chứng từ khấu trừ lại tại **chỉ tiêu [38]** | **NĐ 144/2026/NĐ-CP** sửa Điều 26 NĐ 181/2025 |
| **Thuế suất GTGT 8%** | 10% | Tiếp tục giảm 2% (thuế suất 8%) đến hết ngày 31/12/2026; kê khai chỉ tiêu [32a] và Phụ lục giảm thuế đi kèm | **Nghị quyết 204/2025/QH15** |
| **Mức giảm trừ gia cảnh TNCN** | Bản thân: 11 tr/th<br>Phụ thuộc: 4,4 tr/th | **Bản thân: 15.500.000 đ/tháng** (186 tr/năm)<br>**Mỗi người phụ thuộc: 6.200.000 đ/tháng** (74,4 tr/năm) | **Nghị quyết 110/2025/UBTVQH15** |
| **Biểu thuế lũy tiến từng phần** | 7 bậc | **Rút gọn còn 5 BẬC** (Bậc 1: đến 10tr: 5%; Bậc 2: 10-30tr: 10%; Bậc 3: 30-60tr: 20%; Bậc 4: 60-100tr: 30%; Bậc 5: trên 100tr: 35%) | Điều 9, 10 **Luật TNCN 109/2025/QH15** |
| **2 Khoản giảm trừ mới hoàn toàn** | Không có | **Chi phí Y tế** (tối đa 23 tr/năm) & **Giáo dục - đào tạo** (tối đa 24 tr/năm). Cá nhân có giảm trừ này **bắt buộc tự quyết toán thuế** | **Điều 49 & 51 NĐ 253/2026/NĐ-CP** |
| **Phụ cấp ăn trưa, giữa ca** | 730.000 đ/tháng | **≤ 1.200.000 đ/người/tháng** (nếu chi tiền mặt); NSDLĐ tự tổ chức bữa ăn/phiếu ăn thì **miễn toàn bộ, không giới hạn** | Điểm g khoản 2 Điều 8 **NĐ 253/2026/NĐ-CP** |
| **Ngưỡng khấu trừ 10% tại nguồn** | Từ 2.000.000 đ/lần | **Từ 5.000.000 đ/lần trở lên** (lao động vãng lai, thử việc, không HĐLĐ hoặc HĐLĐ < 3 tháng). Dưới 5 triệu chỉ khấu trừ khi cá nhân yêu cầu | Khoản 2 Điều 50 **NĐ 253/2026/NĐ-CP** |
| **Đăng ký người phụ thuộc** | Kê khai hàng năm | Chỉ đăng ký và nộp hồ sơ chứng minh **01 LẦN DUY NHẤT** cho mỗi người phụ thuộc; hạn chậm nhất 31/12 | Điều 6 NĐ 252 & **Thông tư 90/2026/TT-BTC** |

---

### PHẦN II: 📅 BẢNG TRA CỨU NHANH GIA HẠN NỘP THUẾ THEO NGHỊ ĐỊNH 245/2026/NĐ-CP

| Loại thuế | Kỳ tính thuế | Thời gian gia hạn | Hạn nộp thuế sau gia hạn | Hạn chót nộp Giấy đề nghị gia hạn |
| :--- | :--- | :---: | :---: | :---: |
| **Thuế GTGT (DN 43 ngành & DNNVV)** | **Quý 3/2026** | **05 tháng** | **30/12/2026** | **Chậm nhất 02/11/2026** (Gửi sau ngày này là mất quyền) |
| **Thuế TNDN tạm nộp** | **Quý 3/2026** | **02 tháng** | **30/12/2026** | Chậm nhất 02/11/2026 |
| **Thuế GTGT tháng** | Tháng 6, 7, 8, 9/2026 | 05 tháng | 21/12/2026 | Chậm nhất 02/11/2026 |
| **Tiền thuê đất năm 2026 (50%)** | Năm 2026 (kỳ 1) | 05 tháng | 02/11/2026 | Chậm nhất 02/11/2026 |

---

### PHẦN III: 🧾 BẢNG HƯỚNG DẪN CÁC CHỈ TIÊU TRỌNG YẾU TỜ KHAI THUẾ GTGT (MẪU 01/GTGT THEO TT 89/2026)

| Chỉ tiêu | Tên chỉ tiêu | Cách xác định số liệu chuẩn 2026 | Lưu ý rủi ro kế toán cần tránh |
| :---: | :--- | :--- | :--- |
| **[22]** | Thuế GTGT còn được khấu trừ kỳ trước | Lấy chính xác từ **Chỉ tiêu [43]** của Tờ khai Quý 2/2026 | Tuyệt đối không tự ý gõ tay sửa số. Nếu Quý 2 có nộp KHBS thì điều chỉnh vào chỉ tiêu [37] hoặc [38] Quý 3 |
| **[23] & [24]** | Giá trị & Thuế GTGT của HHDV mua vào | Tổng giá trị và thuế GTGT từ hóa đơn điện tử mua vào phát sinh trong Quý 3 | Phải đối chiếu dữ liệu cổng hoadondientu.gdt.gov.vn trước khi chốt, tránh bỏ sót hóa đơn nhà cung cấp gửi trễ |
| **[25]** | Thuế GTGT đầu vào ĐỦ ĐIỀU KIỆN khấu trừ | Chỉ tiêu [25] ≤ [24]. Chỉ đưa vào số thuế của hóa đơn có chứng từ KDTM hợp lệ | ⚠️ **Loại bỏ ngay:** Hóa đơn từ 5.000.000 đ thanh toán tiền mặt; các hóa đơn cùng 1 người bán trong ngày tổng ≥ 5 triệu trả tiền mặt |
| **[32a]** | HHDV chịu thuế suất 8% (giảm 2%) | Kê khai doanh thu và thuế GTGT 8% theo NQ 204/2025/QH15 | Đi kèm Phụ lục giảm thuế theo mẫu quy định; rà soát đúng mã ngành thuộc đối tượng giảm |
| **[37] & [38]** | Điều chỉnh giảm / tăng thuế GTGT đầu vào | Kê khai điều chỉnh số thuế đầu vào phát sinh sai sót kỳ trước (chỉ làm giảm số phải nộp hoặc tăng/giảm khấu trừ) | Dùng để điều chỉnh giảm khi hàng trả chậm/trả góp đến hạn không có chứng từ KDTM; khấu trừ lại khi đã có chứng từ KDTM |
| **[40] / [43]** | Thuế phải nộp / Còn được khấu trừ | Nếu [40] > 0: Thuế phải nộp. Nếu [43] > 0: Chuyển khấu trừ sang Quý 4/2026 | Nếu thuộc diện NĐ 245/2026 thì nộp thuế trước 30/12/2026. Nếu không thuộc diện gia hạn thì hạn nộp là 31/10/2026 |

---

### PHẦN IV: 👤 BẢNG BIỂU THUẾ LŨY TIẾN TỪNG PHẦN 5 BẬC (LUẬT TNCN 109/2025) & MẪU 05/KK-TNCN

| Bậc thuế | Thu nhập tính thuế / tháng | Thu nhập tính thuế / năm | Thuế suất (%) | Số thuế tính nhanh theo tháng |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Đến 10.000.000 đ | Đến 120.000.000 đ | **5%** | 5% × TNTT |
| **2** | Trên 10 – 30 triệu đ | Trên 120 – 360 triệu đ | **10%** | 10% × TNTT − 500.000 đ |
| **3** | Trên 30 – 60 triệu đ | Trên 360 – 720 triệu đ | **20%** | 20% × TNTT − 3.500.000 đ |
| **4** | Trên 60 – 100 triệu đ | Trên 720 – 1.200 triệu đ | **30%** | 30% × TNTT − 9.500.000 đ |
| **5** | Trên 100.000.000 đ | Trên 1.200.000.000 đ | **35%** | 35% × TNTT − 14.500.000 đ |

*(Ví dụ: Nhân viên lương 40 triệu/tháng, 2 người phụ thuộc, đóng BHXH 10,5% (3,15tr) → Giảm trừ: 15,5tr + 2×6,2tr = 27,9tr → Thu nhập tính thuế = 40tr − 3,15tr − 27,9tr = 8,95 triệu (Bậc 1) → Thuế TNCN chỉ phải nộp: 8,95tr × 5% = 447.500 đ/tháng — Giảm hơn 757.000 đ/tháng so với mức cũ).*

---

### PHẦN V: 📋 CHECKLIST 6 VIỆC KẾ TOÁN PHẢI LÀM NGAY CHO KỲ QUÝ 3/2026

| Hạn thực hiện | Công việc kế toán phải thực hiện ngay | Rủi ro pháp lý nếu bỏ sót |
| :--- | :--- | :--- |
| **LÀM NGAY** | Khóa quy trình thanh toán: chặn tiền mặt từ 5.000.000 đ; chốt chặn "cùng người bán – cùng ngày – tổng từ 5 triệu" | Mất quyền khấu trừ thuế GTGT và bị loại toàn bộ chi phí được trừ TNDN |
| **LÀM NGAY** | Tra cứu cổng hoadondientu.gdt.gov.vn: loại bỏ hóa đơn "Bán cho người tiêu dùng", tiêu hủy hóa đơn đặt in chưa dùng | Bị loại chi phí khi quyết toán; sử dụng hóa đơn bất hợp pháp bị phạt nặng |
| **LÀM NGAY** | Rà soát HĐLĐ và quy chế lương: tách riêng hỗ trợ điện thoại, đi lại, nhà ở thành mục riêng (TT 10/2020) | Tránh bị cơ quan BHXH quy vào hành vi "trốn đóng BHXH" phạt 18–20% (NĐ 283/2026) |
| **LÀM NGAY** | Lập Bảng kê thời gian và tiền làm thêm giờ, ban đêm lưu tại doanh nghiệp | Bị loại quyền miễn thuế TNCN đối với khoản lương làm thêm giờ (Điều 26 NĐ 253) |
| **Trước 31/10/2026** | Nộp Tờ khai thuế GTGT (01/GTGT) và TNCN (05/KK-TNCN) Quý 3/2026 theo chuẩn TT 89/2026 | Bị xử phạt vi phạm hành chính chậm nộp hồ sơ khai thuế (từ 2 đến 25 triệu theo NĐ 125) |
| **CHẬM NHẤT 02/11/2026** | Gửi Giấy đề nghị gia hạn nộp thuế theo Mẫu Phụ lục II NĐ 245/2026 (gửi 01 lần cho toàn bộ các kỳ) | Mất quyền gia hạn nộp thuế GTGT Quý 3 (30/12/2026) và bị tính tiền chậm nộp 0,03%/ngày |

---

Cẩm nang này được xây dựng dựa trên bản đồ văn bản thực thi chuẩn hóa năm 2026. Chúc toàn thể anh chị em đồng nghiệp kế toán hoàn thành kỳ báo cáo Quý 3/2026 chuẩn xác, tối ưu chi phí và tuyệt đối an toàn về thuế! 

Mọi thắc mắc về tình huống thực tế hoặc các điều khoản mới của Thông tư 89/2026 và NĐ 252 - NĐ 254, các bạn hãy thảo luận ngay bên dưới nhé, **chị Bezin** và các mod sẽ cùng giải đáp hỗ trợ! 💬`,
    authorId: 'user-1', categoryId: 'cat-2',
    createdAt: '2026-10-15T08:30:00', views: 2450, likes: 215,
    tags: ['thuế GTGT', 'thuế TNCN', 'Quý 3/2026', 'Luật QLT 108/2025', 'Thông tư 89/2026', 'Nghị định 252/2026'], pinned: true
  },
  {
    id: 'thread-1',
    title: 'Hướng dẫn xử lý hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP',
    content: `Chào các bạn,\n\nHôm nay mình chia sẻ kinh nghiệm xử lý hóa đơn điện tử (HĐĐT) theo Nghị định 123/2020/NĐ-CP và Thông tư 78/2021/TT-BTC.\n\n**1. Các loại hóa đơn điện tử:**\n- Hóa đơn GTGT\n- Hóa đơn bán hàng\n- Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn\n\n**2. Thời điểm lập hóa đơn:**\n- Đối với bán hàng hóa: thời điểm chuyển giao quyền sở hữu\n- Đối với cung cấp dịch vụ: thời điểm hoàn thành việc cung cấp dịch vụ\n\n**3. Xử lý hóa đơn sai sót:**\n- Hóa đơn chưa gửi cho người mua: hủy và lập lại\n- Hóa đơn đã gửi: lập hóa đơn điều chỉnh hoặc thay thế\n\nCác bạn có thắc mắc gì cứ comment bên dưới nhé!`,
    authorId: 'user-1', categoryId: 'cat-2',
    createdAt: '2024-09-15T08:30:00', views: 342, likes: 28,
    tags: ['hóa đơn', 'nghị định 123', 'HĐĐT'], pinned: true
  },
  {
    id: 'thread-2',
    title: 'Cách hạch toán chi phí lương và các khoản trích theo lương năm 2024',
    content: `Mình tổng hợp lại cách hạch toán lương và các khoản trích theo lương theo quy định mới nhất.\n\n**Các bút toán cơ bản:**\n\n1. Tính lương phải trả NLĐ:\nNợ TK 622, 627, 641, 642\nCó TK 334\n\n2. Trích BHXH, BHYT, BHTN, KPCĐ (phần DN):\nNợ TK 622, 627, 641, 642\nCó TK 3383 (BHXH 17.5%)\nCó TK 3384 (BHYT 3%)\nCó TK 3386 (BHTN 1%)\nCó TK 3382 (KPCĐ 2%)\n\n3. Khấu trừ các khoản (phần NLĐ):\nNợ TK 334\nCó TK 3383 (BHXH 8%)\nCó TK 3384 (BHYT 1.5%)\nCó TK 3386 (BHTN 1%)\nCó TK 3335 (Thuế TNCN)\n\n4. Chi trả lương:\nNợ TK 334\nCó TK 111, 112\n\nBạn nào cần file Excel tính lương tự động thì inbox mình nhé!`,
    authorId: 'user-2', categoryId: 'cat-1',
    createdAt: '2024-09-14T14:20:00', views: 567, likes: 45,
    tags: ['lương', 'BHXH', 'hạch toán'], pinned: false
  },
  {
    id: 'thread-3',
    title: 'Chia sẻ file Excel bảng tính thuế TNCN tự động - Cập nhật 2024',
    content: `Xin chào mọi người,\n\nMình vừa update lại file Excel tính thuế TNCN tự động theo biểu thuế luỹ tiến từng phần mới nhất.\n\n**Tính năng của file:**\n- Tự động tính thuế TNCN theo biểu thuế luỹ tiến\n- Tính giảm trừ gia cảnh (bản thân + người phụ thuộc)\n- Tổng hợp theo tháng/quý/năm\n- Xuất tờ khai 05/KK-TNCN\n- Hỗ trợ tính quyết toán cuối năm\n\n**Hướng dẫn sử dụng:**\n1. Nhập thông tin nhân viên vào sheet "DanhSach"\n2. Nhập số người phụ thuộc\n3. Nhập thu nhập hàng tháng\n4. File sẽ tự động tính toán\n\nFile không có virus hay macro lạ, các bạn yên tâm tải về dùng.`,
    authorId: 'user-3', categoryId: 'cat-5',
    createdAt: '2024-09-13T09:15:00', views: 891, likes: 72,
    tags: ['Excel', 'TNCN', 'thuế', 'tài liệu'], pinned: false
  },
  {
    id: 'thread-4',
    title: 'Kinh nghiệm quyết toán thuế TNDN cuối năm - Những lỗi thường gặp',
    content: `Sắp đến mùa quyết toán rồi, mình chia sẻ một số kinh nghiệm để các bạn tránh sai sót.\n\n**10 lỗi thường gặp khi quyết toán thuế TNDN:**\n\n1. Không loại bỏ chi phí không có hóa đơn\n2. Hạch toán sai kỳ (chi phí năm trước đưa vào năm nay)\n3. Quên loại chi phí vượt định mức (tiếp khách > 15% tổng CF)\n4. Chi phí khấu hao TSCĐ không đúng quy định\n5. Không theo dõi lỗ chuyển kỳ đúng thời hạn (5 năm)\n6. Sai biệt kế toán và thuế không được điều chỉnh\n7. Chi phí lãi vay vượt mức quy định (NĐ 132)\n8. Quên kê khai các khoản giảm thuế, ưu đãi thuế\n9. Không đối chiếu số liệu với tờ khai thuế GTGT\n10. Nộp quyết toán chậm (hạn: 31/3 năm sau)\n\nCác bạn bổ sung thêm nhé!`,
    authorId: 'user-4', categoryId: 'cat-2',
    createdAt: '2024-09-12T16:45:00', views: 423, likes: 35,
    tags: ['TNDN', 'quyết toán', 'kinh nghiệm'], pinned: false
  },
  {
    id: 'thread-5',
    title: 'Hỏi: Cách xử lý chênh lệch tỷ giá hối đoái theo TT200?',
    content: `Em chào các anh chị,\n\nCông ty em có phát sinh giao dịch bằng USD. Em đang gặp khó khăn trong việc hạch toán chênh lệch tỷ giá.\n\n**Tình huống cụ thể:**\n- Ngày 01/09: Mua hàng $10,000, tỷ giá 24,500 VND/USD\n- Ngày 15/09: Thanh toán $10,000, tỷ giá 24,800 VND/USD\n\nEm hạch toán chênh lệch như thế nào ạ? Dùng tỷ giá nào: NHNN, ngân hàng giao dịch hay tỷ giá mua?\n\nCảm ơn các anh chị!`,
    authorId: 'user-5', categoryId: 'cat-6',
    createdAt: '2024-09-11T10:00:00', views: 234, likes: 12,
    tags: ['tỷ giá', 'ngoại tệ', 'TT200'], pinned: false
  },
  {
    id: 'thread-6',
    title: 'Tổng hợp các mẫu biểu kế toán thông dụng theo Thông tư 200/2014/TT-BTC',
    content: `Xin chào cả nhà,\n\nMình tổng hợp lại các mẫu biểu kế toán thông dụng nhất theo TT200. Ai cần mẫu nào cứ comment bên dưới nhé.\n\n**Danh sách mẫu biểu:**\n\n📋 Chứng từ kế toán:\n- Phiếu thu, Phiếu chi\n- Giấy đề nghị thanh toán\n- Giấy đề nghị tạm ứng\n- Phiếu nhập kho, Phiếu xuất kho\n- Biên bản bàn giao TSCĐ\n\n📊 Sổ kế toán:\n- Sổ nhật ký chung\n- Sổ cái tổng hợp\n- Sổ chi tiết công nợ\n- Sổ quỹ tiền mặt\n- Sổ tiền gửi ngân hàng\n\n📑 Báo cáo tài chính:\n- Bảng cân đối kế toán (B01-DN)\n- Báo cáo KQHĐKD (B02-DN)\n- Báo cáo lưu chuyển tiền tệ (B03-DN)\n- Thuyết minh BCTC (B09-DN)\n\nTất cả đã format đẹp, sẵn sàng in.`,
    authorId: 'user-1', categoryId: 'cat-5',
    createdAt: '2024-09-10T11:30:00', views: 1203, likes: 96,
    tags: ['mẫu biểu', 'TT200', 'tài liệu'], pinned: true
  },
  {
    id: 'thread-7',
    title: 'Review phần mềm kế toán 2024: MISA vs FAST vs SAP - Nên dùng phần mềm nào?',
    content: `Nhiều bạn inbox hỏi mình nên chọn phần mềm kế toán nào, nên mình viết bài review chi tiết.\n\n**1. MISA (⭐⭐⭐⭐)**\n✅ Giao diện thân thiện, dễ sử dụng\n✅ Hỗ trợ tốt cho DN Việt Nam\n✅ Giá hợp lý\n❌ Tốc độ xử lý chậm khi dữ liệu lớn\n\n**2. FAST (⭐⭐⭐⭐)**\n✅ Phù hợp DN sản xuất\n✅ Module quản lý kho mạnh\n❌ Giao diện hơi cũ\n\n**3. SAP (⭐⭐⭐⭐⭐)**\n✅ Hệ thống toàn diện, mạnh mẽ\n✅ Phù hợp DN lớn, đa quốc gia\n❌ Chi phí rất cao\n❌ Cần đội ngũ IT chuyên biệt\n\n**Kết luận:**\n- DN nhỏ → MISA\n- DN vừa, sản xuất → FAST\n- DN lớn, FDI → SAP`,
    authorId: 'user-2', categoryId: 'cat-7',
    createdAt: '2024-09-09T15:00:00', views: 678, likes: 52,
    tags: ['phần mềm', 'MISA', 'FAST', 'SAP', 'review'], pinned: false
  },
  {
    id: 'thread-8',
    title: 'Hướng dẫn lập Báo cáo tài chính theo Thông tư 200 - Chi tiết từ A đến Z',
    content: `Đây là bài hướng dẫn chi tiết cách lập Báo cáo tài chính (BCTC) theo TT200.\n\n**I. Bảng cân đối kế toán (B01-DN)**\n\nNguyên tắc lập:\n- Tuân thủ nguyên tắc kỳ kế toán\n- Số liệu lấy từ sổ kế toán đã khóa sổ\n- Đối chiếu với biên bản kiểm kê\n\n**Tài sản ngắn hạn:**\n- Mã 100: Tiền và tương đương tiền = Dư Nợ TK 111 + 112 + 121\n- Mã 130: Các khoản phải thu = Dư Nợ TK 131 + 136 + 138 + 141\n- Mã 140: Hàng tồn kho = Dư Nợ TK 151 + 152 + 153 + 154 + 155 + 156 + 157\n\n**Tài sản dài hạn:**\n- Mã 220: TSCĐ = Dư Nợ TK 211 - Dư Có TK 214\n- Mã 260: Chi phí XDCB dở dang = Dư Nợ TK 241\n\n(Mình sẽ update thêm phần Nguồn vốn, BCKQKD và BCLCTT ở comment bên dưới)`,
    authorId: 'user-1', categoryId: 'cat-1',
    createdAt: '2024-09-08T09:00:00', views: 1567, likes: 120,
    tags: ['BCTC', 'TT200', 'hướng dẫn'], pinned: true
  },
  {
    id: 'thread-9',
    title: 'Cập nhật Nghị định 65/2024 - Thay đổi quan trọng về quản lý thuế',
    content: `Chào các bạn,\n\nNghị định 65/2024/NĐ-CP vừa được ban hành với một số thay đổi quan trọng.\n\n**Những điểm mới đáng chú ý:**\n\n1. Thay đổi về mức phạt vi phạm hành chính thuế\n2. Bổ sung quy định về quản lý thuế đối với giao dịch liên kết\n3. Cập nhật quy trình hoàn thuế\n4. Quy định mới về kê khai bổ sung\n\n**Hiệu lực:** Từ ngày 01/07/2024\n\nCác bạn nên đọc kỹ và cập nhật vào quy trình nội bộ sớm.\n\nAi có câu hỏi về điểm nào cụ thể thì comment nhé!`,
    authorId: 'user-4', categoryId: 'cat-8',
    createdAt: '2024-09-07T13:20:00', views: 345, likes: 23,
    tags: ['nghị định', 'cập nhật', 'quản lý thuế'], pinned: false
  },
  {
    id: 'thread-10',
    title: 'Hướng dẫn phân tích báo cáo tài chính cho người mới bắt đầu',
    content: `Bài viết dành cho các bạn mới bước vào nghề kế toán quản trị.\n\n**Các chỉ số tài chính quan trọng:**\n\n📊 Nhóm thanh toán:\n- Hệ số thanh toán hiện hành = TSNH / Nợ NH\n- Hệ số thanh toán nhanh = (TSNH - HTK) / Nợ NH\n\n📈 Nhóm hiệu quả:\n- ROA = Lợi nhuận sau thuế / Tổng tài sản\n- ROE = Lợi nhuận sau thuế / Vốn CSH\n- Vòng quay HTK = GVHB / HTK bình quân\n\n💰 Nhóm đòn bẩy:\n- Hệ số nợ = Tổng nợ / Tổng tài sản\n- Đòn bẩy tài chính = Tổng TS / Vốn CSH\n\n**Cách đọc và phân tích:**\n- So sánh theo thời gian (trend analysis)\n- So sánh với ngành (benchmark)\n- Kết hợp nhiều chỉ số để có bức tranh tổng thể`,
    authorId: 'user-5', categoryId: 'cat-3',
    createdAt: '2024-09-06T10:45:00', views: 456, likes: 38,
    tags: ['phân tích', 'BCTC', 'chỉ số tài chính'], pinned: false
  }
];

const DEFAULT_REPLIES = [
  { id: 'reply-tax-1', threadId: 'thread-tax-q3-2026', content: 'Cảm ơn chị Phan Thị Bezin! Sổ tay tổng hợp quá xuất sắc và kịp thời. Cho em hỏi về quy định mới ở NĐ 181/2025: Bên em có giao dịch mua văn phòng phẩm cùng 1 nhà cung cấp trong 1 ngày chia làm 2 hóa đơn 2.500.000đ và 3.000.000đ (tổng 5,5 triệu) thanh toán tiền mặt thì xử lý trên tờ khai Quý 3 thế nào ạ?', authorId: 'user-2', createdAt: '2026-10-15T09:15:00', likes: 16 },
  { id: 'reply-tax-2', threadId: 'thread-tax-q3-2026', content: 'Chào Hương! Theo khoản 3 Điều 26 NĐ 181/2025, trường hợp mua nhiều lần dưới 5 triệu của cùng 1 người bán trong cùng 1 ngày mà tổng từ 5.000.000đ trở lên thì BẮT BUỘC phải thanh toán không dùng tiền mặt cho toàn bộ. Do bên em đã lỡ trả tiền mặt nên:\n1. Thuế GTGT đầu vào không được khấu trừ, em phải loại ra khỏi Chỉ tiêu [25] của Tờ khai 01/GTGT Quý 3.\n2. Toàn bộ tiền hàng cũng bị loại khỏi chi phí được trừ khi tính thuế TNDN theo điểm c khoản 1 Điều 9 NĐ 320/2025.\nCác bạn kế toán nhớ khóa ngay quy trình mua hàng để tránh thiệt hại kép nhé!', authorId: 'user-1', createdAt: '2026-10-15T10:00:00', likes: 28 },
  { id: 'reply-tax-3', threadId: 'thread-tax-q3-2026', content: 'Chị Bezin nhấn mạnh điểm mốc 02/11/2026 gửi Giấy đề nghị gia hạn thuế theo NĐ 245/2026 là sống còn luôn! Rất nhiều doanh nghiệp cứ nghĩ hạn nộp thuế được tự động lùi, không nộp mẫu Phụ lục II trước 02/11/2026 là mất luôn quyền gia hạn thuế GTGT Quý 3 và TNDN tạm nộp.', authorId: 'user-3', createdAt: '2026-10-15T11:20:00', likes: 24 },
  { id: 'reply-tax-4', threadId: 'thread-tax-q3-2026', content: 'Bổ sung thêm: Với 2 khoản giảm trừ mới về Y tế (23tr) và Giáo dục (24tr) theo Điều 49 NĐ 253/2026, nhân viên trong công ty thường hỏi nhờ trừ luôn. Các bạn kế toán lưu ý là khi kê khai tạm nộp Quý 3 công ty chưa trừ khoản này nhé, vì người lao động bắt buộc phải TỰ QUYẾT TOÁN THUẾ cuối năm kèm hóa đơn bảng kê viện phí theo khoản 3 Điều 51 NĐ 253.', authorId: 'user-4', createdAt: '2026-10-15T14:30:00', likes: 20 },
  { id: 'reply-1',  threadId: 'thread-1', content: 'Cảm ơn chị Bezin! Bài viết rất chi tiết. Em muốn hỏi thêm về trường hợp hóa đơn đã gửi CQT nhưng phát hiện sai tên người mua thì xử lý thế nào ạ?', authorId: 'user-2', createdAt: '2024-09-15T09:45:00', likes: 5 },
  { id: 'reply-2',  threadId: 'thread-1', content: 'Trường hợp đó em lập hóa đơn điều chỉnh hoặc thay thế nhé.\n- Nếu sai tên nhưng đúng MST → lập biên bản điều chỉnh\n- Nếu sai MST → phải lập hóa đơn thay thế\n\nNhớ thông báo cho CQT về việc điều chỉnh/thay thế.', authorId: 'user-1', createdAt: '2024-09-15T10:30:00', likes: 8 },
  { id: 'reply-3',  threadId: 'thread-1', content: 'Bổ sung thêm: theo Nghị định 123, khi lập HĐ thay thế, trên HĐ mới phải ghi rõ "Thay thế cho hóa đơn Mẫu số... ký hiệu... số... ngày... tháng... năm...". Mình hay quên cái này 😅', authorId: 'user-3', createdAt: '2024-09-15T14:00:00', likes: 12 },
  { id: 'reply-4',  threadId: 'thread-2', content: 'Chị Hương ơi, cho em hỏi tỷ lệ BHXH bắt buộc phần DN đóng từ 01/07/2024 có thay đổi gì không ạ?', authorId: 'user-5', createdAt: '2024-09-14T15:30:00', likes: 3 },
  { id: 'reply-5',  threadId: 'thread-2', content: 'Hiện tại chưa thay đổi em nhé. Vẫn là:\n- BHXH: DN 17.5%, NLĐ 8%\n- BHYT: DN 3%, NLĐ 1.5%\n- BHTN: DN 1%, NLĐ 1%\n- KPCĐ: DN 2%', authorId: 'user-2', createdAt: '2024-09-14T16:00:00', likes: 6 },
  { id: 'reply-6',  threadId: 'thread-5', content: 'Em xử lý như sau:\n\n1. Ghi nhận mua hàng (01/09):\nNợ TK 156: 245,000,000\nNợ TK 133\nCó TK 331: 245,000,000\n\n2. Thanh toán (15/09):\nNợ TK 331: 245,000,000\nNợ TK 635: 3,000,000 (lỗ CL tỷ giá)\nCó TK 112 (USD): 248,000,000\n\nChênh lệch 3 triệu hạch toán vào TK 635 (chi phí tài chính) vì tỷ giá tăng khi thanh toán.', authorId: 'user-1', createdAt: '2024-09-11T11:30:00', likes: 15 },
  { id: 'reply-7',  threadId: 'thread-5', content: 'Chị Bezin giải thích rất đúng. Bổ sung thêm:\n- Tỷ giá ghi nhận nợ phải trả: dùng tỷ giá MUA của ngân hàng giao dịch\n- Tỷ giá thanh toán: dùng tỷ giá BÁN hoặc tỷ giá thực tế thanh toán\n- Cuối kỳ đánh giá lại: dùng tỷ giá chuyển khoản trung bình', authorId: 'user-4', createdAt: '2024-09-11T14:00:00', likes: 10 },
  { id: 'reply-8',  threadId: 'thread-5', content: 'Cảm ơn chị Bezin và chị Thảo! Em đã hiểu rồi ạ. Vậy cuối năm khi đánh giá lại số dư có gốc ngoại tệ thì hạch toán vào TK 413 phải không ạ?', authorId: 'user-5', createdAt: '2024-09-11T15:30:00', likes: 2 },
  { id: 'reply-9',  threadId: 'thread-7', content: 'Công ty mình đang dùng MISA, nói chung ổn cho DN nhỏ. Nhưng lúc cuối năm quyết toán nhiều data thì hơi lag. Đang tính chuyển sang cloud version.', authorId: 'user-3', createdAt: '2024-09-09T16:30:00', likes: 7 },
  { id: 'reply-10', threadId: 'thread-7', content: 'Mình thêm 1 option nữa: BRAVO. Phần mềm Việt Nam, giá OK, phù hợp DN xây dựng và sản xuất. Giao diện khá hiện đại, hỗ trợ nhanh.', authorId: 'user-4', createdAt: '2024-09-09T17:00:00', likes: 9 },
  { id: 'reply-11', threadId: 'thread-8', content: 'Bài viết quá giá trị luôn ạ! Bookmark lại để đọc kỹ. Chị Bezin có thể chia sẻ thêm phần lập Báo cáo kết quả kinh doanh được không ạ?', authorId: 'user-2', createdAt: '2024-09-08T10:30:00', likes: 14 },
  { id: 'reply-12', threadId: 'thread-8', content: 'Mình sẽ update thêm phần BCKQKD trong tuần tới nhé! Cảm ơn mọi người đã ủng hộ.', authorId: 'user-1', createdAt: '2024-09-08T11:00:00', likes: 6 },
];

// ---------- database init & CRUD ------

function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    const db = JSON.parse(raw);
    let changed = false;

    // Update Bezin user profile
    const idxU = db.users ? db.users.findIndex(u => u.id === 'user-1') : -1;
    if (idxU !== -1) {
      db.users[idxU].name = 'Phan Thị Bezin';
      db.users[idxU].bio = 'Khối Tài chính – Kế toán | Dược Phẩm Hoàng Vũ | Founder BZ Forum';
      changed = true;
    }

    DEFAULT_THREADS.forEach(dt => {
      const idx = db.threads.findIndex(t => t.id === dt.id);
      if (idx === -1) {
        db.threads.unshift(dt);
        changed = true;
      } else if (dt.id === 'thread-tax-q3-2026') {
        db.threads[idx] = dt;
        changed = true;
      }
    });

    // Update replies: sync all default replies and fix gender pronouns
    if (db.replies) {
      db.replies.forEach(r => {
        if (r.content.includes('anh Bezin')) {
          r.content = r.content.replace(/anh Bezin/g, 'chị Bezin');
          changed = true;
        }
        if (r.content.includes('Anh Bezin')) {
          r.content = r.content.replace(/Anh Bezin/g, 'Chị Bezin');
          changed = true;
        }
      });
    }

    DEFAULT_REPLIES.forEach(dr => {
      const idxR = db.replies.findIndex(r => r.id === dr.id);
      if (idxR === -1) {
        db.replies.push(dr);
        changed = true;
      } else if (dr.content !== db.replies[idxR].content) {
        db.replies[idxR] = dr;
        changed = true;
      }
    });

    if (changed) saveDB(db);
    return db;
  }
  // first run – seed
  const db = {
    users:      DEFAULT_USERS,
    categories: DEFAULT_CATEGORIES,
    threads:    DEFAULT_THREADS,
    replies:    DEFAULT_REPLIES,
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

// -- Categories --
function getCategories() { return getDB().categories; }

function getCategoryById(id) { return getCategories().find(c => c.id === id); }

function getThreadCountByCategory(catId) {
  return getDB().threads.filter(t => t.categoryId === catId).length;
}

// -- Users --
function getUsers() { return getDB().users; }
function getUserById(id) { return getUsers().find(u => u.id === id); }

function createUser(name, email, password) {
  const db = getDB();
  if (db.users.find(u => u.email === email)) return { error: 'Email đã tồn tại' };
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const user = {
    id: 'user-' + Date.now(),
    name, email, password, avatar: initials,
    role: 'member', bio: '',
    joinDate: new Date().toISOString().slice(0, 10)
  };
  db.users.push(user);
  saveDB(db);
  return { user };
}

function authenticateUser(email, password) {
  const user = getDB().users.find(u => u.email === email && u.password === password);
  return user || null;
}

// -- Threads --
function getThreads({ categoryId, sortBy = 'newest', search } = {}) {
  let threads = getDB().threads;
  if (categoryId) threads = threads.filter(t => t.categoryId === categoryId);
  if (search) {
    const q = search.toLowerCase();
    threads = threads.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }
  // pinned first, then sort
  const pinned   = threads.filter(t => t.pinned);
  const unpinned = threads.filter(t => !t.pinned);
  const sortFn = sortBy === 'popular'
    ? (a, b) => b.views - a.views
    : sortBy === 'most-liked'
      ? (a, b) => b.likes - a.likes
      : (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
  pinned.sort(sortFn);
  unpinned.sort(sortFn);
  return [...pinned, ...unpinned];
}

function getThreadById(id) { return getDB().threads.find(t => t.id === id); }

function createThread({ title, content, categoryId, tags, authorId }) {
  const db = getDB();
  const thread = {
    id: 'thread-' + Date.now(),
    title, content, categoryId, tags,
    authorId,
    createdAt: new Date().toISOString(),
    views: 0, likes: 0, pinned: false
  };
  db.threads.push(thread);
  saveDB(db);
  return thread;
}

function incrementViews(threadId) {
  const db = getDB();
  const t = db.threads.find(t => t.id === threadId);
  if (t) { t.views++; saveDB(db); }
}

function toggleLike(threadId) {
  const db = getDB();
  const t = db.threads.find(t => t.id === threadId);
  if (t) { t.likes++; saveDB(db); }
  return t;
}

// -- Replies --
function getReplies(threadId) {
  return getDB().replies
    .filter(r => r.threadId === threadId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function createReply({ threadId, content, authorId }) {
  const db = getDB();
  const reply = {
    id: 'reply-' + Date.now(),
    threadId, content, authorId,
    createdAt: new Date().toISOString(),
    likes: 0
  };
  db.replies.push(reply);
  saveDB(db);
  return reply;
}

function getReplyCount(threadId) {
  return getDB().replies.filter(r => r.threadId === threadId).length;
}

// -- Stats --
function getStats() {
  const db = getDB();
  return {
    threads:    db.threads.length,
    replies:    db.replies.length,
    users:      db.users.length,
    categories: db.categories.length
  };
}

function getUserThreads(userId) {
  return getDB().threads.filter(t => t.authorId === userId);
}

// -- Reset DB (dev helper) --
function resetDB() {
  localStorage.removeItem(DB_KEY);
  getDB(); // re-seed
}
window.getDB = getDB; // expose to global scope for Vercel build
export { getDB, saveDB, getCategories, getCategoryById, getThreadCountByCategory, getUsers, getUserById, createUser, authenticateUser, getThreads, getThreadById, createThread, incrementViews, toggleLike, getReplies, createReply, getReplyCount, getStats };
