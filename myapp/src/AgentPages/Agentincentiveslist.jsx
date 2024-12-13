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
  Container,

  // Button,
} from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";

import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'js-cookie';
import AgentNavbar from '../AgentNavbar/AgentNavbar';
import './createagent.css';
import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
import * as XLSX from 'xlsx'; // Import for Excel export
import pdfMake from 'pdfmake/build/pdfmake'; // Import for PDF export
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Import for PDF export
//import baseUrl from "../ConstUrl/url";
// Set the fonts for pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Agentincentivelist() {

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
  const [showpolicy, setShowpolicy] = useState(false);
  const navigate = useNavigate();


  const handleClose = () => {
    setShowpolicy(false);
    setShow(false);
  }



  // ----------------------table data for complete schemelist based on radio buttons active or deactive-------------
  const [showActive, setShowActive] = useState(true);
  const [schemeList, setSchemeList] = useState([]);
  const [years, setYears] = useState([]);


  const handleSchemeList = async () => {
    const demo = {
      userid: Cookies.get('masterUserid'),
      roleid: Cookies.get('userRoleId')
    }

    try {
      const res = await fetch(`${baseUrl}/agent/agent_product_role_incentive_showup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(demo)
      });

      const response = await res.json();
      setSchemeList(response.agent_incentive_list)
      if (response.demo) {
        const years = response.demo.tenure_incentives;
      }
      setYears(years)

    } catch (error) {
      console.error('An error occurred in scheme list', error);
    }
  };

  useEffect(() => {

    handleSchemeList()
  }, []);





  const handleShow = () => setShow(true);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const handleProductTypeChange = (option) => {
    setSelectedProductType(option);
    setSelectedProductName(null); // Clear product name when type changes
  };

  const handleProductNameChange = (option) => {
    if (option && option.value) {
      // Find the selected product based on the option value
      const selectedProduct = schemeList.find(product => product.product_name === option.value);

      if (selectedProduct) {
        const label = `${selectedProduct.product_name} - ${selectedProduct.installment_model}`;
        setSelectedProductName({ value: option.value, label: label });

        setSelectedProductType({ value: selectedProduct.product_type, label: selectedProduct.product_type });
      } else {
        setSelectedProductName(null);
        setSelectedProductType(null);
      }
    } else {
      setSelectedProductName(null);
      setSelectedProductType(null);
    }
  };

  const filteredSchemeList = schemeList.filter(item =>
    (!selectedProductType || item.product_type === selectedProductType.value) &&
    (!selectedProductName || item.product_name === selectedProductName.value)
  );


  const productTypesOptions = schemeList
    .reduce((acc, product) => {
      if (!acc.includes(product.product_type)) {
        acc.push(product.product_type);
      }
      return acc;
    }, [])
    .map(type => ({ value: type, label: type }));

  const productNameOptions = schemeList
    .filter(product => !selectedProductType || product.product_type === selectedProductType.value)
    .map(product => ({
      value: product.product_name,
      label: `${product.product_name} - ${product.installment_model}`
    }));






  const exportToExcel = () => {
    try {
      const todaysDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const ws = XLSX.utils.json_to_sheet(filteredSchemeList.map((item) => ({
        'Product ID': item.product_id,
        'Product Name': item.product_name,
        'Product Type': item.product_type,
        '1st Year': item.tenure_incentives["12"] !== null ? item.tenure_incentives["12"] : 'N/A',
        '2nd Year': item.tenure_incentives["24"] !== null ? item.tenure_incentives["24"] : 'N/A',
        '3rd Year': item.tenure_incentives["36"] !== null ? item.tenure_incentives["36"] : 'N/A',
        '4th Year': item.tenure_incentives["48"] !== null ? item.tenure_incentives["48"] : 'N/A',
        '5th Year': item.tenure_incentives["60"] !== null ? item.tenure_incentives["60"] : 'N/A',
        '6th Year': item.tenure_incentives["60"] !== null ? item.tenure_incentives["72"] : 'N/A',
        '7th Year': item.tenure_incentives["72"] !== null ? item.tenure_incentives["84"] : 'N/A',
        'Tenure': item.tenure,
        'Installment Model': item.installment_model
      })));

      const wb = XLSX.utils.book_new();
      const sheetName = `Incentives_List${todaysDate}`;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const fileName = `Incentives_List${todaysDate}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success(`Data exported successfully to ${fileName}`);
      // const wb = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, 'Incentivesl');
      // XLSX.writeFile(wb, 'Incentivesl.xlsx');
      // //Show success message
      // toast.success('Data exported successfully to Incentiveslist.xlsx')
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
                ['Product ID', 'Product Name', 'Product Type', '12-Month Incentive', '24-Month Incentive', '36-Month Incentive', '48-Month Incentive', '60-Month Incentive', '72-Month Incentive', 'Tenure', 'Installment Model'],
                ...filteredSchemeList.map((item) => [
                  item.product_id,
                  item.product_name,
                  item.product_type,
                  item.tenure_incentives["12"] !== null ? item.tenure_incentives["12"] : 'N/A',
                  item.tenure_incentives["24"] !== null ? item.tenure_incentives["24"] : 'N/A',
                  item.tenure_incentives["36"] !== null ? item.tenure_incentives["36"] : 'N/A',
                  item.tenure_incentives["48"] !== null ? item.tenure_incentives["48"] : 'N/A',
                  item.tenure_incentives["60"] !== null ? item.tenure_incentives["60"] : 'N/A',
                  item.tenure_incentives["72"] !== null ? item.tenure_incentives["72"] : 'N/A',
                  item.tenure,
                  item.installment_model,
                ]),
              ],
            },
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download('Incentivesl.pdf');
      pdfMake.createPdf(docDefinition).download('Incentiveslist.pdf');
      //Show success message
      toast.success('Data exported successfully to Incentiveslist.pdf')
    } catch (error) {
      // Show error message in case something goes wrong
      toast.error('Failed to export data.');
    }
  };



  return (
    <div>
      <AgentNavbar />
      <ToastContainer
        autoClose={1000} />
      <Container>
        <Row>

        <Row className="d-flex justify-content-center">
          <Col lg={11}  className="sidenav2 main-header-div me-5" >
            <div className="faq-headers agent-list-main-header">
                <h5> {translations[language].incentiveslist}</h5>
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
                    className=""
                  />
                </Col>
                <Col lg={3} style={{ fontSize: '12px' }} className="mb-2">
                  <Select
                    options={productNameOptions}
                    onChange={handleProductNameChange}
                    value={selectedProductName}
                    placeholder={translations[language].selectproductname}
                    isClearable
                  />
                </Col>


                <Col lg={2}>
                  <button className="shiftagentleg py-1" onClick={exportToExcel}>Export to Excel</button>

                </Col>
                {/* <Col lg={2}>
     <button className="shiftagentleg" onClick={exportToPDF}>Export to Pdf</button>
    
  </Col>             */}
              </Row>
            </div>

            <div className="salesdiv m-0 p-0" style={{ maxHeight: '55vh', overflowY: 'auto' }}>


              {showActive && (
                <MDBTable  >
                  <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                    <tr >

                      <th scope="col" rowspan={2}>
                        {translations[language].productid}
                      </th>
                      <th scope="col" rowspan={2}>
                        {translations[language].productname}
                      </th>
                      <th scope="col" rowspan={2}>
                        {translations[language].producttype}
                      </th>
                      <th scope="col" colSpan={7}>
                        {translations[language].incentiverepresentationinmonths}
                      </th>
                      <th scope="col" rowspan={2}>
                        {translations[language].tenure}
                      </th>
                      <th scope="col" rowspan={2}>
                        {translations[language].installmentmodel}
                      </th>


                    </tr>
                    <tr  >
                      <th scope="col" >
                        1st Year %
                      </th>
                      <th scope="col" >
                        2nd Year %
                      </th>
                      <th scope="col" >
                        3rd Year %
                      </th>
                      <th scope="col" >
                        4th Year %
                      </th>
                      <th scope="col" >
                        5th Year %
                      </th>
                      <th scope="col" >
                        6th Year %
                      </th>
                      <th scope="col" >
                        7th Year %
                      </th>
                    </tr>
                  </MDBTableHead>


                  <MDBTableBody style={{ textAlign: "center" }} className="common-tbody text-start">
                    {filteredSchemeList.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", fontSize: "16px", color: "#dc3545" }}>
                          No active products found.
                        </td>
                      </tr>
                    ) : (
                      filteredSchemeList.map((item, index) => (
                        <tr key={item.product_id} >

                          <td>{item.product_id}</td>
                          <td>{item.product_name}</td>
                          <td>{item.product_type}</td>
                          <td>{item.tenure_incentives["12"] !== null ? item.tenure_incentives["12"] : 'N/A'}</td>
                          <td>{item.tenure_incentives["24"] !== null ? item.tenure_incentives["24"] : 'N/A'}</td>
                          <td>{item.tenure_incentives["36"] !== null ? item.tenure_incentives["36"] : 'N/A'}</td>
                          <td>{item.tenure_incentives["48"] !== null ? item.tenure_incentives["48"] : 'N/A'}</td>
                          <td>{item.tenure_incentives["60"] !== null ? item.tenure_incentives["60"] : 'N/A'}</td>
                          <td>{item.tenure_incentives["72"] !== null ? item.tenure_incentives["72"] : 'N/A'}</td>
                          <td>{item.tenure_incentives["84"] !== null ? item.tenure_incentives["84"] : 'N/A'}</td>
                          <td>{item.tenure}</td>
                          <td>{item.installment_model}</td>

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
              )}

            </div>
          </div>
        </Row>

      </Container>





    </div>
  );
}

export default Agentincentivelist;
