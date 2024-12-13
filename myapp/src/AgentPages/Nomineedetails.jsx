import React, { useState, useEffect } from "react";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "@mui/material/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Cookies from 'js-cookie';
import AgentNavbar from '../AgentNavbar/AgentNavbar';
import "./createagent.css";
import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
//import baseUrl from "../ConstUrl/url";
import { Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



const Nomineedetails = () => {

  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  // useEffect(() => {
  //   const addProof = Cookies.get('addDoc');
  //   if (addProof === 'true') {
  //     toast.success('Added documents successfully');
  //     Cookies.remove('addDoc');
  //     // const timeout = setTimeout(() => {
  //     //   Cookies.remove('addDoc');
  //     // }, 2000);
  //     // return () => clearTimeout(timeout); // Cleanup function
  //   }
  // }, []);

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
  //   const adminBankDetails = Cookies.get('bankDetails');
  //   if (adminBankDetails === 'true') {
  //     toast.success(`${translations[language].bankdetailsadded}`);
  //     Cookies.remove('bankDetails');
  //   }
  // }, []);
  useEffect(() => {
    const bankDetailsCookie = Cookies.get('bankDetails');
    if (bankDetailsCookie) {
        const { success, member_name, username } = JSON.parse(bankDetailsCookie);
        if (success) {
            const successMessage = ` ${member_name} - ${username} : ${translations[language].bankdetailsadded} :`;
            toast.success(successMessage);
            Cookies.remove('bankDetails');
        }
    }
}, []);




useEffect(() => {
  const errorNominee = Cookies.get('createAgentNomineeDet');
  if (errorNominee) {
      const data = JSON.parse(errorNominee);
      if (data.error) {
          toast.error(`${data.member_name} - ${data.username}:${translations[language].nomineenotadded}`);
      }
      Cookies.remove('createAgentNomineeDet');
  }
}, [navigate]);

//   useEffect(() => {
//     const cookieData = Cookies.get('createAgentNomineeDet');
   

  
//     // if (cookieData) {
//     //     const data = JSON.parse(cookieData);
//     //     if (data.error) {
//     //         toast.error(data.error);
//     //     }        
//     //     Cookies.remove('createAgentNomineeDet');
//     // }
// }, [navigate]);
 

const [usernamenom, setUsernamenom] = useState('');
const [passwordnom, setPasswordnom] = useState('');


  const [form, setForm] = useState({
    nomineeName: '',
    relationship: '',
    age: '',
    address: '',
    phone: '',
    city: '',
    pincode: '',
    state: '',
    aadharNum: '',
    panNum: '',
  });

  const [errors, setErrors] = useState({});

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
        
        if (data.nominee_details && data.nominee_details.length > 0) {
          const nomineeDetails = data.nominee_details[0];
          setForm({
            nomineeName: nomineeDetails.nominee_name || '',
            relationship: nomineeDetails.relationship || '',
            age: nomineeDetails.age || '',
            address: nomineeDetails.address || '',
            phone: nomineeDetails.mobile || '',
            city: nomineeDetails.city || '',
            pincode: nomineeDetails.pincode || '',
            state: nomineeDetails.state || '',
            aadharNum: nomineeDetails.aadhar_no || '',
            panNum: nomineeDetails.pan_number || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // setErrors({ ...errors, [e.target.name]: undefined });
  };

  // const validateForm = () => {
  //   let formErrors = {};
  //   const pincodePattern = /^\d{6}$/;
  //   const agePattern = /^\d{1,2}$/;
  //   const phonePattern = /^\d{10}$/;
  //   const aadharNumberPattern = /^\d{12}$/;
  //   const pancardNumberPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  //   if (!pincodePattern.test(form.pincode)) {
  //     formErrors.pincode = "Invalid Pincode (6 digits required)";
  //   }

  //   if (!agePattern.test(form.age) || parseInt(form.age) < 18) {
  //     formErrors.age = "Age must be above 18";
  //   }

  //   if (!phonePattern.test(form.phone)) {
  //     formErrors.phone = "Invalid Phone Number (10 digits required)";
  //   }

  //   if (!aadharNumberPattern.test(form.aadharNum)) {
  //     formErrors.aadharNumber = "Invalid Aadhaar Number";
  //   }

  //   if (!pancardNumberPattern.test(form.panNum)) {
  //     formErrors.panNum = "Invalid PAN Card Number";
  //   }

  //   return formErrors;
  // };

  const [nomineeAdd, setNomineeAdd] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');


  const [modalContent, setModalContent] = useState({
    userId: '',
    username: '',
    password: '',
    memberName: '',
    message: '',
  });
  
  const handleNominee = async (e) => {
    e.preventDefault();
    // const errors = validateForm();

    // if (Object.keys(errors).length === 0) {
      try {
        const formData = {
          userid: Cookies.get('agentUserid'),
          // username:Cookies.get('agentUserid'),
          nominee_name: form.nomineeName,
          age: form.age,
          relationship: form.relationship,
          address: form.address,
          state: form.state,
          city: form.city,
          pincode: form.pincode,
          aadhar_no: form.aadharNum,
          pan_number: form.panNum,
          mobile: form.phone
        };

        const res = await fetch(`${baseUrl}/agent/add_nominee_details/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const message = await res.text();
          throw new Error(message);
        }
        const data = await res.json();
        // toast.success(data.message);
        if (data.message) {

          setModalContent({
            username: data.username,
            password: data.password,
            memberName: data.member_name,
            message: data.success_message
          });

          // Cookies.set('nomineeAdd', 'true');
          // // toast.success(translations[language].nomineeadded);
          // setNomineeAdd(true)
          // Cookies.remove('agentUserid');

          // setTimeout(() => {
          //   navigate('/dashboard')
          // }, 0);

        setMessage(data.message);
        setShowModal(true);

        } else {
          Cookies.set('nomineeAdd', 'false');
          toast.error();
        }


      } catch (error) {
        toast.error('Failed to add nominee details: ' + error.message);
      }
    // } else {
    //   setErrors(errors);
    // }
  };

  const handleConfirm = () => {
    const message = `${modalContent.username} - ${modalContent.memberName}: ${translations[language].allempdetailsadded}`;
    Cookies.set('nomineeAdd', message);
    setShowModal(false);
    navigate('/dashboard'); 
  };

  const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

  return (
    <div>
      <AgentNavbar />
      <ToastContainer 
      autoClose={4000}/>
      <Col lg={11} className="sidenav2">
        <div className="headingagentinfo">
          <h6>{translations[language].nomineedetails}</h6>
        </div>
      </Col>
      <Container>
        <Form onSubmit={handleNominee}>
          <Row className="justify-content-md-center">
            <Col md lg="6">
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].nomineename}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  name="nomineeName"
                  className="inputs"
                  value={form.nomineeName}
                  onChange={handleChange}
                  readOnly
                  // isInvalid={!!errors.nomineeName}
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].relationship}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  name="relationship"
                  className="inputs"
                  value={form.relationship}
                  onChange={handleChange}
                  // isInvalid={!!errors.relationship}
                  required
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].age}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  name="age"
                  className="inputs"
                  value={form.age}
                  onChange={handleChange}
                  // isInvalid={!!errors.age}
                  required
                  readOnly
                />
                <Form.Control.Feedback type="invalid">
                  {errors.age}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingTextarea2"
                label={translations[language].address}
                className="input1"
              >
                <Form.Control
                  as="textarea"
                  className="inputs"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  // isInvalid={!!errors.address}
                  required
                  readOnly
                />
              </FloatingLabel>
              <br />
              <FloatingLabel
                controlId="floatingTextarea2"
                label={translations[language].phonenumber}
                className="input1"
              >
                <Form.Control
                  type="text"
                  maxLength={12}
                  className="inputs"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  // isInvalid={!!errors.phone}
                  required
                  readOnly
                />
                {/* <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback> */}
              </FloatingLabel>
            </Col>
            <Col md lg="6">
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].city}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  className="inputs"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  // isInvalid={!!errors.city}
                  required
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].pincode}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  className="inputs"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  isInvalid={!!errors.pincode}
                  required
                  readOnly
                />
                {/* <Form.Control.Feedback type="invalid">
                  {errors.pincode}
                </Form.Control.Feedback> */}
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].state}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  className="inputs"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  // isInvalid={!!errors.state} // Corrected typo here
                  required
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].aadharnumber}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  className="inputs"
                  name="aadharNum"
                  value={form.aadharNum}
                  // onChange={handleChange}
                  isInvalid={!!errors.aadharNum}
                  required
                  readOnly
                />
                {/* <Form.Control.Feedback type="invalid">
                  {errors.aadharNum}
                </Form.Control.Feedback> */}
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translations[language].pancardnumber}
                className="input1 mb-3"
              >
                <Form.Control
                  type="text"
                  maxLength={10}
                  className="inputs"
                  name="panNum"
                  value={form.panNum}
                  onChange={handleChange}
                  // isInvalid={!!errors.panNum}
                  required
                  readOnly
                />
                {/* <Form.Control.Feedback type="invalid">
                  {errors.panNum}
                </Form.Control.Feedback> */}
              </FloatingLabel>
            </Col>
            <div className="mt-2" style={{display:'flex',justifyContent:'center'}}>
              <Button style={{ backgroundColor: '#198754', color: '#fff', border: 'none' }} type="submit">{translations[language].confirm}  </Button>
            </div>
          </Row>
        </Form>
      </Container>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static" // Prevent closing by clicking outside
        keyboard={false} // Prevent closing with ESC key
      >
          <Modal.Header>
          <Modal.Title>
  {`${modalContent.username} - ${modalContent.memberName}: ${translations[language].nomineedetailsadded}`}
</Modal.Title>
        </Modal.Header>
        <Modal.Body >
   <p>Member Name: {modalContent.memberName}</p>
    <p>Username: {modalContent.username}</p>
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Label on the side */}
            <label style={{ marginRight: '10px'}}>Password:</label>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={modalContent.password}
                    readOnly
                    style={{ paddingRight: '40px' ,border:'none'}} 
                />
                <span
                    className="password-toggle-icon"
                    style={{ position: 'absolute', top: '50%', right: '70px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    onClick={togglePasswordVisibility}
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
            </div>
        </div>
    {/* <p>Message: {modalContent.message}</p> */}
         
        </Modal.Body>
        <Modal.Footer>
        <Button
            variant="success"
            onClick={handleConfirm}
            style={{ background: "rgba(29, 58, 175, 1)", color: "white",text:'center' }}
          >
            Ok &#8608;
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Nomineedetails;
