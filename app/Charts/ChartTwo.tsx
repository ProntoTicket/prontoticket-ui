import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    width: '100%', // Adjust width here
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

interface Producer {
  Id: string;
  Name: string;
}

interface EventFormData {
  name: string;
  description: string;
  shortDescription: string;
  imageurl: string;
  location: string;
  capacity: number;
  startDateTimeUtc: string;
  endDateTimeUtc: string;
  producerId: string;
  tags: string[];
  ticketTypes: {
    type: string;
    price: number;
    totalTickets: number;
  }[];
}

const ChartTwo: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    shortDescription: '',
    imageurl: '',
    location: '',
    capacity: 0,
    startDateTimeUtc: '',
    endDateTimeUtc: '',
    producerId: '',
    tags: [],
    ticketTypes: [{ type: '', price: 0, totalTickets: 0 }],
  });

  const [producers, setProducers] = useState<Producer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/producers`);
      const data = await response.json(); // Parse response body as JSON
      console.log('PRODS', data); // Log the parsed JSON data
      if (!response.ok) {
        throw new Error('Failed to fetch producers');
      }
      setProducers(data);
    } catch (error) {
      console.error('Error fetching producers:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;

    // Check if the input field should be a number and convert it
    if (name === 'capacity' && value !== '') {
      finalValue = parseInt(value, 10); // parseInt for whole numbers
      if (isNaN(finalValue)) {
        finalValue = 0;
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: finalValue,
    }));
  };

  const handleProducerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      producerId: e.target.value,
    });
  };

  const handleTicketTypeChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTicketTypes = formData.ticketTypes.map((ticket, idx) =>
      idx === index ? { ...ticket, [field]: value } : ticket
    );
    setFormData({
      ...formData,
      ticketTypes: updatedTicketTypes,
    });
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { type: '', price: 0, totalTickets: 0 },
      ],
    });
  };

  const removeTicketType = (index: number) => {
    const updatedTicketTypes = [...formData.ticketTypes];
    updatedTicketTypes.splice(index, 1);
    setFormData({
      ...formData,
      ticketTypes: updatedTicketTypes,
    });
  };

  const BASE_URL = 'http://localhost:5110';
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // No need to split tags since it's already an array
    const payload = {
      ...formData,
      capacity: Number(formData.capacity), // Ensure capacity is a number
      ticketTypes: formData.ticketTypes.map((ticketType) => ({
        ...ticketType,
        price: Number(ticketType.price),
        totalTickets: Number(ticketType.totalTickets),
      })),
    };

    try {
      const selectedProducer = producers.find(
        (producer) => producer.Id === formData.producerId
      );

      if (!selectedProducer) {
        throw new Error('Selected producer not found');
      }

      const response = await fetch(`${BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create event: ${errorText}`);
      }

      console.log('Event created successfully');
      setSuccessMessage('Event created successfully'); // Set the success message state
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        imageurl: '',
        location: '',
        capacity: 0,
        startDateTimeUtc: '',
        endDateTimeUtc: '',
        producerId: '',
        tags: [],
        ticketTypes: [{ type: '', price: 0, totalTickets: 0 }],
      }); // Clear the form data
    } catch (error: any) {
      // Explicitly type 'error' as 'any'
      console.error('Error creating event:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message); // Set the error message state
      } else {
        setErrorMessage('An unknown error occurred.'); // Fallback error message
      }
    }
  };

  return (
    <div
      className="col-span-8 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"
      style={{ backgroundColor: '#f0f2f5', padding: '10px' }}
    >
      <div>
        <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
          Add Event
        </h4>
      </div>
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <form onSubmit={handleFormSubmit} className="space-y-3 space-x-0">
            {/* Event Name Input */}
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 w-full"
            />
            {/* Event Description Input */}
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 w-full h-32"
            />
            {/* Short Description Input */}
            <input
              type="text"
              name="shortDescription"
              placeholder="Short Description"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="border border-gray-300 w-full"
            />
            {/* Image URL Input */}
            <input
              type="text"
              name="imageurl"
              placeholder="Image URL"
              value={formData.imageurl}
              onChange={handleInputChange}
              className="border border-gray-300 w-full"
            />
            {/* Event Location Input */}
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={formData.location}
              onChange={handleInputChange}
              className="border border-gray-300 w-full"
            />
            {/* Event Capacity Input */}
            <input
              type="number"
              name="capacity"
              placeholder="Event Capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="border border-gray-300 w-full"
            />
            {/* Start Date and Time Input */}
            <div className="flex space-x-4">
              <div className="flex flex-col w-1/2">
                <label
                  htmlFor="startDateTimeUtc"
                  className="text-sm text-gray-600"
                >
                  Start Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="startDateTimeUtc"
                  id="startDateTimeUtc"
                  placeholder="Start Date and Time"
                  value={formData.startDateTimeUtc}
                  onChange={handleInputChange}
                  className="border border-gray-300 w-full"
                />
              </div>
              {/* End Date and Time Input */}
              <div className="flex flex-col w-1/2">
                <label
                  htmlFor="endDateTimeUtc"
                  className="text-sm text-gray-600"
                >
                  End Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="endDateTimeUtc"
                  id="endDateTimeUtc"
                  placeholder="End Date and Time"
                  value={formData.endDateTimeUtc}
                  onChange={handleInputChange}
                  className="border border-gray-300 w-full"
                />
              </div>
            </div>
            {/* Select Producer */}
            <select
              name="producerId"
              value={formData.producerId}
              onChange={handleProducerChange}
              className="border border-gray-300 w-full"
            >
              <option value="">Select Producer</option>
              {producers.map((producer) => (
                <option key={producer.Id} value={producer.Id}>
                  {producer.Name}
                </option>
              ))}
            </select>
            {/* Event Tags Input */}
            <input
              type="text"
              name="tags"
              placeholder="Event Tags (comma separated)"
              value={formData.tags.join(',')}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value.split(',') })
              }
              className="border border-gray-300 w-full"
            />
            {/* Ticket Types */}
            {formData.ticketTypes.map((ticket, index) => (
              <div key={index} className="flex flex-col mb-2">
                {/* Ticket Type Input */}
                <input
                  type="text"
                  name={`ticketTypes[${index}].type`}
                  placeholder="Ticket Type"
                  value={ticket.type}
                  onChange={(e) =>
                    handleTicketTypeChange(index, 'type', e.target.value)
                  }
                  className="border border-gray-300 w-full"
                />
                {/* Ticket Price Input */}

                <input
                  type="number"
                  name={`ticketTypes[${index}].price`}
                  placeholder="Ticket Price"
                  value={ticket.price}
                  onChange={(e) =>
                    handleTicketTypeChange(
                      index,
                      'price',
                      Number(e.target.value)
                    )
                  }
                  className="border border-gray-300 w-full"
                />
                {/* Total Tickets Input */}
                <input
                  type="number"
                  name={`ticketTypes[${index}].totalTickets`}
                  placeholder="Total Tickets"
                  value={ticket.totalTickets}
                  onChange={(e) =>
                    handleTicketTypeChange(
                      index,
                      'totalTickets',
                      Number(e.target.value)
                    )
                  }
                  className="border border-gray-300 w-full"
                />
                {/* Remove and Add Ticket Buttons */}
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className=" text-black px-2 py-2 rounded w-auto"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={addTicketType}
                    className=" text-black px-4 py-2 rounded w-auto"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            {/* Add Event Button */}
            {/* Error message display */}
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <div className="text-green-600">{successMessage}</div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Event
            </button>
          </form>
        </div>
        {/* Right Column Content */}
        <div>
          <div id="chartTwo" className="-mb-9 -ml-5"></div>
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
