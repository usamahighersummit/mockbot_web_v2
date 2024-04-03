import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from "../images/logo.png";

const Header = ({ stage }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Determine the background color based on the stage prop. Default to white for mobile.
  const backgroundColorClass = stage === 'end' ? 'md:bg-[#F2F2F2]' : 'bg-white';

  
  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
    
      window.location.reload();
    } else {
 
      navigate('/');
    }
  };
  return (
    <div className={`flex justify-center md:justify-start md:px-10 lg:px-16 xl:px-40 2xl:px-60 ${backgroundColorClass}`}>
      {/* Attach onClick event to the logo */}
      <button> <img onClick={handleLogoClick} src={logo} alt='logo' className=" mt-[12px] md:mt-[24px]"/></button>
     
    </div>
  );
}

export default Header;
