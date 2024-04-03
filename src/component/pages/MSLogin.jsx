import React, { useState } from "react";
import { Image } from "semantic-ui-react";
import { useMsal } from "@azure/msal-react";
import MsIcon from "../images/ic_microsoft.svg";

function MSLogin() {
  const { instance } = useMsal();
  const [setErrorMsg] = useState("");

  const login = () => {
    instance
      .loginPopup({
        scopes: ["email"],
      })
      .then((result) => {
        return result;
      })
      .then((result) => {
        if (result.status) {
        } else {
          setErrorMsg(result && result.err);
        }
      })
      .catch((err) => {
        console.log(err.errName, err.errType);
      });
  };

  return (
    <>
      {/* <div
        onClick={() => {
         
        }}
      >
        <center>
          <div className="flex border-black border-[1px] w-56 p-2 mt-2">
            <Image
              src={MsIcon}
              size="small"
              centered
              alt={process.env.REACT_APP_SCHOOL_NAME}
              className="h-6 w-6"
            />
            <div className="ml-2 cursor-default">Login With Microsoft</div>
          </div>
        </center>
      </div> */}

      <div
        className="mt-[20px]"
        style={{
          position: "relative",
          //  display:'flex',
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <GoogleButton  style={{width: "100%"}} label="Sign in with Google 🚀 " onClick={() => login()}/> */}
        <button
          type="submit"
          className="create-new-account-button border-[1px] border-[#474747] rounded-md hover:bg-black text-[black] hover:text-white font-bold py-2 px-4 w-full h-[45px]"
          onClick={() => login()}
        >
          <div style={{ display: "inherit" }}>
            <div className="flex">
              <img alt="" className="float-left w-[26px]" src={MsIcon}></img>
              Continue with Microsoft
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

export default MSLogin;
