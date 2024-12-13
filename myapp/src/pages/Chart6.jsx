import React, { useState ,useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';
//import baseUrl from '../ConstUrl/url';


const ApexChart = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [selectedYear, setSelectedYear] = useState(null);

  const [series,setSeries] = useState([{
    name: "RD Collection Percentage",
    data: [] // Data for all 12 months
  }]);

  const [options] = useState({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' // or 'straight'
    },
    title: {
    //   text: 'Product Trends by Month',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // Takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    xaxis: {
      categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec','Jan', 'Feb', 'Mar'] // 12 months
    },
    yaxis: {
      min: 0, 
      tickAmount: 5, 
      labels: {
        formatter: function (value) {
            return `${value}%`; 
        }
      },
      max: 100
    }
  });

  useEffect(() => {
    const getCurrentFinancialYear = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // January is 0, so add 1
  
      if (month >= 4) {
        return `${year}-${year + 1}`; // Current year to next year
      } else {
        return `${year - 1}-${year}`; // Last year to current year
      }
    };
  
    const financialYear = getCurrentFinancialYear();
    
    const fetchData = async () => {
      const data = {
        year: financialYear
      };
  
  
      try {
        const response = await fetch(`${baseUrl}/adminmanage/monthwide_rd_collection_percentage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        const rdPercentage = result.data;
  
        // Initialize an array for employee counts, with 12 months
        const monthlyCounts = new Array(12).fill(0);
  
        rdPercentage.forEach(item => {
          let monthIndex;
  
          if (item.Month >= 4) {
            // For April (4) to December (12), subtract 4 to map to index 0-8
            monthIndex = item.Month - 4;
          } else {
            // For January (1) to March (3), map them to index 9-11
            monthIndex = item.Month + 8;
          }
  
          // Ensure the monthIndex is valid and set the count
          if (monthIndex >= 0 && monthIndex < monthlyCounts.length) {
            monthlyCounts[monthIndex] = item.percentage;
          }
        });
  
        // Update the series state with the fetched data
        setSeries([{
          name: "RD Collection Percentage",
          data: monthlyCounts
        }]);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
  }, [selectedYear]);
  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
