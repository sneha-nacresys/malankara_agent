import React, { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

import "./createagent.css";
import "./responsive.css";
import LanguageSelector from '../pages/LanguageSelector';
import translationMal from "../pages/translationMal";
import translation from "../pages/translation";
import { Container, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import AgentNavbar from '../AgentNavbar/AgentNavbar'
//import baseUrl from "../ConstUrl/url";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";

function Dashboard() {
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_URL;

  const [language, setLanguage] = useState('en')

  useEffect(() => {
    setLanguage(Cookies.get('language') || 'en')
    const loggedInStatus = Cookies.get('loggedIn');
    if (loggedInStatus === 'true') {
      Cookies.remove('loggedIn');
      toast.success('Logged in successfully');

    }
  }, [])


  const translations = {
    en: translation,
    mal: translationMal,
  };
  // const handleLanguageChange = (selectedLanguage) => {
  //   setLanguage(selectedLanguage);
  //   Cookies.set("language", selectedLanguage);
  // };

  // =============================================
  useEffect(() => {
    const message = Cookies.get('nomineeAdd');

    if (message) {
      toast.success(message);
      Cookies.remove('nomineeAdd');
    }
  }, []);

  //  useEffect(() => {
  //     const nomineeDetails = Cookies.get('nomineeAdd');
  //     if (nomineeDetails === 'true') {
  //         toast.success(translations[language].nomineedetailsadded);
  //         Cookies.remove('nomineeAdd');
  //     }
  // }, []);


  const [selectedOption, setSelectedOption] = useState('one');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // ======================modal=================
   const [show, setShow] = useState(false);
  const [imageData, setImageData] = useState(null);

  const handleClose = () => {
    // Close the modal and update the sessionStorage to prevent showing again
    setShow(false);
    sessionStorage.setItem('adPopupShown', '1');
  };

  useEffect(() => {
    // Check if the session variable exists, if not set it to 0
    const adPopupShown = sessionStorage.getItem('adPopupShown') || '0';

    // If the session variable is 0, attempt to fetch the image and show modal only on success
    if (adPopupShown === '0') {
      
      const fetchImageData = async () => {
        try {
          const response = await fetch(`${baseUrl}/adminmanage/Campaign_file_view/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();

          if (response.ok) {
            setImageData(data.image); // Set the base64 image data
            setShow(true); // Show the modal only if image fetch is successful
          } else {
            // toast.error(data.error || "Failed to load campaign image.");
            sessionStorage.setItem('adPopupShown', '1');  // Prevent future display attempts
          }
        } catch (error) {
          console.error("Error fetching campaign image:", error);
          toast.error("Error fetching campaign image.");
          sessionStorage.setItem('adPopupShown', '1');  // Prevent future display attempts
        }
      };

      fetchImageData();
    }
  }, [baseUrl]);



  // ======================achievements api calls=========================

  // ==============monthly allowance criteria ==================

  const [monthlyIncentive, setMonthlyIncentive] = useState([])
  const [monthlyAchievement, setMonthlyAchievement] = useState([])
  const [promotionAchivement, setPromotionAchivement] = useState([])
  const [promotionQuotaAchivement, setPromotionQuotaAchivement] = useState([])
  const [specialRewardAchievement, setSpecialRewardAchievement] = useState([])
  const [preClosureStatus, setPreClosureStatus] = useState([])

  const getCurrentFinancialYear = () => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JS months are zero-based (0 = January, 11 = December)

    // Financial year starts in April, ends in March
    if (currentMonth >= 4) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  };

  const fetchMonthlyIncentives = async () => {
    const monthData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }

    try {
      const res = await fetch(`${baseUrl}/adminmanage/agent_monthly_incentive_achieved/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(monthData)
      });

      const response = await res.json();

      if (response.monthly_incentive) {

        setMonthlyIncentive(response.monthly_incentive)

      }
      // else {
      //   toast.error(response.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };

  const fetchMonthlyAchievements = async () => {
    const monthData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }

    try {
      const res = await fetch(`${baseUrl}/adminmanage/monthly_allowance_criteria_table/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(monthData)
      });

      const response = await res.json();

      if (response.data) {

        setMonthlyAchievement(response.data)

      }
      // else {
      //   toast.error(response.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };

  const fetchAchivementPromotionCriteria = async () => {
    const promoData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }

    try {
      const res = await fetch(`${baseUrl}/adminmanage/agent_promotion_target_acheived/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(promoData)
      });

      const response = await res.json();
     
      if (response.prmt_acheived) {



        setPromotionAchivement(response.prmt_acheived)

      }
      // else {
      //   toast.error(response.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };

  const fetchPromotionQuotaAchievement = async () => {
    const promoData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }

    try {
      const res = await fetch(`${baseUrl}/adminmanage/agent_promotion_quota_achieved/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(promoData)
      });

      const response = await res.json();
  

      if (response.quota_achieve) {



        setPromotionQuotaAchivement(response.quota_achieve)

      }
      // else {
      //   toast.error(response.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };


  const fetchSpecialReward = async () => {
    const splData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }

    try {
      const res = await fetch(`${baseUrl}/adminmanage/agent_special_reward_achieved/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(splData)
      });

      const response = await res.json();
  

      if (response.spl_reward) {



        setSpecialRewardAchievement(response.spl_reward)

      }
      // else {
      //   toast.error(response.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };

  const fetchPreclosure = async () => {
    const preData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }

    try {
      const res = await fetch(`${baseUrl}/adminmanage/agent_preclosure_status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(preData)
      });

      const response = await res.json();
       

      if (response.preclosure_status) {
        setPreClosureStatus(response.preclosure_status)
       
        

      }
      
      // else {
      //   toast.error(response.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };

  useEffect(() => {
    fetchMonthlyIncentives();
    fetchMonthlyAchievements();
    fetchAchivementPromotionCriteria();
    fetchPromotionQuotaAchievement();
    fetchSpecialReward();
    fetchPreclosure();
  }, []);


  // ==================targets api calls =====================


  // ================promotion quota /special yaer===============
  const [promotionQuotaTarget, setPromotionQuotaTarget] = useState([])

  const fetchPromotionQuotaTarget = async () => {
    const quotaTarData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }


    try {
      const quotaTarRes = await fetch(`${baseUrl}/adminmanage/agent_promotion_quota_criteria_target/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(quotaTarData)
      });

      const quotaTarResponse = await quotaTarRes.json();


      if (quotaTarResponse.quota_details) {
        setPromotionQuotaTarget(quotaTarResponse.quota_details)

      }
      //  else {
      //   toast.error(quotaTarResponse.error)
      // }
    } catch (error) {
      console.error('An error', error);
    }
  };



  // ===================yearly target===================


  const [yearlyTarget, setTearlyTarget] = useState([])

  const fetchyearlyTarget = async () => {
    const yearlyTarData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }


    try {
      const yearlyTarRes = await fetch(`${baseUrl}/adminmanage/agent_yearly_business_target/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(yearlyTarData)
      });

      const yearlyTarResponse = await yearlyTarRes.json();


      if (yearlyTarResponse.yearly_business_det) {
        setTearlyTarget(yearlyTarResponse.yearly_business_det)

      }
      // else {
      //   toast.error(yearlyTarResponse.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };


  // ====================promotion target==================


  const [promoTarget, setPromoTarget] = useState([])

  const fetchPromoTarget = async () => {
    const promoTarData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }


    try {
      const promoTarRes = await fetch(`${baseUrl}/adminmanage/agent_promotion_criteria_target/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(promoTarData)
      });

      const promoTarResponse = await promoTarRes.json();


      if (promoTarResponse.promotion_details) {
        setPromoTarget(promoTarResponse.promotion_details)

      }
      // else {
      //   toast.error(promoTarResponse.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };

  // ===================monthly target================
  const [monthlyTarget, setMonthlyTarget] = useState([])

  const fetchMonthlyTarget = async () => {
    const monthlyTarData = {
      year: getCurrentFinancialYear(),
      AgentId: Cookies.get('masterUserid')
    }


    try {
      const monthlyTarRes = await fetch(`${baseUrl}/adminmanage/agent_monthly_allowance_target/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(monthlyTarData)
      });

      const monthlyTarResponse = await monthlyTarRes.json();
      console.log(monthlyTarResponse);


      if (monthlyTarResponse.monthly_details) {
        setMonthlyTarget(monthlyTarResponse.monthly_details)

      }
      // else {
      //   toast.error(monthlyTarResponse.error)
      // }
    } catch (error) {
      console.error('An error ', error);
    }
  };
  // =============================================================
  useEffect(() => {
    fetchPromotionQuotaTarget();
    fetchyearlyTarget();
    fetchPromoTarget();
    fetchMonthlyTarget();

  }, []);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
  // =================================
  return (
    <div className="dashboard-agent">
      <AgentNavbar />
      <ToastContainer
        autoClose={1000}
      />

      <Row className="d-flex justify-content-center ms-2 ">
        <Col lg={11} className="sidenav2 main-header-div " >
          <div className="faq-headers mb-3 main-header-dashbord">
            <h5>{translations[language].dashboard}</h5>
          </div>
        </Col>
      </Row>

      {/* ============================targets========== */}

      <Row className="d-flex justify-content-center ms-2 ">
        <Col lg={11} className="main-header-div sub-header-dashboard" >
          <div className="faq-headers mb-3 main-header-dashbord sub-header-color" >
            {/* <Row className="d-flex justify-content-center ">
        <Col lg={10} className="main-header-div sub-header-div">
          <div className="faq-headers sub-heading-dashboard "> */}
            <h5 >{translations[language].targets}</h5>
          </div>
        </Col>
      </Row>


      <Container>
        <Row >

          {/* =====================Monthly allowance criteria targets========================= */}

          <Col lg={6} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].monthlyAllowanceCriteria}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" rowSpan={2}>{translations[language].slno}</th>
                    <th scope="col" colSpan={2}>{translations[language].monthlyTargetAmount}</th>
                    <th scope="col" rowSpan={2}>{translations[language].allowances}</th>
                    <th scope="col" rowSpan={2}>{translations[language].activeBe}</th>
                  </tr>
                  <tr >

                    <th scope="col" >{translations[language].from}</th>
                    <th scope="col" >{translations[language].to}</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                  {monthlyTarget.length > 0 ? (
                    monthlyTarget.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatCurrency(item.from_target)}</td>
                        <td>{` ${item.to_target === 999999999 ? "above" : formatCurrency(item.to_target)}`}</td>
                        <td>{formatCurrency(item.allowance)}</td>
                        <td>{item.activebe}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}


                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>

          {/* =======================promotion target to be achived============ */}

          <Col lg={6} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].promotionCriteria}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].promotionTargetAmount}</th>
                    <th scope="col" >{translations[language].noOfBePromoted}</th>
                    <th scope="col" >{translations[language].noOfImmediatePromotion} </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                  {promoTarget.length > 0 ? (
                    promoTarget.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatCurrency(item.target_amount)}</td>

                        <td>{formatCurrency(item.NumberOfBEtoPromote)}</td>
                        <td>{formatCurrency(item.immidiate_promotion)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}

                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>



          {/* =============================promotion quota (special yaerly) achievement reward================= */}
          <Col lg={6} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].promotionQuotaIncentive}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >
                    <th scope="col" rowSpan={2}>{translations[language].slno}</th>
                    <th scope="col" colSpan={2}>{translations[language].businessAssociatePromotion}</th>
                    <th scope="col" rowSpan={2}>{translations[language].incentives}</th>
                  </tr>
                  <tr >
                    <th scope="col" >{translations[language].fromBe}</th>
                    <th scope="col" >{translations[language].toBe}</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                  {promotionQuotaTarget.length > 0 ? (
                    promotionQuotaTarget.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatCurrency(item.from_target)}</td>
                        <td>{` ${item.to_target === 999999999 ? "above" : formatCurrency(item.to_target)}`}</td>
                        <td>{formatCurrency(item.incentive)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>

          {/* ====================Yearly BUsiness Rewards========================= */}

          <Col lg={6} className="mb-1">
            <Col lg={12} className="dashboard-heading ">
              <h5>{translations[language].yearlyBusinessTargets}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" rowSpan={2}>{translations[language].slno}</th>
                    <th scope="col" colSpan={2}>{translations[language].targets}</th>
                    <th scope="col" rowSpan={2}>{translations[language].reward}</th>
                  </tr>
                  <tr >

                    <th scope="col" >{translations[language].from}</th>
                    <th scope="col" >{translations[language].to}</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">

                  {yearlyTarget.length > 0 ? (
                    yearlyTarget.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatCurrency(item.from_target)}</td>
                        <td>{` ${item.to_target === 999999999 ? "above" : formatCurrency(item.to_target)}`}</td>
                        <td>{formatCurrency(item.reward)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>


        </Row>
      </Container>



      {/* ==============================================Achievement====================== ========================*/}


      <Row className="d-flex justify-content-center ms-2 ">
        <Col lg={11} className="main-header-div sub-header-dashboard" >
          <div className="faq-headers mb-3 main-header-dashbord sub-header-color">
            <h5>{translations[language].achievement}</h5>
          </div>
        </Col>
      </Row>

      <Container>
        <Row>



          {/* =====================monthly Incentive===================== */}

          <Col lg={6} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].monthlyIncentive}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].month}</th>
                    <th scope="col" >{translations[language].monthlyIncentive} </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody text-start">
                  {monthlyIncentive.length > 0 ? (
                    monthlyIncentive.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td>{formatCurrency(item.Incentive_Month)}</td>
                        <td>{formatCurrency(item.Total_Incentive)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}

                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>

          {/* =====================monthly allowance criteria achievement===================== */}

          <Col lg={6} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].monthlyAllowanceCriteria}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable >
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].noOfActiveEmployees}</th>
                    <th scope="col" >{translations[language].achievedSlab}</th>
                    <th scope="col" >{translations[language].eligibleAllowance} </th>
                    <th scope="col" >{translations[language].rdAchievement} </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                  {monthlyAchievement.length > 0 ? (
                    monthlyAchievement.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatCurrency(item.ActiveCountOfBE)}</td>
                        <td>{`${formatCurrency(item.TargetFrom)} - ${item.TargetTo === 999999999 ? "above" : formatCurrency(item.TargetTo)}`}</td>
                        <td>{formatCurrency(item.Allowance)}</td>
                        <td>{formatCurrency(item.CurrentMonthActiveRD)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>
          {/* =====================Promotion Criteria===================== */}

        </Row>
      </Container>
      {/* ===============================2nd row================ */}
      <Container>
        <Row >


          <Col lg={3} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].promotionCriteria}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].noOfemployeePromoted}</th>
                    <th scope="col" >{translations[language].target}</th>
                    <th scope="col" >{translations[language].rdSixty} </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">

                  {promotionAchivement.length > 0 ? (
                    promotionAchivement.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.total_ba_count}</td>
                        <td>{formatCurrency(item.Total_Business)}</td>
                        <td>{item.rdpercentage}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>

          {/* =====================Promotional Quota Incentive========================= */}

          <Col lg={3} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].promotionQuotaIncentive}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].noOfEmployeePromotionSlab}</th>
                    <th scope="col" >{translations[language].eligibleReward}</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">

                {promotionQuotaAchivement.length > 0 ? (
                    promotionQuotaAchivement.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        
                        <td>{`${formatCurrency(item.from_target)} - ${item.to_target === 999999999 ? "above" : formatCurrency(item.to_target)}`}</td>
                        <td>{item.reward}</td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
                </MDBTableBody>
              </MDBTable>
            </div>
          </Col>

          {/* =============================special reward================= */}
          <Col lg={3} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].specialReward}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].noOfEmployeePromotionSlab}</th>
                    <th scope="col" >{translations[language].eligibleReward}</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                {specialRewardAchievement.length > 0 ? (
                    specialRewardAchievement.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        
                        <td>{`${formatCurrency(item.from_target)} - ${item.to_target === 999999999 ? "above" : formatCurrency(item.to_target)}`}</td>
                        <td>{item.Reward}</td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" >{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
                </MDBTableBody>

               
              </MDBTable>
            </div>
          </Col>

          {/* =====================Preclosure Status========================= */}

          <Col lg={3} className="mb-1">
            <Col lg={12} className="dashboard-heading">
              <h5>{translations[language].preClosureStatus}</h5>
            </Col>
            <div className="dashboard-table" >

              <MDBTable>
                <MDBTableHead style={{ textAlign: "center" }} className="common-thead">
                  <tr >

                    <th scope="col" >{translations[language].slno}</th>
                    <th scope="col" >{translations[language].currentMonth}</th>
                    <th scope="col" >{translations[language].previousMonth}</th>
                    <th scope="col" >{translations[language].tillDate}</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody style={{ textAlign: "center" }} className="common-tbody ">
                </MDBTableBody>

                {preClosureStatus.length > 0 ? (
                    preClosureStatus.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.current_count}</td>
                        <td>{item.previous_count}</td>
                        <td>{formatDate(item.till_date_count)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center border-bottom py-1" style={{fontSize:'12px'}}>{translations[language].noDataAvailable}</td>
                    </tr>
                  )}
              </MDBTable>
            </div>
          </Col>
        </Row>
      </Container>


      {/* ==================================================================================================== */}
      {/* ==========================campaign master================================= */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {/* <Modal.Title> {translations[language].campaignMaster}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
        {imageData ? (
          <img
            src={imageData} // Use the base64 image data here
            alt="Ad Image"
            className="img-fluid"
          />
        ) : (
          <p>Loading...</p> 
        )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default Dashboard;