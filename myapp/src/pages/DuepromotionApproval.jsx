import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from '../AdminNavbar/AdminNavbar'
import Badge from "@mui/material/Badge";
import Offcanvas from "react-bootstrap/Offcanvas";
// import logout from '../components/logout.png'
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createagent.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DuepromotionApproval() {
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




  const handleAgentinfoapproval = () => {
    navigate("/agentinfoapproval");
  };
  const handleDuepromotion = () => {
    navigate("/duepromotionapproval");
  };
  const handleTreeshiftapproval = () => {
    navigate("/treeviewapproval");
  };

  const handleTargetsetting = () => {
    navigate("/targetsettingapproval");
  };
  const handleBranchcreation = () => {
    navigate("/branchcreationapproval");
  };

  const handleCreateuser = () => {
    navigate("/createuserapproval");
  };
  const handleCreateagent = () => {
    navigate("/createagentapproval");
  };
  const handleRights = () => {
    navigate("/rightsapproval");
  };
  const handleSchememasterapproval = () => {
    navigate("/schememasterapproval");
  };


  // -----------------------------------------------------
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

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
 
  return (
    <>
      <div className="main" style={{ height: "90vh" }}>
        <ToastContainer />
        <AdminNavbar/>


        <Row className="adminBtnRowoffcanvas">
        <Col sm={8} lg={11} className="sidenav2">
            <div className="headingagentinfo" style={{ marginTop: "-30px" }}>
              <h5>Due Promotion Approval</h5>
            </div>
          </Col>
          </Row>

          <Row>
            <Col lg={11}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <table style={{ width: "1200px" }}>
                <thead>
                  <th style={{ backgroundColor: "#e1e1e1" }}>Employee ID</th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>Employee Name</th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>
                    Intro Employee ID
                  </th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>
                    Intro Employee Name
                  </th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>State</th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>Branch</th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>Division Head</th>
                  <th style={{ backgroundColor: "#e1e1e1" }}>Approve</th>
                </thead>
                <tbody>
                  <td>009</td>
                  <td>Jithin</td>
                  <td>004</td>
                  <td>Sumesh</td>
                  <td>Kerala</td>
                  <td>Thrissur</td>
                  <td>Rajeev</td>
                  <td>
                    <input type="checkbox" />
                  </td>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>

        {/* --------------------------off canvas------------- */}
        <Offcanvas
          show={show}
          onHide={handleClose}
          style={{ width: "200px" }}
        >
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

  
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          className="shiftagentleg"
          style={{ background: "rgba(29, 58, 175, 1)", color: "white" }}
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default DuepromotionApproval;
