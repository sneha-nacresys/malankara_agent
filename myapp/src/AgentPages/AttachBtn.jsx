import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Row, Col, Form, FloatingLabel, Button, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AgentNavbar from '../AgentNavbar/AgentNavbar'
import "./createagent.css";

//import baseUrl from "../ConstUrl/url";

function AttachBtn() {

  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  

  useEffect(() => {
    const adminbankDetails = Cookies.get('adminBankDetails');
    if (adminbankDetails === 'true') {
      toast.success('Bank details added successfully');
      Cookies.remove('adminBankDetails');
    //   const timeout = setTimeout(() => {
    //     Cookies.remove('adminBankDetails');
    //   }, 2000);
    //   return () => clearTimeout(timeout);
    }
  }, []);

  const [username] = useState(Cookies.get('agentUserid') || '');
  // const [username, setUsername] = useState(Cookies.get('agentUserid') || '');
  const [show, setShow] = useState(false);
  const [aadhar, setAadhar] = useState(null);
  const [pancard, setPancard] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [passbook, setPassbook] = useState(null);

  const clearForm = () => {

    setAadhar(null);
    setPancard(null);
    setPhoto(null);
    setPassbook(null);
  };

 

  const handleAadharChange = (e) => setAadhar(e.target.files[0]);
  const handlePancardChange = (e) => setPancard(e.target.files[0]);
  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);
  const handlePassbookChange = (e) => setPassbook(e.target.files[0]);
  const [adminAddDoc, setAdminAddDoc] = useState(false)
  const handleUpload = async (event) => {
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }
    }

    try {
      const formData = new FormData();
      // formData.username = username;
      // formData.aadhar_card = aadhar;
      // formData.pancard = pancard;
      // formData.photo = photo;
      // formData.bank_passbook = passbook;

      formData.append('username', username);
      formData.append('aadhar_card', aadhar);
      formData.append('pancard', pancard);
      formData.append('photo', photo);
      formData.append('bank_passbook', passbook);

     
      const response = await fetch(`${baseUrl}/agent/add_agent_files`, {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // },

        body: formData,
        // body: JSON.stringify({
        //     username: username,
        //     aadhar_card: aadhar,
        //     pancard: pancard,
        //     photo: photo,
        //     bank_passbook: passbook,
        // }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload files');
      } else {
        const responseData = await response.json();
        if (responseData.message) {

          Cookies.set('adminAddDoc', 'true');
          toast.success('Files uploaded successfully');
          clearForm();
          setAdminAddDoc(true)
          setTimeout(() => {
            navigate('/nomineedetails')
          }, 0);
        }
        else {
          Cookies.set('adminAddDoc', 'false');
          toast.error('Adding bank details failed');
        }
      }

    } catch (error) {
      console.error('File upload error', error);
    }
  };

  return (
    <>
     <AgentNavbar/>
     <ToastContainer autoClose={1000}/>
     <Col lg={11} className="sidenav2">
                    <div className="headingagentinfo">
                        <h6>Upload documents</h6>
                    </div>
                </Col>
      <Container>
        <Row>
          <Col>

            <Form encType="multipart/form-data" onSubmit={handleUpload}>
              <div className="pancardsec">
                {/* <p style={{ textAlign: 'left', fontSize: '12px' }}>Upload Required Files</p> */}
                <Row>
                  <Col lg={3}></Col>
                  <Col lg={6} md={12}>
                    <FloatingLabel controlId="floatingInput" label="Upload Aadharcard's" style={{ fontSize: '13px', color: 'black' }} className="input1 mb-3">
                      <Form.Control type="file" name="aadhar" className="inputs" onChange={handleAadharChange} />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Upload Pancard's" style={{ fontSize: '13px', color: 'black' }} className="input1 mb-3">
                      <Form.Control type="file" name="pancard" className="inputs" onChange={handlePancardChange} />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Upload Photo" style={{ fontSize: '13px', color: 'black' }} className="input1 mb-3">
                      <Form.Control type="file" name="photo" className="inputs" onChange={handlePhotoChange} />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Upload Bank passbook" style={{ fontSize: '13px', color: 'black' }} className="input1 mb-3">
                      <Form.Control type="file" name="bank_passbook" className="inputs" onChange={handlePassbookChange} />
                    </FloatingLabel>
                        <div className='mt-2' style={{display:'flex',justifyContent:'center'}}>
                    <Button style={{ backgroundColor: '#198754', color: '#fff', border: 'none' }} type="submit">
                      Upload
                    </Button>
                    </div>

                  </Col>
                  <Col lg={3}></Col>
                </Row>
              </div>



            </Form>

          </Col>


        </Row>
      </Container>
    </>
  );
}

export default AttachBtn;