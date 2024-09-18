const axios = require('axios');

const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;
