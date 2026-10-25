# CyberSoft Shoes Store — Next.js

Dự án cửa hàng giày dùng **Next.js App Router, TypeScript và Redux Toolkit**. Các chức năng đã bổ sung gồm danh sách yêu thích có lưu trên trình duyệt, phân trang tìm kiếm, chỉnh sửa hồ sơ, đổi mật khẩu qua API cập nhật hồ sơ, chọn ảnh đại diện cục bộ, và phân biệt các dòng giỏ hàng theo size.

## Chạy dự án
1. Cài Node.js LTS (khuyến nghị Node 20 trở lên).
2. Giải nén ZIP và mở thư mục `shoes-shop-next` trong VS Code.
3. Mở Terminal tại thư mục dự án, chạy:

```bash
npm install
npm run dev
```

4. Mở http://localhost:3000

## Các trang
- `/` — Trang chủ và sản phẩm nổi bật.
- `/search` — Tìm kiếm, lọc danh mục, sắp xếp giá và phân trang (8 sản phẩm/trang).
- `/product/1` — Chi tiết, chọn size/số lượng, thêm giỏ.
- `/favorites` — Danh sách yêu thích được lưu trong localStorage.
- `/cart` — Giỏ hàng, cập nhật số lượng, xóa từng dòng, gửi yêu cầu đặt hàng.
- `/login` — Đăng nhập bằng email/mật khẩu hoặc Facebook Login (cần cấu hình App ID).
- `/register` — Đăng ký, kiểm tra xác nhận mật khẩu.
- `/profile` — Xem lịch sử đơn hàng, chỉnh sửa hồ sơ, đổi mật khẩu, chọn ảnh đại diện.

## API
Base URL: `https://shop.cyberlearn.vn/api`
- GET `/Product`
- GET `/Product/getbyid?id={id}`
- POST `/Users/signup`
- POST `/Users/signin`
- POST `/Users/getProfile`
- POST `/Users/updateProfile`
- POST `/Users/order`

## Lưu ý quan trọng
- Cần có kết nối mạng để gọi API. Môi trường tạo ZIP không kết nối được tới API để kiểm thử trực tiếp; vì vậy cần chạy thử với Swagger/API thật trước khi nộp. Nếu cấu trúc response hoặc payload thực tế khác, cần điều chỉnh `lib/api.ts` và trang liên quan.
- Ảnh đại diện hiện lưu trên trình duyệt của thiết bị đang dùng, không tải lên máy chủ vì chưa xác minh được API upload ảnh.
- Đổi mật khẩu được gửi cùng payload tới `/Users/updateProfile`; nếu API không hỗ trợ trường `password`, chức năng này cần endpoint đổi mật khẩu phù hợp do backend cung cấp.
- Facebook Login đã được tích hợp qua Facebook JavaScript SDK. Để bật, sao chép `.env.example` thành `.env.local`, rồi đặt `NEXT_PUBLIC_FACEBOOK_APP_ID=APP_ID_CUA_BAN`.
- Trong Meta for Developers: tạo ứng dụng, thêm use case Facebook Login, cấu hình miền ứng dụng là `localhost` khi phát triển local và website URL `http://localhost:3000`. Bật các thiết lập Facebook Login cho JavaScript/OAuth tương ứng. Khi deploy, thêm domain thật và cấu hình HTTPS.
- Facebook Login hiện xác thực người dùng với Facebook và lưu hồ sơ Facebook cục bộ để demo giao diện. Nó **không tự tạo token đăng nhập cho API CyberLearn**; muốn dùng Facebook để đặt hàng/hồ sơ qua API của trường cần backend xác minh Facebook access token và cấp token phiên riêng. Không đưa App Secret vào frontend.
- Bản đồ cửa hàng chưa tích hợp vì cần thông tin địa điểm do bên cung cấp dịch vụ cấp.
- Đề tham khảo nhắc `react-router-dom v6`, nhưng dự án này dùng Next.js theo yêu cầu nên sử dụng App Router thay thế. Redux Toolkit quản lý giỏ hàng; giỏ hàng và yêu thích được lưu cục bộ.
