import React, { useState, useEffect } from "react";
import ReactApexChart from 'react-apexcharts';

import Cookies from 'js-cookie'
import Select from 'react-select';


import {

  Row,
  Col,

} from "react-bootstrap";
// import baseUrl from "../ConstUrl/url";



const Apexchartreport5 = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [selectedYear, setSelectedYear] = useState(null);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: { show: true },
        zoom: { enabled: true }
      },
      responsive: [{ breakpoint: 480, options: { legend: { position: 'bottom', offsetX: -10, offsetY: 0 } } }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 5,
          
          
          dataLabels: { total: { enabled: true, style: { fontSize: '12px', fontWeight: 600} } }
        }
      },
      title: { align: 'left' },
      xaxis: {
        type: 'category',
        categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], // Fixed list of months
        labels: {
          style: { fontSize: '10px', fontWeight: 'bold', transform: 'rotate(-45deg)' }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          
        },
        offsetY: 0,         // Adjust Y offset for positioning
        rotate: -90,        // Rotate the labels by -90 degrees
        formatter: function (val) {
          return val.toFixed(0);  // Ensure values are integers
        }
      },
     
      // legend: { position: 'right', offsetY: 40 },
      legend: { position: 'top' },
      fill: { opacity: 1 }
    }
  });

  const baseYear = 2024;
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(baseYear, currentYear - 4);

  const yearOptions = [];
  for (let year = startYear; year <= currentYear; year++) {
    const financialYear = `${year}-${year + 1}`;
    yearOptions.push({ value: financialYear, label: financialYear });
  }

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
  };

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
        }
          
        try {
          const response = await fetch(`${baseUrl}/adminmanage/statewise_employee_count`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await response.json();

          // Initialize data arrays for each state
          const states = Array.from(new Set(result.statewise_employee_count.map(item => item.state_name)));
          const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

          // initializes an object where each state has an array of zeros, one for each month. This ensures every state has a slot for each month.
          const stateData = states.reduce((acc, state) => {
            acc[state] = new Array(months.length).fill(0); // Initialize data with zeros
            return acc;
          }, {});
          //============================================= 

          // // creates an object mapping month names to their indices (e.g., {'Apr': 0, 'May': 1, ...}) to easily find the index for each month in the stateData array.
          // const monthIndices = months.reduce((acc, month, index) => {
          //   acc[month] = index;
          //   return acc;
          // }, {});


          //============================================= 
          // Fill the data arrays based on API response
          // Adjust the month index based on calendar year to financial year mapping
          result.statewise_employee_count.forEach(item => {
            let monthIndex;

            if (item.processed_month2 >= 4) {
              // For April (4) to December (12), subtract 4 to map to index 0-8
              monthIndex = item.processed_month2 - 4;
            } else {
              // For January (1) to March (3), map them to index 9-11
              monthIndex = item.processed_month2 + 8;
            }

            // Ensure the monthIndex is valid
            if (monthIndex >= 0 && monthIndex < months.length) {
              stateData[item.state_name][monthIndex] =item.employee_count ;
            }
          });


          const seriesData = states.map(state => ({
            name: state,
            data: stateData[state]
          }));

          setChartData(prevState => ({
            ...prevState,
            series: seriesData
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    
  }, [selectedYear]);

  
  return (
    <div>

      {/* <Row>
        <Col lg={6} style={{ fontSize: '12px' }}>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            options={yearOptions}
            isSearchable
            isClearable
            placeholder="Select A Year"
          />
        </Col>
      </Row> */}
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={250} />
      </div>

    </div>
  );
}


export default Apexchartreport5;
