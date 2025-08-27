#!/usr/bin/env node

/**
 * Simple API test script for EasyClinic
 * Run with: node scripts/test-api.js
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing EasyClinic API...\n');
  console.log(`📍 API Base URL: ${API_BASE_URL}\n`);

  // Test 1: Check if API is reachable
  try {
    console.log('1️⃣ Testing API connectivity...');
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ API is reachable');
    } else {
      console.log('⚠️  API responded but with status:', response.status);
    }
  } catch (error) {
    console.log('❌ API is not reachable:', error.message);
  }

  // Test 2: Test login endpoint
  try {
    console.log('\n2️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@easyclinic.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('   User:', data.user.firstName, data.user.lastName);
      console.log('   Token received:', data.token ? 'Yes' : 'No');
    } else {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log('❌ Login failed:', loginResponse.status, errorData.message || '');
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }

  // Test 3: Test protected endpoint (if we have a token)
  try {
    console.log('\n3️⃣ Testing protected endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@easyclinic.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      const token = loginData.token;

      // Test getting current user
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ Protected endpoint successful');
        console.log('   Current user:', userData.firstName, userData.lastName);
      } else {
        console.log('❌ Protected endpoint failed:', userResponse.status);
      }
    } else {
      console.log('⚠️  Skipping protected endpoint test (login failed)');
    }
  } catch (error) {
    console.log('❌ Protected endpoint test failed:', error.message);
  }

  console.log('\n🎯 API testing completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Ensure your backend is running on port 3001');
  console.log('   2. Check CORS configuration');
  console.log('   3. Verify database connection');
  console.log('   4. Test the frontend login form');
}

// Run the tests
testAPI().catch(console.error);
