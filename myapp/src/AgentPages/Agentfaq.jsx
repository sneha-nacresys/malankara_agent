import { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Cookies from 'js-cookie'
import AgentNavbar from '../AgentNavbar/AgentNavbar'

// import { OrganizationChart } from "primereact/organizationchart";
import "react-toastify/dist/ReactToastify.css";
import Accordion from "react-bootstrap/Accordion";
import translation from "../pages/translation";
import translationMal from "../pages/translationMal"
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "./createagent.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
// import './OrganizationChartDemo.css'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

// import baseUrl from "../ConstUrl/url";
import { Container } from "@mui/material";
import { log } from "pdfmake/build/pdfmake";
function Agentfaq() {

  const baseUrl = process.env.REACT_APP_API_URL;


  const [language, setLanguage] = useState("en");


  const translations = {
    en: translation,
    mal: translationMal,

  };


  useEffect(() => {
    setLanguage(Cookies.get("language") || "en");
  }, [])


  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };


  const [expandedtwo, setExpandedtwo] = React.useState(false);


  const handleFaq = () => {
    navigate('/faq')
  }


  const [faqlist, setFaqlist] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const userId = Cookies.get('masterUserid');

  useEffect(() => {
    const fetchFaqNewList = async () => {
      if (!userId) {
        return;
      }
      try {
        const response = await fetch(`${baseUrl}/adminmanage/faq_list_by_user/`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Send user_id in request body
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.error) {
        } else {
          setFaqlist(data.faq_list_by_user);
        }
      } catch (error) {
        console.error('There was an error fetching the FAQ list:', error);
      }
    };

    fetchFaqNewList();
  }, [userId]);


  

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };



  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [question, setQuestion] = useState('');


  const handleSubmit = async () => {

    const demo = Cookies.get('masterUserid');
    const data = {
      username: demo,
      FAQ_QUEST: question
    };

    try {
      const response = await fetch(`${baseUrl}/adminmanage/agentfaq/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value // CSRF token
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.message) {
        toast.success(result.message);
        setShow(false)
        setQuestion('')
        handleClose();
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Error:', error);

    }
  };


  const [commonFaqlist, setCommonFaqlist] = useState([]);
  const fetchCommonFaqList = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/adminmanage/faqlist/`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      setCommonFaqlist(data.faq_list);
    } catch (error) {
      console.error("There was an error fetching the FAQ list:", error);
    }
  };

  // Fetch FAQ list when the component mounts
  useEffect(() => {
    fetchCommonFaqList();

  }, []);

  const [openFaq, setOpenFaq] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  const handleAccordionClick = async (faq) => {
    
    // setOpenFaq(faq.id);
    setOpenFaq(faq.id === openFaq ? null : faq.id);

    const faqData = {
      faq_id: faq.id,
      userid: Cookies.get('masterUserid')
    }
   
    
    try {
      const response = await fetch(`${baseUrl}/adminmanage/OpenQuestions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData)
      });

      const res = await response.json();


    } catch (error) {
      console.error("There was an error fetching the FAQ list:", error);
    }
  };

  return (
    <div>
      <AgentNavbar />
      <ToastContainer autoClose={2000} />
  
      <Row className="d-flex justify-content-center  ms-3 ">
          <Col lg={11}  className="sidenav2 main-header-div " >
            <div className="faq-headers ">
            <h5>{translations[language].faq}</h5>
          </div>
        </Col>
      </Row>

      <Container >

  
        <div style={{ height: "65vh", overflowY: 'auto' }}>
  
  
          <Row className="d-flex justify-content-center mx-2">
            {/* ====================common faq============= */}
            <Col lg={6} sm={12}>
             
                    <div className="faq-headers">
                      <h5 className="m-0 mb-3">{translations[language].commonQuestions}</h5>
                    </div>
                 
                <Row className="d-flex mx-1">
                  {commonFaqlist.map((commonFaq) => (
                           <Col key={commonFaq.id} lg={6} sm={12} className="mb-3">
                           <Accordion activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey)}>
                             <Accordion.Item eventKey={commonFaq.id}>
                 
                          
                          <Accordion.Header style={{ fontSize: "12px" }}>
    
                            {commonFaq.FAQ_QUEST}
                          </Accordion.Header>
                          <Accordion.Body style={{ fontSize: "12px" }}>
                            {commonFaq.FAQ_ANS}
                            <div
                              className="icon-container"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                padding: "10px",
                              }}
                            >
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
    
                    </Col>
                  ))}
                </Row>
    
          
            </Col>
  
  
  
            {/* =============================asked qns============== */}
            <Col lg={6} sm={12}>
  
  
           
                  <div className="faq-headers">
                    <h5 className="m-0 mb-3">{translations[language].askedQuestions}</h5>
                  </div>
               
  
  
              <Row className="d-flex mx-1">
                {faqlist.map((faq) => (
                   <Col key={faq.id} lg={6} sm={12} className="mb-3">
                   <Accordion activeKey={openFaq?.toString()}>
                     <Accordion.Item
                       eventKey={faq.id.toString()}
                       onClick={() => handleAccordionClick(faq)}
                     >
  
                        <Accordion.Header style={{ fontSize: "12px" }}>
  
                          {faq.FAQ_QUEST}
                        </Accordion.Header>
                        <Accordion.Body style={{ fontSize: "12px" }}>
                          {faq.FAQ_ANS}
                          <div
                            className="icon-container"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                              padding: "10px",
                            }}
                          >
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
  
                  </Col>
                ))}
              </Row>
  
  
            </Col>
  
  
          </Row>
  
  
        </div>
</Container>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="mt-3">
        <button onClick={handleShow} style={{ background: "blue", color: "white", border: "none", padding: "5px", borderRadius: "3px" }}>{translations[language].askquestion}</button>
      </div>

      {/* ------------------------------question modal----------------------------- */}
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{translations[language].askquestion}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicQuestion">
              <Form.Label>{translations[language].yourquestion}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                style={{ fontSize: "12px" }}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-danger text-white me-2" onClick={handleClose} >{translations[language].close}</Button>
            <Button className="bg-success text-white" type="submit">{translations[language].submit}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>



  );
}
export default Agentfaq;
