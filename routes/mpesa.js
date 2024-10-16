const express = require('express');
const axios = require('axios');
const router = express.Router();

const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';

// Base64 encoding of credentials
const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

// Generate OAuth token
const generateOAuthToken = async () => {
  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${credentials}`
      }
    });
    return response.data.access_token;
  } catch (err) {
    console.error('Error generating OAuth token', err);
    return null;
  }
};

// Payment request (STK Push)
router.post('/pay', async (req, res) => {
  const token = await generateOAuthToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to generate token' });
  }

  const paymentData = {
    BusinessShortCode: '174379',  // Test shortcode
    Password: 'PASSWORD', // Generate this dynamically
    Timestamp: '20211016120000', // Dynamic timestamp
    TransactionType: 'CustomerPayBillOnline',
    Amount: req.body.amount, // The total order amount
    PartyA: req.body.phone, // Customer's phone number
    PartyB: '174379',
    PhoneNumber: req.body.phone,
    CallBackURL: 'https://yourapp.com/mpesa/callback',
    AccountReference: 'FRESHDAILY',
    TransactionDesc: 'Payment for Juice'
  };

  try {
    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', paymentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Payment failed', details: err });
  }
});

module.exports = router;

router.post('/callback', (req, res) => {
    const paymentStatus = req.body.Body.stkCallback.ResultCode;
    if (paymentStatus === 0) {
      // Payment success logic
    } else {
      // Payment failure logic
    }
    res.sendStatus(200);
  });
  