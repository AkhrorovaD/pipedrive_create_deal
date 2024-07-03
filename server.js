const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const pipedrive = require('pipedrive');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const apiClient = new pipedrive.ApiClient();
apiClient.authentications.api_key.apiKey = process.env.PIPEDRIVE_API_KEY;
let oauth2 = apiClient.authentications.oauth2;
oauth2.clientId = process.env.PIPEDRIVE_CLIENT_ID;
oauth2.clientSecret = process.env.PIPEDRIVE_CLIENT_SECRET;
oauth2.redirectUri = 'https://api.workiz.com';
oauth2.refreshToken = process.env.PIPEDRIVE_REFRESH_TOKEN;

async function refreshAccessToken() {
  try {
    const refreshToken = oauth2.refreshToken || process.env.PIPEDRIVE_REFRESH_TOKEN;
    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    oauth2.refreshToken = refreshToken;
    console.log('Refreshing token with refreshToken:', refreshToken);

    const refreshPromise = apiClient.refreshToken();
    await refreshPromise;
    console.log('Token refreshed successfully');
  } catch (exception) {
    console.error('Error refreshing token:', exception);
  }
}

app.use(bodyParser.json());

app.post('/api/addDeal', async (req, res) => {
  try {
    console.log('Sending request...');
    await refreshAccessToken();
    const api = new pipedrive.DealsApi(apiClient);
    const { first_name, last_name, phone, email, job_type, job_source, job_description, address, city, state, zip_code, area, start_date, start_time, end_time, test_select } = req.body;

    const dealData = {
      title: `${job_type} - ${first_name} ${last_name}`,
      value: 0,
      currency: 'USD', 
      person_id: null,
      org_id: 1, 
      stage_id: 1,
      status: 'open',
      add_time: new Date().toISOString(),
      "e158b4e8f07d4c057a3003b82841719d4dfe5196": first_name,
      "9151c7c54e7733159c72d691fa67f6e1445ca6fa": last_name,
      "685cc9c841df2db735acd4c9bc497a766d69d27e": phone,
      "63d1d9b18d273fcb804112c2008cb3a2744c78b2": job_type,
      "9846a72dfa96bf2d4bb84b7e14d0be94fc5973e6": email,
      "23f00f4412a65cee3569c7150088bafd901b92a6": job_source,
      "509d68ce0b095cca6dd2103808227a9d4ee7e4d1": job_description,
      "933830c0d24b9d8765689935fa6a88ad15704b3a": address,
      "f1564598d08cba545d77ca7963b1d528ccb2220f": city,
      "77fc9d7c4bdd0029c2dde50aeb02de7c6a5b1ee3": state,
      "34bfe1e8a3f2d74bf67107ab260ebdeda47fec74": zip_code,
      "f83e3c352f3f2c040ef5f9c6719d0c267c10973f": area,
      "a9cc5e8655a22d96eef7a3d5b3ce8137a28a5005": start_date,
      "55cbc09a6ab0ed21bdd852f5012650e953e42e56": start_time,
      "0d78e86fc8eb5b23d0236110588e9c586ed5b8f0": end_time,
      "4d0422efa136a93a8b391dce1f1d6aec13fe7bc4": test_select
    };

    console.log('Sending deal data to Pipedrive:', dealData);
    const response = await api.addDeal(dealData);
    console.log('Pipedrive API response:', response);

    res.json({ message: 'Deal added successfully!', response });
  } catch (err) {
    const errorToLog = err.context?.body || err;
    console.error('Adding deal failed', errorToLog);
    res.status(500).json({ error: 'Failed to add deal', details: errorToLog });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
