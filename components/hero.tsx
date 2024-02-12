'use client';

import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5110';

interface Event {
  Id?: string;
  Name: string;
  Description: string;
  Capacity: number;
  Date: Date;
  Location: string;
  ProducerId: string;
  ImageUrl: string;
  Price: number; // Assuming this is how you're storing price
  ShortDescription: string;
}

interface PaginationProps {
  eventsPerPage: number;
  totalEvents: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination = ({
  eventsPerPage,
  totalEvents,
  paginate,
  currentPage,
}: PaginationProps & { currentPage: number }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2 items-center mt-4">
        {' '}
        {/* Add margin on top */}
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`text-blue-500 cursor-pointer ${
              currentPage === 1 ? 'cursor-not-allowed text-gray-500' : ''
            }`}
            aria-label="Previous page"
          >
            &lt; {/* Using HTML entity for left arrow */}
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="list-none">
            <button
              onClick={() => paginate(number)}
              className={`text-blue-500 ${
                currentPage === number ? 'font-bold' : ''
              }`}
              style={{
                margin: '0 8px',
              }} /* Adding horizontal margins for page numbers */
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`text-blue-500 cursor-pointer ${
              currentPage === totalPages
                ? 'cursor-not-allowed text-gray-500'
                : ''
            }`}
            aria-label="Next page"
          >
            &gt; {/* Using HTML entity for right arrow */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

interface EventModalProps {
  event: Event; // Assuming 'Event' is your event interface
  onClose: () => void; // Defines a function that doesn't take parameters and doesn't return anything
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  if (!event) return null; // Don't render if there's no event

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg max-w-lg w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-3xl font-semibold leading-none text-black hover:text-gray-700"
        >
          &times;
        </button>

        {/* Event Image */}
        <img
          src={event.ImageUrl}
          alt={event.Name}
          className="mt-10 rounded-lg"
        />

        {/* Event Details */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">{event.Name}</h2>
          <p className="mb-4">{event.Description}</p>
          <p className="mb-1">Location: {event.Location}</p>
          {/* <p className="mb-1">Date: {event.Date.toUTCString()}</p> */}
          <p className="text-lg font-bold mb-4">Price: $25{event.Price}</p>
          <button
            onClick={() => {
              // handle buy action here
              console.log(`Buying ticket for event: ${event.Name}`);
            }}
            className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 w-full"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Hero() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events`);
        const data = await response.json();
        console.log('WE GOT THIS RESPONSE ' + data);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  //Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Pronto
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Ticket
              </span>
            </h1>
            <p
              className="text-xl text-gray-600 mb-8"
              data-aos="zoom-y-out"
              data-aos-delay="150"
            >
              Instant Access to Exclusive Events
            </p>
            {/* Events Section */}
            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentEvents.map((event) => (
                <div
                  key={event.Id}
                  onClick={() => handleEventClick(event)}
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden relative cursor-pointer"
                >
                  <div className="absolute top-0 right-0 m-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600">
                    $25{event.Price}
                  </div>{' '}
                  {/* Price tag */}
                  <div className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={event.ImageUrl}
                      alt={event.Name}
                    />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-gray-900">
                        {event.Name}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {event.ShortDescription}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event from triggering modal
                        console.log(`Buying ticket for event: ${event.Name}`);
                      }}
                      className="bg-blue-500 text-white text-sm font-semibold py-2 px-16 rounded hover:bg-blue-600 self-center mt-4"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              eventsPerPage={eventsPerPage}
              totalEvents={events.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
      {/* Conditionally render EventModal */}
      {showModal && selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </section>
  );
}
