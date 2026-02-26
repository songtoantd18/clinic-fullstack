const axios = require('axios');

async function createPatients() {
  const url = 'http://localhost:3000/api/auth/register';
  
  for (let i = 2; i <= 22; i++) {
    const data = {
      email: `patient${i}@example.com`,
      password: '1',
      role: 'patient'
    };

    try {
      const response = await axios.post(url, data);
      console.log(`✅ Created: ${data.email} | Status: ${response.status}`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log(`🟡 Already exists: ${data.email}`);
      } else {
        console.error(`❌ Failed: ${data.email} | Error: ${error.message}`);
      }
    }
  }
}

createPatients();
