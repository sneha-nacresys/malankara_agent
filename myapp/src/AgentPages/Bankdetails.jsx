import React, { useEffect, useState } from "react";
import {  Container, Row, Col, Form, FloatingLabel, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./createagent.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
// import AttachBtn from "./AttachBtn";
import AgentNavbar from '../AgentNavbar/AgentNavbar';
import "./createagent.css";


import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
//import baseUrl from "../ConstUrl/url";

function Bankdetails() {
  
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");
  const handleLanguageChange = (selectedLanguage) => {
      setLanguage(selectedLanguage);
      Cookies.set("language", selectedLanguage);
    };

    const translations = {
      en: translation,
      mal: translationMal,
     
    };
  
    
useEffect(() => {
  setLanguage(Cookies.get("language") || "en");
}, [])
    




  // useEffect(() => {
  //   const agentCreateStatus = Cookies.get('createAgent');
  //   if (agentCreateStatus === 'true') {

  //     toast.success(translations[language].agentcreatedsuccessfully);
  //     Cookies.remove('createAgent')

  //   }
  // }, []);

  useEffect(() => {
    const successData = Cookies.get('createAgentSuccess');
    if (successData) {
        const { message, member_name, username } = JSON.parse(successData);
        if (message) {
            toast.success(`${member_name} - ${username}: ${translations[language].agentcreatedsuccessfully}`);
        }
        Cookies.remove('createAgentSuccess');
    }
    const agentCreateStatus = Cookies.get('createAgent');
    if (agentCreateStatus === 'true') {
        Cookies.remove('createAgent');
    }
}, [navigate]);

  
  useEffect(() => {
    const errorData = Cookies.get('createAgentBankDet');
    if (errorData) {
      const { error, member_name, username } = JSON.parse(errorData);
      if (error) {
          toast.error(`${member_name} - ${username}: ${translations[language].employeebankdeatilsadded}`);
      }
        Cookies.remove('createAgentBankDet');
    }
}, [navigate]);


  const [form, setForm] = useState({
    bankName: '',
    ifscCode: '',
    branchName: '',
    accountNumber: '',
    aadharNumber: '',
    pancardNumber: '',
    
  });
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/agent/temp_bank_nominee_fetch/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid: Cookies.get('agentUserid') }),
        });
        const data = await response.json();
        
        if (data.bank_details && data.bank_details.length > 0) {
          const bankDetails = data.bank_details[0];
          setForm({
            bankName: bankDetails.bank_name || '',
            ifscCode: bankDetails.IFSC || '',
            branchName: bankDetails.branch_name || '',
            accountNumber: bankDetails.acc_number || '',
            aadharNumber: bankDetails.aadhar_no || '',
            pancardNumber: bankDetails.pan_number || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleIfsc = async () => {
  //   const ifscPattern = /^[A-Z]{4}0[0-9]{6}$/;
  //   if (!ifscPattern.test(form.ifscCode)) {
  //     setErrors((prevErrors) => ({ ...prevErrors, ifscCode: "Invalid IFSC Code" }));
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       bankName: '',
  //       branchName: ''
  //     }));
  //     return;
  //   }

  //   setErrors((prevErrors) => ({ ...prevErrors, ifscCode: undefined }));
  //   try {
  //     const res = await fetch(`https://ifsc.razorpay.com/${form.ifscCode}`);
  //     if (!res.ok) {
  //       throw new Error("Invalid IFSC Code");
  //     }
  //     const response = await res.json();
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       bankName: response.BANK,
  //       branchName: response.BRANCH
  //     }));
  //   } catch (error) {
      
  //     toast.error('An error occurred while validating IFSC code');
  //   }
  // };

  // const validateForm = () => {
  //   let formErrors = {};
  //   const accountNumberPattern = /^\d{9,18}$/;
  //   const aadharNumberPattern = /^\d{12}$/;
  //   const pancardNumberPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
   
  //   if (!accountNumberPattern.test(form.accountNumber)) {
  //     formErrors.accountNumber = "Invalid Account Number";
  //   }
  //   if (!aadharNumberPattern.test(form.aadharNumber)) {
  //     formErrors.aadharNumber = "Invalid Aadhaar Number";
  //   }
  //   if (!pancardNumberPattern.test(form.pancardNumber)) {
  //     formErrors.pancardNumber = "Invalid PAN Card Number";
  //   }

  //   return formErrors;
  // };

const [bankDetails,setBankDetails] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formErrors = validateForm();

    // if (Object.keys(formErrors).length === 0) {
      try {
        const bankData = {
          userid: Cookies.get('agentUserid'),
          // username:Cookies.get('agentUserid'),
          BANK: form.bankName,
          IFSC: form.ifscCode,
          BRANCH: form.branchName,
          
          acc_number: form.accountNumber,
          aadhar_no: form.aadharNumber,
          pan_number: form.pancardNumber,
         
        };


        const res = await fetch(`${baseUrl}/agent/agent_bank_details_api/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bankData)
        });

        const bankRes = await res.json();

        if (bankRes.error) {
          toast.error(bankRes.error || "failed to add bank details");
      } else {
          if (bankRes.message ) {
              // Cookies.set('bankDetails', 'true');
              Cookies.set('bankDetails', JSON.stringify({
                success: true,
                member_name: bankRes.member_name,
                username: bankRes.username
            }));
              setBankDetails(true)
             setTimeout(() => {
              handleNextstep();
             }, 0); 
           } 
      }   
      } catch (error) {
        console.error("agent bank details api err", error);
      }
    
  };

  const handleNextstep = () => navigate("/nomineedetails");
  return (
    <div>
     <AgentNavbar/>
     <ToastContainer
     autoClose={4000} />
     <Col lg={11} className="sidenav2">
                    <div className="headingagentinfo">
                        <h6>{translations[language].bankdetails}</h6>
                    </div>
                </Col>
      <Container>
        <Form onSubmit={handleSubmit} >
          <Row className="justify-content-md-center">
            <Col md lg="6">
              <FloatingLabel controlId="floatingIFSCCode" label={translations[language].ifsccode} className="input1 mb-3">
                <Form.Control
                  type="text"
                  name="ifscCode"
                  className="inputs"
                  value={form.ifscCode}
                  onChange={handleChange}
                  // onBlur={handleIfsc}
                  // isInvalid={!!errors.ifscCode}
                  required
                  readOnly
                />
                <Form.Control.Feedback type="invalid">{errors.ifscCode}</Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel controlId="floatingBankName" label={translations[language].bankname} className="input1 mb-3">
                <Form.Control
                  type="text"
                  name="bankName"
                  className="inputs"
                  value={form.bankName}
                  onChange={handleChange}
                  readOnly
                  isInvalid={!!errors.bankName}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.bankName}</Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel controlId="floatingBranchName" label={translations[language].branchname} className="input1 mb-3">
                <Form.Control
                  type="text"
                  name="branchName"
                  className="inputs"
                  value={form.branchName}
                  onChange={handleChange}
                  readOnly
                  isInvalid={!!errors.branchName}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.branchName}</Form.Control.Feedback>
              </FloatingLabel>
              {/* -------------------------------------------------------- */}
            {/* <AttachBtn/> */}
              {/*--------------------------------------------------  */}
            </Col>

            <Col md lg="6">
              <FloatingLabel controlId="floatingAccountNumber" label={translations[language].accountnumber} className="input1 mb-3">
                <Form.Control
                  type="text"
                  name="accountNumber"
                  className="inputs"
                  maxLength={18}
                  value={form.accountNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.accountNumber}
                  required
                  readOnly
                />
                <Form.Control.Feedback type="invalid">{errors.accountNumber}</Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel controlId="floatingAadharNumber" label={translations[language].aadharnumber} className="input1 mb-3">
                <Form.Control
                  type="text"
                  name="aadharNumber"
                  className="inputs"
                  maxLength={12}
                  value={form.aadharNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.aadharNumber}
                  required
                  readOnly
                />
                <Form.Control.Feedback type="invalid">{errors.aadharNumber}</Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel controlId="floatingPancardNumber" label={translations[language].pancardnumber} className="input1 mb-3">
                <Form.Control
                  type="text"
                  name="pancardNumber"
                  className="inputs"
                  maxLength={10}
                  value={form.pancardNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.pancardNumber}
                  required
                  readOnly
                />
                <Form.Control.Feedback type="invalid">{errors.pancardNumber}</Form.Control.Feedback>
              </FloatingLabel>
            </Col>
            <div style={{display:'flex',justifyContent:'center'}} className="mt-2">
              <Button type="submit" style={{ backgroundColor: '#198754', color: '#fff', border: 'none' }}>{translations[language].confirm}</Button>
            </div>
          </Row>
        </Form>

      </Container>
    </div>
  );
}

export default Bankdetails;
