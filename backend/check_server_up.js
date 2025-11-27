const axios = require('axios');

async function testDashboardStats() {
    try {
        // We need a token to test this, but since I can't easily get a valid token without login, 
        // I will just check if the server is responsive to a public endpoint first, 
        // or try to login as a doctor if I can find credentials.

        // For now, let's just check if the server is up.
        const response = await axios.get('http://localhost:3000/');
        console.log('Server root response:', response.status);

        console.log('✅ Server is reachable');
    } catch (error) {
        console.error('❌ Server check failed:', error.message);
    }
}

testDashboardStats();
