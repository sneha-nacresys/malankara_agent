import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
//import baseUrl from "../ConstUrl/url";

const RDChartComponent = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [chartType, setChartType] = useState('total');

  const [selectedState, setSelectedState] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [stateOptions, setStateOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  const [totalData, setTotalData] = useState({ series: [], labels: [] });
 
  const [stateChartData, setStateChartData] = useState({ series: [], labels: [] });
  const [branchChartData, setBranchChartData] = useState({ series: [], labels: [] });


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



  useEffect(() => {
    // Fetch state options
    const fetchStates = async () => {
      try {
        const res = await fetch(`${baseUrl}/adminmanage/list_state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        const options = data.state_list.map(s => ({ value: s.id, label: s.state_name }));
        setStateOptions(options);    
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
  
    fetchStates();
  }, []);


  useEffect(() => {
    if (selectedState) {
      // Fetch region options
      const fetchRegions = async () => {
        try {
          const res = await fetch(`${baseUrl}/adminmanage/list_statewiseregion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state_id: selectedState }),
          });
          const data = await res.json();
          const options = data.state_wise_regions_list.map(r => ({
            value: r.id,
            label: r.region_name,
          }));
          setRegionOptions(options);
          setSelectedRegion(null);
          setSelectedBranch(null);
          setBranchOptions([])
        } catch (error) {
          console.error("Error fetching regions:", error);
        }
      };
  
     
  
      fetchRegions();
    
  } else {
    // When state is cleared, clear region and branch options
    setRegionOptions([]);
    setBranchOptions([]);
    setSelectedRegion(null);
    setSelectedBranch(null);
  }
  }, [selectedState]);
  
  useEffect(() => {
    if (selectedState && selectedRegion) {
      // Fetch branch options
      const fetchBranches = async () => {
        try {
          const res = await fetch(`${baseUrl}/adminmanage/User_state_regionbranch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state_id: selectedState, region_id: selectedRegion }),
          });
          const data = await res.json();
          const options = data.branches.map(b => ({
            value: b.branch_id,
            label: b.branch_name,
          }));
          setBranchOptions(options);
          setSelectedBranch(null);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
     
      fetchBranches();
    } else {
      setBranchOptions([]);
      setSelectedBranch(null);
    }
  }, [selectedState, selectedRegion]);

  const fetchTotalData = async () => {

    const financialYear = getCurrentFinancialYear();
    const data = { year: financialYear };
    try {

      const response = await fetch(`${baseUrl}/adminmanage/total_rd_collection_chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const res = await response.json();
      if (response.ok) {
        const fetchedTotalData = {
          series: [res.data[0].Total_Collection, res.data[0].Total_Backlog_Count],
          labels: ['Collected', 'Dues'],
        };
        setTotalData(fetchedTotalData);
      } else {
        console.error('Failed to fetch total data:', res.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const fetchStateChartData = async (stateId) => {
    const financialYear = getCurrentFinancialYear();
    const data = { year: financialYear, state: stateId };
    try {
      const response = await fetch(`${baseUrl}/adminmanage/statewise_rd_collection_chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const res = await response.json();
      if (response.ok) {
        const fetchedStateData = {
          series: [res.data[0].Total_Collection, res.data[0].Total_Backlog_Count],
          labels: ['Collected', 'Dues'],
        };
        if(chartType === 'state'){
          setStateChartData(fetchedStateData);
        }else{
          setBranchChartData(fetchedStateData);
        }

      } else {
        console.error('Failed to fetch state-wise data:', res.error);
      }
    } catch (error) {
      console.error('Error fetching state-wise data:', error);
    }
  };


   // Fetch state + region chart data
   const fetchStateRegionChartData = async () => {
    const financialYear = getCurrentFinancialYear();
    const data = { year: financialYear, state: selectedState, region: selectedRegion };
    try {
      const response = await fetch(`${baseUrl}/adminmanage/state_region_rd_collection_chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (response.ok) {
        setBranchChartData({ series: [res.data[0].Total_Collection, res.data[0].Total_Backlog_Count], labels: ['Collected', 'Dues'] });
      } else {
        console.error('Failed to fetch state-region data:', res.error);
      }
    } catch (error) {
      console.error('Error fetching state-region data:', error);
    }
  };


  const fetchBranchChartData = async () => {
    const financialYear = getCurrentFinancialYear();
    const data = { year: financialYear, state: selectedState, region: selectedRegion, branch: selectedBranch };
    try {
      const response = await fetch(`${baseUrl}/adminmanage/state_branch_rd_collection_chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (response.ok) {
        setBranchChartData({ series: [res.data[0].Total_Collection, res.data[0].Total_Backlog_Count], labels: ['Collected', 'Dues'] });
      } else {
        console.error('Failed to fetch branch data:', res.error);
      }
    } catch (error) {
      console.error('Error fetching branch data:', error);
    }
  };


  useEffect(() => {
    if (chartType === 'total') {
      fetchTotalData();
    } else if (chartType === 'state' && selectedState) {
      fetchStateChartData(selectedState);
    } else if (chartType === 'branch') {
      if (selectedState && selectedRegion && selectedBranch) {
        fetchBranchChartData();
      } else if (selectedState && selectedRegion) {
        fetchStateRegionChartData();
      } else if (selectedState) {
        fetchStateChartData(selectedState);
      } else {
        setBranchChartData(null); // No branch data available if no state is selected
      }
    }
  }, [chartType, selectedState, selectedRegion, selectedBranch]);


  const getOptions = (labels) => ({
    chart: {
      width: 350,
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



  // const handleChartTypeChange = (event) => {
  //   setChartType(event.target.value);
  //   // Reset selections when chart type changes
  //   if (event.target.value === 'region') {
  //     setSelectedRegion('north');
  //   } else if (event.target.value === 'branch') {
  //     setSelectedBranch('palakkad');
  //   } else if (event.target.value === 'state') {
  //     setSelectedState(null);
  //   }
  // };

  

  let dataToDisplay;
  if (chartType === 'total') {
    dataToDisplay = totalData;
  } else if (chartType === 'state' && selectedState) {
    dataToDisplay = stateChartData;
  } else if (chartType === 'branch') {
    dataToDisplay = branchChartData;
  }


  
    // Handler to reset state, region, and branch when chart type changes
    const handleChartTypeChange = (event) => {
      setChartType(event.target.value);
    
      // Reset all selections and chart data
      setSelectedState(null);
      setSelectedRegion(null);
      setSelectedBranch(null);
    
      // Reset all chart data
      setStateChartData(null);
      setBranchChartData(null);
    };
    
    const handleStateChange = (selectedOption) => {
      setSelectedState(selectedOption ? selectedOption.value : null);
    
      // Reset region and branch when state changes
      setSelectedRegion(null);
      setSelectedBranch(null);

      setRegionOptions([]);
      setBranchOptions([]);
    
      // Reset chart data when no state is selected
      if (!selectedOption) {
        setStateChartData(null);
       
        setBranchChartData(null);
      }
    };
    
    const handleRegionChange = (selectedOption) => {
      setSelectedRegion(selectedOption ? selectedOption.value : null);
    
      // Reset branch when region changes
      setSelectedBranch(null);

      setBranchOptions([])
    
      // Reset chart data when no region is selected
      if (!selectedOption) {
        setBranchOptions([])
        setSelectedBranch(null);

        setBranchChartData(null);
      }
    };
    
    const handleBranchChange = (selectedOption) => {
      setSelectedBranch(selectedOption ? selectedOption.value : null);
    
      // Reset branch chart data if no branch is selected
      if (!selectedOption) {
        setBranchChartData(null);
      }
    };

 
  return (
    <Container>
      <Row className='mt-3'>
        <Col lg={4}>
          <input
            type="radio"
            id="total"
            name="chartType"
            value="total"
            checked={chartType === 'total'}
            onChange={handleChartTypeChange}
          />
          <label htmlFor="total" className='ms-2'>Total</label>
        </Col>


        <Col lg={4}>
          <input
            type="radio"
            id="state"
            name="chartType"
            value="state"
            checked={chartType === 'state'}
            onChange={handleChartTypeChange}
          />
          <label htmlFor="state" className='ms-2'>State</label>
        </Col>


        <Col lg={4}>
          <input
            type="radio"
            id="branch"
            name="chartType"
            value="branch"
            checked={chartType === 'branch'}
            onChange={handleChartTypeChange}
          />
          <label htmlFor="branch" className='ms-2'>Branch</label>
        </Col>
      </Row>




      {chartType === 'state' && (
        <Row className='mt-3'>
          <Col lg={7} style={{ fontSize: '12px' }}>
            <Select
              options={stateOptions}
              onChange={handleStateChange}
              placeholder="Select State"
              value={stateOptions.find(option => option.value === selectedState)}
              
              isSearchable
            />
          </Col>
        </Row>
      )}

      {chartType === 'branch' && (
        <Row className='mt-3'>
          <Col lg={6} style={{ fontSize: '11px', paddingRight: '0px' }} className='mb-1'>
            <Select
              options={stateOptions}
              onChange={handleStateChange}
              placeholder="Select State"
              value={stateOptions.find(option => option.value === selectedState) || null}
              isClearable
              isSearchable
            />
          </Col>
          <Col lg={6} style={{ fontSize: '11px', paddingRight: '0px' }} className='mb-1'>
            <Select
              options={regionOptions}
              onChange={handleRegionChange}
              placeholder="Select Region"
              value={regionOptions.find(option => option.value === selectedRegion) || null}
              isClearable
              isSearchable
            />
          </Col>
          <Col lg={6} style={{ fontSize: '11px', paddingRight: '0px' }} className='mb-1'>
            <Select

              options={branchOptions}
              onChange={handleBranchChange}
              placeholder="Select Branch"
              value={branchOptions.find(option => option.value === selectedBranch) || null}
              isClearable
              isSearchable
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col md={4}>
        

    
    {dataToDisplay?.series && dataToDisplay.series.length > 0 ? (
      <Chart
        options={getOptions(dataToDisplay?.labels || [])}
        series={dataToDisplay?.series || []}
        type="pie"
        width={350}
      />
    ) : (
      <p className='text-center fs-6'>No data available</p>
    )}

        </Col>
      </Row>
    </Container>
  );
};

export default RDChartComponent;





