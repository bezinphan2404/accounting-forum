(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const h of a)if(h.type==="childList")for(const o of h.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const h={};return a.integrity&&(h.integrity=a.integrity),a.referrerPolicy&&(h.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?h.credentials="include":a.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function i(a){if(a.ep)return;a.ep=!0;const h=e(a);fetch(a.href,h)}})();const x="data:image/svg+xml,%3csvg%20viewBox='0%200%20200%20200'%20xmlns='http://www.w3.org/2000/svg'%3e%3c!--%20Circle%20border%20--%3e%3ccircle%20cx='100'%20cy='100'%20r='88'%20fill='none'%20stroke='%231d3557'%20stroke-width='9'/%3e%3c!--%20B%20letter%20--%3e%3cpath%20d='M50%2055%20L50%20115%20L72%20115%20C85%20115%2092%20108%2092%2099%20C92%2092%2087%2087%2080%2086%20C86%2084%2090%2079%2090%2073%20C90%2064%2083%2055%2072%2055%20Z%20M62%2065%20L72%2065%20C78%2065%2081%2069%2081%2073%20C81%2078%2078%2081%2072%2081%20L62%2081%20Z%20M62%2090%20L73%2090%20C80%2090%2083%2094%2083%2099%20C83%20104%2080%20106%2073%20106%20L62%20106%20Z'%20fill='%231d3557'/%3e%3c!--%20Z%20letter%20with%20extending%20diagonal%20--%3e%3cpath%20d='M100%2055%20L140%2055%20L140%2065%20L112%20105%20L140%20105%20L140%20115%20L100%20115%20L100%20105%20L128%2065%20L100%2065%20Z'%20fill='%231d3557'/%3e%3c!--%20Bar%20chart%20(3%20ascending%20bars)%20--%3e%3crect%20x='52'%20y='140'%20width='14'%20height='18'%20rx='2'%20fill='%231d3557'/%3e%3crect%20x='72'%20y='130'%20width='14'%20height='28'%20rx='2'%20fill='%231d3557'/%3e%3crect%20x='92'%20y='118'%20width='14'%20height='40'%20rx='2'%20fill='%231d3557'/%3e%3c!--%20Upward%20arrow%20/%20trend%20line%20--%3e%3cpath%20d='M115%20155%20L130%20130%20L140%20138'%20fill='none'%20stroke='%231d3557'%20stroke-width='6'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpolygon%20points='142,128%20148,140%20136,140'%20fill='%231d3557'/%3e%3c/svg%3e",I="bz_forum_db",z=[{id:"cat-1",name:"Kế toán tổng hợp",icon:"📊",color:"#457b9d",description:"Thảo luận chung về nghiệp vụ kế toán"},{id:"cat-2",name:"Thuế",icon:"🧾",color:"#e76f51",description:"Thuế GTGT, TNCN, TNDN và các loại thuế khác"},{id:"cat-3",name:"Kế toán quản trị",icon:"📈",color:"#2a9d8f",description:"Phân tích, dự toán, kiểm soát chi phí"},{id:"cat-4",name:"Kiểm toán",icon:"🔍",color:"#9b8ec4",description:"Kiểm toán nội bộ và kiểm toán độc lập"},{id:"cat-5",name:"Tài liệu & Biểu mẫu",icon:"📁",color:"#e9c46a",description:"Chia sẻ file, mẫu biểu, template"},{id:"cat-6",name:"Hỏi đáp",icon:"💬",color:"#f4a261",description:"Đặt câu hỏi và giải đáp thắc mắc"},{id:"cat-7",name:"Excel & Phần mềm",icon:"💻",color:"#7ec8a0",description:"Tips Excel, VBA, phần mềm kế toán"},{id:"cat-8",name:"Luật & Quy định",icon:"⚖️",color:"#e07a8f",description:"Cập nhật luật, nghị định, thông tư"}],V=[{id:"user-1",name:"Phan Thị Bezin",email:"bezin@bzforum.vn",password:"bezin123",avatar:"BZ",role:"admin",bio:"Khối Tài chính – Kế toán | Dược Phẩm Hoàng Vũ | Founder BZ Forum",joinDate:"2024-01-15"},{id:"user-2",name:"Nguyễn Hương",email:"huong@example.com",password:"demo123",avatar:"NH",role:"member",bio:"Kế toán trưởng, 10 năm kinh nghiệm",joinDate:"2024-02-20"},{id:"user-3",name:"Trần Minh",email:"minh@example.com",password:"demo123",avatar:"TM",role:"member",bio:"Chuyên viên thuế tại Big4",joinDate:"2024-03-10"},{id:"user-4",name:"Lê Thảo",email:"thao@example.com",password:"demo123",avatar:"LT",role:"moderator",bio:"Kiểm toán viên, CPA",joinDate:"2024-04-05"},{id:"user-5",name:"Phạm Đức",email:"duc@example.com",password:"demo123",avatar:"PĐ",role:"member",bio:"Kế toán quản trị, MBA",joinDate:"2024-05-12"}],G=[{id:"thread-tax-q3-2026",title:"Cẩm nang kê khai thuế GTGT và TNCN Quý 3/2026 theo gói pháp luật mới 01/07/2026 (Luật QLT 108/2025, NĐ 252, TT 89/2026, NĐ 253, NĐ 254)",content:`Chào tất cả các anh chị em đồng nghiệp kế toán - tài chính trên BZ Forum!

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

Mọi thắc mắc về tình huống thực tế hoặc các điều khoản mới của Thông tư 89/2026 và NĐ 252 - NĐ 254, các bạn hãy thảo luận ngay bên dưới nhé, **chị Bezin** và các mod sẽ cùng giải đáp hỗ trợ! 💬`,authorId:"user-1",categoryId:"cat-2",createdAt:"2026-10-15T08:30:00",views:2450,likes:215,tags:["thuế GTGT","thuế TNCN","Quý 3/2026","Luật QLT 108/2025","Thông tư 89/2026","Nghị định 252/2026"],pinned:!0},{id:"thread-1",title:"Hướng dẫn xử lý hóa đơn điện tử theo Nghị định 123/2020/NĐ-CP",content:`Chào các bạn,

Hôm nay mình chia sẻ kinh nghiệm xử lý hóa đơn điện tử (HĐĐT) theo Nghị định 123/2020/NĐ-CP và Thông tư 78/2021/TT-BTC.

**1. Các loại hóa đơn điện tử:**
- Hóa đơn GTGT
- Hóa đơn bán hàng
- Các chứng từ được in, phát hành, sử dụng và quản lý như hóa đơn

**2. Thời điểm lập hóa đơn:**
- Đối với bán hàng hóa: thời điểm chuyển giao quyền sở hữu
- Đối với cung cấp dịch vụ: thời điểm hoàn thành việc cung cấp dịch vụ

**3. Xử lý hóa đơn sai sót:**
- Hóa đơn chưa gửi cho người mua: hủy và lập lại
- Hóa đơn đã gửi: lập hóa đơn điều chỉnh hoặc thay thế

Các bạn có thắc mắc gì cứ comment bên dưới nhé!`,authorId:"user-1",categoryId:"cat-2",createdAt:"2024-09-15T08:30:00",views:342,likes:28,tags:["hóa đơn","nghị định 123","HĐĐT"],pinned:!0},{id:"thread-2",title:"Cách hạch toán chi phí lương và các khoản trích theo lương năm 2024",content:`Mình tổng hợp lại cách hạch toán lương và các khoản trích theo lương theo quy định mới nhất.

**Các bút toán cơ bản:**

1. Tính lương phải trả NLĐ:
Nợ TK 622, 627, 641, 642
Có TK 334

2. Trích BHXH, BHYT, BHTN, KPCĐ (phần DN):
Nợ TK 622, 627, 641, 642
Có TK 3383 (BHXH 17.5%)
Có TK 3384 (BHYT 3%)
Có TK 3386 (BHTN 1%)
Có TK 3382 (KPCĐ 2%)

3. Khấu trừ các khoản (phần NLĐ):
Nợ TK 334
Có TK 3383 (BHXH 8%)
Có TK 3384 (BHYT 1.5%)
Có TK 3386 (BHTN 1%)
Có TK 3335 (Thuế TNCN)

4. Chi trả lương:
Nợ TK 334
Có TK 111, 112

Bạn nào cần file Excel tính lương tự động thì inbox mình nhé!`,authorId:"user-2",categoryId:"cat-1",createdAt:"2024-09-14T14:20:00",views:567,likes:45,tags:["lương","BHXH","hạch toán"],pinned:!1},{id:"thread-3",title:"Chia sẻ file Excel bảng tính thuế TNCN tự động - Cập nhật 2024",content:`Xin chào mọi người,

Mình vừa update lại file Excel tính thuế TNCN tự động theo biểu thuế luỹ tiến từng phần mới nhất.

**Tính năng của file:**
- Tự động tính thuế TNCN theo biểu thuế luỹ tiến
- Tính giảm trừ gia cảnh (bản thân + người phụ thuộc)
- Tổng hợp theo tháng/quý/năm
- Xuất tờ khai 05/KK-TNCN
- Hỗ trợ tính quyết toán cuối năm

**Hướng dẫn sử dụng:**
1. Nhập thông tin nhân viên vào sheet "DanhSach"
2. Nhập số người phụ thuộc
3. Nhập thu nhập hàng tháng
4. File sẽ tự động tính toán

File không có virus hay macro lạ, các bạn yên tâm tải về dùng.`,authorId:"user-3",categoryId:"cat-5",createdAt:"2024-09-13T09:15:00",views:891,likes:72,tags:["Excel","TNCN","thuế","tài liệu"],pinned:!1},{id:"thread-4",title:"Kinh nghiệm quyết toán thuế TNDN cuối năm - Những lỗi thường gặp",content:`Sắp đến mùa quyết toán rồi, mình chia sẻ một số kinh nghiệm để các bạn tránh sai sót.

**10 lỗi thường gặp khi quyết toán thuế TNDN:**

1. Không loại bỏ chi phí không có hóa đơn
2. Hạch toán sai kỳ (chi phí năm trước đưa vào năm nay)
3. Quên loại chi phí vượt định mức (tiếp khách > 15% tổng CF)
4. Chi phí khấu hao TSCĐ không đúng quy định
5. Không theo dõi lỗ chuyển kỳ đúng thời hạn (5 năm)
6. Sai biệt kế toán và thuế không được điều chỉnh
7. Chi phí lãi vay vượt mức quy định (NĐ 132)
8. Quên kê khai các khoản giảm thuế, ưu đãi thuế
9. Không đối chiếu số liệu với tờ khai thuế GTGT
10. Nộp quyết toán chậm (hạn: 31/3 năm sau)

Các bạn bổ sung thêm nhé!`,authorId:"user-4",categoryId:"cat-2",createdAt:"2024-09-12T16:45:00",views:423,likes:35,tags:["TNDN","quyết toán","kinh nghiệm"],pinned:!1},{id:"thread-5",title:"Hỏi: Cách xử lý chênh lệch tỷ giá hối đoái theo TT200?",content:`Em chào các anh chị,

Công ty em có phát sinh giao dịch bằng USD. Em đang gặp khó khăn trong việc hạch toán chênh lệch tỷ giá.

**Tình huống cụ thể:**
- Ngày 01/09: Mua hàng $10,000, tỷ giá 24,500 VND/USD
- Ngày 15/09: Thanh toán $10,000, tỷ giá 24,800 VND/USD

Em hạch toán chênh lệch như thế nào ạ? Dùng tỷ giá nào: NHNN, ngân hàng giao dịch hay tỷ giá mua?

Cảm ơn các anh chị!`,authorId:"user-5",categoryId:"cat-6",createdAt:"2024-09-11T10:00:00",views:234,likes:12,tags:["tỷ giá","ngoại tệ","TT200"],pinned:!1},{id:"thread-6",title:"Tổng hợp các mẫu biểu kế toán thông dụng theo Thông tư 200/2014/TT-BTC",content:`Xin chào cả nhà,

Mình tổng hợp lại các mẫu biểu kế toán thông dụng nhất theo TT200. Ai cần mẫu nào cứ comment bên dưới nhé.

**Danh sách mẫu biểu:**

📋 Chứng từ kế toán:
- Phiếu thu, Phiếu chi
- Giấy đề nghị thanh toán
- Giấy đề nghị tạm ứng
- Phiếu nhập kho, Phiếu xuất kho
- Biên bản bàn giao TSCĐ

📊 Sổ kế toán:
- Sổ nhật ký chung
- Sổ cái tổng hợp
- Sổ chi tiết công nợ
- Sổ quỹ tiền mặt
- Sổ tiền gửi ngân hàng

📑 Báo cáo tài chính:
- Bảng cân đối kế toán (B01-DN)
- Báo cáo KQHĐKD (B02-DN)
- Báo cáo lưu chuyển tiền tệ (B03-DN)
- Thuyết minh BCTC (B09-DN)

Tất cả đã format đẹp, sẵn sàng in.`,authorId:"user-1",categoryId:"cat-5",createdAt:"2024-09-10T11:30:00",views:1203,likes:96,tags:["mẫu biểu","TT200","tài liệu"],pinned:!0},{id:"thread-7",title:"Review phần mềm kế toán 2024: MISA vs FAST vs SAP - Nên dùng phần mềm nào?",content:`Nhiều bạn inbox hỏi mình nên chọn phần mềm kế toán nào, nên mình viết bài review chi tiết.

**1. MISA (⭐⭐⭐⭐)**
✅ Giao diện thân thiện, dễ sử dụng
✅ Hỗ trợ tốt cho DN Việt Nam
✅ Giá hợp lý
❌ Tốc độ xử lý chậm khi dữ liệu lớn

**2. FAST (⭐⭐⭐⭐)**
✅ Phù hợp DN sản xuất
✅ Module quản lý kho mạnh
❌ Giao diện hơi cũ

**3. SAP (⭐⭐⭐⭐⭐)**
✅ Hệ thống toàn diện, mạnh mẽ
✅ Phù hợp DN lớn, đa quốc gia
❌ Chi phí rất cao
❌ Cần đội ngũ IT chuyên biệt

**Kết luận:**
- DN nhỏ → MISA
- DN vừa, sản xuất → FAST
- DN lớn, FDI → SAP`,authorId:"user-2",categoryId:"cat-7",createdAt:"2024-09-09T15:00:00",views:678,likes:52,tags:["phần mềm","MISA","FAST","SAP","review"],pinned:!1},{id:"thread-8",title:"Hướng dẫn lập Báo cáo tài chính theo Thông tư 200 - Chi tiết từ A đến Z",content:`Đây là bài hướng dẫn chi tiết cách lập Báo cáo tài chính (BCTC) theo TT200.

**I. Bảng cân đối kế toán (B01-DN)**

Nguyên tắc lập:
- Tuân thủ nguyên tắc kỳ kế toán
- Số liệu lấy từ sổ kế toán đã khóa sổ
- Đối chiếu với biên bản kiểm kê

**Tài sản ngắn hạn:**
- Mã 100: Tiền và tương đương tiền = Dư Nợ TK 111 + 112 + 121
- Mã 130: Các khoản phải thu = Dư Nợ TK 131 + 136 + 138 + 141
- Mã 140: Hàng tồn kho = Dư Nợ TK 151 + 152 + 153 + 154 + 155 + 156 + 157

**Tài sản dài hạn:**
- Mã 220: TSCĐ = Dư Nợ TK 211 - Dư Có TK 214
- Mã 260: Chi phí XDCB dở dang = Dư Nợ TK 241

(Mình sẽ update thêm phần Nguồn vốn, BCKQKD và BCLCTT ở comment bên dưới)`,authorId:"user-1",categoryId:"cat-1",createdAt:"2024-09-08T09:00:00",views:1567,likes:120,tags:["BCTC","TT200","hướng dẫn"],pinned:!0},{id:"thread-9",title:"Cập nhật Nghị định 65/2024 - Thay đổi quan trọng về quản lý thuế",content:`Chào các bạn,

Nghị định 65/2024/NĐ-CP vừa được ban hành với một số thay đổi quan trọng.

**Những điểm mới đáng chú ý:**

1. Thay đổi về mức phạt vi phạm hành chính thuế
2. Bổ sung quy định về quản lý thuế đối với giao dịch liên kết
3. Cập nhật quy trình hoàn thuế
4. Quy định mới về kê khai bổ sung

**Hiệu lực:** Từ ngày 01/07/2024

Các bạn nên đọc kỹ và cập nhật vào quy trình nội bộ sớm.

Ai có câu hỏi về điểm nào cụ thể thì comment nhé!`,authorId:"user-4",categoryId:"cat-8",createdAt:"2024-09-07T13:20:00",views:345,likes:23,tags:["nghị định","cập nhật","quản lý thuế"],pinned:!1},{id:"thread-10",title:"Hướng dẫn phân tích báo cáo tài chính cho người mới bắt đầu",content:`Bài viết dành cho các bạn mới bước vào nghề kế toán quản trị.

**Các chỉ số tài chính quan trọng:**

📊 Nhóm thanh toán:
- Hệ số thanh toán hiện hành = TSNH / Nợ NH
- Hệ số thanh toán nhanh = (TSNH - HTK) / Nợ NH

📈 Nhóm hiệu quả:
- ROA = Lợi nhuận sau thuế / Tổng tài sản
- ROE = Lợi nhuận sau thuế / Vốn CSH
- Vòng quay HTK = GVHB / HTK bình quân

💰 Nhóm đòn bẩy:
- Hệ số nợ = Tổng nợ / Tổng tài sản
- Đòn bẩy tài chính = Tổng TS / Vốn CSH

**Cách đọc và phân tích:**
- So sánh theo thời gian (trend analysis)
- So sánh với ngành (benchmark)
- Kết hợp nhiều chỉ số để có bức tranh tổng thể`,authorId:"user-5",categoryId:"cat-3",createdAt:"2024-09-06T10:45:00",views:456,likes:38,tags:["phân tích","BCTC","chỉ số tài chính"],pinned:!1}],S=[{id:"reply-tax-1",threadId:"thread-tax-q3-2026",content:"Cảm ơn chị Phan Thị Bezin! Sổ tay tổng hợp quá xuất sắc và kịp thời. Cho em hỏi về quy định mới ở NĐ 181/2025: Bên em có giao dịch mua văn phòng phẩm cùng 1 nhà cung cấp trong 1 ngày chia làm 2 hóa đơn 2.500.000đ và 3.000.000đ (tổng 5,5 triệu) thanh toán tiền mặt thì xử lý trên tờ khai Quý 3 thế nào ạ?",authorId:"user-2",createdAt:"2026-10-15T09:15:00",likes:16},{id:"reply-tax-2",threadId:"thread-tax-q3-2026",content:`Chào Hương! Theo khoản 3 Điều 26 NĐ 181/2025, trường hợp mua nhiều lần dưới 5 triệu của cùng 1 người bán trong cùng 1 ngày mà tổng từ 5.000.000đ trở lên thì BẮT BUỘC phải thanh toán không dùng tiền mặt cho toàn bộ. Do bên em đã lỡ trả tiền mặt nên:
1. Thuế GTGT đầu vào không được khấu trừ, em phải loại ra khỏi Chỉ tiêu [25] của Tờ khai 01/GTGT Quý 3.
2. Toàn bộ tiền hàng cũng bị loại khỏi chi phí được trừ khi tính thuế TNDN theo điểm c khoản 1 Điều 9 NĐ 320/2025.
Các bạn kế toán nhớ khóa ngay quy trình mua hàng để tránh thiệt hại kép nhé!`,authorId:"user-1",createdAt:"2026-10-15T10:00:00",likes:28},{id:"reply-tax-3",threadId:"thread-tax-q3-2026",content:"Chị Bezin nhấn mạnh điểm mốc 02/11/2026 gửi Giấy đề nghị gia hạn thuế theo NĐ 245/2026 là sống còn luôn! Rất nhiều doanh nghiệp cứ nghĩ hạn nộp thuế được tự động lùi, không nộp mẫu Phụ lục II trước 02/11/2026 là mất luôn quyền gia hạn thuế GTGT Quý 3 và TNDN tạm nộp.",authorId:"user-3",createdAt:"2026-10-15T11:20:00",likes:24},{id:"reply-tax-4",threadId:"thread-tax-q3-2026",content:"Bổ sung thêm: Với 2 khoản giảm trừ mới về Y tế (23tr) và Giáo dục (24tr) theo Điều 49 NĐ 253/2026, nhân viên trong công ty thường hỏi nhờ trừ luôn. Các bạn kế toán lưu ý là khi kê khai tạm nộp Quý 3 công ty chưa trừ khoản này nhé, vì người lao động bắt buộc phải TỰ QUYẾT TOÁN THUẾ cuối năm kèm hóa đơn bảng kê viện phí theo khoản 3 Điều 51 NĐ 253.",authorId:"user-4",createdAt:"2026-10-15T14:30:00",likes:20},{id:"reply-1",threadId:"thread-1",content:"Cảm ơn chị Bezin! Bài viết rất chi tiết. Em muốn hỏi thêm về trường hợp hóa đơn đã gửi CQT nhưng phát hiện sai tên người mua thì xử lý thế nào ạ?",authorId:"user-2",createdAt:"2024-09-15T09:45:00",likes:5},{id:"reply-2",threadId:"thread-1",content:`Trường hợp đó em lập hóa đơn điều chỉnh hoặc thay thế nhé.
- Nếu sai tên nhưng đúng MST → lập biên bản điều chỉnh
- Nếu sai MST → phải lập hóa đơn thay thế

Nhớ thông báo cho CQT về việc điều chỉnh/thay thế.`,authorId:"user-1",createdAt:"2024-09-15T10:30:00",likes:8},{id:"reply-3",threadId:"thread-1",content:'Bổ sung thêm: theo Nghị định 123, khi lập HĐ thay thế, trên HĐ mới phải ghi rõ "Thay thế cho hóa đơn Mẫu số... ký hiệu... số... ngày... tháng... năm...". Mình hay quên cái này 😅',authorId:"user-3",createdAt:"2024-09-15T14:00:00",likes:12},{id:"reply-4",threadId:"thread-2",content:"Chị Hương ơi, cho em hỏi tỷ lệ BHXH bắt buộc phần DN đóng từ 01/07/2024 có thay đổi gì không ạ?",authorId:"user-5",createdAt:"2024-09-14T15:30:00",likes:3},{id:"reply-5",threadId:"thread-2",content:`Hiện tại chưa thay đổi em nhé. Vẫn là:
- BHXH: DN 17.5%, NLĐ 8%
- BHYT: DN 3%, NLĐ 1.5%
- BHTN: DN 1%, NLĐ 1%
- KPCĐ: DN 2%`,authorId:"user-2",createdAt:"2024-09-14T16:00:00",likes:6},{id:"reply-6",threadId:"thread-5",content:`Em xử lý như sau:

1. Ghi nhận mua hàng (01/09):
Nợ TK 156: 245,000,000
Nợ TK 133
Có TK 331: 245,000,000

2. Thanh toán (15/09):
Nợ TK 331: 245,000,000
Nợ TK 635: 3,000,000 (lỗ CL tỷ giá)
Có TK 112 (USD): 248,000,000

Chênh lệch 3 triệu hạch toán vào TK 635 (chi phí tài chính) vì tỷ giá tăng khi thanh toán.`,authorId:"user-1",createdAt:"2024-09-11T11:30:00",likes:15},{id:"reply-7",threadId:"thread-5",content:`Chị Bezin giải thích rất đúng. Bổ sung thêm:
- Tỷ giá ghi nhận nợ phải trả: dùng tỷ giá MUA của ngân hàng giao dịch
- Tỷ giá thanh toán: dùng tỷ giá BÁN hoặc tỷ giá thực tế thanh toán
- Cuối kỳ đánh giá lại: dùng tỷ giá chuyển khoản trung bình`,authorId:"user-4",createdAt:"2024-09-11T14:00:00",likes:10},{id:"reply-8",threadId:"thread-5",content:"Cảm ơn chị Bezin và chị Thảo! Em đã hiểu rồi ạ. Vậy cuối năm khi đánh giá lại số dư có gốc ngoại tệ thì hạch toán vào TK 413 phải không ạ?",authorId:"user-5",createdAt:"2024-09-11T15:30:00",likes:2},{id:"reply-9",threadId:"thread-7",content:"Công ty mình đang dùng MISA, nói chung ổn cho DN nhỏ. Nhưng lúc cuối năm quyết toán nhiều data thì hơi lag. Đang tính chuyển sang cloud version.",authorId:"user-3",createdAt:"2024-09-09T16:30:00",likes:7},{id:"reply-10",threadId:"thread-7",content:"Mình thêm 1 option nữa: BRAVO. Phần mềm Việt Nam, giá OK, phù hợp DN xây dựng và sản xuất. Giao diện khá hiện đại, hỗ trợ nhanh.",authorId:"user-4",createdAt:"2024-09-09T17:00:00",likes:9},{id:"reply-11",threadId:"thread-8",content:"Bài viết quá giá trị luôn ạ! Bookmark lại để đọc kỹ. Chị Bezin có thể chia sẻ thêm phần lập Báo cáo kết quả kinh doanh được không ạ?",authorId:"user-2",createdAt:"2024-09-08T10:30:00",likes:14},{id:"reply-12",threadId:"thread-8",content:"Mình sẽ update thêm phần BCKQKD trong tuần tới nhé! Cảm ơn mọi người đã ủng hộ.",authorId:"user-1",createdAt:"2024-09-08T11:00:00",likes:6}];function s(){const t=localStorage.getItem(I);if(t){const e=JSON.parse(t);let i=!1;const a=e.users?e.users.findIndex(h=>h.id==="user-1"):-1;return a!==-1&&(e.users[a].name="Phan Thị Bezin",e.users[a].bio="Khối Tài chính – Kế toán | Dược Phẩm Hoàng Vũ | Founder BZ Forum",i=!0),G.forEach(h=>{const o=e.threads.findIndex(r=>r.id===h.id);o===-1?(e.threads.unshift(h),i=!0):h.id==="thread-tax-q3-2026"&&(e.threads[o]=h,i=!0)}),e.replies&&e.replies.forEach(h=>{h.content.includes("anh Bezin")&&(h.content=h.content.replace(/anh Bezin/g,"chị Bezin"),i=!0),h.content.includes("Anh Bezin")&&(h.content=h.content.replace(/Anh Bezin/g,"Chị Bezin"),i=!0)}),S.forEach(h=>{const o=e.replies.findIndex(r=>r.id===h.id);o===-1?(e.replies.push(h),i=!0):h.content!==e.replies[o].content&&(e.replies[o]=h,i=!0)}),i&&k(e),e}const n={users:V,categories:z,threads:G,replies:S};return localStorage.setItem(I,JSON.stringify(n)),n}function k(t){localStorage.setItem(I,JSON.stringify(t))}function H(){return s().categories}function D(t){return H().find(n=>n.id===t)}function R(t){return s().threads.filter(n=>n.categoryId===t).length}function j(){return s().users}function w(t){return j().find(n=>n.id===t)}function O(t,n,e){const i=s();if(i.users.find(o=>o.email===n))return{error:"Email đã tồn tại"};const a=t.split(" ").map(o=>o[0]).join("").slice(0,2).toUpperCase(),h={id:"user-"+Date.now(),name:t,email:n,password:e,avatar:a,role:"member",bio:"",joinDate:new Date().toISOString().slice(0,10)};return i.users.push(h),k(i),{user:h}}function F(t,n){return s().users.find(i=>i.email===t&&i.password===n)||null}function q({categoryId:t,sortBy:n="newest",search:e}={}){let i=s().threads;if(t&&(i=i.filter(r=>r.categoryId===t)),e){const r=e.toLowerCase();i=i.filter(u=>u.title.toLowerCase().includes(r)||u.content.toLowerCase().includes(r)||u.tags.some(d=>d.toLowerCase().includes(r)))}const a=i.filter(r=>r.pinned),h=i.filter(r=>!r.pinned),o=n==="popular"?(r,u)=>u.views-r.views:n==="most-liked"?(r,u)=>u.likes-r.likes:(r,u)=>new Date(u.createdAt)-new Date(r.createdAt);return a.sort(o),h.sort(o),[...a,...h]}function _(t){return s().threads.find(n=>n.id===t)}function Z({title:t,content:n,categoryId:e,tags:i,authorId:a}){const h=s(),o={id:"thread-"+Date.now(),title:t,content:n,categoryId:e,tags:i,authorId:a,createdAt:new Date().toISOString(),views:0,likes:0,pinned:!1};return h.threads.push(o),k(h),o}function Y(t){const n=s(),e=n.threads.find(i=>i.id===t);e&&(e.views++,k(n))}function X(t){const n=s(),e=n.threads.find(i=>i.id===t);return e&&(e.likes++,k(n)),e}function W(t){return s().replies.filter(n=>n.threadId===t).sort((n,e)=>new Date(n.createdAt)-new Date(e.createdAt))}function J({threadId:t,content:n,authorId:e}){const i=s(),a={id:"reply-"+Date.now(),threadId:t,content:n,authorId:e,createdAt:new Date().toISOString(),likes:0};return i.replies.push(a),k(i),a}function nn(t){return s().replies.filter(n=>n.threadId===t).length}function f(){const t=s();return{threads:t.threads.length,replies:t.replies.length,users:t.users.length,categories:t.categories.length}}window.getDB=s;const l={search:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',heart:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',comment:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',back:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',user:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',logout:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',chevronDown:'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'};let g=JSON.parse(sessionStorage.getItem("bz_current_user"))||null;function L(t){g=t,t?sessionStorage.setItem("bz_current_user",JSON.stringify(t)):sessionStorage.removeItem("bz_current_user")}function m(t,n="success"){let e=document.getElementById("toast-container");e||(e=document.createElement("div"),e.id="toast-container",e.className="toast-container",document.body.appendChild(e));const i=document.createElement("div");i.className=`toast toast-${n}`,i.textContent=t,e.appendChild(i),setTimeout(()=>{i.remove()},3e3)}function E(t){const n=Date.now()-new Date(t).getTime(),e=Math.floor(n/6e4),i=Math.floor(n/36e5),a=Math.floor(n/864e5);return e<1?"vừa xong":e<60?`${e} phút trước`:i<24?`${i} giờ trước`:a<30?`${a} ngày trước`:new Date(t).toLocaleDateString("vi-VN")}function P(t){return new Date(t).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"})}function c(t){const n=document.createElement("div");return n.textContent=t,n.innerHTML}function tn(t){const n=/((?:^[ \t]*\|[^\n]+\|[ \t]*(?:\r?\n|$)){2,})/gm;return t.replace(n,e=>{const i=e.trim().split(/\r?\n/).map(d=>d.trim()).filter(Boolean);if(i.length<2||!/^\|[\s\-:|]+\|$/.test(i[1]))return e;const a=d=>d.replace(/^\|/,"").replace(/\|$/,"").split("|").map(v=>v.trim()),h=a(i[0]),o=a(i[1]).map(d=>{const y=d.startsWith(":"),v=d.endsWith(":");return y&&v?"center":v?"right":"left"});let r="<thead><tr>"+h.map((d,y)=>`<th style="text-align:${o[y]||"left"}">${d}</th>`).join("")+"</tr></thead>",u="<tbody>";for(let d=2;d<i.length;d++){const y=a(i[d]);u+="<tr>"+y.map((v,U)=>`<td style="text-align:${o[U]||"left"}">${v}</td>`).join("")+"</tr>"}return u+="</tbody>",`<div class="table-responsive"><table class="forum-table">${r}${u}</table></div>`})}function A(t){if(!t)return"";let n=c(t);n=n.replace(/&lt;br\s*\/?&gt;/gi,"<br>"),n=n.replace(/`(.*?)`/g,'<code style="background:rgba(69,123,157,0.12); color:var(--color-navy); padding:2px 6px; border-radius:4px; font-family:monospace; font-size:0.92em; font-weight:500;">$1</code>'),n=n.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*(.*?)\*/g,"<em>$1</em>"),n=tn(n);const e=[];return n=n.replace(/<div class="table-responsive">[\s\S]*?<\/div>/g,i=>(e.push(i),`__TABLE_PLACEHOLDER_${e.length-1}__`)),n=n.replace(/(?:^|\n)### (.*?)(?=\n|$)/g,'<h3 style="margin-top:1.5rem; margin-bottom:0.75rem; color:var(--color-navy); font-size:1.2rem; font-weight:700; border-bottom:2px solid var(--color-primary); padding-bottom:6px;">$1</h3>'),n=n.replace(/(?:^|\n)#### (.*?)(?=\n|$)/g,'<h4 style="margin-top:1.2rem; margin-bottom:0.5rem; color:var(--color-text); font-size:1.05rem; font-weight:600;">$1</h4>'),n=n.replace(/(?:^|\n)---(?=\n|$)/g,'<hr style="margin:1.75rem 0; border:none; border-top:1px dashed var(--color-border); opacity:0.8;">'),n=n.replace(/\n- /g,`
<span style="color:var(--color-primary); font-weight:bold; margin-right:4px;">•</span> `),n=n.replace(/\n  \+ /g,`
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:var(--color-accent); font-weight:bold;">▸</span> `),n=n.replace(/\n    \* /g,`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▫ `),n=n.replace(/\n/g,"<br>"),e.forEach((i,a)=>{n=n.replace(`__TABLE_PLACEHOLDER_${a}__`,i)}),n}let N="newest";function B(){return window.location.hash||"#/"}function p(t){window.location.hash=t}function Q(){const t=B();if(document.getElementById("app"),t==="#/"||t==="")C();else if(t.startsWith("#/category/")){const n=t.replace("#/category/","");C(n)}else if(t.startsWith("#/thread/")){const n=t.replace("#/thread/","");M(n)}else if(t==="#/new-thread")on();else if(t==="#/login")cn();else if(t==="#/register")sn();else if(t.startsWith("#/search")){const n=new URLSearchParams(t.split("?")[1]||"");ln(n.get("q")||"")}else if(t.startsWith("#/profile/")){const n=t.replace("#/profile/","");dn(n)}else C()}window.addEventListener("hashchange",Q);function b(){const t=B().startsWith("#/search")?decodeURIComponent(B().split("q=")[1]||""):"";return`
    <header class="header">
      <div class="header-inner">
        <a class="header-logo" onclick="navigate('#/')">
          <img src="${x}" alt="BZ Logo">
          <div class="header-logo-text">
            <span class="header-logo-title">BZ Forum</span>
            <span class="header-logo-subtitle">Kế toán Tài chính</span>
          </div>
        </a>

        <div class="search-container">
          <span class="search-icon">${l.search}</span>
          <input type="text" class="search-input" id="search-input"
                 placeholder="Tìm kiếm bài viết, chủ đề..."
                 value="${c(t)}"
                 onkeydown="if(event.key==='Enter') handleSearch()">
        </div>

        <div class="header-actions">
          ${g?an():en()}
        </div>
      </div>
    </header>
  `}function en(){return`
    <button class="btn btn-outline btn-sm" onclick="navigate('#/login')">Đăng nhập</button>
    <button class="btn btn-primary btn-sm" onclick="navigate('#/register')">Đăng ký</button>
  `}function an(){return`
    <div class="user-menu" id="user-menu" onclick="toggleDropdown()">
      <div class="user-menu-avatar">${c(g.avatar)}</div>
      <span class="user-menu-name">${c(g.name)}</span>
      ${l.chevronDown}
      <div class="dropdown-menu" id="user-dropdown">
        <button class="dropdown-item" onclick="navigate('#/profile/${g.id}')">
          ${l.user} Trang cá nhân
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" onclick="handleLogout()">
          ${l.logout} Đăng xuất
        </button>
      </div>
    </div>
  `}function hn(){const t=document.getElementById("user-dropdown");t&&t.classList.toggle("open")}document.addEventListener("click",t=>{const n=document.getElementById("user-dropdown"),e=document.getElementById("user-menu");n&&e&&!e.contains(t.target)&&n.classList.remove("open")});function $(t){const n=H();return`
    <aside class="sidebar">
      <div class="sidebar-new-thread">
        <button class="btn btn-primary" onclick="${g?"navigate('#/new-thread')":"navigate('#/login'); showToast('Vui lòng đăng nhập để đăng bài', 'info')"}">
          ${l.plus} Tạo bài viết mới
        </button>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Danh mục</div>
        <ul class="category-list">
          <li class="category-item ${t?"":"active"}" onclick="navigate('#/')">
            <span class="category-dot" style="background: var(--color-navy)"></span>
            Tất cả
            <span class="category-count">${f().threads}</span>
          </li>
          ${n.map(e=>`
            <li class="category-item ${t===e.id?"active":""}" onclick="navigate('#/category/${e.id}')">
              <span class="category-dot" style="background: ${e.color}"></span>
              ${c(e.name)}
              <span class="category-count">${R(e.id)}</span>
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="sidebar-section card" style="padding: var(--space-md);">
        <div class="sidebar-title" style="padding:0; margin-bottom: var(--space-sm);">Thống kê</div>
        <div style="font-size:0.85rem; color: var(--color-text-light); display:flex; flex-direction:column; gap:0.3rem;">
          <div>📝 ${f().threads} bài viết</div>
          <div>💬 ${f().replies} bình luận</div>
          <div>👥 ${f().users} thành viên</div>
        </div>
      </div>
    </aside>
  `}function T(){return`
    <footer class="footer">
      <p>© 2024 <strong>BZ Forum</strong> – Cộng đồng Kế toán Tài chính Việt Nam</p>
      <p style="margin-top:0.3rem;">Được tạo bởi <a href="#">Bezin</a> với ❤️</p>
    </footer>
  `}function C(t){const n=q({categoryId:t,sortBy:N}),e=t?D(t):null,i=f(),a=document.getElementById("app");a.innerHTML=`
    ${b()}
    <div class="main-layout">
      ${$(t)}
      <main class="content animate-fadeIn">
        ${t?`
          <div class="breadcrumb">
            <a onclick="navigate('#/')">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            <span>${c(e.icon+" "+e.name)}</span>
          </div>
        `:`
          <div class="welcome-banner">
            <h2>👋 Chào mừng đến với BZ Forum!</h2>
            <p>Cộng đồng chia sẻ kiến thức, kinh nghiệm và tài liệu kế toán tài chính.</p>
          </div>
          <div class="stats-bar">
            <div class="stat-card card">
              <div class="stat-value">${i.threads}</div>
              <div class="stat-label">Bài viết</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${i.replies}</div>
              <div class="stat-label">Bình luận</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${i.users}</div>
              <div class="stat-label">Thành viên</div>
            </div>
            <div class="stat-card card">
              <div class="stat-value">${i.categories}</div>
              <div class="stat-label">Danh mục</div>
            </div>
          </div>
        `}

        <div class="content-header">
          <h3 class="content-title">${e?c(e.name):"Bài viết mới nhất"}</h3>
          <div class="sort-options">
            <button class="btn btn-sm ${N==="newest"?"btn-secondary":"btn-ghost"}" onclick="changeSort('newest')">Mới nhất</button>
            <button class="btn btn-sm ${N==="popular"?"btn-secondary":"btn-ghost"}" onclick="changeSort('popular')">Xem nhiều</button>
            <button class="btn btn-sm ${N==="most-liked"?"btn-secondary":"btn-ghost"}" onclick="changeSort('most-liked')">Yêu thích</button>
          </div>
        </div>

        <div class="thread-list">
          ${n.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
              <div class="empty-state-text">Hãy là người đầu tiên đăng bài trong danh mục này!</div>
              <button class="btn btn-primary" onclick="navigate('#/new-thread')">Tạo bài viết</button>
            </div>
          `:n.map(h=>K(h)).join("")}
        </div>
      </main>
    </div>
    ${T()}
  `}function K(t){const n=w(t.authorId),e=D(t.categoryId),i=nn(t.id);return`
    <article class="thread-card card card-elevated ${t.pinned?"thread-pinned":""}" onclick="navigate('#/thread/${t.id}')">
      <div class="thread-card-header">
        <div class="thread-avatar" style="background: ${e?e.color:"var(--color-navy)"}">${c((n==null?void 0:n.avatar)||"?")}</div>
        <div class="thread-meta">
          <span class="thread-author">${c((n==null?void 0:n.name)||"Ẩn danh")}</span>
          ${(n==null?void 0:n.role)==="admin"?'<span class="badge badge-admin">Admin</span>':""}
          ${(n==null?void 0:n.role)==="moderator"?'<span class="badge badge-mod">Mod</span>':""}
          <span class="thread-time">${E(t.createdAt)}</span>
          ${t.pinned?'<span style="color:var(--color-peach); font-size:0.8rem; margin-left:0.3rem;">📌 Ghim</span>':""}
        </div>
      </div>
      <h3 class="thread-title">${c(t.title)}</h3>
      <p class="thread-excerpt">${c(t.content.substring(0,150))}...</p>
      <div class="thread-footer">
        ${e?`<span class="thread-tag" style="background:${e.color}">${c(e.icon+" "+e.name)}</span>`:""}
        ${t.tags.slice(0,3).map(a=>`<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${c(a)}</span>`).join("")}
        <div style="flex:1"></div>
        <span class="thread-stat">${l.eye} ${t.views}</span>
        <span class="thread-stat">${l.heart} ${t.likes}</span>
        <span class="thread-stat">${l.comment} ${i}</span>
      </div>
    </article>
  `}function rn(t){N=t;const n=B();n.startsWith("#/category/")?C(n.replace("#/category/","")):C()}function M(t){const n=_(t);if(!n){p("#/");return}Y(t);const e=w(n.authorId),i=D(n.categoryId),a=W(t),h=document.getElementById("app");h.innerHTML=`
    ${b()}
    <div class="main-layout">
      ${$()}
      <main class="content animate-fadeIn">
        <div class="thread-detail">
          <a class="back-link" onclick="history.back()">${l.back} Quay lại</a>

          <div class="breadcrumb">
            <a onclick="navigate('#/')">Trang chủ</a>
            <span class="breadcrumb-sep">›</span>
            ${i?`<a onclick="navigate('#/category/${i.id}')">${c(i.icon+" "+i.name)}</a><span class="breadcrumb-sep">›</span>`:""}
            <span style="color:var(--color-text);">${c(n.title.substring(0,50))}...</span>
          </div>

          <div class="thread-detail-header">
            <h1 class="thread-detail-title">${c(n.title)}</h1>
            <div class="thread-detail-meta">
              <div class="thread-avatar" style="background: ${(i==null?void 0:i.color)||"var(--color-navy)"}; cursor:pointer;" onclick="navigate('#/profile/${e==null?void 0:e.id}')">${c((e==null?void 0:e.avatar)||"?")}</div>
              <div>
                <span class="thread-author" style="cursor:pointer;" onclick="navigate('#/profile/${e==null?void 0:e.id}')">${c((e==null?void 0:e.name)||"Ẩn danh")}</span>
                ${(e==null?void 0:e.role)==="admin"?'<span class="badge badge-admin">Admin</span>':""}
                ${(e==null?void 0:e.role)==="moderator"?'<span class="badge badge-mod">Mod</span>':""}
                <br><span class="thread-time">${P(n.createdAt)}</span>
              </div>
              <div style="flex:1"></div>
              <span class="thread-stat">${l.eye} ${n.views} lượt xem</span>
              <button class="vote-btn" onclick="handleLike('${n.id}')">${l.heart} ${n.likes}</button>
            </div>
          </div>

          <div class="thread-detail-content card card-elevated">
            <div class="content-body">${A(n.content)}</div>
            <div style="margin-top: var(--space-lg); display:flex; gap:var(--space-sm); flex-wrap:wrap;">
              ${n.tags.map(o=>`<span class="thread-tag" style="background: rgba(69,123,157,0.7)">#${c(o)}</span>`).join("")}
            </div>
          </div>

          <div class="replies-section">
            <div class="replies-title">${l.comment} ${a.length} bình luận</div>

            ${a.map(o=>{const r=w(o.authorId);return`
                <div class="reply-card card">
                  <div class="reply-header">
                    <div class="reply-avatar" style="cursor:pointer;" onclick="navigate('#/profile/${r==null?void 0:r.id}')">${c((r==null?void 0:r.avatar)||"?")}</div>
                    <span class="reply-author" style="cursor:pointer;" onclick="navigate('#/profile/${r==null?void 0:r.id}')">${c((r==null?void 0:r.name)||"Ẩn danh")}</span>
                    ${(r==null?void 0:r.role)==="admin"?'<span class="badge badge-admin">Admin</span>':""}
                    ${(r==null?void 0:r.role)==="moderator"?'<span class="badge badge-mod">Mod</span>':""}
                    <span class="reply-time">${E(o.createdAt)}</span>
                  </div>
                  <div class="reply-content">${A(o.content)}</div>
                </div>
              `}).join("")}

            ${g?`
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md);">
                <h4 style="margin-bottom: var(--space-md); color: var(--color-navy);">Viết bình luận</h4>
                <form onsubmit="handleReply(event, '${n.id}')">
                  <textarea class="form-textarea" id="reply-content" placeholder="Nhập nội dung bình luận..." required style="min-height:100px;"></textarea>
                  <div style="margin-top: var(--space-md); text-align:right;">
                    <button type="submit" class="btn btn-primary">Gửi bình luận</button>
                  </div>
                </form>
              </div>
            `:`
              <div class="card" style="padding: var(--space-lg); margin-top: var(--space-md); text-align:center;">
                <p style="color: var(--color-text-light); margin-bottom: var(--space-md);">Đăng nhập để tham gia thảo luận</p>
                <button class="btn btn-primary" onclick="navigate('#/login')">Đăng nhập</button>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>
    ${T()}
  `}function on(){if(!g){p("#/login"),m("Vui lòng đăng nhập để đăng bài","info");return}const t=H(),n=document.getElementById("app");n.innerHTML=`
    ${b()}
    <div class="main-layout-full">
      <div class="new-thread-form animate-fadeIn">
        <a class="back-link" onclick="history.back()">${l.back} Quay lại</a>
        <div class="form-card card card-elevated">
          <h2 class="form-title">✏️ Tạo bài viết mới</h2>
          <p class="form-subtitle">Chia sẻ kiến thức, kinh nghiệm hoặc đặt câu hỏi</p>

          <form onsubmit="handleNewThread(event)">
            <div class="form-group">
              <label class="form-label">Tiêu đề *</label>
              <input type="text" class="form-input" id="thread-title" placeholder="Nhập tiêu đề bài viết..." required>
            </div>

            <div class="form-group">
              <label class="form-label">Danh mục *</label>
              <select class="form-select" id="thread-category" required>
                <option value="">-- Chọn danh mục --</option>
                ${t.map(e=>`<option value="${e.id}">${e.icon} ${c(e.name)}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Nội dung *</label>
              <textarea class="form-textarea" id="thread-content" placeholder="Viết nội dung bài viết...

Mẹo: Dùng **chữ đậm** và - để tạo danh sách" required style="min-height:200px;"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Thẻ tags</label>
              <input type="text" class="form-input" id="thread-tags" placeholder="Nhập các tag cách nhau bởi dấu phẩy (VD: thuế, TNCN, hướng dẫn)">
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" onclick="history.back()">Hủy</button>
              <button type="submit" class="btn btn-primary btn-lg">Đăng bài viết</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    ${T()}
  `}function cn(){const t=document.getElementById("app");t.innerHTML=`
    ${b()}
    <div class="main-layout-full">
      <div class="form-container animate-fadeIn">
        <div class="form-card card card-elevated">
          <div style="text-align:center; margin-bottom: var(--space-lg);">
            <img src="${x}" alt="BZ" style="width:60px; height:60px;">
          </div>
          <h2 class="form-title">Đăng nhập</h2>
          <p class="form-subtitle">Chào mừng quay lại BZ Forum</p>

          <form onsubmit="handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="login-email" placeholder="email@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-input" id="login-password" placeholder="Nhập mật khẩu" required>
            </div>
            <div id="login-error" class="form-error" style="display:none;"></div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">Đăng nhập</button>
            </div>
          </form>

          <div class="form-link">
            Chưa có tài khoản? <a onclick="navigate('#/register')">Đăng ký ngay</a>
          </div>

          <div style="margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--border-color);">
            <p style="font-size: 0.8rem; color: var(--color-text-lighter); text-align: center; margin-bottom: var(--space-sm);">Tài khoản demo:</p>
            <div style="font-size: 0.8rem; color: var(--color-text-light); text-align: center;">
              <strong>Admin:</strong> bezin@bzforum.vn / bezin123<br>
              <strong>Member:</strong> huong@example.com / demo123
            </div>
          </div>
        </div>
      </div>
    </div>
    ${T()}
  `}function sn(){const t=document.getElementById("app");t.innerHTML=`
    ${b()}
    <div class="main-layout-full">
      <div class="form-container animate-fadeIn">
        <div class="form-card card card-elevated">
          <div style="text-align:center; margin-bottom: var(--space-lg);">
            <img src="${x}" alt="BZ" style="width:60px; height:60px;">
          </div>
          <h2 class="form-title">Đăng ký</h2>
          <p class="form-subtitle">Tham gia cộng đồng kế toán BZ Forum</p>

          <form onsubmit="handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Họ tên</label>
              <input type="text" class="form-input" id="reg-name" placeholder="Nhập họ tên" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="reg-email" placeholder="email@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu</label>
              <input type="password" class="form-input" id="reg-password" placeholder="Tối thiểu 6 ký tự" required minlength="6">
            </div>
            <div class="form-group">
              <label class="form-label">Xác nhận mật khẩu</label>
              <input type="password" class="form-input" id="reg-confirm" placeholder="Nhập lại mật khẩu" required>
            </div>
            <div id="reg-error" class="form-error" style="display:none;"></div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">Đăng ký</button>
            </div>
          </form>

          <div class="form-link">
            Đã có tài khoản? <a onclick="navigate('#/login')">Đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
    ${T()}
  `}function ln(t){const n=q({search:t}),e=document.getElementById("app");e.innerHTML=`
    ${b()}
    <div class="main-layout">
      ${$()}
      <main class="content animate-fadeIn">
        <a class="back-link" onclick="navigate('#/')">${l.back} Quay lại trang chủ</a>
        <div class="content-header">
          <h3 class="content-title">Kết quả tìm kiếm: "${c(t)}"</h3>
          <span style="color: var(--color-text-light); font-size:0.9rem;">${n.length} kết quả</span>
        </div>
        <div class="thread-list">
          ${n.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">Không tìm thấy kết quả</div>
              <div class="empty-state-text">Thử tìm với từ khóa khác hoặc duyệt theo danh mục</div>
            </div>
          `:n.map(i=>K(i)).join("")}
        </div>
      </main>
    </div>
    ${T()}
  `}function dn(t){const n=w(t);if(!n){p("#/");return}const e=getUserThreads(t),i=document.getElementById("app");i.innerHTML=`
    ${b()}
    <div class="main-layout">
      ${$()}
      <main class="content animate-fadeIn">
        <a class="back-link" onclick="history.back()">${l.back} Quay lại</a>

        <div class="profile-header card card-elevated">
          <div class="profile-avatar">${c(n.avatar)}</div>
          <div class="profile-info">
            <h2>${c(n.name)}
              ${n.role==="admin"?'<span class="badge badge-admin" style="margin-left:0.5rem;">Admin</span>':""}
              ${n.role==="moderator"?'<span class="badge badge-mod" style="margin-left:0.5rem;">Mod</span>':""}
            </h2>
            <p>${c(n.bio||"Chưa có giới thiệu")}</p>
            <p style="font-size:0.8rem; color:var(--color-text-lighter); margin-top:0.3rem;">Tham gia: ${P(n.joinDate)}</p>
          </div>
        </div>

        <div class="content-header">
          <h3 class="content-title">Bài viết của ${c(n.name)}</h3>
          <span style="color: var(--color-text-light); font-size:0.9rem;">${e.length} bài</span>
        </div>

        <div class="thread-list">
          ${e.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">📝</div>
              <div class="empty-state-title">Chưa có bài viết nào</div>
            </div>
          `:e.map(a=>K(a)).join("")}
        </div>
      </main>
    </div>
    ${T()}
  `}function un(){const t=document.getElementById("search-input"),n=t==null?void 0:t.value.trim();n&&p("#/search?q="+encodeURIComponent(n))}function gn(t){t.preventDefault();const n=document.getElementById("login-email").value.trim(),e=document.getElementById("login-password").value,i=F(n,e);if(i)L(i),m(`Chào mừng ${i.name}! 👋`),p("#/");else{const a=document.getElementById("login-error");a.style.display="block",a.textContent="Email hoặc mật khẩu không đúng"}}function mn(t){t.preventDefault();const n=document.getElementById("reg-name").value.trim(),e=document.getElementById("reg-email").value.trim(),i=document.getElementById("reg-password").value,a=document.getElementById("reg-confirm").value,h=document.getElementById("reg-error");if(i!==a){h.style.display="block",h.textContent="Mật khẩu xác nhận không khớp";return}const o=O(n,e,i);if(o.error){h.style.display="block",h.textContent=o.error;return}L(o.user),m(`Đăng ký thành công! Chào mừng ${o.user.name} 🎉`),p("#/")}function pn(){L(null),m("Đã đăng xuất","info"),p("#/")}function vn(t){t.preventDefault();const n=document.getElementById("thread-title").value.trim(),e=document.getElementById("thread-content").value.trim(),i=document.getElementById("thread-category").value,a=document.getElementById("thread-tags").value.trim(),h=a?a.split(",").map(r=>r.trim()).filter(Boolean):[];if(!n||!e||!i){m("Vui lòng điền đầy đủ thông tin","error");return}const o=Z({title:n,content:e,categoryId:i,tags:h,authorId:g.id});m("Đăng bài thành công! 🎉"),p("#/thread/"+o.id)}function bn(t,n){t.preventDefault();const e=document.getElementById("reply-content").value.trim();if(!e){m("Vui lòng nhập nội dung bình luận","error");return}J({threadId:n,content:e,authorId:g.id}),m("Bình luận đã được gửi! 💬"),M(n)}function Tn(t){X(t),M(t)}document.addEventListener("DOMContentLoaded",()=>{s(),Q()});Object.assign(window,{navigate:p,showToast:m,toggleDropdown:hn,changeSort:rn,handleSearch:un,handleLogin:gn,handleRegister:mn,handleLogout:pn,handleNewThread:vn,handleReply:bn,handleLike:Tn});
