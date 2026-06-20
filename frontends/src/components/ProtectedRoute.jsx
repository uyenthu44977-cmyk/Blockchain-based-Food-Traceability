import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // Lấy role hiện tại của người dùng từ localStorage
  const userRole = localStorage.getItem("role");

  // 1. Nếu chưa kết nối ví (chưa có role), đá về trang chủ
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // 2. CẬP NHẬT LOGIC: Nếu tài khoản là ADMIN thì BỎ QUA kiểm tra, cho vào luôn
  if (userRole === "ADMIN") {
    return children;
  }

  // 3. Đối với các ví khác (Không phải Admin), nếu sai role yêu cầu thì chặn lại
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // Nếu đúng role thì cho vào trang bình thường
  return children;
}