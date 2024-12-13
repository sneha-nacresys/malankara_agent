import React, { useState, useEffect } from "react";
import {

  Row,
  Col,
  Container

} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./createagent.css";
// import { Snackbar } from '@mui/material';
import Cookies from 'js-cookie';
import AgentNavbar from '../AgentNavbar/AgentNavbar'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
//import baseUrl from "../ConstUrl/url";
import {
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Navbar, Nav } from "react-bootstrap";


function AgentTermsandCondition() {
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_URL;

  const [language, setLanguage] = useState("en");


  const translations = {
    en: translation,
    mal: translationMal,

  };


  useEffect(() => {
    setLanguage(Cookies.get("language") || "en");
  }, [])

  // ==========================================
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = Cookies.get('termsUserId'); // Assuming 'masterUserid' is your username cookie name
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      toast.error(translations[language].usernotfound);
    }
  }, []);
   

  const handleAgree = async()=>{
    const storedUsername = Cookies.get('termsUserId'); 

    const data ={
      AgentId : storedUsername
    }
    try {
      const response = await fetch(
        `${baseUrl}/adminmanage/Accept_agreement/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const res = await response.json();

      if (res.message) {
        toast.success(res.message);
       

        setTimeout(async () => {
          localStorage.setItem('termSuccessMessage', res.message);
          await handleLogout();
        }, 500);

      } else if (res.error) {

        toast.error(res.error);
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  const [termsandConditionsView, setTermsandConditionsView] = useState("");


  const fetchTermsandConditions = async () => {

    try {
      const response = await fetch(
        `${baseUrl}/adminmanage/AgentAgreementList/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        }
      );

      const res = await response.json();

      if (res.data && res.data.length > 0) {

        setTermsandConditionsView(res.data[0].criteria);

      } else if (res.error) {

        toast.error(res.error);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  useEffect(() => {
    fetchTermsandConditions();
  }, []);


  const handleLogout = async () => {

    const mainUserid = username;

    if (!mainUserid) {
      toast.error('User ID not found');
      return;
    }

    const data = {
      userid: mainUserid
    };

    try {
      const res = await fetch(`${baseUrl}/login/logout_api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (response.status === 0) {

        navigate('/');

        setTimeout(async () => {
          Object.keys(Cookies.get()).forEach(function (cookieName) {
            Cookies.remove(cookieName);
          });
          localStorage.clear();
          sessionStorage.clear();
        }, 3000);
        Cookies.set('loggedIn', 'false');
        Cookies.set('loggedOut', 'true');
      
       
      } else {
        toast.error('Error logging out: ' + response.error);
      }
    } catch (error) {
      toast.error('Error logging out: ' + error.message);
    }
  };
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" variant="tabs" className="navbar" >
        <Container fluid className='agent-navabar'>
          <Navbar.Brand >
            <img
              src={`${process.env.PUBLIC_URL}/assets/MALANKARA.jpg`}
              alt="Malankara logo"
              style={{ width: "50px", height: "40px" }}
            />
          </Navbar.Brand>



          <Nav className="ms-auto">

            <FontAwesomeIcon
              onClick={handleLogout}
              icon={faSignOutAlt}
              style={{
                cursor: "pointer",
                color: "white",
                marginLeft: "10px",
                fontSize: "24px",
                paddingRight: "20px",
                marginTop: '5px'
              }}
            />
          </Nav>
        </Container>
      </Navbar>



      <Row className="d-flex justify-content-center  ms-3 ">
        <Col lg={11} className="sidenav2 main-header-div " >
          <div className="faq-headers ">
            <h5>{translations[language].businessAssociateJoiningCriteria}</h5>
          </div>
        </Col>
      </Row>
      <ToastContainer autoClose={2000} />
      <Container>
        <Row className="mx-1">
          <div className="border p-3" style={{ whiteSpace: "pre-wrap", fontSize: "12px"}}>
            {termsandConditionsView || "No terms and conditions available"}
          </div>


          <div className="pswd-btn d-flex justify-content-center">

            <button style={{ fontSize: "12px" }} onClick={handleAgree}>  {translations[language].iagree}</button>
          </div>
        </Row>
      </Container>


    </div>
  )
}

export default AgentTermsandCondition