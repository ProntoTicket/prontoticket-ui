import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ChartTwo from './ChartTwo';

// Modal component
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-8 z-50 max-w-3xl max-h-full overflow-y-auto relative">
        <button
          className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const ChartThree: React.FC = () => {
  const [state, setState] = useState({
    series: [
      {
        name: 'Sales',
        data: [44, 55, 41, 67, 22, 43, 65],
      },
      {
        name: 'Revenue',
        data: [13, 23, 20, 8, 13, 27, 15],
      },
    ],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showChartTwo = () => {
    setIsModalOpen(true);
  };

  const removeEvent = () => {
    // Implement logic to remove event
  };

  const editEvent = () => {
    // Implement logic to edit event
  };

  return (
    <div
      className="col-span-8 flex flex-col items-center justify-center rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"
      style={{ backgroundColor: '#f0f2f5', padding: '10px' }}
    >
      <h1 className="text-xl font-bold mb-4">Manage Events</h1>
      <div className="mb-4 flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={showChartTwo}
        >
          Add Event
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={editEvent}
        >
          Edit Event
        </button>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div id="ChartTwo">
            <ChartTwo />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChartThree;
