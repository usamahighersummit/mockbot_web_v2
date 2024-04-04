import React, { useContext, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import google_icon from "./images/ic_google.svg";
import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import microsoft_icon from "./images/ic_microsoft.svg";
import LoginWithEmail from "./LoginWithEmail";


function LoginOptions(props) {
  const [user, setUser] = useState(null);
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [loginWithEmail, setLoginWithEmail] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });
  const loginWithEmailStatus = () => {
    setLoginWithEmail(true);
  };

  const loginWithMicrosoft = () => {
    instance
      .loginPopup({
        scopes: ["email"],
      })
      .then((result) => {
        return result;
      })
      .then((result) => {
        console.log("MICROSOFT DATA: ", result);
        checkUserAccountAndThenLogin(result.account, 3);
      })
      .catch((err) => {
        console.log(err.errName, err.errType);
     
      });
  };
  function checkUserAccountAndThenLogin(email, auth_type) {
  
    const url = props.user_type
      ? "/student_login_with_google_or_ms_verified_email"
      : "/login_with_google_or_ms_verified_email";
  var name = email.name.replace(" "," | " );
    axios
      .request({
        method: "POST",
        url: process.env.REACT_APP_REST_API_BASE_URL + url,
        headers: {
          "Content-Type": "application/json",
       
        },
        data: JSON.stringify({
          email: auth_type === 3 ? email.username : email.email,
          auth_type: auth_type,
       
          name: name,
        }),
      })
      .then((res) => {
        console.log(res);

   

        localStorage.setItem("access_token", res.data.access_token);
        if (props.user_type) {
          localStorage.setItem("user_type", "3");
        } else {
          localStorage.setItem("user_type", res.data.user_type);
        }
        localStorage.setItem(
          "email_address",
          auth_type === 3 ? email.username : email.email
        );
        if (props.user_type) {
          localStorage.setItem("student_name", email.name);
        }
        console.log("DATA:", res.data);
     
        if (props.user_type) {
          navigate("/", {});
        } else {
          if (res.data.new_user) {
            navigate("/about_you");
            return;
          }
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);

    
      });
  }
  useEffect(() => {
    if (user != null) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // setProfile(res.data);
          checkUserAccountAndThenLogin(res.data, 2);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);
  return (
    <div>
      {!loginWithEmail ? (
        <div>
          <div>
            <div className="w-full">
              <div className="login-options">
              Choose how would you like to sign in your MockBot account
              </div>
              <div
                className="mt-[20px] "
                style={{
                  position: "relative",
                  //  display:'flex',
                  alignItems: "center",
                  justifyContent: "center",
            
                  borderRadius: "4px",
                }}
              >
                {/* <GoogleButton  style={{width: "100%"}} label="Sign in with Google 🚀 " onClick={() => login()}/> */}
                <button
                  type="submit"
                  className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full  h-auto"
                  onClick={() => login()}
                >
                  <div
                    style={{
                      display: "inherit",

                      justifyContent: "center",
                    }}
                  >
                    <div className="flex centered">
                      <img
                        alt=""
                        className="float-left w-[26px] mr-[10px] centered"
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
               
                  borderRadius: "4px",
                }}
              >
                <button
                  type="submit"
                  className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full  h-auto"
                  onClick={() => loginWithMicrosoft()}
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
              </div>
              <div
                className="mt-[20px] mb-[0px]"
                style={{
                  position: "relative",
                  //  display:'flex',
                  alignItems: "center",
                  justifyContent: "center",
          
                  borderRadius: "4px",
                }}
              >
                {/* <GoogleButton  style={{width: "100%"}} label="Sign in with Google 🚀 " onClick={() => login()}/> */}
                <button
                  type="submit"
                  className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full  h-auto"
                  onClick={() => loginWithEmailStatus()}
                >
                  <div style={{ display: "inherit" }}>
                    <div className="flex">
                      <img
                      // alt=""
                      // className="float-left w-[26px] mr-[10px]"
                      // src={google_icon}
                      ></img>
                      Continue with Email
                    </div>
                  </div>
                </button>
              </div>
              <button
                type="submit"
                className="create-new-account-text w-[100%] mt-[4px]"
                onClick={() => {
                  navigate("/register");
                
                }}
              >
                Create new account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LoginWithEmail
          classCode={props.classCode}
          loginWithEmailStatus={loginWithEmailStatus}
        />
      )}
    </div>
  );
}

export default LoginOptions;
