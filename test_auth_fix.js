import axios from 'axios';

async function testCheckEmail() {
    const url = 'http://localhost:3000/api/auth/check-email';
    console.log('Testing /api/auth/check-email with empty body...');
    try {
        const response = await axios.post(url, {});
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        if (error.response) console.error('Data:', error.response.data);
    }

    console.log('\nTesting /api/auth/check-email with valid email...');
    try {
        const response = await axios.post(url, { email: 'admin@redgriffin.academy' });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
    }
}

testCheckEmail();
