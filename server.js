
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/api/waits', async (req, res) => {
  try {
    // Placeholder sample park data. Replace with live queue-times API if needed.
    res.json({
      parks: {
        "Magic Kingdom": {
          hours: "9:00 AM – 9:00 PM",
          nightShow: "Happily Ever After – 9:00 PM",
          attractions: [
            { name: "Seven Dwarfs Mine Train", wait: 75 },
            { name: "Peter Pan's Flight", wait: 50 },
            { name: "Space Mountain", wait: 40 }
          ]
        },
        "Universal Studios Florida": {
          hours: "8:00 AM – 8:00 PM",
          nightShow: "Cinematic Celebration – 8:30 PM",
          attractions: [
            { name: "Harry Potter and the Escape from Gringotts", wait: 80 },
            { name: "Transformers: The Ride", wait: 55 }
          ]
        },
        "EPCOT": {
          hours: "9:00 AM – 9:00 PM",
          nightShow: "Luminous – 9:00 PM",
          attractions: [
            { name: "Guardians of the Galaxy: Cosmic Rewind", wait: 90 },
            { name: "Test Track", wait: 60 }
          ]
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load park data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
