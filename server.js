
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/api/waits', async (req, res) => {
  try {
    // Sample simulated ride data (replace with real API calls as needed)
    const parkData = {
      "Magic Kingdom": {
        hours: "9:00 AM – 9:00 PM",
        nightShow: "Happily Ever After – 9:00 PM",
        attractions: [
          { name: "Seven Dwarfs Mine Train", wait: 65, status: "open" },
          { name: "Peter Pan's Flight", wait: 45, status: "closed" }
        ]
      },
      "EPCOT": {
        hours: "9:00 AM – 9:00 PM",
        nightShow: "Luminous – 9:00 PM",
        attractions: [
          { name: "Test Track", wait: 0, status: "closed" },
          { name: "Spaceship Earth", wait: 0, status: "closed" }
        ]
      },
      "Universal Studios Florida": {
        hours: "8:00 AM – 8:00 PM",
        nightShow: "Cinematic Celebration – 8:30 PM",
        attractions: []
      }
    };

    // Filter and mark parks
    const filteredParks = {};
    for (const [park, info] of Object.entries(parkData)) {
      const openRides = (info.attractions || []).filter(r => r.status === 'open');
      filteredParks[park] = {
        ...info,
        status: openRides.length > 0 ? "open" : "closed",
        attractions: openRides
      };
    }

    res.json({ parks: filteredParks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load park data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
