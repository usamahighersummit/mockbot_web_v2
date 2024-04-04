import React from "react";

import LoginPageRightSide from "./LoginPageRightPart";
import LoginPageLeftSide from "./LoginPageLeftSide";


function Login() {
 

  return (
    <React.Fragment>
      <section>
      <div className="w-auto h-auto grid  text-white text-4xl md:grid-cols-2 sm:grid-cols-1 overflow-hidden ">
          <LoginPageLeftSide />
          <LoginPageRightSide header="Boost your grades - join MockBot now!" />
        </div>
      </section>
    </React.Fragment>
  );
}

export default Login;
