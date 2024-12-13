import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const state = {
    series: [
      { name: 'Palakkad', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] },
      { name: 'Thrissur', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
      { name: 'Ernakulam', data: [35, 41, 36, 26, 45, 48, 52, 53, 41] },
      
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          }
        }
      }
    }
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
    