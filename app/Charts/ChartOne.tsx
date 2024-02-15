import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 8000,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}
const BASE_URL = 'http://localhost:5110';

// Adjust the fetchData function to accept a period parameter
const fetchData = async (period: 'lastMonth' | 'lastYear') => {
  try {
    // Determine the endpoint based on the period parameter
    const endpoint =
      period === 'lastMonth'
        ? `${BASE_URL}/api/transactions/saleslastmonth`
        : `${BASE_URL}/api/transactions/saleslast12months`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return empty array in case of error
  }
};

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [],
  });

  const [chartOptions, setChartOptions] = useState<ApexOptions>(options);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Function to load data based on the selected period
  const loadData = async (period: 'lastMonth' | 'lastYear') => {
    const endpoint =
      period === 'lastMonth'
        ? `${BASE_URL}/api/transactions/saleslastmonth`
        : `${BASE_URL}/api/transactions/saleslast12months`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const salesData = data.map((item: any) => item.TotalAmount);
      const revenueData = salesData.map((amount: number) => amount * 0.05); // Calculate revenue as 5% of sales
      const dates = data.map((item: any) => item.Date);

      // Calculate total sales and revenue
      const totalSalesAmount = salesData.reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );
      const totalRevenueAmount = revenueData.reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );

      setTotalSales(totalSalesAmount);
      setTotalRevenue(totalRevenueAmount);

      setState({
        series: [
          {
            name: 'Total Sales',
            data: salesData,
          },
          {
            name: 'Total Revenue',
            data: revenueData,
          },
        ],
      });

      setChartOptions((prevOptions) => {
        const newOptions = JSON.parse(JSON.stringify(prevOptions)); // Deep copy to change the reference
        newOptions.xaxis.categories = dates; // Set new dates
        return newOptions;
      });

      console.log(state);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Initial load for last year's data
  useEffect(() => {
    // Removed any dependencies from the array to ensure this only runs once
    loadData('lastYear');
  }, []);

  const [selectedPeriod, setSelectedPeriod] = useState<
    'lastMonth' | 'lastYear'
  >('lastYear');

  const handleLoadLastMonthData = () => {
    setSelectedPeriod('lastMonth');
    loadData('lastMonth');
  };

  const handleLoadLastYearData = () => {
    setSelectedPeriod('lastYear');
    loadData('lastYear');
  };

  return (
    <div
      className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8"
      style={{ backgroundColor: '#f0f2f5', padding: '20px' }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="w-full">
            <p className="font-semibold text-primary">Total Revenue</p>
            {/* Display total revenue */}
            <p className="text-sm font-medium">{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="w-full">
            <p className="font-semibold text-secondary">Total Sales</p>
            {/* Display total sales */}
            <p className="text-sm font-medium">{totalSales.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              onClick={handleLoadLastYearData}
              className={`rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${
                selectedPeriod === 'lastYear' ? 'selected-button-class' : ''
              }`}
            >
              Year
            </button>
            <button
              onClick={handleLoadLastMonthData}
              className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${
                selectedPeriod === 'lastMonth' ? 'selected-button-class' : ''
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={chartOptions} // Use state variable here instead of the static 'options'
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
