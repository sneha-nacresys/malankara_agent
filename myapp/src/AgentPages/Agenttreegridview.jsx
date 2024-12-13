import React, { useState, useEffect } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { toast, ToastContainer } from "react-toastify";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createagent.css";
import TextField from "@mui/material/TextField";
import Cookies from 'js-cookie';
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";
import AgentNavbar from '../AgentNavbar/AgentNavbar';
import translation from "../pages/translation";
import translationMal from "../pages/translationMal";
import * as XLSX from 'xlsx'; // Import for Excel export
import pdfMake from 'pdfmake/build/pdfmake'; // Import for PDF export
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Import for PDF export
//import baseUrl from "../ConstUrl/url";
// Set the fonts for pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const StyledNode = styled.div`
padding: 0px 5px;
width:auto;
border-radius: 8px;
display: inline-block;
border: 1px dotted white;
cursor:pointer;
font-size:11px;
`;



const roleColors = {
  '1': 'green',
  '2': 'blue',
  '3': 'darkorange',
  '4': 'dodgerblue',
  '5': 'purple',
  '6': 'teal',
  '7': 'mediumseagreen',
  '8': 'red'


};
const roleLabels = {
  '1': 'BE',
  '2': 'BDO',
  '3': 'BDM',
  '4': 'ZM',
  '5': 'CMM',
  '6': 'COH',
  '7': 'NEM',
  '8': 'B.GROUP'

};
const getColorForRole = (roleId) => roleColors[roleId] || 'darkslategray';

const AgenttreegridView = () => {
  
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  // =================languages===========================
  const [language, setLanguage] = useState("en");
  const translations = {
    en: translation,
    mal: translationMal,

  };

  useEffect(() => {
    setLanguage(Cookies.get("language") || "en");
  }, [])


  // --------the data to display in fields whose data is fetched----------
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [userRole, setUserRole] = useState('');

  // -------------for setting tree view and grid view upline and downline-----------------------
  // const [view, setView] = useState("tree");
  // const [hierarchy, setHierarchy] = useState("upline");
  const [view, setView] = useState("grid");
  const [hierarchy, setHierarchy] = useState("downline");
  const [nodesDownline, setNodesDownline] = useState([]);
  const [tableUpline, setTableUpline] = useState([]);
  const [tableDownline, setTableDownline] = useState([]);
  const [uplineTreeList, setUplineTreeList] = useState([]);
  // --------for grid view for setting positions in dropdown------------------
  const [positionOpt, setPositionOpt] = useState([]);
  const [positionName, setPositionName] = useState("");
  const [filteredTableUpline, setFilteredTableUpline] = useState([]);
  const [filteredTableDownline, setFilteredTableDownline] = useState([]);


  useEffect(() => {
    const storedUsername = Cookies.get('masterUsername')
    const storedUserId = Cookies.get('masterUserid');
    const storedUseRole = Cookies.get('userRoleName');
    if (storedUsername || storedUsername) {
      setUsername(storedUsername);
      setUserid(storedUserId);
      setUserRole(storedUseRole);

    } else {
      toast.error('Username not found in cookies.');
    }
  }, []);


  // ----------------set onload which api to be called-----------
  useEffect(() => {

    if (hierarchy === 'upline') {
      fetchUplineData();
    } else {
      fetchDownlineData();
    }

  }, [hierarchy]);


  // ===========calculations======================

  // const [roleTotals, setRoleTotals] = useState({});
  const [uplineRoleTotals, setUplineRoleTotals] = useState({});
  const [downlineRoleTotals, setDownlineRoleTotals] = useState({});
  const [uplineData, setUplineData] = useState([]);
  const [downlineData, setDownlineData] = useState([]);

  const calculateUplineRoleTotals = (data) => {
    const roleCounts = {};
    const uniqueAgents = new Set();

    data.forEach(item => {
      // Count the agent's role
      const agentRole = item.RoleName;
      if (agentRole) {
        if (!roleCounts[agentRole]) {
          roleCounts[agentRole] = 0;
        }
        // Ensure each agent is counted only once
        if (!uniqueAgents.has(item.Agent_Id)) {
          roleCounts[agentRole]++;
          uniqueAgents.add(item.Agent_Id);
        }
      }

      // Count the manager's role
      const managerRole = item.ManagerRoleName;
      if (managerRole) {
        if (!roleCounts[managerRole]) {
          roleCounts[managerRole] = 0;
        }
        roleCounts[managerRole]++;
      }
    });

    return roleCounts;
  };

  const calculateDownlineRoleTotals = (data) => {
    const roleCounts = {};
    const uniqueAgents = new Set();
    const uniqueUsers = new Set();

    data.forEach(item => {
      // Count the agent's role
      const agentRole = item.RoleName;
      if (agentRole) {
        if (!roleCounts[agentRole]) {
          roleCounts[agentRole] = 0;
        }
        // Ensure each agent is counted only once
        if (!uniqueAgents.has(item.Agent_Id)) {
          roleCounts[agentRole]++;
          uniqueAgents.add(item.Agent_Id);
        }
      }

      // Count the user's role
      const userRole = item.UserRoleName;
      if (userRole) {
        if (!roleCounts[userRole]) {
          roleCounts[userRole] = 0;
        }
        // Ensure each user is counted only once
        if (!uniqueUsers.has(item.UserId)) {
          roleCounts[userRole]++;
          uniqueUsers.add(item.UserId);
        }
      }
    });

    return roleCounts;
  };



  useEffect(() => {
    if (Array.isArray(uplineData) && uplineData.length > 0) {
      const uplineTotals = calculateUplineRoleTotals(uplineData);
      setUplineRoleTotals(uplineTotals);
    }

    if (Array.isArray(downlineData) && downlineData.length > 0) {
      const downlineTotals = calculateDownlineRoleTotals(downlineData);
      setDownlineRoleTotals(downlineTotals);
    }
  }, [uplineData, downlineData]);



  // -----------------to set logic for downline tree view---------------
  const transformDownlineDataToNodes = (data) => {
    const tree = {};
    const nodesById = {};

    // Helper function to create or retrieve a node
    const createNode = (agent) => {
      if (!nodesById[agent.Agent_Id]) {
        nodesById[agent.Agent_Id] = {
          Agent_Id: agent.Agent_Id,
          Agent_Name: agent.Agent_Name,
          RoleId: agent.RoleId,
          RoleName: agent.RoleName,
          children: [],
        };
      }
      return nodesById[agent.Agent_Id];
    };

    // Create nodes and establish parent-child relationships
    data.forEach((agent) => {
      const userNode = createNode({
        Agent_Id: agent.UserId,
        Agent_Name: agent.UserName,
        RoleId: agent.UserRoleId,
        RoleName: agent.UserRoleName
      });

      const parent = createNode({
        // Agent_Id: agent.Intro_Agent_ID,
        // Agent_Name: agent.Intro_Agent_Name,
        // RoleId: agent.IntroAgentRoleId,
        // RoleName: agent.IntroAgentRoleName
        Agent_Id: agent.DirectManagerId,
        Agent_Name: agent.DirectManagerName,
        RoleId: agent.DirectManagerRoleId,
        RoleName: agent.DirectManagerRoleName
      });

      if (parent) {
        parent.children.push(userNode);
      }

    });

    // Identify root nodes
    const rootNodes = Object.values(nodesById).filter(
      (node) => !data.some(agent => agent.UserId === node.Agent_Id)
    );

    return rootNodes;
  };

  // ----------------------to handle to whether to view in upline or downline-----------
  const handleSelectionChange = async (event) => {
    const value = event.target.value;
    const [newView, newHierarchy] = value.split("-");
    setView(newView);
    setHierarchy(newHierarchy);
    setPositionName('');

  };


  // -------------to handle select box on basis of position of agents-----------
  const handlePositionName = async (e) => {
    const value = e.target.value;
    setPositionName(value);

    if (hierarchy === 'upline') {
      if (value) {
        const filteredData = tableUpline.filter((row) => row.ManagerRoleName === value);
        setFilteredTableUpline(filteredData);
      } else {
        setFilteredTableUpline(tableUpline);
      }
    } else if (hierarchy === 'downline') {
      if (value) {
        const filteredData = tableDownline.filter((row) => row.UserRoleName === value);
        setFilteredTableDownline(filteredData);
      } else {
        setFilteredTableDownline(tableDownline);
      }
    }
  };
  // --------to set table view based on whwether postion selected or not------------
  const getDataToRender = () => {
    if (hierarchy === 'upline') {
      return positionName ? filteredTableUpline : tableUpline;
    } else if (hierarchy === 'downline') {
      return positionName ? filteredTableDownline : tableDownline;
    }
  };
  const dataToRender = getDataToRender();
  // ----------------api to fetch upline data------------------
  const fetchUplineData = async () => {
    const uplineData = {
      user_id: Cookies.get('masterUserid')
    };

    try {
      const uplineRes = await fetch(`${baseUrl}/incentive/agentupline/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uplineData),
      });
      const uplineResponse = await uplineRes.json();
      setUplineData(uplineResponse.upline || []);//for calculation
      // setTableUpline(uplineResponse.upline)


      const sortedUpline = [...uplineResponse.upline].sort((a, b) => b.ManagerRoleId - a.ManagerRoleId);
      setTableUpline(sortedUpline)
      const agent = {
        Agent_Id: uplineResponse.upline[0].Agent_Id,
        Agent_Name: uplineResponse.upline[0].Agent_Name,
        RoleId: uplineResponse.upline[0].RoleId,
        RoleName: uplineResponse.upline[0].RoleName
      };
      const updatedUplineTreeList = [...sortedUpline, agent];




      setUplineTreeList(updatedUplineTreeList);
      const managerPosition = uplineResponse.upline.reduce((acc, product) => {
        if (!acc.some(item => item.value === product.ManagerRoleName)) {
          acc.push({
            value: product.ManagerRoleName,
            label: product.ManagerRoleName
          });
        }
        return acc;
      }, []);
      setPositionOpt(managerPosition);
      const roleKeys = ['RoleName', 'ManagerRoleName'];
      const uplineRoleTotals = calculateUplineRoleTotals(uplineResponse.upline, roleKeys);
      setUplineRoleTotals(uplineRoleTotals);

    } catch (error) {
      console.error('Upline data not found:', error);

    }
  };

  // ----------------api to fetch downline data------------------
  const fetchDownlineData = async () => {
    const downlineData = {
      user_id: Cookies.get('masterUserid')
    };

    try {
      const downlineRes = await fetch(`${baseUrl}/incentive/agentdownline//`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(downlineData),
      });
      const downlineResponse = await downlineRes.json();
      setDownlineData(downlineResponse.upline || []);//for calculation

      const sortedDownline = downlineResponse.downline.sort((a, b) => b.UserRoleId - a.UserRoleId);
      setTableDownline(sortedDownline)  /// -------for table downline----------
      ///==========setting position dropdown---------------

      const userPosition = downlineResponse.downline.reduce((acc, product) => {
        if (!acc.some(item => item.value === product.UserRoleName)) {
          acc.push({
            value: product.UserRoleName,
            label: product.UserRoleName
          });
        }
        return acc;
      }, []);

      setPositionOpt(userPosition); // Update state with options of position

      // Transform downlineResponse data into nodes format for tree view
      const nodes = transformDownlineDataToNodes(downlineResponse.downline);
      setNodesDownline(nodes);
      const roleKeys = ['RoleName', 'UserRoleName'];
      const downlineRoleTotals = calculateDownlineRoleTotals(downlineResponse.downline, roleKeys);

      setDownlineRoleTotals(downlineRoleTotals);
      //   // Calculate role totals
      // const downlineRoleTotals = calculateRoleTotals(downlineResponse.downline, 'UserRoleName');
      // setRoleTotals(prevTotals => ({ ...prevTotals, ...downlineRoleTotals }));
    } catch (error) {
      console.error('downline res :', error);
    }
  };


  // ------------------ export to excel---------------------------
  const exportToExcel = () => {
    try {
      const todaysDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-mm-yyyy


      const sheetName = hierarchy === 'upline' ? `AboveHierarchyData_${todaysDate}` : `BelowHierarchyData_${todaysDate}`;
      const fileName = hierarchy === 'upline' ? `Above_HierarchyData_${todaysDate}.xlsx` : `Below_HierarchyData_${todaysDate}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(dataToRender.map((item, index) => ({
        'No': index + 1,
        'ID': hierarchy === 'upline' ? (item.Manager_ID || 'NA') : (item.UserId || 'NA'),
        'Name': hierarchy === 'upline' ? (item.Manager_Name || 'NA') : (item.UserName || 'NA'),
        'Role': hierarchy === 'upline' ? (item.ManagerRoleName || 'NA') : (item.UserRoleName || 'NA'),
        'Direct Manager Id': item.DirectManagerId || 'NA',
        'Direct Manager Name': item.DirectManagerName || 'NA',
        'Direct Manager Role': item.DirectManagerRoleName || 'NA',
        'Intro Business Associate ID': item.Intro_Agent_ID || 'NA',
        'Intro Business Associate Name': item.Intro_Agent_Name || 'NA',
        'Intro Business Associate Role': item.IntroAgentRoleName || 'NA'

      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);

      // Show success message with the correct hierarchy
      toast.success(`${hierarchy === 'upline' ? 'Above' : 'Below'} hierarchy grid data downloaded successfully on ${todaysDate}`);
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
                ['No', 'ID', 'Name', 'Role', 'Direct Manager Id', 'Direct Manager Name', 'Direct Manager Role', 'Intro Business Associate ID', 'Intro Business Associate Name', 'Intro Business Associate Role'],
                ...dataToRender.map((item, index) => [
                  index + 1,
                  hierarchy === 'upline' ? (item.Manager_ID || 'NA') : (item.UserId || 'NA'),
                  hierarchy === 'upline' ? (item.Manager_Name || 'NA') : (item.UserName || 'NA'),
                  hierarchy === 'upline' ? (item.ManagerRoleName || 'NA') : (item.UserRoleName || 'NA'),
                  item.DirectManagerId || 'NA',
                  item.DirectManagerName || 'NA',
                  item.DirectManagerRoleName || 'NA',
                  item.Intro_Agent_ID || 'NA',
                  item.Intro_Agent_Name || 'NA',
                  item.IntroAgentRoleName || 'NA',
                ]),
              ],
            },
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download('UserHierarchy.pdf');
      //Show success message
      toast.success('Data exported successfully to HierarchyData.pdf')
    } catch (error) {
      // Show error message in case something goes wrong
      toast.error('Failed to export data.');
    }
  };

  // --------------to display data of downline tree view and overlay trigger for tooltip --------------
  const renderDownlineTree = (nodes) => {
    if (!nodes || nodes.length === 0) return null;


    // Get color for the current role ID
    const getColorForRole = (roleId) => roleColors[roleId] || 'black';
    const getLabelForRole = (roleId) => roleLabels[roleId] || 'Unknown';
    return nodes.map((node) => (
      <TreeNode key={node.Agent_Id} label={
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-${node.Agent_Id}`}>
              <div>
                {node.Agent_Name} <br />
                Total Business Associates added: 5/10 <br />
                Business Target: 7/10
              </div>
            </Tooltip>
          }
        >
          <div >
            <StyledNode style={{ backgroundColor: getColorForRole(node.RoleId), color: 'white' }}>
              {node.Agent_Name}
              <div className="fw-medium">{getLabelForRole(node.RoleId)}</div>
              {/* <div className="fw-medium">{node.RoleName}</div> */}
              <div>{node.Agent_Id}</div>
            </StyledNode>
          </div>
        </OverlayTrigger>
      }>
        {renderDownlineTree(node.children)}
      </TreeNode>
    ));
  };

  // ----------color--------------
  const renderLegend = (roleTotals) => {
    return Object.keys(roleColors).map((roleId) => (
      <OverlayTrigger
        key={roleId}
        placement="top"
        overlay={
          <Tooltip id={`tooltip-${roleId}`}>
            Total: {roleTotals[roleLabels[roleId]] || 0}
          </Tooltip>
        }
      >
        <div style={{ marginTop: '5px' }}>
          <span
            className="legend-color"
            style={{
              backgroundColor: roleColors[roleId],
              width: '12px',
              height: '12px',
              display: 'inline-block',
              margin: '0px 5px -4px 0px',
              borderRadius: '5px',
              textAlign: 'center',
              lineHeight: '20px',
              color: 'white',
              cursor: 'pointer'
            }}
          ></span>
          <span className="legend-name">{roleLabels[roleId]}</span>
        </div>
      </OverlayTrigger>
    ));
  };



  return (
    <div>

      {/* ------------------------------------navbar-------------------------- */}
      <AgentNavbar />
      <ToastContainer
        autoClose={1000} />

      {/* --------------heading------------------ */}
      <Row className="d-flex justify-content-center  ms-3 ">
        <Col lg={12} className="sidenav2 main-header-div " >
          <div className="faq-headers main-header-treeview">
            <h5>  {translations[language].employeedesignationchart}</h5>
          </div>
        </Col>
      </Row>
      {/* --------------text fields and select boxes--------------------- */}
      <Row className="mt-3 d-flex justify-content-center align-items-center mx-5">

        <Col lg={2} >
          <TextField
            id="emp id"
            label={translations[language].employeeid}
            type="input"
            variant="standard"
            value={userid}
            InputProps={{
              readOnly: true,
            }}

          />
        </Col>
        <Col lg={2}>
          <TextField

            id="emp name"
            label={translations[language].employeename}
            type="input"
            variant="standard"

            value={username}
            InputProps={{
              readOnly: true
            }}
          />
        </Col>
        <Col lg={2} style={{ fontSize: '12px' }}>
          <TextField

            id="position"
            label={translations[language].desigofemp}
            type="input"
            variant="standard"

            value={userRole}
            InputProps={{
              readOnly: true,
            }}
          />
        </Col>


        <Col lg={2} className="mt-3" sm={12}>

          <select
            id="mySelect"
            onChange={handleSelectionChange}
            value={`${view}-${hierarchy}`}
          >
            {/* <option value="tree-upline">{translations[language].uplinehierarchychart}</option> */}
            {/* <option value="tree-downline"> {translations[language].downlinehierarchychart}</option> */}
            {/* <option value="grid-upline"> {translations[language].uplinegridview} </option> */}
            <option value="grid-downline"> {translations[language].downlinegridview} </option>
          </select>

        </Col>
        {view === "grid" ? (
          <Col lg={2} className="mt-3">
            <select
              id="mySelect"
              value={positionName}
              onChange={handlePositionName}
            >
              <option value="" className="text-white">{translations[language].selectposition}</option>
              {positionOpt.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Col>
        ) : (
          <Col lg={2}>

          </Col>
        )}
      </Row>

      {/* -----------------to display whether grid or tree---------------- */}
      {/* -----------------to display whether grid ---------------- */}
      {view === "grid" ? (
        <>
          <div className="mt-3 mx-5 mb-1" style={{ height: '55vh', overflowY: 'scroll' }}>
            <MDBTable>
              <MDBTableHead className="common-thead">
                <tr >
                  <th className="trtable " scope="col">
                    {translations[language].slno}
                  </th>
                  <th scope="col">
                    {translations[language].employeeid}
                  </th>
                  <th scope="col">
                    {translations[language].employeename}
                  </th>
                  <th scope="col">
                    {translations[language].position}
                  </th>

                  <th scope="col">
                    {translations[language].directmanagerid}
                  </th>
                  <th scope="col">
                    {translations[language].directmanagername}
                  </th>
                  <th scope="col">
                    {translations[language].position}
                  </th>
                  <th scope="col">
                    {translations[language].introemployeeid}
                  </th>
                  <th scope="col">
                    {translations[language].introemployeename}
                  </th>
                  <th scope="col">
                    {translations[language].position}
                  </th>

                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {dataToRender.length > 0 ? (
                  dataToRender.map((item, index) => (
                    <tr key={index} className="trbody">
                      <td>{index + 1}</td>
                      <td>{hierarchy === 'upline' ? (item.Manager_ID || 'NA') : (item.UserId || 'NA')}</td>
                      <td>{hierarchy === 'upline' ? (item.Manager_Name || 'NA') : (item.UserName || 'NA')}</td>
                      <td>{hierarchy === 'upline' ? (item.ManagerRoleName || 'NA') : (item.UserRoleName || 'NA')}</td>

                      <td>{item.DirectManagerId || 'NA'}</td>
                      <td>{item.DirectManagerName || 'NA'}</td>
                      <td>{item.DirectManagerRoleName || 'NA'}</td>

                      <td>{item.Intro_Agent_ID || 'NA'}</td>
                      <td>{item.Intro_Agent_Name || 'NA'}</td>
                      <td>{item.IntroAgentRoleName || 'NA'}</td>

                    </tr>
                  ))
                ) : (
                  <tr className="trbody">
                    <td colSpan="9" className="text-center">No data available</td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>

          </div>
          <div style={{ display: "flex", justifyContent: "center" }} id='export-to-excel' >

            <button className="shiftagentleg py-1" onClick={exportToExcel}>Export to Excel</button>
            {/* <button className="shiftagentleg py-1" onClick={exportToPDF}>Export to PDF</button> */}

          </div>
        </>
      ) : (
        //---------------------- to display tree view-----------------
        <div className="hoverable-chart mt-3">
          {hierarchy === 'upline' ? (
            <Row>
              <Col lg={1} sm={4} style={{ marginTop: '10px' }} className="legend-col">
                {renderLegend(uplineRoleTotals)}
              </Col>

              <Col className="mt-3">
                <MDBTable >
                  <MDBTableBody>
                    {uplineTreeList.length > 0 ? (
                      uplineTreeList.map((member, index) => (
                        <React.Fragment key={member.Agent_Id || member.Manager_ID}>
                          <tr>
                            <td className="py-0 text-center" style={{ border: 'none' }}>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${member.Agent_Id || member.Manager_ID}`}>
                                    <div>
                                      {member.Manager_Name ? member.Manager_Name : member.Employee_Name} <br />
                                      Total Business Associates added: 5/10 <br />
                                      Business Target: 3/10
                                    </div>
                                  </Tooltip>
                                }
                              >
                                <Button
                                  style={{
                                    border: '1.5px dotted black',
                                    borderRadius: '8px',
                                    color: 'black',
                                    paddingBottom: '0px',
                                    fontSize: '11px',
                                    color: 'white',
                                    backgroundColor: member.ManagerRoleId ? getColorForRole(member.ManagerRoleId) : getColorForRole(member.RoleId),
                                  }}
                                >
                                  <span>
                                    {member.Manager_Name ? member.Manager_Name : member.Agent_Name} <br />
                                    <strong>{member.ManagerRoleName ? member.ManagerRoleName : member.RoleName}</strong>
                                    <br />
                                    {member.Manager_ID ? member.Manager_ID : member.Agent_Id}
                                  </span>
                                </Button>
                              </OverlayTrigger>
                            </td>
                          </tr>
                          {index < uplineTreeList.length - 1 && (
                            <tr>
                              <td
                                style={{
                                  textAlign: 'center',
                                  border: 'none',
                                  fontSize: '35px',
                                  lineHeight: '10px',
                                  paddingBottom: '16px',
                                  color: 'rgba(29, 58, 175)',
                                }}
                              >
                                |
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No data available
                        </td>
                      </tr>
                    )}
                  </MDBTableBody>
                </MDBTable>
              </Col>
            </Row>

          ) : (


            <div style={{ overflowY: 'auto', maxHeight: '65vh' }} >
              <Container >
                <Row>
                  <Col lg={1} sm={4} style={{ marginTop: '10px' }} className="legend-col">
                    {renderLegend(downlineRoleTotals)}</Col>
                  <Col lg={11} sm={8}>

                    {nodesDownline.length > 0 ? (
                      <Tree
                        lineWidth={'1.5px'}
                        lineColor={'rgba(29, 58, 175)'}
                        lineBorderRadius={'5px'}
                      // label={<StyledNode></StyledNode>}
                      >
                        {renderDownlineTree(nodesDownline)}
                      </Tree>
                    ) : (
                      <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', padding: '20px' }}>
                        No data available
                      </div>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>

          )}
        </div>
      )}

    </div>
  );
}

export default AgenttreegridView;