// scripts/test-donation.mjs
import axios from 'axios';
import { randomUUID } from 'crypto';

async function testDonation() {
  const donationData = {
    id: randomUUID(),
    campaignId: "623cf38a-e201-4f07-879a-36e447b857a7", // Use a valid campaign ID from your database
    userId: 'anonymous', // Using anonymous user
    amount: "100.00",
    status: "completed",
    anonymous: true,
    transactionId: `test_${Date.now()}`,
    paymentMethod: "test",
    message: "Test donation"
  };

  try {
    console.log('Sending test donation request...');
    const response = await axios.post('http://localhost:3001/api/donations', donationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testDonation(); 