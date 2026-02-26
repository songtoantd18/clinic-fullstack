const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Đổi lại thành port bạn đang chạy
const CLINIC_ID = 'd13bdd67-1411-488a-b0b9-b24bd52b0cc6'; // <--- BẠN CẦN ĐIỀN ID CỦA CLINIC1 VÀO ĐÂY
const APPOINTMENT_TIME = '2026-03-10T09:00:00.000Z'; // Khung giờ định tranh giành

async function simulateAttack() {
  console.log('--- BƯỚC 1: Đăng ký & Đăng nhập 20 bệnh nhân ---');
  const patients = [];
  
  for (let i = 5; i <= 25; i++) {
    const email = `patient${i}@example.com`;
    const password = '1';
    
    try {
      // 1. Đăng ký (nếu chưa có)
      await axios.post(`${BASE_URL}/auth/register`, {
        email, password, role: 'patient'
      }).catch(() => {}); // Bỏ qua nếu đã tồn tại

      // 2. Đăng nhập để lấy Token
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email, password
      });
      
      patients.push({
        email,
        token: loginRes.data.access_token
      });
      console.log(`✅ Sẵn sàng: ${email}`);
    } catch (err) {
      console.error(`❌ Lỗi chuẩn bị ${email}: ${err.message}`);
    }
  }

  if (patients.length < 2) return;

  console.log('\n--- BƯỚC 2: "TẤN CÔNG" ĐỒNG LOẠT VÀO SLOT 9H00 ---');
  console.log(`Đang bắn ${patients.length} requests cùng lúc...`);

  const startTime = Date.now();
  const requests = patients.map(p => {
    return axios.post(`${BASE_URL}/appointments`, {
      clinicUserId: CLINIC_ID,
      appointmentTime: APPOINTMENT_TIME,
      symptoms: "Đau rát họng (Race test)"
    }, {
      headers: { Authorization: `Bearer ${p.token}` },
      params: { submit: true } // Gửi luôn không để Draft
    }).then(res => ({ email: p.email, success: true, status: res.status }))
      .catch(err => ({ email: p.email, success: false, status: err.response?.status, error: err.response?.data?.message }));
  });

  const results = await Promise.all(requests);
  const duration = Date.now() - startTime;

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log('\n--- KẾT QUẢ TẤN CÔNG ---');
  console.log(`Tổng thời gian bắn: ${duration}ms`);
  console.log(`✅ Đặt lịch thành công: ${successCount}`);
  console.log(`❌ Đặt lịch thất bại: ${failCount}`);

  if (successCount > 1) {
    console.log('\n🔴 KẾT LUẬN: HỆ THỐNG BỊ LỖI RACE CONDITION!');
    console.log('Nhiều người đã đặt được cùng 1 khung giờ.');
  } else if (successCount === 1) {
    console.log('\n🟢 KẾT LUẬN: HỆ THỐNG AN TOÀN.');
    console.log('Chỉ duy nhất 1 người nhanh nhất đặt được chỗ.');
  }

  results.forEach(r => {
    if (!r.success) console.log(`   - ${r.email}: ${r.status} - ${r.error}`);
  });
}

simulateAttack();
