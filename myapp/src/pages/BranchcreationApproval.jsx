import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import malankara from "../components/MALANKARA.webp";
// import logout from '../components/logout.png'
import AdminNavbar from '../AdminNavbar/AdminNavbar'

import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import Cookies from "js-cookie";
import NavDropdown from "react-bootstrap/NavDropdown";
import LoadingSpinner from "./LoadingSpinner";
import Button from "@mui/material/Button";
import React from "react";
import Row from "react-bootstrap/Row";
import Badge from "@mui/material/Badge";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Col from "react-bootstrap/Col";
import { Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createagent.css";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';

function BranchcreationApproval() {
  useEffect(() => {
    // Check if the message has already been shown
    const loggedInStatus = Cookies.get("loggedIn");
    if (loggedInStatus === "true") {
      toast.info("Logged in successfully");
      // Clear the login status
      const timeout = setTimeout(() => {
        // Clear the loggedIn cookie after 5000 milliseconds (5 seconds)
        Cookies.remove("loggedIn");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, []);



  const navigate = useNavigate();






  const handleClick = () => {
    navigate("/");
  };

  const handleSchemelist = () => {
    navigate("/schemefulllist");
  };
 


  const handleApprovals=()=>{
    navigate('/approvals')
  }
const handleSchememaster=()=>{
    navigate('/newschememaster')
}
const handleAgentmanagement=()=>{
    navigate('/agentmanagement')
}

const handleAgentinfoapproval=()=>{
  navigate('/agentinfoapproval')
}
const handleDuepromotion=()=>{
  navigate('/duepromotionapproval')
}
const handleTreeshiftapproval=()=>{
  navigate('/treeviewapproval') 
}
const handleAgentreports=()=>{
  navigate('/agentreportapproval')
}
const handleTargetsetting=()=>{
  navigate('/targetsettingapproval')
}
const handleBranchcreation=()=>{
  navigate('/branchcreationapproval')
}

const handleCreateuser=()=>{  
  navigate('/createuserapproval')
}
const handleCreateagent=()=>{
   navigate('/createagentapproval')
}
const handleRights=()=>{
  navigate('/rightsapproval')
}
const handleSchememasterapproval=()=>{
  navigate('/schememasterapproval')
}
// -----------------------------------------------------
const [show, setShow] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);





const [animate, setAnimate] = useState(false);
// // -------------------modal1-----------------------
// const [show, setShow] = useState(false);

//   const handleClose = () =>{
//     setShow(false);
//     setShowduepromotion(false)
//     setTreeview(false)
//   }     
//   const handleShow = () => setShow(true);

// //   ------------------------------modal 2------------------
// const [showDuepromotion,setShowduepromotion]=useState(false)
// const handleShowDuepromotion=()=>{
//     setShowduepromotion(true)
// }
// // --------------------modal 3--------------------------
// const [showTreeview,setTreeview]=useState(false)
// const handleShowTreeview =()=>{
//     setTreeview(true)
// }
// // ---------------------------modal 4---------------------------------
 






// -------------------------------------profile views-------------------------
const [profileview,setProfileview]=useState(false)
const handleProfile=()=>{
  setProfileview(true)
}
const handleCloseprofile=()=>{
  setProfileview(false)
}

  return (
    <>
    <div className="main" style={{height:"90vh"}}>
     
      <ToastContainer />
      <AdminNavbar/>


    
      <Row className='adminBtnRowoffcanvas' >

{/* 
        <Col lg={1} className="adminBtnColoffcanvas">
  <button  className="adminBtn1offcanvas"> Create Agent  Approval</button>

  <button className="adminBtn1offcanvas" onClick={handleAgentinfoapproval}>Agent Info Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleTreeshiftapproval}  >Tree Shift Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleBranchcreation} style={{background:"green",border:"2px solid black",boxShadow:"5px 3px 4px 2px"}}>Branch Creation Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleDuepromotion}>Due Promotion Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleSchememasterapproval}>Scheme Master Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleTargetsetting}>Target Setting Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleRights}>Rights Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleCreateuser}>Create User Approval</button>
  <button className="adminBtn1offcanvas" onClick={handleCreateagent}>Create Agent Approval</button>

</Col> */}
  <Col sm={8} lg={11} className="sidenav2">
            <div className="headingagentinfo" style={{ marginTop: "-30px" }}>
              <h5>Branch Creation Approval</h5>
            </div>
          </Col>
          </Row>
          <Row>
            <Col lg={11}>
      <div style={{display:"flex",justifyContent:"center"}}>
      <table style={{width:"1200px"}}>
            <thead>
            <th style={{backgroundColor:"#e1e1e1"}}>
                    Employee ID
                  </th>
              <th style={{backgroundColor:"#e1e1e1"}}>
                    Employee Name
                  </th>
                  <th style={{backgroundColor:"#e1e1e1"}}>
                 Intro   Employee ID
                  </th>
                  <th style={{backgroundColor:"#e1e1e1"}}>
                  Intro  Employee Name
                  </th>
                  <th style={{backgroundColor:"#e1e1e1"}}>
                    State 
                  </th>
                  <th style={{backgroundColor:"#e1e1e1"}}>
                    Branch 
                  </th>
                  <th style={{backgroundColor:"#e1e1e1"}}>
                   Division Head
                  </th>
                  <th style={{backgroundColor:"#e1e1e1"}}>
                    Approve
                  </th>
            </thead>
            <tbody>
            <td>009</td>
                  <td>
                   Jithin
                  </td>
                <td>
                  004
                </td>
              <td>Sumesh</td>
              <td>Kerala</td>
              <td>Thrissur</td>
              <td>Rajeev</td>
              <td><input type="checkbox" /></td>
            </tbody>
          </table>
      </div>
</Col>

 




































</Row>

    {/* --------------------------off canvas------------- */}
    <Offcanvas show={show} onHide={handleClose} style={{ width: "200px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Approvals List</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="ms-4">
          <Row className="adminBtnRowoffcanvas">
            <Col lg={1} className="adminBtnColoffcanvas">
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleCreateagent}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
              Create Employee 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleAgentinfoapproval}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
              Employee Info 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleTreeshiftapproval}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
              Designation Chart
              </Badge>
            </Button>
               
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleBranchcreation}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
               Branch 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleDuepromotion}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
               Due Promotion 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleSchememasterapproval}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
               Product master 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleTargetsetting}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
               Target 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleRights}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
               Rights 
              </Badge>
            </Button>
            <Button
              className="adminBtn1"
              variant="contained"
              onClick={handleCreateuser}
              disableElevation
            >
               <Badge color="warning" badgeContent={10}>
               Create User 
              </Badge>
            </Button>
             
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>

    </div>

    <Modal  show={profileview} onHide={handleClose}>
        
        <Modal.Body  style={{background:"#e1e1e1"}}>
        <Row className="ms-2">
        <Col lg={12}>
    
      <MDBContainer className="h-100 w-100">
        <MDBRow className="justify-content-center align-items-center h-100 w-100">
          <MDBCol >
            <MDBCard style={{ borderRadius: '15px'}}>
              <MDBCardBody className="text-center">
                <div className="mt-3 mb-4">
                  <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                    className="rounded-circle" fluid style={{ width: '100px' }} />
                </div>
                <MDBTypography tag="h4">Admin</MDBTypography>
                <MDBCardText className="text-muted mb-4">
                admin @ MALANKARA<span className="mx-2">|</span> <a href="#!">admin@123.com</a>
                </MDBCardText>
               
                {/* <div className="d-flex justify-content-between text-center mt-5 mb-2">
                  <div>
                    <MDBCardText className="mb-1 h5">8471</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Wallets Balance</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">8512</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5">4751</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Total Transactions</MDBCardText>
                  </div>
                </div> */}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    
        </Col>
      </Row>
     <div className="mt-2" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
     <Button variant="secondary" onClick={handleCloseprofile} style={{background:"rgba(29, 58, 175, 1)",color:"white"}}>
            Close
          </Button>
     </div>
        </Modal.Body>
      
      </Modal>  
      {/* ----------------------------------------------------------------------------- */}
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
   <Button className="shiftagentleg" style={{background:"rgba(29, 58, 175, 1)",color:"white"}}>Save</Button>
   </div>
    </>
  );
}

export default BranchcreationApproval;


















































