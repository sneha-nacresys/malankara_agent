import React, { useState, useEffect, useCallback, useRef } from "react";
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import baseUrl from "../ConstUrl/url";


const SessionTimeout = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
    const [events] = useState([
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
  "touchstart"]);

  const [second, setSecond] = useState(0);
  const [isInactivityLogout, setIsInactivityLogout] = useState(false);

  let warningInactiveInterval = useRef();
  let startTimerInterval = useRef();
  let navigate = useNavigate();


  const logout = async () => {
    const mainUserid = Cookies.get('masterUserid');
  
    if (!mainUserid) {
      toast.error('User ID not found');
      return;
    }
  
    const data = {
      userid: mainUserid,
    };
  
    try {
      // Make the API call
      const res = await fetch(`${baseUrl}/login/logout_api/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const response = await res.json();
  
      if (response.status === 0) {
        // Clear cookies and local storage if the API call was successful
        Object.keys(Cookies.get()).forEach(function (cookieName) {
          Cookies.remove(cookieName);
        });
  
        localStorage.clear();
        sessionStorage.clear();
        Cookies.set('loggedIn', 'false');
        Cookies.set('loggedOut', 'true');
  
        toast.success('Logged out successfully due to inactivity');
  
        setIsInactivityLogout(true);
        sessionStorage.setItem('logoutReason', 'inactivity');
  
        navigate('/'); // Redirect to login page
      } else {
        // Handle the case where the API returned an error
        toast.error('Error logging out: ' + response.error);
      }
    } catch (error) {
      // Handle network or API call failure
      toast.error('Error logging out: ' + error.message);
    }
  };
  

  // const logout = () => {
  //   // Clear cookies and local storage
  //   Object.keys(Cookies.get()).forEach(function(cookieName) {
  //     Cookies.remove(cookieName);
  //   });
  //   localStorage.clear();
  //   sessionStorage.clear();

  // toast.error("User logged out due to inactivity");

  // setIsInactivityLogout(true);

  // sessionStorage.setItem('logoutReason', 'inactivity');
    
  //   navigate('/');
  // };



  // Start checking for inactivity
  const timeChecker = () => {
    startTimerInterval.current = setTimeout(() => {
      const storedTimeStamp = sessionStorage.getItem("lastTimeStamp");
      warningInactive(storedTimeStamp);
    }, 60000); // Check every minute
  };

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    clearTimeout(startTimerInterval.current);
    clearInterval(warningInactiveInterval.current);

    const timeStamp = moment();
    sessionStorage.setItem("lastTimeStamp", timeStamp);

    timeChecker();
  }, []);

  // Check if the user is inactive for too long
  const warningInactive = (timeString) => {
    clearTimeout(startTimerInterval.current);

    warningInactiveInterval.current = setInterval(() => {
        const maxInactiveMinutes = 15; 
        const warningMinutes = 14; 

      const diff = moment.duration(moment().diff(moment(timeString)));
      const minutesPast = diff.minutes();
      const secondsLeft = 60 - diff.seconds();

      if (minutesPast === warningMinutes) {
        setSecond(secondsLeft);
      }

      if (minutesPast >= maxInactiveMinutes) {
        clearInterval(warningInactiveInterval.current);
        sessionStorage.removeItem("lastTimeStamp");
        logout(); // Trigger logout
        // setSecond(0); 
      }
    }, 1000); // Check every second
  };

  useEffect(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    timeChecker();

    return () => {
      clearTimeout(startTimerInterval.current);
      clearInterval(warningInactiveInterval.current);
    };
  }, [resetTimer, events]);


  return (
    <div >
 {/* {isInactivityLogout && second > 0 && <p >You have been logged out due to inactivity.</p>}    */}
 
  </div>
  );
};

export default SessionTimeout;
