import React from "react";

function GuideInstructions() {
  return (
    <article className="self-start mt-1.5 max-md:max-w-full">
      <section>
        <h3 className="font-bold">1. Đăng ký và Đăng nhập</h3>
        <h4 className="font-medium text-base">Bước 1: Đăng ký tài khoản</h4>
        <ul className="list-disc pl-5">
          <li className="text-base">
            Truy cập trang chủ Astro Số và nhấp vào &quot;Đăng nhập&quot; ở góc
            phải trên cùng
          </li>
          <li className="text-base">
            Chọn &quot;Đăng ký&quot; nếu bạn chưa có tài khoản
          </li>
          <li className="text-base">
            Điền đầy đủ thông tin cá nhân: Họ tên, số điện thoại, email, mật
            khẩu
          </li>
          <li className="text-base">
            Xác nhận số điện thoại qua mã OTP được gửi đến
          </li>
          <li className="text-base">Hoàn tất đăng ký</li>
        </ul>

        <h4 className="font-medium text-base">Bước 2: Đăng nhập</h4>
        <ul className="list-disc pl-5">
          <li className="text-base">Nhập email/số điện thoại và mật khẩu</li>
          <li className="text-base">Nhấp vào &quot;Đăng nhập&quot;</li>
          <li className="text-base">
            Chọn &quot;Ghi nhớ đăng nhập&quot; nếu bạn muốn duy trì trạng thái
            đăng nhập.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="font-bold">2. Sử dụng các công cụ tra cứu</h3>
        <h4 className="font-medium">Tra cứu Thần số học:</h4>
        <ul className="list-disc pl-5">
          <li>Nhấp vào mục &quot;Thần số học&quot; trên menu chính</li>
          <li>Nhập đầy đủ họ tên khai sinh và ngày tháng năm sinh của bạn</li>
          <li>Bấm &quot;Tra cứu&quot; để nhận kết quả chi tiết</li>
        </ul>

        <h4 className="font-medium mt-4">Tra cứu Chiêm tinh học:</h4>
        <ul className="list-disc pl-5">
          <li>Nhấp vào mục &quot;Chiêm tinh học&quot; trên menu chính</li>
          <li>
            Nhập ngày tháng năm sinh, giờ sinh (nếu biết) và địa điểm sinh
          </li>
          <li>
            Bấm &quot;Tra cứu&quot; để xem bản đồ sao và các phân tích liên quan
          </li>
        </ul>

        <h4 className="font-medium mt-4">So sánh tương hợp:</h4>
        <ul className="list-disc pl-5">
          <li>Chọn mục &quot;So sánh tương hợp&quot;</li>
          <li>Nhập thông tin của hai người cần so sánh</li>
          <li>Chọn loại phân tích (tình yêu, bạn bè, công việc)</li>
          <li>Nhận kết quả phân tích độ tương hợp</li>
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="font-bold">3. Đọc hiểu kết quả</h3>
        <ul className="list-disc pl-5">
          <li>
            Sau khi tra cứu, hệ thống sẽ hiển thị kết quả dưới dạng biểu đồ và
            phân tích chi tiết
          </li>
          <li>Cuộn xuống để xem thông tin chi tiết về từng chỉ số</li>
          <li>
            Bạn có thể lưu kết quả bằng cách nhấp vào &quot;Lưu kết quả&quot;
            hoặc &quot;In kết quả&quot;
          </li>
        </ul>
      </section>
    </article>
  );
}

export default GuideInstructions;
