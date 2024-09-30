// src/app/calendar/page.js
import { useEffect, useState } from 'react';


const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/calendar-events');
      const data = await response.json();
      setEvents(data.items || []);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.start.dateTime || event.start.date} - {event.summary}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarPage;  