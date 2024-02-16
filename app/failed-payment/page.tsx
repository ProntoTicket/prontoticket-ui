'use client';
import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid'; // New structure example, adjust as necessary

const FailedPage = () => {
  return (
    <>
      <div
        className="mx-auto mt-24"
        style={{ minWidth: '800px', maxWidth: '800px', maxHeight: '800px' }}
      >
        <div
          className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
          style={{ minHeight: 'auto' }}
        >
          <div className="relative px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mb-10 mt-16">
              Pronto
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Ticket
              </span>
            </h2>
            <h2 className="text-1xl md:text-2xl font-extrabold leading-tighter tracking-tighter mb-10 mt-16">
              Your Order Has Failed
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default FailedPage;
