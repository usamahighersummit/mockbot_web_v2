import React, {useEffect, useState} from 'react';
import ReactGA from "react-ga4"
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
const PurpleCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.getContrastText('#6750A4'), // Color for unchecked state
  '&.Mui-checked': {
    color: '#6750A4', // Custom color for checked state
  },
  '&.MuiCheckbox-root': {
    color: '#6750A4', // Ensures the checkbox has a visible color when unchecked
  },
  // Adjusting the size of the checkbox icon
  '& svg': {
    width: '16px', // Set the width of the checkbox
    height: '16px', // Set the height of the checkbox
  },
}));
const EmailInput = ({ email, setEmail, onSubmit,stage }) => {
  var topicName = localStorage.getItem("topic_name");
  var sbjName = localStorage.getItem("subject_name");
  const [update, setUpdate]= useState(true);
  const handleSubmitResponse = async () => {
 
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(email)){
      alert("Invalid email")
       return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}get_user_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         email: email,
         subject_name:  sbjName,
        
        }),
      });
      if (response.ok){
        onSubmit();
      }
      else{
    
      }
    } catch (error) {
      console.log(error.message);
    }
     
    
  };
useEffect(()=>{
 if(stage === 'email'){

  if(topicName === 'undefined'){
  ReactGA.event("Select Topic", {
    topic_name: "All Topic", // 'subject_name' as a custom parameter
    // Include any other custom parameters here
  });
  
}
else{
  ReactGA.event("Select Topic", {
    topic_name: topicName, // 'subject_name' as a custom parameter
    // Include any other custom parameters here
  });
}
 }
},[])
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="md:w-[35%] flex flex-col items-center justify-center mx-2 md:mx-4 lg:mx-8 xl:mx-16">
        <h2 className="text-xl font-semibold mb-[4px]" style={{ fontFamily: 'Roboto', fontWeight: '700', fontSize: '22px', lineHeight: '32px' }}>Want to see how you're doing?</h2>
        <p className="mb-[12px] md:text-[16px] sm:text-sm" style={{ fontFamily: 'Roboto', fontWeight: '400', lineHeight: '28px', color:"#322E33" }}>Enter your email to receive marks and feedback!</p>
        <input
          type="email"
          className="w-full text-black p-2 border rounded mb-[4px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email here.."
          required
        />
           <div className=" mb-[4px] float-left w-full text-[#322E33] ">   <FormControlLabel
      control={
        <PurpleCheckbox
          checked={update}
          onChange={() => setUpdate(!update)}
        />
      }
      label={
        <Typography variant="body1" style={{ color: '#322E33', fontFamily:"Roboto", fontSize:"14px", lineHeight:'20px', letterSpacing:"0.1px" }}>
         I want to receive updates about mockbot

        </Typography>
      }
    /></div>
        <button
          className="bg-[#8854C0] w-full hover:bg-[#8853C1] text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={handleSubmitResponse}
          disabled={!email.trim()}
        >
          Start Mock
        </button>
      </div>
    </div>
  );
};

export default EmailInput;
