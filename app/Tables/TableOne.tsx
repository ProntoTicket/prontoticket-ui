import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5110';
const ITEMS_PER_PAGE = 10;

interface Event {
  Id: string;
  CreatedAt: string;
  Name: string;
  Description: string;
  Capacity: number;
  Date: string;
  Location: string;
  ProducerId: string;
  ImageUrl: string;
  ShortDescription: string;
  ProducerName?: string;
}

interface Producer {
  Id: string;
  Name: string;
}

const TableOne = () => {
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [eventsWithProducerName, setEventsWithProducerName] = useState<Event[]>(
    []
  );
  const [routerReady, setRouterReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events`);
        const events: Event[] = await response.json();

        const eventsWithProducerName = await Promise.all(
          events.map(async (event) => {
            const producerResponse = await fetch(
              `${BASE_URL}/api/producers/${event.ProducerId}`
            );
            const producer: Producer = await producerResponse.json();
            return { ...event, ProducerName: producer.Name };
          })
        );

        setEventsWithProducerName(eventsWithProducerName);
        const totalPages = Math.ceil(
          eventsWithProducerName.length / ITEMS_PER_PAGE
        );
        setTotalPages(totalPages);

        // Filter events based on search term and set initial events data for the first page
        filterAndSetEventsData(eventsWithProducerName, searchTerm, 1);
      } catch (error) {
        console.error('Failed to fetch events or producers:', error);
      }
    };

    fetchEvents();
    setRouterReady(true); // Set router readiness once the component mounts
  }, []);

  useEffect(() => {
    // When the search term changes, filter events and set data for the first page
    filterAndSetEventsData(eventsWithProducerName, searchTerm, 1);
  }, [searchTerm]);

  const filterAndSetEventsData = (
    events: Event[],
    term: string,
    page: number
  ) => {
    const filteredEvents = events.filter(
      (event) =>
        event.Name.toLowerCase().includes(term.toLowerCase()) ||
        event.Location.toLowerCase().includes(term.toLowerCase()) ||
        (event.ProducerName &&
          event.ProducerName.toLowerCase().includes(term.toLowerCase()))
    );

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const slicedEvents = filteredEvents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    setTotalPages(Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
    setEventsData(slicedEvents);
    setCurrentPage(page);
  };

  const handleEventClick = (eventId: string) => {
    if (routerReady) {
      // Only navigate when router is ready
      window.location.href = `/admin-event/${eventId}`;
    }
  };

  const handleDeleteEvent = async (eventId: string, eventName: string) => {
    const confirmation = prompt(
      `Are you sure you want to delete the event '${eventName}'? Type the event name to confirm.`
    );

    if (confirmation === eventName) {
      try {
        await fetch(`${BASE_URL}/api/events/${eventId}`, {
          method: 'DELETE',
        });
        // Update eventsData by filtering the deleted event
        setEventsData(eventsData.filter((event) => event.Id !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      filterAndSetEventsData(
        eventsWithProducerName,
        searchTerm,
        currentPage - 1
      );
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      filterAndSetEventsData(
        eventsWithProducerName,
        searchTerm,
        currentPage + 1
      );
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div
      className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 xl:px-100"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Events
      </h4>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name, location, or producer"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Producer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Capacity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventsData.map((event) => (
                  <tr key={event.Id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center text-sm font-medium text-gray-900">
                        {event.Name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {event.ProducerName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {event.Capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(event.Date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {event.Location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteEvent(event.Id, event.Name)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.293 4.293a1 1 0 011.414 0L10 10.586l6.293-6.293a1 1 0 111.414 1.414L11.414 12l6.293 6.293a1 1 0 01-1.414 1.414L10 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 12 2.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="text-blue-600 hover:text-blue-900"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span>{`Page ${currentPage}/${totalPages}`}</span>
        <button
          className="text-blue-600 hover:text-blue-900"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TableOne;
