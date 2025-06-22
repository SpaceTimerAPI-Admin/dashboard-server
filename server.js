
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 4000;

const PARK_IDS = {
  "Magic Kingdom": 6,
  "EPCOT": 5,
  "Disney's Hollywood Studios": 7,
  "Disney's Animal Kingdom": 4,
  "Universal Studios Florida": 65,
  "Universal's Islands of Adventure": 64,
  "Universal's Epic Universe": 66
};

const STATIC_HOURS = {
  "Magic Kingdom": "9:00 AM – 11:00 PM",
  "EPCOT": "9:00 AM – 9:00 PM",
  "Disney's Hollywood Studios": "8:30 AM – 9:00 PM",
  "Disney's Animal Kingdom": "8:00 AM – 8:00 PM",
  "Universal Studios Florida": "9:00 AM – 9:00 PM",
  "Universal's Islands of Adventure": "9:00 AM – 9:00 PM",
  "Universal's Epic Universe": "Coming 2025"
};

app.get('/api/waits', async (req, res) => {
  const parks = {};

  await Promise.all(Object.entries(PARK_IDS).map(async ([name, id]) => {
    try {
      const response = await fetch(`https://queue-times.com/parks/${id}/queue_times.json`);
      const json = await response.json();

      const allRides = json.lands.flatMap(land =>
        land.rides
          .filter(r => typeof r.wait_time === 'number' && r.is_open)
          .map(r => ({
            name: r.name,
            wait: r.wait_time
          }))
      );

      const topRides = allRides.sort((a, b) => b.wait - a.wait).slice(0, 5);

      parks[name] = {
        status: topRides.length > 0 ? "open" : "closed",
        attractions: topRides,
        hours: STATIC_HOURS[name] || "Hours unavailable"
      };
    } catch (err) {
      parks[name] = {
        status: "error",
        attractions: [],
        hours: "Error fetching"
      };
      console.error(`Error fetching data for ${name}:`, err);
    }
  }));

  res.json({ parks });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
