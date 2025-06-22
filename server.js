const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Theme Park API server is running');
});

app.get('/api/waits', async (req, res) => {
  try {
    const response = await fetch('https://queue-times.com/parks.json');
    const parkList = await response.json();

    const parkData = {};

    for (const park of parkList.parks) {
      const parkDetailsRes = await fetch(\`https://queue-times.com/parks/\${park.id}/queue_times.json\`);
      const parkDetails = await parkDetailsRes.json();

      const allRides = [];
      for (const land of parkDetails.lands || []) {
        for (const ride of land.rides || []) {
          if (ride.is_open) {
            allRides.push({
              name: ride.name,
              wait: ride.wait_time
            });
          }
        }
      }

      const top5 = allRides.sort((a, b) => b.wait - a.wait).slice(0, 5);

      parkData[park.name] = {
        status: top5.length > 0 ? "open" : "closed",
        attractions: top5,
        hours: park.operating_hours || "Unknown"
      };
    }

    res.json({ parks: parkData });
  } catch (err) {
    console.error('API fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch park data' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
