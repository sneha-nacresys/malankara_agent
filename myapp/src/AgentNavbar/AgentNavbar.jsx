import React, { useState, useEffect ,useRef} from 'react';
import { Navbar, Nav ,Container} from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import {  MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography,} from 'mdb-react-ui-kit';
import Modal from 'react-bootstrap/Modal';
import { deepOrange, deepPurple } from '@mui/material/colors';
//import malankara from "../components/MALANKARA.webp";

import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import translation from "../pages/translation";
import translationMal from "../pages/translationMal";
//import baseUrl from "../ConstUrl/url";
import Badge from '@mui/material/Badge';

function HeaderAgent() {
  
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  // -------------------------------------profile views-------------------------
  const [profileview, setProfileview] = useState(false)

  const handleCloseprofile = () => {
    setProfileview(false)
  }
  const [initials, setInitials] = useState('');
  const baRoleId = Cookies.get('userRoleId');

  const handleProfile = () => {
    setProfileview(true)
    const agentId = Cookies.get('masterUsername')
    const masterInitials = agentId.slice(0, 2).toUpperCase();
    setInitials(masterInitials);
    const userRoleId = Cookies.get('userRoleId');
    const userRoleName = Cookies.get('userRoleName');
    const userEmail = Cookies.get('empEmail');

   

  }





  const handleFaq = () => {
    navigate('/agentfaq')
  }
  const handleLogout = async () => {

    const mainUserid = Cookies.get('masterUserid');

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
        Object.keys(Cookies.get()).forEach(function(cookieName) {
          Cookies.remove(cookieName);
        });

        // Object.keys(Cookies.get()).forEach(function(cookieName) {
        //   Cookies.remove(cookieName);
        // });

        localStorage.clear();
        sessionStorage.clear();
        Cookies.remove('masterUserid');
        Cookies.remove('masterUsername');
        Cookies.remove('agentUserid');
        Cookies.remove('userLevel');
        Cookies.remove('userRoleId');
        Cookies.remove('userRoleName');
        Cookies.remove('empEmail');
        Cookies.set('loggedIn', 'false');
        Cookies.set('loggedOut', 'true');
        navigate('/');
      } else {
        toast.error('Error logging out: ' + response.error);
      }
    } catch (error) {
      toast.error('Error logging out: ' + error.message);
    }
  };




  const translations = {
    en: translation,
    mal: translationMal,

  };
  const [language, setLanguage] = useState("en");
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    Cookies.set("language", selectedLanguage);
  };


  useEffect(() => {
    setLanguage(Cookies.get("language") || "en");
  }, [])

  const faqCount = Cookies.get('agentFAQCount');

const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };

    // Adding both mousedown and touchstart event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  return (
    <>
      <Navbar collapseOnSelect expand="lg" variant="tabs" className="navbar" ref={navbarRef}>
       <Container fluid className='agent-navabar'>
          <Navbar.Brand href="/#/dashboard">
            <img
              src={`${process.env.PUBLIC_URL}/assets/MALANKARA.jpg`}
              alt="Malankara logo"
              style={{ width: "50px", height: "40px" }}
            />
          </Navbar.Brand>
  
          {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav"> */}
           <Navbar.Toggle 
          aria-controls="responsive-navbar-nav" 
          onClick={() => setNavbarOpen(!navbarOpen)} 
        />
        <Navbar.Collapse id="responsive-navbar-nav" in={navbarOpen}  style={{backgroundColor:"gray",width:"100%", top:"0"}}>
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/dashboard")}>
                {translations[language].dashboard}
              </Nav.Link>
              <NavDropdown title={translations[language].employee} id="nav-dropdown" >
  
               {baRoleId != '1' && ( <NavDropdown.Item onClick={() => navigate("/nextstep")}>
                  {translations[language].createemployee}
                </NavDropdown.Item>)}
  
                <NavDropdown.Item onClick={() => navigate("/baBelowdata")}>
                  {translations[language].employeedesignationchart}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/agentpasswordreset")}>
                  {translations[language].passwordrest}
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={translations[language].product} id="nav-dropdown">
                <NavDropdown.Item onClick={() => navigate("/agentproductlist")}>
                  {translations[language].productlist}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/agentincentivelist")}>
                  {translations[language].productincentivelist}              
                  </NavDropdown.Item>
  
              </NavDropdown>
            </Nav>
            <Nav className="me-right">
          
              <Nav.Link style={{ cursor: "pointer" }} className='mb-1' onClick={handleFaq}>
              <Badge color="secondary" badgeContent={faqCount}> {translations[language].askquestion}
              </Badge>
              </Nav.Link>
             
  
  
              <Nav.Link href="tel:987654321">  <span>  {translations[language].helplinenumber}: </span>987654321</Nav.Link>
              <Stack direction="row" spacing={1} className='profile-icon'>
  
                <Avatar sx={{ bgcolor: deepPurple[500] ,width:'35px',height:'35px'}} style={{ cursor: "pointer"}} onClick={handleProfile}>{initials}</Avatar>  
                </Stack>

            </Nav>

            <FontAwesomeIcon
              onClick={handleLogout}
              icon={faSignOutAlt}
              style={{
                cursor: "pointer",
                color: "white",
                marginLeft: "10px",
                fontSize: "24px",
                paddingRight: "20px",
                marginTop:'5px'
              }}
            />
          </Navbar.Collapse>
       </Container>
      </Navbar>

      {/* --------------------------------------------------------------------------- */}
      {/* --------------------------------------------------------------------------- */}
      <Modal show={profileview} onHide={handleCloseprofile} >
        <Modal.Body style={{ background: "#e1e1e1", borderRadius: '15px' }}>

          <MDBCard style={{ borderRadius: '15px' }}>
            <MDBCardBody className="text-center">
              <div >
                <MDBCardImage
                  src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.webp"
                  className="rounded-circle"
                  fluid
                  style={{ width: '100px' }}
                />
              </div>
              <MDBTypography tag="h4">{translations[language].username} : {Cookies.get('masterUsername')}
              </MDBTypography>
              <MDBTypography tag="h6"> {translations[language].userid} : {Cookies.get('masterUserid')}</MDBTypography>
              <MDBCardText className="text-muted">
                <p className='fw-bold'>{translations[language].designation} : {Cookies.get('userRoleName')}</p>
                <p>
                {translations[language].emailid} :
                  <a href="#!"> {Cookies.get('empEmail')}</a>

                </p>                </MDBCardText>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '8px' }}>
                <Button variant="secondary" onClick={handleCloseprofile} style={{ background: "rgba(29, 58, 175, 1)", color: "white" }}>
                {translations[language].close}
                </Button>
              </div>

            </MDBCardBody>
          </MDBCard>
        </Modal.Body>
      </Modal>


    </>
  )
}

export default HeaderAgent