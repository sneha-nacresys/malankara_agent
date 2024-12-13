import NavDropdown from "react-bootstrap/NavDropdown";
import malankara from "../components/MALANKARA.webp";
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./agent.css";
import { useNavigate } from "react-router-dom";
function Agent() {
  const navigate = useNavigate();
  const handleAgent = () => {
    navigate("/createagent");
  };
  const handleAgentreport = () => {
    navigate("/agentreport");
  };
  const handleDownlineupline = () => {
    navigate("/agentdownlineupline");
  };
  const handleUpdatedesignation = () => {
    navigate("/updatedesignation");
  };
  const handleCommissionchartreport = () => {
    navigate("/commissionchart");
  };
  const handleCommissioninfo = () => {
    navigate("/commissioninfo");
  };
  const handleShiftagentleg = () => {
    navigate("/shiftagentleg");
  };
  const handleDuepromolist = () => {
    navigate("/duepromolist");
  };

  const handleDirectinstallment = () => {
    navigate("/directinstallment");
  };
  const handleCommissionsetup = () => {
    navigate("/commissionsetup");
  };
  const handleAgentactivedeactive = () => {
    navigate("/agentactivedeactive");
  };
  return (
    <div className="main">
      <div className="createagent">
        <Navbar
          collapseOnSelect
          expand="sm"
          variant="tabs"
          className="navbar"
          style={{ background: "#0070c0" }}
        >
          <Navbar.Brand href="/home">
            <img
              src={malankara}
              alt="logo"
              style={{ width: "50px", height: "40px" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Agent" id="nav-dropdown">
                <NavDropdown.Item onClick={handleAgent}>
                  Create Agent{" "}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleAgentreport}>
                  {" "}
                  Agent Report
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleDownlineupline}>
                  {" "}
                  Agent Downline and Upline
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleUpdatedesignation}>
                  {" "}
                  Update Designation
                </NavDropdown.Item>
                {/* <NavDropdown.Item  onClick={handleCommissionchart}>  Commission Chart</NavDropdown.Item> */}
                <NavDropdown.Item onClick={handleCommissioninfo}>
                  {" "}
                  Commission Info
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleCommissionchartreport}>
                  {" "}
                  Commission Chart Report
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShiftagentleg}>
                  Shift Agent Leg
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleDuepromolist}>
                  {" "}
                  Due Promo List
                </NavDropdown.Item>

                <NavDropdown.Item onClick={handleDirectinstallment}>
                  {" "}
                  Direct Installment
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleCommissionsetup}>
                  {" "}
                  Commission Setup
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleAgentactivedeactive}>
                  {" "}
                  Agent Active-DeActive
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="User Management" id="nav-dropdown">
                <NavDropdown.Item onClick={handleAgent}>
                  Create Agent{" "}
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleAgentreport}>
                  {" "}
                  Agent Report
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleDownlineupline}>
                  {" "}
                  Agent Downline and Upline
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleUpdatedesignation}>
                  {" "}
                  Update Designation
                </NavDropdown.Item>
                <NavDropdown.Item> Commission Info</NavDropdown.Item>
                <NavDropdown.Item> Commission Chart</NavDropdown.Item>
                <NavDropdown.Item> Commission Chart Report</NavDropdown.Item>
                <NavDropdown.Item>Shift Agent Leg</NavDropdown.Item>
                <NavDropdown.Item> Due Promo List</NavDropdown.Item>

                <NavDropdown.Item> Direct Installment</NavDropdown.Item>
                <NavDropdown.Item> Commission Setup</NavDropdown.Item>
                <NavDropdown.Item> Agent Active-DeActive</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Scheme" id="nav-dropdown">
                <NavDropdown.Item> Scheme Master</NavDropdown.Item>
                <NavDropdown.Item> Scheme Lift</NavDropdown.Item>
                <NavDropdown.Item> Set Scheme</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Reports" id="nav-dropdown">
                <NavDropdown.Item> demo1</NavDropdown.Item>
                <NavDropdown.Item> demo2</NavDropdown.Item>
                <NavDropdown.Item> demo3</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className="rotate-on-hover" id="nav-dropdown">
                Reports
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="heading">
          <h5 style={{ fontSize: "20px" }}>New Registration</h5>
        </div>
        <div className="one">
          <div className="two">
            <table>
              <tbody>
                <tr className="tr">
                  <td>Enter Agent ID</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td>Select Hierarchy </td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td> Payment Mode</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td>Cheque/DD Date</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td> Select Company Account</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="three">
            <table>
              <tbody>
                <tr className="tr">
                  <td> Agent Post</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td> Referal Fees</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td> Cheque/DD Details</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td> Bank Name</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
                <tr className="tr">
                  <td> Date Of Registration</td>
                  <td>
                    <input type="text" className="input" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="button">
          <button>Next Step</button>
        </div>
      </div>
    </div>
  );
}

export default Agent;
