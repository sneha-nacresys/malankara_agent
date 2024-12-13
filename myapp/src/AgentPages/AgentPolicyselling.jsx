import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import translation from '../pages/translation';
// import translationMal from '../pages/translationMal';
import Cookies from 'js-cookie'
import Select from 'react-select';
import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
import AgentNavbar from '../AgentNavbar/AgentNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {

  Row,
  Col,
  Container
} from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createagent.css";
import * as XLSX from 'xlsx'; // Import for Excel export
import pdfMake from 'pdfmake/build/pdfmake'; // Import for PDF export
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Import for PDF export
//import baseUrl from "../ConstUrl/url";
// Set the fonts for pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;


function AgentPolicyselling() {
  const baseUrl = process.env.REACT_APP_API_URL;

  const [show, setShow] = useState(false);
  const [showtable, setShowtable] = useState(true);
  const [showDeactive, setShowDeactive] = useState(false);
  const [status, setStatus] = useState("active");
  const [showpolicy, setShowpolicy] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [schemeType, setSchemeType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const navigate = useNavigate();

  // const handleShowpolicy = () => setShowpolicy(true);
  const handleShowpolicy = () => {
    navigate("/policyselling");
  };
  const handleClose = () => {
    setShowpolicy(false);
    setShow(false);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setShowtable(true);
    setShowDeactive(false);
  };
  const handleClick = () => {
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };
  const handleCreateagent = () => {
    navigate("/nextstep");
  };

  const handleResetpassword = () => {
    navigate("/passwordreset");
  };
  const handleSchemelist = () => {
    navigate("/adminSchemelist");
  };
  // const handleAgenttreegridview = () => {
  //   navigate('/agenttreegridview')
  // }


  const [language, setLanguage] = useState("en");


  const translations = {
    en: translation,
    mal: translationMal,

  };


  useEffect(() => {
    setLanguage(Cookies.get("language") || "en");
  }, [])



  const handleBack = () => {
    navigate("/agentproductlist");
  };


  const [selectedOption, setSelectedOption] = useState('rd');
  // ================================POlicy sales data=============================
  const [rdSalesData, setRdSalesData] = useState([]);
  const [fdSalesData, setFdSalesData] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch(`${baseUrl}/adminmanage/PolicySales_RD_FD_ShowUp/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          // body: JSON.stringify({ userid: 'MCCS0001' })  // Fetching userid from cookies
          body: JSON.stringify({ userid: Cookies.get('masterUserid') })  // Fetching userid from cookies
        });

        const response = await res.json();

        if (res.ok) {
          if (response.message) {
            setRdSalesData(response.RD_sales_data);
            setFdSalesData(response.FD_sales_data);
          } else if (response.error) {
            setError(response.error);
          }
        } else {
          setError('Failed to fetch sales data.');
        }

      } catch (error) {
        console.error('An error occurred in fetching sales data', error);
      }
    };

    fetchSalesData();
  }, []); // Removed userid from dependency array


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // -------------------------------------RD SELECT BOXES-------------------------
  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  // const [selectedYear, setSelectedYear] = useState(null);
  // const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredRdSalesData, setFilteredRdSalesData] = useState(rdSalesData);

  // Extract year options from rdSalesData
  const extractYearOptions = (data) => {
    const years = [...new Set(data.map(item => new Date(item.start_date).getFullYear()))];
    return years.map(year => ({ value: year, label: year }));
  };

  // Extract month options from rdSalesData
  const extractMonthOptions = (data) => {
    const months = [...new Set(data.map(item => new Date(item.start_date).getMonth() + 1))];
    return months.map(month => ({ value: month, label: `Month ${month}` }));
  };

  // Extract product options from rdSalesData
  const extractProductOptions = (data) => {
    const products = [...new Set(data.map(item => item.product_name))];
    return products.map(product => ({ value: product, label: product }));
  };

  // Update options when rdSalesData changes
  useEffect(() => {
    setYearOptions(extractYearOptions(rdSalesData));
    setMonthOptions(extractMonthOptions(rdSalesData));
    setProductOptions(extractProductOptions(rdSalesData));
  }, [rdSalesData]);

  // Update filteredRdSalesData based on selected filters
  useEffect(() => {
    let filteredData = rdSalesData;

    if (selectedYear) {
      filteredData = filteredData.filter(item => new Date(item.start_date).getFullYear() === selectedYear);
    }

    if (selectedMonth) {
      filteredData = filteredData.filter(item => new Date(item.start_date).getMonth() + 1 === selectedMonth);
    }

    if (selectedProduct) {
      filteredData = filteredData.filter(item => item.product_name === selectedProduct);
    }

    setFilteredRdSalesData(filteredData);

    // Update options based on filtered data
    setMonthOptions(extractMonthOptions(filteredData));
    setProductOptions(extractProductOptions(filteredData));
  }, [selectedYear, selectedMonth, selectedProduct, rdSalesData]);

  // Handle year selection change
  const handleYearChange = (selectedOption) => {
    const year = selectedOption ? selectedOption.value : null;
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedProduct(null);
  };

  // Handle month selection change
  const handleMonthChange = (selectedOption) => {
    const month = selectedOption ? selectedOption.value : null;
    setSelectedMonth(month);
    setSelectedProduct(null);
  };

  // Handle product selection change
  const handleProductChange = (selectedOption) => {
    const product = selectedOption ? selectedOption.value : null;
    setSelectedProduct(product);
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  // ==========================FD SELECT BOXES========================
  const [yearOptionsFd, setYearOptionsFd] = useState([]);
  const [monthOptionsFd, setMonthOptionsFd] = useState([]);
  const [productOptionsFd, setProductOptionsFd] = useState([]);
  const [selectedYearFd, setSelectedYearFd] = useState(null);
  const [selectedMonthFd, setSelectedMonthFd] = useState(null);
  const [selectedProductFd, setSelectedProductFd] = useState(null);
  const [filteredFddSalesData, setFilteredFdSalesData] = useState(rdSalesData);

  const extractYearOptionsFd = (data) => {
    const years = [...new Set(data.map(item => new Date(item.start_date).getFullYear()))];
    return years.map(year => ({ value: year, label: year }));
  };

  const extractMonthOptionsFd = (data) => {
    const months = [...new Set(data.map(item => new Date(item.start_date).getMonth() + 1))];
    return months.map(month => ({ value: month, label: `Month ${month}` }));
  };

  // Extract product options from rdSalesData
  const extractProductOptionsFd = (data) => {
    const products = [...new Set(data.map(item => item.product_name))];
    return products.map(product => ({ value: product, label: product }));
  };

  useEffect(() => {
    setYearOptionsFd(extractYearOptionsFd(fdSalesData));
    setMonthOptionsFd(extractMonthOptionsFd(fdSalesData));
    setProductOptionsFd(extractProductOptionsFd(fdSalesData));
  }, [fdSalesData]);

  useEffect(() => {
    let filteredDataFd = fdSalesData;

    if (selectedYearFd) {
      filteredDataFd = filteredDataFd.filter(item => new Date(item.start_date).getFullYear() === selectedYearFd);
    }

    if (selectedMonthFd) {
      filteredDataFd = filteredDataFd.filter(item => new Date(item.start_date).getMonth() + 1 === selectedMonthFd);
    }

    if (selectedProductFd) {
      filteredDataFd = filteredDataFd.filter(item => item.product_name === selectedProductFd);
    }

    setFilteredFdSalesData(filteredDataFd);

    // Update options based on filtered data
    setMonthOptionsFd(extractMonthOptionsFd(filteredDataFd));
    setProductOptionsFd(extractProductOptionsFd(filteredDataFd));
  }, [selectedYearFd, selectedMonthFd, selectedProductFd, fdSalesData]);


  // Handle year selection change
  const handleYearChangeFd = (selectedOption) => {
    const year = selectedOption ? selectedOption.value : null;
    setSelectedYearFd(year);
    setSelectedMonthFd(null);
    setSelectedProductFd(null);
  };

  // Handle month selection change
  const handleMonthChangeFd = (selectedOption) => {
    const month = selectedOption ? selectedOption.value : null;
    setSelectedMonthFd(month);
    setSelectedProductFd(null);
  };

  // Handle product selection change
  const handleProductChangeFd = (selectedOption) => {
    const product = selectedOption ? selectedOption.value : null;
    setSelectedProductFd(product);
    setSelectedYearFd(null);
    setSelectedMonthFd(null);
  };
  // ========================================================





  const exportToExcel = () => {
    try {
      const todaysDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const ws = XLSX.utils.json_to_sheet(filteredRdSalesData.map((rowRd) => ({
        'Policy ID': rowRd.policy_id,
        'Product ID': rowRd.product_id,
        'Product Name': rowRd.product_name,
        'Tenure': rowRd.tenure,
        'Customer ID': rowRd.customer_id,
        'Customer Name': rowRd.customer_name,
        'Start Date': formatDate(rowRd.start_date),
        'Maturity Date': formatDate(rowRd.maturity_date),
        'Installment Amount': rowRd.installment_amount,
        'Total installment Paid': rowRd.last_paid_installment,
        'Total Paid Amount': rowRd.last_paid_installment,
        'Total Maturity Amount': rowRd.last_paid_installment,

      })));
      const wb = XLSX.utils.book_new();
      const sheetName = `Policy_SalesData_RD${todaysDate}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const fileName = `Policy Sales Data RD${todaysDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Data exported successfully to ${fileName}`);

      // const wb = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, 'RdSalesData');
      // XLSX.writeFile(wb, 'RdSalesData.xlsx');
      // toast.success('Data exported successfully to RdSalesData.xlsx')
    } catch (error) {
      // Show error message in case something goes wrong
      toast.error('Failed to export data.');
    }
  };

  const exportToPDF = () => {
    try {
      const docDefinition = {
        content: [
          {
            table: {
              headerRows: 1,
              body: [
                [
                  'Policy ID',
                  'Product ID',
                  'Product Name',
                  'Tenure',
                  'Customer ID',
                  'Customer Name',
                  'Start Date',
                  'Maturity Date',
                  'Installment Amount',
                  'Total Installment Paid',
                  'Paid Amount',
                  'Maturity Amount'
                ],
                ...filteredRdSalesData.map((rowRd) => [
                  rowRd.policy_id,
                  rowRd.product_id,
                  rowRd.product_name,
                  rowRd.tenure,
                  rowRd.customer_id,
                  rowRd.customer_name,
                  formatDate(rowRd.start_date),
                  formatDate(rowRd.maturity_date),
                  rowRd.installment_amount,
                  rowRd.last_paid_installment,
                  rowRd.Paid_Amount,
                  rowRd.Maturity_Amount,
                ]),
              ],
            },
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download('RdSalesData.pdf');
      // Show success message
      toast.success('Data exported successfully to RdSalesData.pdf');
    } catch (error) {
      // Show error message in case something goes wrong
      toast.error('Failed to export data.');
    }
  };



  const exportToExcelFD = () => {
    try {
      const todaysDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const ws = XLSX.utils.json_to_sheet(filteredFddSalesData.map((rowFd) => ({
        'Policy ID': rowFd.policy_id,
        'Product ID': rowFd.product_id,
        'Product Name': rowFd.product_name,
        'Customer ID': rowFd.customer_id,
        'Customer Name': rowFd.customer_name,
        'Invested Amount': rowFd.deposit_amount,
        'Start Date': formatDate(rowFd.start_date),
        'Maturity Date': formatDate(rowFd.maturity_date)
      })));

      const wb = XLSX.utils.book_new();
      const sheetName = `Policy_SalesData_FD${todaysDate}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const fileName = `Policy Sales Data FD${todaysDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Data exported successfully to ${fileName}`);
    } catch (error) {
      // Show error message in case something goes wrong
      toast.error('Failed to export data.');
    }
  };


  const exportToPDFFD = () => {
    try {
      const docDefinition = {
        content: [
          {
            table: {
              headerRows: 1,
              body: [
                ['Policy ID',
                  'Product ID',
                  'Product Name',
                  'Customer ID',
                  'Customer Name',
                  'Invested Amount',
                  'Start Date',
                  'Maturity Date'],
                ...filteredFddSalesData.map((rowFd) => [
                  rowFd.policy_id,
                  rowFd.product_id,
                  rowFd.product_name,
                  rowFd.customer_id,
                  rowFd.customer_name,
                  rowFd.deposit_amount,
                  formatDate(rowFd.start_date),
                  formatDate(rowFd.maturity_date),
                ]),
              ],
            },
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download('FdSalesData.pdf');
      //Show success message
      toast.success('Data exported successfully to FdSalesData.pdf')
    } catch (error) {
      // Show error message in case something goes wrong
      toast.error('Failed to export data.');
    }
  };

  return (

    <div style={{ height: "90vh" }}>
      <AgentNavbar />
      <ToastContainer
        autoClose={1000}
      />
   <Container>
   <Row>

   <Row className="d-flex justify-content-center">
          <Col lg={11}  className="sidenav2 main-header-div me-5" >
            <div className="faq-headers agent-list-main-header">
            <h5>   {translations[language].policysalesdata}</h5>
          </div>
        </Col>
      </Row>
      <Container>



        <Row className=" mt-3 d-flex justify-content-center align-items-center mx-5" style={{ fontSize: '12px' }}>

          <Col lg={4}>
            <input
              type="radio"
              id="rd"
              name="policyType"
              value="rd"
              checked={selectedOption === 'rd'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <label htmlFor="rd" className="ms-2">RD</label>

          </Col>

          <Col lg={4}>
            <input
              type="radio"
              id="fd"
              name="policyType"
              value="fd"
              checked={selectedOption === 'fd'}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            <label htmlFor="fd" className="ms-2">FD</label>
          </Col>
        </Row>

      </Container>



      <Container>
        {selectedOption === 'rd' && (
          <>
          
          <div style={{ marginLeft: "20px", height: "50vh", width: "86%" }}>
            <div style={{ marginBottom: "20px" }}>
            <Row className=' mt-3 d-flex justify-content-center align-items-center'>
              <Col lg={3} style={{ fontSize: '12px' }}>
                <Select
                  options={yearOptions}
                  className="month-select select-wd"
                  onChange={handleYearChange}
                  value={selectedYear ? { value: selectedYear, label: selectedYear } : null}
                  placeholder={translations[language].selectayear}
                  isSearchable
                  isClearable
                />
              </Col>

              <Col lg={3} style={{ fontSize: '12px' }}>
                <Select
                  options={monthOptions}
                  className="month-select select-wd"
                  onChange={handleMonthChange}
                  value={selectedMonth ? { value: selectedMonth, label: `Month ${selectedMonth}` } : null}
                  placeholder={translations[language].selectamonth}
                  isSearchable
                  isClearable
                />
              </Col>

              <Col lg={3} style={{ fontSize: '12px' }}>
                <Select
                  options={productOptions}
                  className="month-select select-wd"
                  onChange={handleProductChange}
                  value={selectedProduct ? { value: selectedProduct, label: selectedProduct } : null}
                  placeholder={translations[language].selectaproduct}
                  isSearchable
                  isClearable
                />
              </Col>

              <Col lg={2}>

                <button
                  className="shiftagentleg py-2"
                  style={{ width: "75px", fontSize: "12px" }}
                  onClick={handleBack}
                >
                  {translations[language].back}
                </button>
              </Col>

            </Row>
            </div>
         
            <div className="salesdiv m-0 p-0" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                <MDBTable >
                  <MDBTableHead className="common-thead">
                    <tr >
                      <th scope="col">    {translations[language].policyId}</th>
                      <th scope="col">  {translations[language].productid}</th>
                      <th scope="col">   {translations[language].productname}</th>
                      <th scope="col"> {translations[language].tenure}</th>
                      <th scope="col">    {translations[language].customerid}</th>
                      <th scope="col">   {translations[language].customername}</th>
                      <th scope="col">   {translations[language].startdate}</th>
                      <th scope="col">   {translations[language].maturitydate}</th>
                      <th scope="col"> {translations[language].installmentamount}</th>
                      <th scope="col">  {translations[language].totalInstallmentPaid}</th>
                      <th scope="col">  {translations[language].totalPaidAmount}</th>
                      <th scope="col">  {translations[language].maturityamount}</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody className="common-tbody ">
                    {filteredRdSalesData.length === 0 ? (
                      <tr>
                        <td colSpan="12" className=" text-danger" style={{ textAlign: 'center' }}>No data available</td>
                      </tr>
                    ) : (
                      filteredRdSalesData.map((rowRd, index) => (
                        <tr key={`${rowRd.policyId} - ${rowRd.customer_id}-${index}`} >
                          <td>{rowRd.policy_id}</td>
                          <td>{rowRd.product_id}</td>
                          <td>{rowRd.product_name}</td>
                          <td>{rowRd.tenure}</td>
                          <td>{rowRd.customer_id}</td>
                          <td>{rowRd.customer_name}</td>
                          <td>{formatDate(rowRd.start_date)}</td>
                          <td>{formatDate(rowRd.maturity_date)}</td>
                          <td>{rowRd.installment_amount}</td>
                          <td>{rowRd.last_paid_installment}</td>
                          <td>{rowRd.Paid_Amount}</td>
                          <td>{rowRd.Maturity_Amount}</td>

                        </tr>
                      ))
                    )}
                  </MDBTableBody>
                </MDBTable>
              </div>
           

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <button className="shiftagentleg" onClick={exportToExcel}>Export to Excel</button>


            </div>
            </div>
          </>
        )}


        {selectedOption === 'fd' && (
          <>
            <div style={{ marginLeft: "20px", height: "50vh", width: "86%" }}>
            <div style={{ marginBottom: "20px" }}>
            <Row className='mt-3 d-flex justify-content-center policy-selling-select-row'>
              <Col lg={3} style={{ fontSize: '12px' }}>
                <Select
                  options={yearOptionsFd}
                  className="month-select select-wd"
                  onChange={handleYearChangeFd}
                  value={selectedYearFd ? { value: selectedYearFd, label: selectedYearFd } : null}
                  placeholder={translations[language].selectayear}
                  isSearchable
                  isClearable
                />
              </Col>

              <Col lg={3} style={{ fontSize: '12px' }}>
                <Select
                  options={monthOptionsFd}
                  className="month-select select-wd"
                  onChange={handleMonthChangeFd}
                  value={selectedMonthFd ? { value: selectedMonthFd, label: `Month ${selectedMonthFd}` } : null}
                  placeholder={translations[language].selectamonth}
                  isSearchable
                  isClearable
                />
              </Col>

              <Col lg={3} style={{ fontSize: '12px' }}>
                <Select
                  options={productOptionsFd}
                  className="month-select select-wd"
                  onChange={handleProductChangeFd}
                  value={selectedProductFd ? { value: selectedProductFd, label: selectedProductFd } : null}
                  placeholder={translations[language].selectaproduct}
                  isSearchable
                  isClearable
                />
              </Col>

              <Col lg={2}>


                <button
                  className="shiftagentleg py-2"
                  style={{ width: "75px", fontSize: "12px" }}
                  onClick={handleBack}
                >
                  {translations[language].back}
                </button>
              </Col>

            </Row>
            </div>

            <div className="salesdiv m-0 p-0" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
              <MDBTable >
                <MDBTableHead className="common-thead">
                  <tr >
                    <th scope="col"> {translations[language].policyId}</th>
                    <th scope="col">  {translations[language].productid}</th>
                    <th scope="col">  {translations[language].productname}</th>
                    <th scope="col">  {translations[language].customerid}</th>
                    <th scope="col">   {translations[language].customername}</th>
                    <th scope="col">  {translations[language].investedamount}</th>
                    <th scope="col">  {translations[language].startdate}</th>
                    <th scope="col">  {translations[language].maturitydate}</th>

                  </tr>
                </MDBTableHead>

                <MDBTableBody className="common-tbody text-start">
                  {fdSalesData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-danger" style={{ textAlign: 'center' }}>No data available</td>
                    </tr>
                  ) : (
                    filteredFddSalesData.map((rowFd, index) => (
                      <tr key={`${rowFd.policy_id}-${rowFd.customer_name}-${index}`} style={{ fontSize: '12px' }}>

                        <td>{rowFd.policy_id}</td>
                        <td>{rowFd.product_id}</td>
                        <td>{rowFd.product_name}</td>
                        <td>{rowFd.customer_id}</td>
                        <td>{rowFd.customer_name}</td>
                        <td>{rowFd.deposit_amount}</td>
                        <td>{formatDate(rowFd.start_date)}</td>
                        <td>{formatDate(rowFd.maturity_date)}</td>
                      </tr>
                    ))
                  )}
                </MDBTableBody>

              </MDBTable>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <button className="shiftagentleg" onClick={exportToExcelFD}>Export to Excel</button>
              {/* <button className="shiftagentleg" onClick={exportToPDFFD}>Export to PDF</button> */}

          
            </div>
            </div>
          </>
        )}
      </Container>

      </Row>

      </Container>
    </div>

  );
}

export default AgentPolicyselling;
