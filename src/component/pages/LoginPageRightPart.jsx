import React from "react";

import LoginOptions from "./LoginOptions";

function LoginPageRightSide(props) {
  return (
    <div>
      <div className="w-full h-screen bg-white centered md:h-screen p-10 md:p-28 sm:p-5">
        <div className="main-content-div w-[500px] sm:w-[320px] md:w-[520px]">
          <div className="sign-in-label mb-[16px]">
            <p className="text-[24px]">{props.header}</p>
          </div>
          <div className="w-[100%] flex justify-center">
            <LoginOptions teacher={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPageRightSide;
