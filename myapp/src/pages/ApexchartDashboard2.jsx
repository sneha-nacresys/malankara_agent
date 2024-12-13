import React, { useState ,useEffect} from 'react';
 import Chart from 'react-apexcharts';


import { Container, Row, Col, Form } from 'react-bootstrap';

//import baseUrl from "../ConstUrl/url";

const RDChartComponent = () => {

  // const data = {
  //   RD: {
  //     series: [80, 20],  // Total Business, Preclosure
  //     labels: ['Total Business', 'Preclosure']
  //   },
  //   FD: {
  //     series: [70,30],  // Total Business, Preclosure
  //     labels: ['Total Business', 'Preclosure']
  //   }
  // };

  // const getOptions = (labels) => ({
  //   chart: {
  //     width: 380,
  //     type: 'pie',
  //   },
  //   labels: labels,
  //   responsive: [{
  //     breakpoint: 480,
  //     options: {
  //       chart: {
  //         width: 200
  //       },
  //       legend: {
  //         position: 'bottom'
  //       }
  //     }
  //   }]
  // });


  // const dataToDisplay = selectedOption === 'RD' ? data.RD : data.FD;
// ====================================api==============================

const baseUrl = process.env.REACT_APP_API_URL;
  const [selectedOption, setSelectedOption] = useState('RD');
  const [chartData, setChartData] = useState({
    RD: { series: [], labels: ['Total RD', 'Preclosure'] },
    FD: { series: [], labels: ['Total FD', 'Preclosure'] }
  });
  // const [rdChartData, setRdChartData] = useState({ series: [], labels: [] });
  // const [fdChartData, setFdChartData] = useState({ series: [], labels: [] });

  // Function to get current financial year
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

  // Fetch data from API
  const fetchData = async () => {
    const financialYear = getCurrentFinancialYear();
    const data = { year: financialYear };


    try {
      const response = await fetch(`${baseUrl}/adminmanage/total_business_rdfd_chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();


      if (result.error) {
        console.error(result.error);
      } else {
        // const rdData = result.rd[0] || {};
        // const fdData = result.fd[0] || {};

        // setRdChartData({
        //   series: [
        //     rdData.percentage_rd || 0,
        //     rdData.percentage_preclosure_rd || 0
        //   ],
        //   labels: ['Total RD', 'Preclosure']
        // });

        // setFdChartData({
        //   series: [
        //     fdData.percentage_fd || 0,
        //     fdData.percentage_preclosure_fd || 0
        //   ],
        //   labels: ['Total FD', 'Preclosure']
        // });

        const rdSeries = [parseFloat(result.rd[0]?.percentage_rd) || 0, parseFloat(result.rd[0]?.percentage_preclosure_rd) || 0];
        const rdLabels = ['Total RD', 'Preclosure'];
        const fdSeries = [parseFloat(result.fd[0]?.percentage_fd) || 0, parseFloat(result.fd[0]?.percentage_preclosure_fd) || 0];
        const fdLabels = ['Total FD', 'Preclosure'];

        setChartData({
          RD: { series: rdSeries, labels: rdLabels },
          // FD: { series: [100,0], labels: ['Total FD','preclosure'] },
          FD: { series: fdSeries, labels: fdLabels }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const dataToDisplay = selectedOption === 'RD' ? chartData.RD : chartData.FD;

  // const dataToDisplay = selectedOption === 'RD' ? rdChartData : fdChartData;

  const getOptions = (labels) => ({
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: labels,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });


  return (
    <Container>
       <Form>
        <Form.Check
          type="radio"
          label="RD"
          value="RD"
          checked={selectedOption === 'RD'}
          onChange={handleOptionChange}
          inline
        />
        <Form.Check
          type="radio"
          label="FD"
          value="FD"
          checked={selectedOption === 'FD'}
          onChange={handleOptionChange}
          inline
        />
      </Form>
      <Row>
        
          <Col md={4}>
            <Chart 
              options={getOptions(dataToDisplay.labels)} 
              series={dataToDisplay.series} 
              type="pie" 
              width={350} 
            />
          </Col>
       
      </Row>
    </Container>
  );
};

export default RDChartComponent;

