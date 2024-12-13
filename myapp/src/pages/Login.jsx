import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import malankara from "../components/MALANKARA.webp";
import "./login.css";
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LanguageSelector from "./LanguageSelector";
import translation from "./translation";
import translationMal from "./translationMal";
// import baseUrl from "../ConstUrl/url";

function App() {
  const baseUrl = process.env.REACT_APP_API_URL;

  // const [loginInfo, setLoginInfo] = useState({
  //   username: '',
  //   password: ''
  // });
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState('en');


  const translations = {
    en: translation,
    mal: translationMal,

  };

  // const handleLanguageChange = (selectedLanguage) => {
  //   Cookies.set('language', selectedLanguage);
  // };

  useEffect(() => {
    // Get the saved language from cookies
    const savedLanguage = Cookies.get('language');

    // If saved language exists in cookies, use it. Otherwise, default to 'en'.
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // If no language is set in cookies, use 'en' as default
      setLanguage('en');
      Cookies.set('language', 'en'); // Set default language in cookies
    }
  }, []);

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage); // Update the language state
    Cookies.set('language', selectedLanguage); // Save the selected language to cookies
  };

  // ===============================================

  useEffect(() => {
    const logoutReason = sessionStorage.getItem('logoutReason');
    if (logoutReason === 'inactivity' || logoutReason === 'browserClosed') {
      toast.error(`You were logged out due to ${logoutReason === 'inactivity' ? 'inactivity' : 'browser closing or page reload'}`, {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: true,
        draggable: true
      });
      sessionStorage.removeItem('logoutReason');  // Clear after showing toast
    }
  }, []);


  useEffect(() => {
    // Check if the success message exists in localStorage
    const successMessage = localStorage.getItem('resetSuccessMessage');
  

    if (successMessage) {
    
      toast.success(successMessage);

      setTimeout(async () => {
        localStorage.removeItem('resetSuccessMessage');
      }, 5000);
    
    }
  }, []);

  
  useEffect(() => {
    // Check if the success message exists in localStorage
    const termsuccessMessage = localStorage.getItem('termSuccessMessage');
    
    if (termsuccessMessage) {
    
      toast.success(termsuccessMessage);

      // setTimeout(async () => {
      //   localStorage.removeItem('termSuccessMessage');
      // }, 5000);
      
    }
  }, []);


  const [level, setLevel] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    const data = {
      username: username,
      password: password
    };

    try {
      const res = await fetch(`${baseUrl}/login/login_api/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const response = await res.json();
      // console.log(response);
      

      if (response.error && response.status === 2 &&response.AgentId) {
        toast.error(response.error)
        Cookies.set('termsUserId', response.AgentId);
        navigate('/agentTermsandCondition')

      }
      else if (response.error && response.status === 3 && response.AgentId) {
        Cookies.set('pswdUserId', response.AgentId);
        toast.error(response.error)
        navigate('/passwordResetMain')


      } else if (response.status === 1) {
        Cookies.set("adminFAQCount", parseInt(response.admin_msg_count[0].quest_count))
        Cookies.set("agentFAQCount", parseInt(response.agent_msg_count[0].quest_ans_count))

        Cookies.set("desID", response.des);
        Cookies.set('masterUserid', response.username);
        Cookies.set('masterUsername', response.uname);

        if (response.level && response.level.length > 0) {
          const userLevel = response.level[0].level;
          setLevel(userLevel);
          Cookies.set('userLevel', userLevel);
          Cookies.set('userRoleId', response.level[0]?.RoleId);
          Cookies.set('userRoleName', response.level[0]?.RoleName);
          Cookies.set('empEmail', response.level[0]?.email);
        }



        const rightsListString = JSON.stringify(response.rights_list);
        localStorage.setItem('userRights', rightsListString);




        if (response.des) {
          const roleNavigation = {
            // 1: '/agentmanagement',
            2: '/dashboard',
            // 3: '/agentmanagement'
          };

          // if (response.des == 3) {

          //   Cookies.set("userEmail", response.desig[0]?.email);
          //   Cookies.set("userPositionname", response.desig[0]?.position_name);
          //   Cookies.set("userpositionid", response.desig[0]?.position_id);
          // }

          if (response.des && response.des in roleNavigation) {
            Cookies.set('loggedIn', 'true');
            setLoggedIn(true);
            setTimeout(() => {
              navigate(roleNavigation[response.des]);
            }, 0); // Navigate immediately after setting cookies
          }
          else {
            Cookies.set('loggedIn', 'false');
            toast.error('Login not available.');
          }
        }
        else {
          toast.error("Incorrect Username or Password");
        }
      }
      else {
        toast.error(response.error)
      }
    }
    catch (error) {
      console.error('Error logging in:', error);
    }
  };


  useEffect(() => {

    const loggedOutStatus = Cookies.get('loggedOut');
    if (loggedOutStatus === 'true') {
      toast.success('Logged out successfully');
      // const timeout = setTimeout(() => {
      //   Cookies.remove('loggedOut');
      // }, 2000);
      // return () => clearTimeout(timeout); 
      Cookies.remove('loggedOut');
    }
  }, []);


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // const [pwd, setPwd] = useState('');
  // const [isRevealPwd, setIsRevealPwd] = useState(false);
  return (
    <div className="loginbody">
      <ToastContainer
        autoClose={3000}
      />
      <form className="wrapper">
        <div style={{ display: "flex" }} className="loginheader">
          <img
            src={`${process.env.PUBLIC_URL}/assets/MALANKARA.jpg`}
            alt="Malankara logo"
            style={{ height: "200px", width: "auto" }}
          />

        </div>
        <section className="group">
          <input
            type="text"
            size="30"
            className="logininput"
            name="username"
            required
            value={username.toUpperCase()}
            onChange={(e) => setUsername(e.target.value)}
            style={{ textTransform: "uppercase" }}
          />
          <label htmlFor="username" className="label">
            Username
          </label>
        </section >
        <section className="group" style={{ position: 'relative' }}>

          <input
            // type="password"
            className="logininput"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}

          />

          <span
            style={{ position: 'absolute', top: '50%', right: '50px', transform: 'translateY(-50%)', cursor: 'pointer' }}

            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
          <label htmlFor="password" className="label">
            Password

          </label>
        </section>
        <section className="group">
          <LanguageSelector onSelectLanguage={handleLanguageChange} style={{ padding: "9px", border: "none", borderBottom: "1px solid black" }} />

        </section>
        <button type="button" className="btn-login" onClick={handleLogin}>
          LOGIN
        </button>
        <span className="footer"></span>
      </form>
    </div>
  );
}

export default App;