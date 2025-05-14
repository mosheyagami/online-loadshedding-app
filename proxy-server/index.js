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
  try {
    const { text } = req.query;
    const response = await axios.get(`${API_BASE}/areas_search?text=${text}`, {
      headers: { token: API_TOKEN },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
