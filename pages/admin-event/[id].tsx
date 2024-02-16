import { useRouter } from 'next/router';
import Layout from '../layout';
import React, { useEffect, useState, Suspense } from 'react';
import CardDataStats from '../CardDataStats';

const EventPage: React.FC = () => {
  const router = useRouter();
  const [eventId, setEventId] = useState<string>('');
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [ticketsSold, setTicketsSold] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [formattedStartDate, setFormattedStartDate] = useState<string>('');
  const [producerName, setProducerName] = useState<string>('');

  const BASE_URL = 'http://localhost:5110';

  useEffect(() => {
    if (router.isReady) {
      setEventId(router.query.id as string);
      if (router.query.id) {
        fetchEventDetails(router.query.id as string);
      }
    }
  }, [router.isReady, router.query.id]);

  const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const eventData = await response.json();
      setEventDetails(eventData);

      // Format start date
      const startDate = new Date(eventData.StartDateTimeUtc);
      const formattedDate = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      });
      setFormattedStartDate(formattedDate);

      // Fetch total revenue for the event
      const revenueResponse = await fetch(
        `${BASE_URL}/api/transactions/totalRevenue/${eventId}`
      );
      if (!revenueResponse.ok) {
        throw new Error('Failed to fetch total revenue');
      }
      const totalRevenueData = await revenueResponse.json();
      setTotalRevenue(totalRevenueData);

      // Fetch tickets sold for the event
      const ticketsSoldResponse = await fetch(
        `${BASE_URL}/api/transactions/ticketsSold/${eventId}`
      );
      if (!ticketsSoldResponse.ok) {
        throw new Error('Failed to fetch tickets sold');
      }
      const ticketsSoldData = await ticketsSoldResponse.json();
      setTicketsSold(ticketsSoldData);

      // Fetch producer details
      const producerResponse = await fetch(
        `${BASE_URL}/api/producers/${eventData.ProducerId}`
      );
      if (!producerResponse.ok) {
        throw new Error('Failed to fetch producer details');
      }
      const producerData = await producerResponse.json();
      setProducerName(producerData.Name);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const LazyChartOne = React.lazy(
    () => import('../Charts/ChartOneEventSpecific')
  );

  return (
    <>
      <Layout>
        <div className="flex justify-center items-center">
          <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mt-16 text-center">
            Pronto
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Ticket
            </span>
          </h2>
        </div>
        {eventId && eventDetails ? (
          <>
            <div className="flex justify-center items-center">
              <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mt-16 text-center">
                {eventDetails.Name} - {producerName}
              </h2>
            </div>
            <div
              className="mx-auto mt-6"
              style={{
                minWidth: '1000px',
                maxWidth: '1000px',
                padding: '20px',
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats
                  title="Event Capacity"
                  total={eventDetails.Capacity}
                  levelUp
                >
                  <svg
                    className="fill-primary dark:fill-white"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </CardDataStats>
                <CardDataStats
                  title="Total Revenue"
                  total={`$${totalRevenue}`}
                  levelUp
                >
                  <svg
                    className="fill-primary dark:fill-white"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </CardDataStats>
                <CardDataStats
                  title="Tickets Sold"
                  total={ticketsSold.toString()}
                  levelUp
                >
                  <svg
                    className="fill-primary dark:fill-white"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </CardDataStats>
                <CardDataStats
                  title="Event Date"
                  total={formattedStartDate}
                  levelUp
                >
                  <svg
                    className="fill-primary dark:fill-white"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  ></svg>
                </CardDataStats>
                {/* Add more CardDataStats components as needed */}
              </div>
            </div>
            {/* Lazy load ChartOne */}
            <div
              className="mt-4 ml-60 mb-16 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"
              style={{ minWidth: '1450px' }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <LazyChartOne eventId={eventId} />
              </Suspense>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </Layout>
    </>
  );
};

export default EventPage;
