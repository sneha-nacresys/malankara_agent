import React, { useState, useEffect } from "react";
import {

  Row,
  Col,
  Container,

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

const CountrySelect = () => {
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



  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordOld = () => {
    setShowOldPassword(!showOldPassword);
  };

  const togglePasswordNew = () => {
    setShowNewPassword(!showNewPassword);
  };
  const togglePasswordConfirm = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  useEffect(() => {
    const storedUsername = Cookies.get('masterUserid'); // Assuming 'masterUserid' is your username cookie name
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      toast.error(translations[language].usernotfound);
    }
  }, []);

  const handleReset = async () => {
    if (!username) {
      toast.error(translations[language].usernamenotfount);
      return;
    }
    if (!oldPassword) {
      toast.error(translations[language].oldpasswordisrequired);
      return;
    }

    if (!newPassword) {
      toast.error(translations[language].newpasswordisrequired);
      return;
    }
    if (!confirmPassword) {
      toast.error(translations[language].confirmpasswordisrequired);
      return;
    }
    if (newPassword.length < 8) {
      toast.error(translations[language].doesntmatch);
      return;
    }
    if (newPassword.length > 16) {
      toast.error(translations[language].toolong);
      return;
    }
    if (oldPassword === newPassword) {
      toast.error(translations[language].comparison);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(translations[language].donotmatch);
      return;
    }

    const resetData = {
      username: username,
      oldpassword: oldPassword,
      newpassword: newPassword,
    };

    try {
      const resetRes = await fetch(`${baseUrl}/agent/agent_rest_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      const resetResponse = await resetRes.json();

      if (resetResponse.message) {
        toast.success(resetResponse.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
       
        setTimeout(async () => {
          await handleLogout();
        }, 3000);
      } else if (resetResponse.error) {
        toast.error("Invalid old password");
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };


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

  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div>
      <AgentNavbar />

      <ToastContainer
        autoClose={1000} />

      <Row className="d-flex justify-content-center mx-1 me-2 mb-3">
        <Col lg={11} className="sidenav2">
          <div className="headingagentinfo">
            <h6>{translations[language].passwordrest}</h6>
          </div>
        </Col>
      </Row>

      <Container>
        <div className="pswd-reset">
          <Row>
            <Col lg={12} className="pswd-form shadow">
              <TextField
                id="standard-password-input"
                label={translations[language].username}
                type="input"
                variant="standard"
                value={username}
                disabled
                // onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span style={{ position: 'relative' }}>
                <TextField
                  id="standard-password-input"
                  label={translations[language].oldpassword}
                  type={showOldPassword ? 'text' : 'password'}
                  variant="standard"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  style={{ width: '100%' }}

                />
                <span
                  className="password-toggle-icon"
                  style={{ cursor: 'pointer', position: 'absolute', bottom: '0px', right: '2px' }}
                  onClick={togglePasswordOld}
                >
                  <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
                </span>
              </span>
              <span style={{ position: 'relative' }}>
                <TextField
                  id="standard-password-input"
                  label={translations[language].passwordnew}
                  type={showNewPassword ? 'text' : 'password'}
                  variant="standard"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
                <span
                  className="password-toggle-icon"
                  style={{ cursor: 'pointer', position: 'absolute', bottom: '0px', right: '2px' }}
                  onClick={togglePasswordNew}
                >
                  <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                </span>
              </span>
              <span style={{ position: 'relative' }}>
                <TextField
                  id="standard-password-input"
                  label={translations[language].confirmpassword}
                  type={showConfirmPassword ? 'text' : 'password'}

                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="standard"
                  required
                  style={{ width: '100%' }}
                />
                <span
                  className="password-toggle-icon"
                  style={{ cursor: 'pointer', position: 'absolute', bottom: '0px', right: '2px' }}
                  onClick={togglePasswordConfirm}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                </span>
              </span>
              <div className="pswd-btn">
                <button onClick={handleCancel} style={{ fontSize: "12px" }}>  {translations[language].cancel}</button>
                <button onClick={handleReset} style={{ fontSize: "12px" }}>  {translations[language].reset}</button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default function Nextstep() {
  return (
    <div className="App">
      <CountrySelect />
    </div>
  );
}
