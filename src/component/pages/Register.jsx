import React, { useState, useContext } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import { Link, useNavigate } from "react-router-dom";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { MuiOtpInput } from "mui-one-time-password-input";
import TextField from "@material-ui/core/TextField";
import google_icon from "../pages/images/ic_google.svg";
import microsoft_icon from "../pages/images/ic_microsoft.svg";
import appContext from "../../context/appContext";
import validator from "validator";
import LoginPageLeftSide from "./LoginPageLeftSide";

function Register() {
  React.useEffect(() => {
    try {

    } catch (e) {
      console.log(e);
    }
  }, []);

  const [otp, setOtp] = React.useState("");

  const [passwordCriteraMatch, setPasswordCriteraMatch] = React.useState(true);
  const [confirmPasswordCriteraMatch, setConfirmPasswordCriteraMatch] =
    React.useState(true);
  const [passwordHelperText, setPasswordHelperText] = React.useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    React.useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    one_time_password: "",
  });

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const [signUpStep, setSignUpStep] = useState(1);
  const state = useContext(appContext);
  

  const createUserAccount = (email, password, auth_type, name) => {
    console.log("URL IS: ", process.env);
    const url = "/create_new_user_by_otp_authentication_student";
    var fullname= name.replace(" ", " | ")
    axios
      .request({
        method: "POST",
        url: process.env.REACT_APP_REST_API_BASE_URL + url,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          name: fullname,
          email: email,
          password: password,
        }),
      })
      .then((res) => {
        console.log(res);

        setSignUpStep(2);
        // amplitude.getInstance().setUserId(email);
        // amplitude.getInstance().logEvent("SU-CwithWorkEmail");
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 409) {
        alert("email already exists")
          return;
        }
    
      });
  };

  const verifyOtp = (email, one_time_password, e) => {
    var classCode = localStorage.getItem("class_code");
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
          class_code: classCode !== undefined ? classCode : null,
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
        localStorage.setItem("email_address", email);
        console.log("DATA:", res.data);
        if (state.loginState === 1) {
          navigate("/about_you");
        } else {
          if (res.data.new_user) {
            navigate("/about_you");
            return;
          }
          navigate("/about_you");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {

        }
   
        console.log(err);
   
      });
  };


  const signUpUser = (e) => {
    e.preventDefault();
    if (
      credentials.name.trim() === "" ||
      credentials.email.trim() === "" ||
      credentials.password.trim() === "" ||
      credentials.confirm_password.trim() === ""
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (validator.isEmail(credentials.email)) {
    } else {
      setEmailError("Enter valid Email!");
      setIsValidEmail(true);
      return;
    }

    if (!credentials.password.match("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$")) {
      setPasswordHelperText(
        "Password must have atleast 6 characters including alphabets and numbers."
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

    createUserAccount(
      credentials.email,
      credentials.password,
      1,
      credentials.name
    );
 
  };
  const onChange = (e) => {
    setIsValidEmail(false);
    setEmailError("");
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          titleStyle={{ textAlign: "center" }}
          textAlign="center"
        >
          <b>Thank you!</b>
        </DialogTitle>
        <DialogContent titleStyle={{ textAlign: "center" }} textAlign="center">
          <DialogContentText
            id="alert-dialog-description"
            titleStyle={{ textAlign: "center" }}
            textAlign="center"
          >
            Someone will get in touch shortly
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{ justifyItems: "center", justifyContent: "center" }}
        >
          <button
            fullWidth
            type="submit"
            style={{ width: "180px", height: "45px" }}
            className="early_access__dialog_close_button  hover:text-white font-bold py-2 px-4 "
            onClick={handleClose}
          >
            Close
          </button>
          {/* <Button onClick={handleClose}>Close</Button> */}
        </DialogActions>
      </Dialog>
      <section>
      <div className="w-auto h-auto grid  text-white text-4xl md:grid-cols-2 sm:grid-cols-1 overflow-hidden ">
          <LoginPageLeftSide />
          {/* page 2 */}
          {signUpStep === 0 ? (
            <div className="w-[60%] h-full bg-white centered md:h-screen p-10 md:p-40 sm:p-5">
              <div className="main-content-div w-[500px] sm:w-[360px] md:w-[420px]">
                <div className="sign-in-label ">
                  <p>Welcome to Mockbot</p>
                </div>
                <div className="sign-in-sub-label ">
                  <p>
                    Choose how would you like to create your
                    <br />
                    Mockbot account
                  </p>
                </div>

                <div>
                  <div className="w-full">
                    <button
                      type="submit"
                      style={{ display: "none" }}
                      className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                      onClick={() => {
                        setSignUpStep(1);
                        // amplitude.getInstance().setUserId(null);
                        // amplitude.getInstance().logEvent("MAR-Page View");
                      }}
                    >
                      Continue with work email
                    </button>
                    <div
                      className="mt-[20px]"
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* <GoogleButton label="Sign in with Google 🚀 " onClick={() => login()}/> */}
                      <button
                        type="submit"
                        style={{ display: "none" }}
                        className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                      >
                        <div style={{ display: "inline-block" }}>
                          <div className="flex">
                            <img
                              alt=""
                              className="float-left w-[26px] mr-[10px]"
                              src={google_icon}
                            ></img>
                            Continue with Google
                            <div style={{ visibility: "hidden" }}>ds</div>
                          </div>
                        </div>
                      </button>
                    </div>
                    <div
                      className="mt-[20px]"
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        type="submit"
                        style={{ display: "none" }}
                        className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                      >
                        <div style={{ display: "inline-block" }}>
                          <div className="flex">
                            <img
                              alt=""
                              className="float-left w-[26px] mr-[10px]"
                              src={microsoft_icon}
                            ></img>
                            Continue with Microsoft
                          </div>
                        </div>
                      </button>

                      {/* <MicrosoftLogin
                  buttonTheme="light"
                  className="bg-center"
                  clientId={"82c15ec2-c4b6-47e0-b520-6f3839d026c4"}
                  authCallback={authHandler}
                /> */}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    textAlign: "center",
                    color: "#101010",
                  }}
                >
                  <p className="mb-[0px]">Or</p>
                </div>

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
                    Already have an account?{" "}
                    <Link
                      className="sign-in-text"
                      style={{ fontSize: "14px", marginTop: "0px" }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                        // amplitude.getInstance().setUserId(null);
                        // amplitude.getInstance().logEvent("SU- ClickSign in");
                      }}
                    >
                      {" "}
                      Sign in
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          ) : signUpStep === 1 ? (
            <div className="w-full h-full bg-white centered md:h-screen  ">
              <div className="main-content-div w-[500px] sm:w-[360px] md:w-[520px]">
                <div className="sign-in-label  ">
                  <p>Welcome to Mockbot</p>
                </div>

                <div><div className=" flex justify-center items-center ">
                    <form id="signup-form" className="w-[400px] ">
                      {state.loginState === 2 && (
                        <div className="mt-[2px]">
                          <label className="email-label color-[#49454F]">
                            Enter your name:
                          </label>
                          <TextField
                            type="text"
                            name="name"
                            style={{
                              height: "45px",
                            }}
                            className="textfield-text border-[#8B8B90] border-[1px] rounded-md w-full text-black leading-tight  focus:shadow-blue-900 "
                            id="username"
                            placeholder="Enter your name"
                            value={credentials.name}
                            onChange={onChange}
                          />
                        </div>
                      )}

                      <div className="mt-[2px]">
                        <label className="email-label color-[#49454F]">
                          Enter your email address:
                        </label>
                        <TextField
                          type="email"
                          name="email"
                          style={{
                            height: "45px",
                            marginBottom: isValidEmail ? "10px" : null,
                          }}
                          className="textfield-text border-[#8B8B90] border-[1px] rounded-md w-full text-black leading-tight  focus:shadow-blue-900 "
                          id="username"
                          placeholder="Enter your email"
                          value={credentials.email}
                          onChange={onChange}
                          error={isValidEmail}
                          helperText={emailError}
                        />
                      </div>
                      <div>
                        <label className="email-label mt-[13px] color-[#49454F]">
                          Password:
                        </label>
                        <TextField
                          type="password"
                          name="password"
                          style={{ height: "45px" }}
                          className="myTextField textfield-text  border-[#8B8B90] border-[1px] rounded-md w-full text-black leading-tight  focus:shadow-blue-900  "
                          id="password"
                          error={!passwordCriteraMatch}
                          helperText={passwordHelperText}
                          placeholder="Enter password"
                          value={credentials.password}
                          onChange={onChange}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: passwordHelperText ? "30px" : "0px",
                        }}
                      >
                        <label className="email-label mt-[10px] color-[#49454F] ">
                          Confirm Password:
                        </label>
                        <TextField
                          type="password"
                          name="confirm_password"
                          style={{ height: "45px" }}
                          className=" textfield-text border-[#8B8B90] border-[1px] rounded-md w-full text-black leading-tight  focus:shadow-blue-900  "
                          id="confirm_password"
                          error={!confirmPasswordCriteraMatch}
                          helperText={confirmPasswordHelperText}
                          placeholder="Enter password again"
                          value={credentials.confirm_password}
                          onChange={onChange}
                        />
                      </div>

                      <div className="mt-[28px] ">
                        <button
                          type="submit"
                          className="sign-in-button bg-[black]   rounded-md hover:bg-black text-[white] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                          onClick={(e) => signUpUser(e)}
                        >
                          Sign Up
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
                              style={{
                                fontSize: "14px",
                                marginTop: "0px",
                                color: "#9A7BA2",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                                // amplitude.getInstance().setUserId(null);
                                // amplitude
                                //   .getInstance()
                                //   .logEvent("SU- ClickSign in");
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
          ) : (
            signUpStep === 2 && (
              <div className="w-full h-full bg-white centered md:h-screen p-10 md:p-36 sm:p-5">
                <div className="main-content-div w-[500px] sm:w-[360px] md:w-[520px]">
                  <div className="sign-in-label ">
                    <p>Welcome to Mockbot</p>
                  </div>
                  <div className="sign-in-sub-label mt-[8px] ">
                    <p>
                      Please enter the code sent to <br />
                      <b>{credentials.email}</b>
                    </p>
                  </div>
                  <div>
                    <div className="w-full">
                      <form>
                        <div className="mt-[24px]">
                          {/* <input
                    name="one_time_password"
                    style={{ height: "65px" }}
                    className="textfield-text border-[1px] border-[#8B8B90] rounded-md w-full py-7 px-4 text-black leading-tight  "
                    id="verification_code"
                    placeholder="Enter your verification"
                    value={credentials.one_time_password}
                    onChange={onChange}
                  /> */}
                          <MuiOtpInput
                            length={5}
                            value={otp}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mt-[24px] ">
                          <button
                            type="submit"
                            className="sign-in-button bg-[black]  rounded-md hover:bg-black text-[white] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
                            onClick={(e) =>
                              verifyOtp(credentials.email, otp, e)
                            }
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
                                  navigate("/login");
                          
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
            )
          )}
        </div>
      </section>
    </React.Fragment>
  );
}

export default Register;
