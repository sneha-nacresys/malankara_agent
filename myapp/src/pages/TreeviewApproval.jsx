import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from '../AdminNavbar/AdminNavbar'
// import logout from '../components/logout.png'
import Button from "@mui/material/Button";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createagent.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Approvals() {
 




  return (
    <>
    <div className="main" style={{height:"90vh"}}>
     
      <ToastContainer />
      <AdminNavbar/>

        
      <Row className='adminBtnRowoffcanvas' >


       
  <Col sm={8} lg={11} className="sidenav2">
            <div className="headingagentinfo" style={{ marginTop: "-30px" }}>
              <h5> Designation Chart Approval</h5>
            </div>
          </Col>
          </Row>
          <Row>
            <Col lg={12}>
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
      


 





































   
    </div>
{/* -------------------------------------------------------------------- */}

     
      {/* -------------------------------------------------------------------------------------------- */}
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
    <Button className="shiftagentleg" style={{background:"rgba(29, 58, 175, 1)",color:"white"}}>Save</Button>
    </div>
    </>
  );
}

export default Approvals;


















































