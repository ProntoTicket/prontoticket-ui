import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
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

  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add validation if needed

    // Here, you would update the chart data with the new event data
    // For simplicity, let's just log the new event data
    console.log('New Event:', formData);

    // Reset form data
    setFormData({
      eventName: '',
      eventDate: '',
    });
  };

  return (
    <div
      className="col-span-8 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"
      style={{ backgroundColor: '#f0f2f5', padding: '10px' }}
    >
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Add Event
          </h4>
        </div>
        <div>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Event Name"
              className="border border-gray-300 p-2 mr-2"
            />
            <input
              type="text"
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleInputChange}
              placeholder="Event Name"
              className="border border-gray-300 p-2 mr-2"
            />
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              placeholder="Event Date"
              className="border border-gray-300 p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5"></div>
      </div>
    </div>
  );
};

export default ChartTwo;
