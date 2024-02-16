// api/admin-event/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';

// Example function to fetch event data
const fetchEventById = async (eventId: string): Promise<Event | null> => {
  console.log('WE ARE HERE YEAH');
  try {
    // Your logic to fetch event data by ID
    const response = await fetch(`http://localhost:5110/api/events/${eventId}`); // Adjust this line
    if (!response.ok) {
      throw new Error('Failed to fetch event data');
    }
    const event = await response.json();
    return event;
  } catch (error) {
    console.error('Error fetching event data:', error);
    return null;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query; // id is the dynamic parameter from the URL

  try {
    const eventData = await fetchEventById(id as string);

    // If event data is found, return it
    if (eventData) {
      res.status(200).json(eventData);
    } else {
      // If event data is not found, return a 404 error
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching event data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
