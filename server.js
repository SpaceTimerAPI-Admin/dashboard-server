
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

function parseTimeToTodayDate(timeStr) {
  const [hourMin, ampm] = timeStr.split(' ');
  let [hour, min] = hourMin.split(':').map(Number);
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
}

app.get('/api/waits', async (req, res) => {
  try {
    const now = new Date();

    const parkData = {
      "Magic Kingdom": {
        hours: "9:00 AM – 9:00 PM",
        earlyEntry: "8:30 AM",
        parkHopper: "2:00 PM",
        nightShow: "Happily Ever After – 9:00 PM",
        attractions: [
          { name: "Seven Dwarfs Mine Train", wait: 65, status: "open" },
          { name: "Peter Pan's Flight", wait: 45, status: "closed" }
        ]
      },
      "EPCOT": {
        hours: "9:00 AM – 9:00 PM",
        earlyEntry: "8:30 AM",
        parkHopper: "2:00 PM",
        nightShow: "Luminous – 9:00 PM",
        attractions: [
          { name: "Test Track", wait: 0, status: "closed" },
          { name: "Spaceship Earth", wait: 0, status: "closed" }
        ]
      },
      "Universal Studios Florida": {
        hours: "8:00 AM – 8:00 PM",
        earlyEntry: "7:00 AM",
        parkHopper: "11:00 AM",
        nightShow: "Cinematic Celebration – 8:30 PM",
        attractions: [
          { name: "Gringotts", wait: 80, status: "open" }
        ]
      }
    };

    const filteredParks = {};

    for (const [park, info] of Object.entries(parkData)) {
      const openRides = (info.attractions || []).filter(r => r.status === 'open');
      const [openStr, closeStr] = info.hours.split('–').map(s => s.trim());
      const openTime = parseTimeToTodayDate(openStr);
      const closeTime = parseTimeToTodayDate(closeStr);

      const isOpen = now >= openTime && now < closeTime && openRides.length > 0;

      filteredParks[park] = {
        ...info,
        status: isOpen ? "open" : "closed",
        attractions: isOpen ? openRides : []
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
