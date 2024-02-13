'use client';

import React, { useEffect, useState } from 'react';
import ChatCard from '../Chat/ChatCard';
import TableOne from '../Tables/TableOne';
import CardDataStats from '../CardDataStats';
import ChartOne from '../Charts/ChartOne';
import ChartThree from '../Charts/ChartThree';
import ChartTwo from '../Charts/ChartTwo';
import TableFour from '../Tables/TableFour';
import MultiSelect from '../FormElements/MultiSelect';

const ECommerce: React.FC = () => {
  const BASE_URL = 'http://localhost:5110';

  const [totalEvents, setTotalEvents] = useState(0);

  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const fetchTotalProfit = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/transactions/totalamount`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const total = await response.json();
        console.log('Total Profit: ' + total);
        setTotalProfit(total);
      } catch (error) {
        console.error('Failed to fetch total profit:', error);
      }
    };

    fetchTotalProfit();
  }, []);

  // Effect hook to fetch data from the API
  useEffect(() => {
    // Function to fetch events
    const fetchEvents = async () => {
      try {
        // Replace 'axios' with 'fetch' if you are not using axios
        // You'll need to adjust the response handling accordingly
        const response = await fetch(`${BASE_URL}/api/events`);
        const data = await response.json();
        // Setting the total number of events
        console.log(data);
        setTotalEvents(data.length);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    // Call the fetch function
    fetchEvents();
  }, []);

  const [totalUsers, setTotalUsers] = useState(0);

  // Add another useEffect hook to fetch the total number of users
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/count`);
        const data = await response.json();
        console.log(data);
        setTotalUsers(data); // Assuming the endpoint returns the count directly
      } catch (error) {
        console.error('Failed to fetch users count:', error);
      }
    };

    fetchUsersCount();
  }, []);

  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    // Function to fetch the total transactions count
    const fetchTotalTransactions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/transactions/count`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const total = await response.json();
        console.log('TOTAL TOTAL ' + total);
        setTotalTransactions(total);
      } catch (error) {
        console.error('Failed to fetch total transactions count:', error);
      }
    };

    fetchTotalTransactions();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mt-16 text-center">
          Pronto
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Ticket
          </span>
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
          <CardDataStats title="Total Events" total={`${totalEvents}`} levelUp>
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                fill=""
              />
              <path
                d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                fill=""
              />
            </svg>
          </CardDataStats>

          <CardDataStats
            title="Total Profit"
            total={`$${totalProfit.toFixed(2)}`}
            levelUp
          >
            <svg
              className="fill-primary dark:fill-white"
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </CardDataStats>

          <CardDataStats
            title="Tickets Solds"
            total={`${totalTransactions}`}
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
          <CardDataStats title="Total Users" total={`${totalUsers}`} levelDown>
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </CardDataStats>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <ChartOne />
          <ChartTwo />
          {/* <ChartThree /> */}
        </div>
        <div className="mt-4 ">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
