import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";
import appContext from "../../context/appContext";

function LoginWithEmail(props) {
  const navigate = useNavigate();
  const state = useContext(appContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [forgotPassword, setForgotPassword] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const forgetPasswordFalseState = () => {
    setForgotPassword(false);
  };
  const onForgotPasswordClick = () => {
    // amplitude.getInstance().setUserId(null);
    // amplitude.getInstance().logEvent("LP-ForgotPassword");
    setForgotPassword(true);
  };
  const loginUser = async (e) => {
    e.preventDefault();
 
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(credentials.email) && credentials.email.length >0) {
      alert("Please enter a valid email address.");
      return;
    }

    if (credentials.email.trim() === "" || credentials.password.trim() === "") {
      alert("Please fill in all the empty fields.");
      return;
    }

    const url = "/student_login";
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
       
        }),
      })
      .then((res) => {
        console.log(res);
        if (res.data.access_token === undefined) {
          // alert("Enter valid Email or password");

          // invalid username or password
          alert("Invalid Creditionals");
          return;
        }
        localStorage.setItem("access_token", res.data.access_token);
        if (state.loginState === 1) {
          localStorage.setItem("user_type", "3");
        } else {
          localStorage.setItem("user_type", res.data.user_type);
        }

        localStorage.setItem("email_address", credentials.email);
        if (state.loginState === 1) {
          localStorage.setItem("student_name", res.data.name);
        }
        console.log("DATA:", res.data);

        // amplitude.getInstance().setUserId(credentials.email);
        // amplitude.getInstance().logEvent("LP-ManualLoggedIn");
        if (state.loginState === 1) {
          navigate("/");
        } else {
          if (res.data.new_user) {
            navigate("/");

            return;
          }
          navigate("/");
        }
      })
      .catch((err) => {
        alert("LogIn credentials don't match.");

        console.log(err);
      });
  };
  return (
    <div>
      {!forgotPassword ? (
        <form>
          <div className="mt-[2px] mb-[0px]">
            <label className="email-label color-[#49454F]">
              Enter your email address:
            </label>
            <input
              type="email"
              name="email"
              style={{ height: "45px" }}
              className="textfield-text border-[1px] border-[#8B8B90] rounded-md w-full px-4 text-black leading-tight  "
              id="username"
              placeholder="Enter your Username"
              value={credentials.email}
              onChange={onChange}
            />
          </div>

          <div>
            <label className="email-label mt-[0px] color-[#49454F]">
              Password:
            </label>
            <input
              type="password"
              name="password"
              style={{ height: "45px" }}
              className=" textfield-text border-[#8B8B90] border-[1px] rounded-md w-full px-4 text-black leading-tight  focus:shadow-blue-900  "
              id="password"
              placeholder="Enter your Password"
              value={credentials.password}
              onChange={onChange}
            />
          </div>

          <div className="mt-[8px] ">
            <Link
              className="text-[14px] mt-[0px] sign-in-text color-[black]"
              onClick={() => onForgotPasswordClick()}
            >
              Forgot your password?
            </Link>
            <button
              type="submit"
              className="sign-in-button mt-[8px] bg-[#8854C0]  rounded-md hover:bg-black text-[white] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
              onClick={loginUser}
            >
              Sign In
            </button>

            <div
              style={{
                fontWeight: "700",
                fontSize: "14px",
                textAlign: "center",
                color: "#101010",
              }}
            ></div>

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
      ) : (
        <ForgotPassword
          loginWithEmailStatus={props.loginWithEmailStatus}
          forgetPasswordFalseState={forgetPasswordFalseState}
        />
      )}
    </div>
  );
}

export default LoginWithEmail;
