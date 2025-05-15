// proxy-server/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_BASE = 'https://developer.sepush.co.za/business/2.0';
const API_TOKEN = process.env.ESP_TOKEN;

app.get('/api/search', async (req, res) => {
  const search = req.query.search;

  try {
    const response = await axios.get(`https://developer.sepush.co.za/business/2.0/areas_search`, {
      params: { text: search },
      headers: { 'Token': process.env.ESP_API_KEY }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Search API failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal server error from proxy' });
  }
});


app.get('/api/area', async (req, res) => {
  try {
    const { id } = req.query;
    const response = await axios.get(`${API_BASE}/area?id=${id}`, {
      headers: { token: API_TOKEN },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
