
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/api/waits', async (req, res) => {
  try {
    // Fake example data structure, replace this with real Queue-Times integration
    res.json({
      parks: {
        "Magic Kingdom": {
          hours: "9:00 AM – 9:00 PM",
          nightShow: "Happily Ever After – 9:00 PM",
          attractions: [
            { name: "Seven Dwarfs Mine Train", wait: 75 },
            { name: "Peter Pan's Flight", wait: 50 }
          ]
        },
        "Universal Studios Florida": {
          hours: "8:00 AM – 8:00 PM",
          nightShow: "Cinematic Celebration – 8:30 PM",
          attractions: [
            { name: "Harry Potter and the Escape from Gringotts", wait: 80 },
            { name: "Despicable Me Minion Mayhem", wait: 40 }
          ]
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
