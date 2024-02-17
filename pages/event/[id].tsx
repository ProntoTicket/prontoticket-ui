import React, { useEffect, useState } from 'react';
import Layout from '../layout';
import { useRouter } from 'next/router'; // Import useRouter

const BASE_URL = 'http://localhost:5110';

interface TicketType {
  Id: string;
  EventId: string;
  Type: string;
  Price: number;
  TotalTickets: number;
}

interface Event {
  Id?: string;
  Name: string;
  Description: string;
  Capacity: number;
  StartDateTimeUtc: Date;
  EndDateTimeUtc: Date;
  Location: string;
  ProducerId: string;
  ImageUrl: string;
  Price: number;
  ShortDescription: string;
  Tags?: string[];
}

const EventPage = () => {
  const router = useRouter(); // Use the useRouter hook
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const pathname = router.asPath;
    const eventIdFromPath = pathname.split('/').pop(); // Extract eventId from the URL pathname

    if (eventIdFromPath) {
      setEventId(eventIdFromPath);
    }
  }, [router.asPath]);

  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          console.log('Fetching event...');
          const response = await fetch(`${BASE_URL}/api/events/${eventId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch event data');
          }
          const data = await response.json();
          console.log('Fetched event:', data);
          setEvent(data);
        } catch (error) {
          console.error('Error fetching event:', error);
        }
      };

      const fetchTicketTypes = async () => {
        try {
          console.log('Fetching ticket types...');
          const response = await fetch(
            `${BASE_URL}/api/tickettypes/event/${eventId}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch ticket types');
          }
          const data = await response.json();
          console.log('Fetched ticket types:', data);
          setTicketTypes(data);
        } catch (error) {
          console.error('Error fetching ticket types:', error);
        }
      };

      fetchEvent();
      fetchTicketTypes();
    }
  }, [eventId]);

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets({ ...selectedTickets, [ticketId]: quantity });
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    ticketTypes.forEach((ticketType) => {
      if (selectedTickets[ticketType.Id]) {
        totalPrice += ticketType.Price * selectedTickets[ticketType.Id];
      }
    });
    return totalPrice;
  };

  const handleBuyClick = async () => {
    setIsProcessing(true);

    // Retrieve user details from localStorage, if available
    const userId = localStorage.getItem('Id');
    const email = localStorage.getItem('Email') || 'defaultemail@example.com';
    const firstName = localStorage.getItem('FirstName') || 'FirstName';
    const lastName = localStorage.getItem('LastName') || 'LastName';
    const phoneNumber = '1234567890'; // Hardcoded phone number for now

    const purchases = Object.keys(selectedTickets).map((ticketId) => ({
      Quantity: selectedTickets[ticketId],
      TicketTypeId: ticketId,
    }));

    const paymentRequestBody = {
      UserId: userId || undefined, // Exclude UserId if not available
      EventId: eventId,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: phoneNumber,
      Purchases: purchases,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/payments/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequestBody),
      });

      if (!response.ok) {
        // If the response status code is not OK, it's an error
        const errorText = await response.text(); // Try to read the error response
        throw new Error(`Failed to create payment link: ${errorText}`);
      }

      // Assuming the API might return a plain text URL (not JSON) if successful
      const data = await response.text(); // First attempt to read as text

      // Check if the data looks like a URL, which means the Stripe link was created successfully
      if (data.startsWith('http')) {
        window.location.href = data; // Redirect user to Stripe for payment
        return; // Exit the function after redirecting
      } else {
        // If not, try to parse as JSON and handle accordingly
        const jsonData = JSON.parse(data);
        if (jsonData && jsonData.stripeLink) {
          window.location.href = jsonData.stripeLink;
          return;
        }
        throw new Error('The response did not contain a valid Stripe link.');
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!event)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="fixed inset-0 flex justify-center items-center ">
        <div className="">
          <button
            className="absolute top-0 right-0 mt-2 mr-2 text-2xl font-semibold leading-none text-black hover:text-gray-700"
            onClick={() => window.history.back()}
          >
            &times;
          </button>
          <img
            src={event.ImageUrl}
            alt={event.Name}
            className="mt-6 rounded-lg w-full"
          />
          <div className="p-2">
            <h2 className="text-xl font-bold mb-2">{event.Name}</h2>
            <p className="mb-2 text-sm">{event.Description}</p>
            <p className="mb-1 text-sm">
              <strong>Location: </strong>
              {event.Location}
            </p>
            <p className="mb-1 text-sm">
              <strong>Date: </strong>
              {new Date(event.StartDateTimeUtc).toLocaleDateString()}{' '}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {ticketTypes.map((ticket) => (
                <div key={ticket.Id} className="mb-1">
                  <p className="text-sm font-bold mb-1">
                    {ticket.Type}: ${ticket.Price}
                  </p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={selectedTickets[ticket.Id] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          ticket.Id,
                          parseInt(e.target.value)
                        )
                      }
                      className="border border-gray-300 rounded-md px-1 py-1 w-16 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm font-bold mt-2">
              Total Price: ${getTotalPrice()}
            </p>
            <button
              onClick={handleBuyClick}
              disabled={isProcessing}
              className={`bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded hover:bg-blue-600 w-full mt-2 ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? 'Processing...' : 'Buy'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventPage;
