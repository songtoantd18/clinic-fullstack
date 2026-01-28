Story:

- Giúp cho phòng khám(Clinic - PK) tư có thể kiểm soát được số lượng người khám
  trong 1 buổi, thứ tự người đến khám (Patient - Pa), lịch sử đến khám, đơn thuốc
- Giúp cho người đến khám có thể đặt giờ đến khám tại PK, giảm thời gian chờ đến
  lượt đến mức thấp nhất có thể, có thể theo dõi lịch sử khám, đơn thuốc đã mua ở đó
  Mô tả chức năng:
- Xây dựng trang web và app cho PK và Pa
- Đối với PK:
- Đối tượng sử dụng: các bác sĩ mở PK
- Chức năng:
- Login, logout
- Xem thông tin chung về lịch sử khám bệnh tại PK, lịch sử đơn thuốc,
  không thể chỉnh sửa
- Chỉnh sửa thông tin giới thiệu PK, hình ảnh PR
- Xem thông tin về lịch khám đặt trước, chỉnh sửa, hủy lịch khám
- Gửi mail, gửi tin nhắn thông báo đến Pa khi hủy, chỉnh sửa lịch khám
- Có thể chỉnh sửa giờ mở khám của PK,
- Có thể nhập đơn thuốc cho Pa sau khi khám tại PK để lưu lịch sử
- Đối với Pa:
- Đối tượng sử dụng: Tất cả các đối tượng có thể sử điện thoại, laptop để truy
  cập vào trang web và đặt lịch
- Chức năng:
- Xem thông tin về các PK đã đăng ký với hệ thống, list dưới dạng
  giống sản phẩm thương mại điện tử.
- Vào xem thông tin phòng khám, chọn giờ, khai báo bệnh tình cơ bản,
  xem lịch trống, đặt lịch
  Mô tả màn hình:
- Cho PK:
  a. Màn hình login: chỉ có chức năng Login, không có chức năng register,
  account sẽ được tạo sẵn trong Database và cung cấp cho PK
  b. Dashboard: màn hình thể hiện tổng quát các thông tin về PK, bao gồm:
- Lịch sử đặt khám tại PK
- Danh sách khám trong 1 tiếng tới tại PK
- Item điều hướng đến trang chỉnh sửa thông tin PK
- Item điều hướng đến thời gian hoạt động của PK
  c. History Order:
- lịch sử thể hiện dưới dạng table, table có 6 cột: số thứ tự, giờ khám,
  tên người đặt, sdt, email, mô tả tình trạng bệnh nhân
- có chức năng load more, mỗi lần sẽ load thêm 15 record
- phía trên table là chức năng filter: theo thời gian (từ ngày nào đến
  ngày nào), theo sdt, theo email, theo tên người đặt, theo mới nhất/cũ
  nhất. Có thể kết hợp các filter với nhau
- Với những lịch khám quá khứ (sau thời gian hiện tại) sẽ có
  background màu xám nhạt, lịch khám tương lai sẽ là màu xanh lá
  nhạt, lịch đang khám sẽ có màu lam nhạt
  d. Detail History:- Thể hiện thông tin chi tiết về buổi khám: thời gian khám, tên người
  đặt, sdt, email, tình trạng bệnh, đơn thuốc (nếu có), kết quả xét
  nghiệm (nếu có)
- Nếu buổi khám là ở tương lai, sẽ có thêm nút switch để hủy lịch khám
- Có thể edit được thời gian khám (nếu chưa khám)
- Có thể edit được kết quả xét nghiệm, đơn thuốc, tình trạng bệnh
  e. Clinic Info:
- Thể hiện thông tin phòng khám: tên PK, hình ảnh PK, mô tả PK, địa
  chỉ, sdt liên lạc, email, giờ mở cửa khám chữa bệnh, mật khẩu đăng
  nhập, cài đặt thông báo lịch khám
- Có thể edit tất cả thông tin, ko được để trống thông tin nào
- Cho Pa:
  a. Home Page ( không cần đăng nhập)
- Banner giới thiệu về trang web, các chức năng có trong web: đặt lịch
  khám, xem lại lịch khám, đơn thuốc, tìm phòng khám
- Có nút “Hướng dẫn sử dụng” để người dùng bấm vào và link tới video
  hướng dẫn sử dụng
- List phòng khám được gợi ý ngẫu nhiên (hoặc theo bệnh tình của
  người bệnh nếu đã đăng nhập)
- Filter danh sách phòng khám dựa trên các tiêu chí: bệnh tình (tai mũi
  họng, phổi, siêu âm,…), khu vực (Hải Châu, Thanh Khê,...)
  b. Detail Clinic (không cần đăng nhập)
- Hình ảnh phòng khám
- Thông tin mô tả về phòng khám
- Thông tin Bác sĩ tại phòng khám
- Thời gian khám
- Thời gian khám trong 7 ngày tới
- Chức năng đặt lịch khám (cần đăng nhập)
  c. Login/Register
- Chức năng đăng nhập theo google account
- Chức năng đăng ký bằng google account, sau khi đăng ký bằng
  google account, thì yêu cầu cập nhật đầy đủ thông tin (số điện thoại,
  email, tên thật, cmnd) để sử dụng chức năng đặt lịch phòng khám.
  d. Profile (chỉ hiện khi đăng nhập)
- Xem lại các thông tin của người dùng
- Có thể edit thông tin
  e. History (chỉ hiện khi đăng nhập)
- List lịch sử đi khám bằng table, có 6 cột: stt, time, tên PK, địa chỉ PK,
  bệnh chẩn đoán, nút detail bệnh và đơn thuốc
  f. Logout: đăng xuất khỏi trang
  g. Chức năng đặt lịch khám:
- Chọn PK
- Chọn thời gian khám theo lịch mở cửa của PK
- Điền thông tin bệnh nhân ( có thể dùng thông tin của user đã có sẵn)
- Submit lịch khám1 số chức năng sẽ phát triển trong tương lai:
- Đánh giá phòng khám
- Gợi ý phòng khám dựa trên địa chỉ bệnh nhân
- chat trực tiếp giữa phòng khám và bệnh nhân trên web
- chức năng gửi tin nhắn nhắc nhở tới lịch khám trên điện thoại
