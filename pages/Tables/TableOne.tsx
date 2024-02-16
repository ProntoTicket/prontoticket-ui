import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const BASE_URL = 'http://localhost:5110';

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
  const [routerReady, setRouterReady] = useState(false);

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

        setEventsData(eventsWithProducerName);
      } catch (error) {
        console.error('Failed to fetch events or producers:', error);
      }
    };

    fetchEvents();
    setRouterReady(true); // Set router readiness once the component mounts
  }, []);

  const handleEventClick = (eventId: string) => {
    if (routerReady) {
      // Only navigate when router is ready
      window.location.href = `/admin-event/${eventId}`;
    }
  };

  return (
    <div
      className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 xl:px-100"
      style={{ backgroundColor: '#f0f2f5' }}
    >
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Events
      </h4>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventsData.map((event) => (
                  <tr
                    key={event.Id}
                    onClick={() => handleEventClick(event.Id)}
                    style={{ cursor: 'pointer' }}
                  >
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOne;
