import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';

import {

  Table,
  Row,
  Col,
  Modal,
  Form,
  Container,
  // Button,
} from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";

import AgentNavbar from '../AgentNavbar/AgentNavbar';
import './createagent.css';
import "../pages/createagent.css";
import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
import Cookies from 'js-cookie'
//import baseUrl from "../ConstUrl/url";
import { log } from "pdfmake/build/pdfmake";


function AdminSchemelist() {
  const baseUrl = process.env.REACT_APP_API_URL;


  const [language, setLanguage] = useState("en");


  const translations = {
    en: translation,
    mal: translationMal,

  };


  useEffect(() => {
    setLanguage(Cookies.get("language") || "en");
  }, [])
  const [show, setShow] = useState(false);
  // const [showActive, setShowActive] = useState(true);
  // const [showDeactive, setShowDeactive] = useState(false);
  // const [status, setStatus] = useState("active");
  const [showpolicy, setShowpolicy] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [schemeType, setSchemeType] = useState('');
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  // const handleShowpolicy = () => setShowpolicy(true);
  const handleShowpolicy = async () => {
    navigate('/agentpolicyselling');
    try {
      const res = await fetch(`${baseUrl}/adminmanage/SalesData/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const response = await res.json();

      if (res.ok) {
        if (response.message) {
          console.log("res ok");

          // console.log(`policy sales data msg: ${response.message}`);

        } else if (response.error) {
          console.error(`Error: ${response.error}`);
        }
      } else {
        console.error('Request was not successful.');
      }

    } catch (error) {
      console.error('An error occurred in fetching sales data', error);
    }
  };
  const handleClose = () => {
    setShowpolicy(false);
    setShow(false);
  }



  // ----------------------table data for complete schemelist based on radio buttons active or deactive-------------
  const [status, setStatus] = useState("active");
  const [showActive, setShowActive] = useState(true);
  // const [showDeactive, setShowDeactive] = useState(false);
  const [schemeList, setSchemeList] = useState([]);



  const handleSchemeList = async (statusParam) => {
    try {
      const res = await fetch(`${baseUrl}/agent/agent_product_list/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify('')
      });

      const response = await res.json();
      setSchemeList(response.agent_pro_data)
    } catch (error) {
      console.error('An error occurred in scheme list', error);
      toast.error('An error occurred in schemelist: ' + error);
    }
  };

  useEffect(() => {
    // const statusParam = status === "deactive" ? 0 : 1;
    // handleSchemeList(statusParam);
    // }, [status]);
    handleSchemeList()
  }, []);



  const handleLoad = () => {
    // Logic to set tableData based on selected policyName and schemeType
    if (policyName === '1' && schemeType === '1') {
      // Jeevan Raksha and RD
      setTableData([
        {
          customerId: 1,
          customerName: 'Revathi',
          policyName: 'Jeevan Raksha',
          policyId: 101,
          dateStartFrom: '2024-06-22', // Example date
          dateEndsIn: '2025-06-22', // Example date
          incentivePercentage: 5 // Example percentage
        }
      ]);
    } else if (policyName === '1' && schemeType === '2') {
      // Jeevan Raksha and FD
      setTableData([
        {
          customerId: 2,
          customerName: 'Vijay',
          policyName: 'Jeevan Raksha',
          policyId: 102,
          dateStartFrom: '2024-06-22', // Example date
          dateEndsIn: '2025-06-22', // Example date
          incentivePercentage: 7 // Example percentage
        }
      ]);
    }
    // Add more conditions for other combinations as needed
  };

  const handleShow = (filePath) => {
    // Log the filePath to check its type and value

    if (typeof filePath === 'string' && filePath.trim() !== '') {
      // Construct the full URL if needed
      const fullFilePath = filePath.startsWith('http') ? filePath : `${baseUrl}${filePath}`;
      window.open(fullFilePath, "_blank"); // Open the file in a new tab
    } else {
      toast.error('No file available for this product or invalid file path.');
    }
  };

  const [productList, setProductList] = useState([]); // Original product list
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const handleProductTypeChange = (option) => {
    setSelectedProductType(option);
    setSelectedProductName(null); // Clear product name when type changes
  };

  const handleProductNameChange = (option) => {
    setSelectedProductName(option);
    if (option && option.value) {
      const selectedProduct = schemeList.find(product => product.product_name === option.value);

      if (selectedProduct) {
        setSelectedProductType({ value: selectedProduct.product_type, label: selectedProduct.product_type });
      }
    } else {
      setSelectedProductType(null);
    }
  };

  const filteredSchemeList = schemeList.filter(item =>
    (!selectedProductType || item.product_type === selectedProductType.value) &&
    (!selectedProductName || item.product_name === selectedProductName.value)
  );

  // const productTypesOptions = [...new Set(productList.map(product => product.product_type))]
  //   .map(type => ({ value: type, label: type }));

  const productTypesOptions = [...new Set(schemeList.map(product => product.product_type))]
    .map(type => ({ value: type, label: type }));

  const productNameOptions = schemeList
    .filter(product => !selectedProductType || product.product_type === selectedProductType.value)
    .map(product => ({
      value: product.product_name,
      label: `${product.product_name} - ${product.installment_model}`
    }));
  return (
    <div>
      <AgentNavbar />
      <ToastContainer
        autoClose={1000} />
      <Container>
        <Row>
          <Row className="d-flex justify-content-center">
            <Col lg={11} className="sidenav2 main-header-div me-5" >
              <div className="faq-headers agent-list-main-header">

                <h5>  {translations[language].productlist}</h5>
              </div>
            </Col>
          </Row>




          <div style={{ marginLeft: "20px", height: "50vh", width: "86%" }}>
            <div style={{ marginBottom: "20px" }}>

              <Row className="d-flex justify-content-center">

                <Col lg={3} style={{ fontSize: '12px' }} className="mb-2">
                  <Select
                    options={productTypesOptions}
                    onChange={handleProductTypeChange}
                    value={selectedProductType}
                    placeholder={translations[language].selectproducttype}
                    isClearable
                  />
                </Col>
                <Col lg={3} style={{ fontSize: '12px' }} className="mb-2" >
                  <Select
                    options={productNameOptions}
                    onChange={handleProductNameChange}
                    value={selectedProductName}
                    placeholder={translations[language].selectproductname}
                    isClearable
                  />
                </Col>


                <Col lg={2}>
                  <button
                    className="shiftagentleg py-2 common-btn"
                    onClick={handleShowpolicy}
                    style={{ fontSize: "11px", width: "100%" }}
                  >
                    {translations[language].policysalesdata}
                  </button></Col>
              </Row>

            </div>



            <div className="salesdiv m-0 p-0" style={{ maxHeight: '55vh', overflowY: 'auto' }}>

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >
                    <th scope="col" >
                      {translations[language].slno}
                    </th>
                    <th scope="col" >
                      {translations[language].productid}
                    </th>
                    <th scope="col">
                      {translations[language].productname}
                    </th>
                    <th scope="col">
                      {translations[language].producttype}
                    </th>
                    <th scope="col">
                      {translations[language].tenure}
                    </th>
                    <th scope="col">
                      {translations[language].installmentmodel}

                    </th>

                    <th scope="col">
                      {translations[language].view}
                    </th>
                  </tr>
                </MDBTableHead>


                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                  {filteredSchemeList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", fontSize: "16px", color: "#dc3545" }}>
                        No active products found.
                      </td>
                    </tr>
                  ) : (
                    filteredSchemeList.map((item, index) => (
                      <tr key={item.product_id} className="trbody">
                        <td>{index + 1}</td>
                        <td>{item.product_id}</td>
                        <td>{item.product_name}</td>
                        <td>{item.product_type}</td>
                        <td>{item.tenure}</td>
                        <td>{item.installment_model}</td>
                        <td>
                          <button className="schemelist-edit" onClick={() => handleShow(item.file_path)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header
                      closeButton
                      style={{ background: "#e1e1e1" }}
                    >
                      <Modal.Title>Pre-Closure</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Table>
                        <thead className="common-thead">
                          <tr>
                            <th style={{ background: "#e1e1e1" }}>   {translations[language].slno}</th>
                            <th style={{ background: "#e1e1e1" }}>
                              {translations[language].productid}
                            </th>
                            <th style={{ background: "#e1e1e1" }}>
                              {translations[language].productname}
                            </th>
                            <th style={{ background: "#e1e1e1" }}>
                              {translations[language].period}(  {translations[language].month})
                            </th>
                            <th style={{ background: "#e1e1e1" }}>  {translations[language].reversal} %</th>
                          </tr>
                        </thead>
                        <tbody className="'common-tbody">
                          <tr>
                            <td>1</td>
                            <td>D01</td>
                            <td>Dhanalakshya</td>
                            <td>0-6</td>
                            <td>100%</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Modal.Body>
                  </Modal>
                </MDBTableBody>
              </MDBTable>
            </div>



          </div>
        </Row>

      </Container>


      <Modal show={showpolicy} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Selling</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div >
            <div style={{ display: "flex" }}>
              <Form.Select aria-label="Default select example" style={{ width: "300px" }} onChange={(e) => setPolicyName(e.target.value)}>
                <option>Select Product Name</option>
                <option value="1">Jeevan Raksha</option>
                <option value="2">Crorepathi</option>
                <option value="3">Jeevan Nirmithi</option>
              </Form.Select>
              <Form.Select aria-label="Default select example" style={{ width: "300px" }} onChange={(e) => setSchemeType(e.target.value)}>
                <option>Select Product Type</option>
                <option value="1">RD</option>
                <option value="2">FD</option>
              </Form.Select>
              <button className="shiftagentleg" onClick={handleLoad}>Load</button>
            </div>
            <br />
            <MDBTable responsive>
              <MDBTableHead>
                <tr >
                  <th scope="col">
                    Customer ID
                  </th>
                  <th scope="col">
                    Customer Name
                  </th>
                  <th scope="col">
                    Policy Name
                  </th>
                  <th scope="col">
                    Policy Id
                  </th>
                  <th scope="col">
                    Date Start From
                  </th>
                  <th scope="col">
                    Date Ends In
                  </th>
                  <th scope="col">
                    Incentive Percentage
                  </th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {tableData.map((row, index) => (
                  <tr key={index} className="trbody">
                    <td>{row.customerId}</td>
                    <td>{row.customerName}</td>
                    <td>{row.policyName}</td>
                    <td>{row.policyId}</td>
                    <td><input type="date" value={row.dateStartFrom} /></td>
                    <td><input type="date" value={row.dateEndsIn} /></td>
                    <td>{row.incentivePercentage} %</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </div>
        </Modal.Body>

      </Modal>
    </div>
  );
}

export default AdminSchemelist;
