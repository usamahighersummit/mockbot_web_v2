import { useContext } from "react";
import MockBotIcon from "../../images/login_icon.png";
import Background from "../../images/background.png";
import appContext from "../../context/appContext";

function LoginPageLeftSide(props) {
  const state = useContext(appContext);

  return (
    <div
    className="flex flex-col justify-between h-screen w-full bg-no-repeat bg-cover  bg-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="flex justify-start">
        <img src={MockBotIcon} alt="MockBot Icon" className="mt-5 ml-5" />
      </div>

      <div className="mr-[80px] ml-[80px]">
        <h1 className="text-4xl font-bold text-white leading-tight mb-6">
          Smash Your Exams with MockBot's AI Marking & Feedback
        </h1>
        <p className="text-white text-lg mb-6">
          Dive into <span className="border-b border-white">topic-based exam questions</span> & get <span className="border-b border-white">instant, AI-powered feedback</span> for smarter studying & better grades. With MockBot, It's not just practice; it's targeted improvement.
        </p>
        <p className="text-yellow-300 text-sm mb-6">
          ⚠️ MockBot is in Beta; quiz evaluations may occasionally be inaccurate.
        </p>
      </div>

      <div className="flex  items-center justify-center text-white text-xs pb-4">
        <div className="mr-4">
          © MockBot. All rights reserved
        </div>
        <div>
          <span className="underline cursor-pointer">About</span>
          <span className="ml-4 underline cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPageLeftSide;
