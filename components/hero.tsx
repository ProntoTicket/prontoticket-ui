'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const BASE_URL = 'http://localhost:5110';

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
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`text-blue-500 cursor-pointer ${
              currentPage === 1 ? 'cursor-not-allowed text-gray-500' : ''
            }`}
            aria-label="Previous page"
          >
            &lt;
          </button>
        </li>
        <li>{`Page ${currentPage}/${totalPages}`}</li>
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
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

const EventCard = ({ event }: { event: Event }) => (
  <div className="flex flex-col rounded-lg shadow-lg overflow-hidden relative cursor-pointer">
    <div className="absolute top-0 right-0 m-2 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600">
      $25
    </div>
    <div className="flex-shrink-0">
      <img
        className="h-48 w-full object-cover"
        src={event.ImageUrl}
        alt={event.Name}
      />
    </div>
    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
      <div className="flex-1">
        <p className="text-xl font-semibold text-gray-900">{event.Name}</p>
        <p className="mt-3 text-base text-gray-500">{event.ShortDescription}</p>
        <p className="text-sm text-gray-600 mt-2">
          {new Date(event.StartDateTimeUtc).toLocaleDateString()} -{' '}
          {event.Location}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log(`Buying ticket for event: ${event.Name}`);
        }}
        className="bg-blue-500 text-white text-sm font-semibold py-2 px-16 rounded hover:bg-blue-600 self-center mt-4"
      >
        Buy
      </button>
    </div>
  </div>
);

const Hero = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  // Filter out past events
  const currentDate = new Date();
  const filteredEvents = events.filter(
    (event) => new Date(event.EndDateTimeUtc) > currentDate
  );

  // Search functionality
  const filteredEventsSearch = filteredEvents.filter((event) => {
    return (
      event.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ShortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="relative mt-8 mb-8">
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
            <input
              type="text"
              placeholder="Search by event name, location, or producer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEventsSearch
                .slice(indexOfFirstEvent, indexOfLastEvent)
                .map((event) => (
                  <Link href={`/event/${event.Id}`} key={event.Id}>
                    <EventCard event={event} />
                  </Link>
                ))}
            </div>
            <Pagination
              eventsPerPage={eventsPerPage}
              totalEvents={filteredEventsSearch.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
      {/* {showModal && selectedEvent && <EventModal event={selectedEvent} />} */}
    </section>
  );
};

export default Hero;
