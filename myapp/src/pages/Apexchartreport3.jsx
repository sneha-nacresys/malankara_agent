import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Apexchartreport3 = () => {
  const chartData = {
    series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
       
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }
      },
      title: {
        text: 'Region Wise Performance by Month',
        align: 'left'
      },
    }
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={250} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default Apexchartreport3;


// import React from 'react';
// import ReactApexChart from 'react-apexcharts';

// const ApexChart = () => {
//   const colors = ['#008FFB', '#00E396', '#FEB019'];

//   const options = {
//     chart: {
//       height: 350,
//       type: 'bar',
//       events: {
//         click: function(chart, w, e) {
//           // Handle click event if needed
//           // console.log(chart, w, e)
//         }
//       }
//     },
//     colors: colors,
//     plotOptions: {
//       bar: {
//         columnWidth: '45%',
//         distributed: true,
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     legend: {
//       show: false
//     },
//     xaxis: {
//       categories: [
//         ['Agent'],
//         ['Region'],
//         ['Branch'],
        
//       ],
//       labels: {
//         style: {
//           colors: colors,
//           fontSize: '12px'
//         }
//       }
//     }
//   };

//   const series = [{
//     data: [21, 22, 10]
//   }];

//   return (
//     <div>
//       <div id="chart">
//         <ReactApexChart options={options} series={series} type="bar" height={350} />
//       </div>
//       <div id="html-dist"></div>
//     </div>
//   );
// };

// export default ApexChart;














