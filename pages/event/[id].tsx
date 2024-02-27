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
  Address: string;
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
  const [promoCode, setPromoCode] = useState('');

  // Handler function to update promo code state
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };

  // User details state
  const [userDetails, setUserDetails] = useState<{
    userId: string | null;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }>({
    userId: null,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // Fetch user details from localStorage
    const userString = localStorage.getItem('user'); // Assuming 'user' contains the stringified user object
    const user = userString ? JSON.parse(userString) : null; // Parse the string if it exists

    const userId = user ? user.Id : null;
    const email = user ? user.Email || '' : '';
    const firstName = user ? user.FirstName || '' : '';
    const lastName = user ? user.LastName || '' : '';
    const phoneNumber = user ? user.PhoneNumber || '' : '';

    setUserDetails({
      userId: userId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    });
  }, []); // Run only once on component mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

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

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleBuyClick = async () => {
    setIsProcessing(true);

    const { userId, email, firstName, lastName, phoneNumber } = userDetails;

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
      PromoCode: promoCode,
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
        throw new Error(`${errorText}`);
      }

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
      setErrorMessage('' + error);
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
      <div className="fixed inset-0 flex justify-center items-center overflow-y-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden">
          <img
            src={event.ImageUrl}
            alt={event.Name}
            className="mt-6 rounded-t-lg w-full max-h-96 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{event.Name}</h2>
            <p className="mb-2 text-sm">{event.Description}</p>
            <p className="mb-1 text-sm">
              <strong>Location: </strong>
              {event.Address}
            </p>
            <p className="mb-1 text-sm">
              <strong>Date: </strong>
              {new Date(event.StartDateTimeUtc).toLocaleDateString()}{' '}
            </p>
            {/* User details form */}
            {!userDetails.userId && ( // Show the form if userId is not present
              <form>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="border border-gray-300 rounded-md px-1 py-1 w-full text-sm mb-2"
                />
                <input
                  type="text"
                  name="firstName"
                  value={userDetails.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="border border-gray-300 rounded-md px-1 py-1 w-full text-sm mb-2"
                />
                <input
                  type="text"
                  name="lastName"
                  value={userDetails.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-md px-1 py-1 w-full text-sm mb-2"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userDetails.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-md px-1 py-1 w-full text-sm mb-2"
                />
              </form>
            )}
            <p className="mt-5 mb-1 text-sm">
              <strong>Promo Code</strong>
            </p>
            <input
              type="text"
              name="promoCode"
              value={promoCode}
              onChange={handlePromoCodeChange}
              placeholder="Promo Code"
              className="border border-gray-300 rounded-md px-1 py-1 text-sm mb-2"
            />
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
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
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
