import React, {useState,useEffect} from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom'; // Import Routes
import './App.css';
import Login from './component/pages/Login';
import Question from './Question'; 
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import Register from './component/pages/Register';
import Tracking from './component/pages/Admin/Tracking';
import RouteChangeTracker from './component/GoogleAnalytics/RouteChangeTracker';
import axios from 'axios';
import AboutYou from './component/pages/User/AboutYou';
import Dashboard from './component/pages/User/Dashboard';
const configuration = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_ID,
  },
};

const pca = new PublicClientApplication(configuration);


function App() {
  var token = localStorage.getItem("access_token");
  const [loggedIn, setLoggedIn] = useState(true);
 
  useEffect(() => {
    if (token === null) {
  
      if (window.location.pathname === "/admin_tracking") {
        return;
      }
  
  
      if (window.location.pathname !== "/login")
        window.location.replace("/login");
    } else {
      getUserJwtSession();
    }
  }, []);
  const getUserJwtSession = () => {
    // var token = localStorage.getItem("access_token");
  
    token = "Bearer " + localStorage.getItem("access_token");
  
    console.log("TOKEN", token);
    axios
      .request({
        method: "GET",
        url:
          process.env.REACT_APP_REST_API_BASE_URL + "/check_user_jwt_session",
  
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        console.log(window.location.pathname);
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/register"
        ) {
          window.location.replace("/");
        }
      })
      .catch((error) => {
        console.log(error);
  
        localStorage.removeItem("access_token");
        localStorage.removeItem("student_name");
        localStorage.removeItem("user_type");
        localStorage.removeItem("email_address");
      });
  };
  
 
  const isExpired = (access_token) => {
    const decodedJwt = parseJwt(access_token);
  
    if (decodedJwt.exp * 1000 < Date.now()) {
      return true;
    }
  
    return false;
  };
  
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  return (
    <MsalProvider instance={pca}>
      
      <BrowserRouter>
      <RouteChangeTracker />
        <Routes> 
       
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about_you" element={<AboutYou />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin_tracking" element={<Tracking />} />
          <Route path="/quiz" element={<Question />} />
        </Routes>
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;
