import axios from 'axios';

async function testRegistration() {
  const uniqueId = Math.floor(Math.random() * 10000);
  const testData = {
    email: `battle_node_${uniqueId}@rg.academy`,
    password: 'TestPassword123!',
    displayName: 'Battle Node v2.26',
    role: 'student',
    phone: `+7999${uniqueId.toString().padStart(4, '0')}`,
    profileData: {
      bio: 'Automated Battle Test v2.26 - Pro Max UI Verification',
      country: 'US',
      citizenship: 'US',
      gender: 'other',
      dateOfBirth: '2000-01-01'
    }
  };

  console.log(`🚀 [BATTLE TEST] Attempting registration for: ${testData.email}`);
  
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', testData);
    console.log('✅ [SUCCESS] Registration synchronized with Grid.');
    console.log('📦 Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    if (error.response) {
      console.error('❌ [FAILURE] Engine Rejection (400/500):', error.response.data);
    } else if (error.request) {
      console.error('❌ [FAILURE] Connection Refused: Is the server running on port 3000?');
    } else {
      console.error('❌ [FAILURE] Logic Error:', error.message);
    }
  }
}

testRegistration();
