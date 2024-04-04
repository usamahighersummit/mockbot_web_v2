import React, { useState, useContext } from "react";
import axios from "axios";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Link, useNavigate } from "react-router-dom";

import {TextField} from "@mui/material";
import appContext from "../../context/appContext";
function ForgotPassword(props) {
  const [passwordCriteraMatch, setPasswordCriteraMatch] = React.useState(true);
  const [confirmPasswordCriteraMatch, setConfirmPasswordCriteraMatch] =
    React.useState(true);
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    React.useState("");

  // React.useEffect(() => {
  //   try {
  //     // amplitude.getInstance().setUserId(null);
  //     // amplitude.getInstance().logEvent("FPP-Page View");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otp, setOtp] = React.useState("");
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const state = useContext(appContext);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const submitForgotPasswordRequest = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if ( !emailRegex.test(credentials.email)) {
     
      alert("Enter valid Email ");

     //  return;
    }
   else{

    const url = "/forgot_password_request_student";
    axios
      .request({
        method: "POST",
        url: process.env.REACT_APP_REST_API_BASE_URL + url,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email_address: credentials.email,
        }),
      })
      .then((res) => {
        console.log(res);
        if (res.data.msg === "Account with this email address does not exist"){   alert("Account with this email address does not exist")}
        else{
          setForgotPasswordStep(1);
        }
       
        // amplitude.getInstance().setUserId(credentials.email);
        // amplitude.getInstance().logEvent("FPP-Submit");
      })
      .catch((err) => {
        console.log(err);
        // amplitude.getInstance().setUserId(credentials.email);
        // amplitude.getInstance().logEvent("FPP-Submit-Unsuccessful");

        if (err.response.status === 404 && credentials.email.length > 0) {
          alert(
            "Account with this email address not exist, Please click on signup to create your account"
          );
        }
      });
    }
  };

  const verifyOtp = (email, one_time_password, e) => {
    e.preventDefault();
    const url = state.loginState === 1 ? "/verify_otp_student" : "/verify_otp_student";
    axios
      .request({
        method: "POST",
        url: process.env.REACT_APP_REST_API_BASE_URL + url,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email_address: email,
          one_time_password: one_time_password,
          class_code: null,
        }),
      })
      .then((res) => {
        console.log(res);
        // amplitude.getInstance().setUserId(email);
        // amplitude.getInstance().logEvent("FPP-OTP-Validated");
        if(res.data.msg === "Invalid OPT"){
           alert("Invalid OPT")
        }
        else{ setForgotPasswordStep(2);}
       
      })
      .catch((err) => {
        // amplitude.getInstance().setUserId(email);
        // amplitude.getInstance().logEvent("FPP-OTP-Invalid");
        if (err.response.status === 401) {
          alert("Invalid OTP entered");
        }
        console.log(err);
        //amplitude.getInstance().setUserId(credentials.email);
        //amplitude.getInstance().logEvent('LoginFailed', "error in login api call for email: " + credentials.email);
      });
  };
  const updatePassword = (e) => {
   
    e.preventDefault();

    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.confirm_password ||
      !otp
    ) {
      alert("All fields must be filled out.");
      return;
    }

    if (!credentials.password.match("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$")) {
      setPasswordHelperText(
        "Password must have at least 6 characters including alphabets and numbers."
      );
      setPasswordCriteraMatch(false);
      return;
    }
    setPasswordHelperText("");
    setPasswordCriteraMatch(true);

    if (credentials.password !== credentials.confirm_password) {
      setConfirmPasswordHelperText(
        "Confirm password did not match with the password entered"
      );
      setConfirmPasswordCriteraMatch(false);
      return;
    }

    setConfirmPasswordHelperText("");
    setConfirmPasswordCriteraMatch(true);

    const url =
      state.loginState === 1
        ? "/update_web_user_password_student"
        : "/update_web_user_password_student";
    axios
      .request({
        method: "POST",
        url: process.env.REACT_APP_REST_API_BASE_URL + url,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          one_time_password: otp,
        
        }),
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("access_token", res.data.access_token);
        if (state.loginState === 1) {
          localStorage.setItem("user_type", "3");
        } else {
          localStorage.setItem("user_type", res.data.user_type);
        }
        localStorage.setItem("email_address", credentials.email);
        console.log("DATA:", res.data);
        if (state.loginState === 1) {
          navigate("/");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("Unable to update web user password");
        }
        console.log(err);
      });
  };

  return (
    <div>
      {forgotPasswordStep === 0 ? (
        <div className="w-full h-full bg-white centered  p-10  sm:p-5">
          <div className="main-content-div  sm:w-[360px] md:w-[520px]">
            {/* <div className="sign-in-sub-label ">
              <p>Please enter the code sent to <br/><b>{credentials.email}</b></p>
            </div>
             */}
            <form>
              <div className="mt-[2px]">
                <label className="email-label">Enter your email address:</label>
                <input
                  type="email"
                  name="email"
                  style={{ height: "45px" }}
                  className="textfield-text border-[1px] border-[#8B8B90] rounded-md w-full px-4 text-black leading-tight "
                  id="username"
                  placeholder="Enter your Username"
                  value={credentials.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="mt-[20px] ">
                <button
                  type="submit"
                  className="sign-in-button bg-[#8854C0] rounded-md hover:bg-black text-[white] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                  onClick={submitForgotPasswordRequest}
                >
                  Submit
                </button>

                <button
                  type="submit"
                  className="create-new-account-text w-[100%]"
                  onClick={() => {
                    navigate("/register");
                    // amplitude.getInstance().setUserId(null);
                    // amplitude.getInstance().logEvent("FPP-Create new account");
                  }}
                >
                  Create new account
                </button>

              
              </div>
            </form>
          </div>
        </div>
      ) : forgotPasswordStep === 1 ? (
        <div className="container w-full h-full bg-white centered  p-10  sm:p-5">
          <div className="main-content-div w-[500px] sm:w-[320px] md:w-[520px]">
            <div className="sign-in-label ">
              <p>OTP Verification</p>
            </div>
            <div className="sign-in-sub-label pt-[8]">
              <p>
                Please enter the code sent to <br />
                <b>{credentials.email}</b>
              </p>
            </div>
            <div>
              <div className="w-full">
                <form>
                  <div className="mt-[24px] w-auto">
                    <MuiOtpInput
                      length={5}
                      value={otp}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-[24px] ">
                    <button
                      type="submit"
                      className="sign-in-button bg-[#8854C0]  rounded-md hover:bg-black text-[white] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                      onClick={(e) => verifyOtp(credentials.email, otp, e)}
                    >
                      Verify
                    </button>

                    <div className="mt-[20px]">
                      <p
                        style={{
                          color: "black",
                          fontSize: "14px",
                          marginBottom: "0px",
                          float: "left",
                          marginRight: "10px",
                        }}
                      >
                        Already have an account?
                        <Link
                          className="sign-in-text"
                          style={{ fontSize: "14px", marginTop: "0px" }}
                          onClick={(e) => {
                            e.preventDefault();
                            props.loginWithEmailStatus();
                            props.forgetPasswordFalseState();
                          }}
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>

                   
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        forgotPasswordStep === 2 && (
          <div className=" w-full  bg-white centered   p-0 sm:p-5">
            <div className=" main-content-div w-[520px] sm:w-[360px] md:w-[520px]">
              <div>
                <div className="w-[100%] pl-[100px] pr-[100px]">
                  <form id="signup-form">
                    <div style={{ width: "359px" }}>
                      <label className="email-label mt-[0px] ">Password</label>
                      <TextField
                        type="password"
                        name="password"
                        style={{ height: "65px", width: "100%" }}
                        className=" textfield-text border-[#8B8B90] border-[1px] rounded-md w-full text-black leading-tight  focus:shadow-blue-900  "
                        id="password"
                        error={!passwordCriteraMatch}
                        helperText={passwordHelperText}
                        placeholder="Enter password"
                        value={credentials.password}
                        onChange={onChange}
                      />
                    </div>

                    <div style={{ width: "359px" }}>
                      <label className="email-label mt-[15px] ">
                        Confirm Password
                      </label>
                      <TextField
                        type="password"
                        name="confirm_password"
                        style={{ height: "65px", width: "100%" }}
                        className=" textfield-text border-[#8B8B90] border-[1px] rounded-md w-full text-black leading-tight  focus:shadow-blue-900  "
                        id="confirm_password"
                        error={!confirmPasswordCriteraMatch}
                        helperText={confirmPasswordHelperText}
                        placeholder="Enter password again"
                        value={credentials.confirm_password}
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-[20px] ">
                      <button
                        type="submit"
                        className="sign-in-button bg-[#8854C0]  rounded-md hover:bg-black text-[white] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                        onClick={(e) => updatePassword(e)}
                      >
                        Update password
                      </button>

                      <div className="mt-[0px]">
                        <p
                          style={{
                            color: "black",
                            fontSize: "14px",
                            marginBottom: "0px",
                            float: "left",
                            marginRight: "10px",
                          }}
                        >
                          Already have an account?
                          <Link
                            className="sign-in-text"
                            style={{ fontSize: "14px", marginTop: "0px" }}
                            onClick={(e) => {
                              e.preventDefault();

                              props.loginWithEmailStatus();
                              props.forgetPasswordFalseState();
                            }}
                          >
                            {" "}
                            Sign in
                          </Link>
                        </p>
                      </div>

                    
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
export default ForgotPassword;
