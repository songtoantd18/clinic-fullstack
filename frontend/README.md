# Clinic Booking System - Unified Frontend

Một ứng dụng frontend duy nhất với khả năng điều khiển dựa trên role (Clinic/Patient).

## Cấu trúc Thư mục

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx           # Auth context + provider
│   ├── hooks/
│   │   └── useRoleBasedNavigation.ts # Navigation hook
│   ├── pages/
│   │   ├── HomePage.tsx              # Trang chủ
│   │   ├── LoginPage.tsx             # Đăng nhập (dùng chung)
│   │   ├── clinic/
│   │   │   └── DashboardPage.tsx     # Dashboard Clinic
│   │   └── patient/
│   │       ├── AppointmentsPage.tsx  # Danh sách cuộc hẹn
│   │       └── ClinicsPage.tsx       # Danh sách phòng khám
│   ├── App.tsx                       # Router chính (role-based)
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

## Tính Năng

### 1. **Authentication dựa trên Role**

- Đăng nhập duy nhất cho cả Clinic và Patient
- Lưu role và user info trong localStorage
- Protected routes - không thể truy cập route của role khác

### 2. **Routing Tự động**

- **Clinic routes**: `/clinic/dashboard`
- **Patient routes**: `/patient/clinics`, `/patient/appointments`
- Redirect tự động dựa trên role khi truy cập `/dashboard`

### 3. **Context API**

- `AuthContext` quản lý toàn bộ trạng thái auth
- Có hook `useAuth()` để dễ dàng truy cập auth state ở bất kỳ component nào

### 4. **UI chung**

- HomePage hiển thị nội dung khác nhau tuỳ theo role
- LoginPage dùng chung cho cả Clinic và Patient
- Navigation tự động điều chỉnh

## Cài đặt

```bash
cd frontend
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3001`

## Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Demo

**Đăng nhập demo:**

- Email: `any@email.com`
- Password: `any`
- Chọn role: Clinic hoặc Patient

## Flow Ứng dụng

1. **Chưa đăng nhập** → HomePage + LoginPage
2. **Đăng nhập** → Redirect theo role
3. **Clinic** → Dashboard clinic
4. **Patient** → Danh sách clinics, appointments

## Lợi Ích

✅ Một codebase duy nhất  
✅ Dễ bảo trì  
✅ Chia sẻ dependencies  
✅ Reduced bundle size  
✅ Consistent UI/UX  
✅ Dễ scaling và thêm features

## Next Steps

- [ ] Kết nối API backend
- [ ] Thêm form validation
- [ ] Implement appointment booking
- [ ] Thêm user profile management
- [ ] Implement notifications
- [ ] Thêm unit tests
