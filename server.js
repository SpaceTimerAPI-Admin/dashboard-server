
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const PARKS = [
  { id: 6, name: "Magic Kingdom" },
  { id: 7, name: "Disney's Hollywood Studios" },
  { id: 5, name: "EPCOT" },
  { id: 8, name: "Disney's Animal Kingdom" },
  { id: 334, name: "Universal's Epic Universe" },
  { id: 65, name: "Universal Studios Florida" },
  { id: 64, name: "Universal's Islands of Adventure" },
];

app.get('/api/waits', async (req, res) => {
  const data = { parks: {} };

  for (const park of PARKS) {
    try {
      const response = await fetch(`https://queue-times.com/parks/${park.id}/queue_times.json`);
      const json = await response.json();

      const attractions = [];
      json.lands.forEach(land => {
        land.rides.forEach(ride => {
          if (ride.is_open && ride.wait_time !== null) {
            attractions.push({
              name: ride.name,
              wait: ride.wait_time
            });
          }
        });
      });

      const sortedAttractions = attractions.sort((a, b) => b.wait - a.wait).slice(0, 5);

      data.parks[park.name] = {
        status: sortedAttractions.length > 0 ? "open" : "closed",
        hours: "9:00 AM – 9:00 PM", // Static placeholder – replace with API data if available
        attractions: sortedAttractions
      };
    } catch (error) {
      data.parks[park.name] = {
        status: "closed",
        hours: "N/A",
        attractions: []
      };
    }
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
