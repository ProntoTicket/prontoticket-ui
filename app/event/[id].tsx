// pages/event/[id].tsx

'use client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// You might need to adjust the Event interface to include all necessary details
interface Event {
  Id?: string;
  Name: string;
  Description: string;
  Capacity: number;
  Date: Date;
  Location: string;
  ProducerId: string;
  ImageUrl: string;
  Price: number;
}

const EventDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://localhost:5110/api/events/${id}`
          );
          const data = await response.json();
          setEvent(data);
        } catch (error) {
          console.error('Error fetching event:', error);
        }
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>; // or some loading spinner
  }

  return (
    <div>
      <h1>{event.Name}</h1>
      {/* Display more details here */}
    </div>
  );
};

export default EventDetailPage;
