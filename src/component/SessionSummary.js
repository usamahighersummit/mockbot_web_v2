import React, {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import verify from "../images/green_tick.png"
import ReactGA from "react-ga4"
const SessionSummary = ({ attempts, onRestart, onEmail }) => {
  const email = localStorage.getItem("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    ReactGA.event("Share Feedback button", {
      share_feedback_button: "Share Feedback",
     
    });
  };

  const extractMarks = (feedback) => {
    // Regular expression to find "Marks: " followed by one or more digits
    const regex = /Marks=(\d+)/;
    const match = feedback.match(regex);
    return match ? parseInt(match[1], 10) : 0;
  };
  const trimedText = (feedback) =>{
    var str = feedback;
    str = str.replace(extractMarks(str)," ");
    str = str.replace("Awarded"," ")
    str = str.replace("Marks"," ")
    str = str.replace("Question"," ")
    str = str.replace("Q"," ")
    str = str.replace(":"," ")
    str = str.replace("1"," ")
    str = str.replace("feedback"," ")
    str = str.replace("separator"," ")
    str = str.replace("**"," ")
    str = str.replace("="," ")
    str = str.replace("Marks"," ")
    return str;
  }
  const totalObtainedMarks = attempts.reduce((acc, attempt) => acc + extractMarks(attempt.ai_feedback), 0);
  
  const handleSubmitFeedback =  async ( ) =>{
    var mail = localStorage.getItem('email');
  setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/submit_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         email: mail,
         text: text
        }),
      });
      if (response.ok){
      setLoading(false)
      setIsModalOpen(false);
      setText("")
      setFeedbackSubmitted(true);
      ReactGA.event("Feedback Submitted button", {
        feedback_submitted_button: "Feedback Submitted",
       
      });
      }
      else{
        alert("feedback sending failed")
        setText("")
        setFeedbackSubmitted(false);
      }
    } catch (error) {
      alert(error.message);
    }
  }
  const handleSubmitResponse = async () =>{
 
   var mail = localStorage.getItem('email');
  
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/start_over_count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
     
        },
        body: JSON.stringify({
          student_email: mail,
        
        }),
      });
      if (response.ok){
        ReactGA.event("Start Over button", {
          start_over_button: "Start over",
         
        });
      
   onRestart();
      }
      else{

      
      }
    } catch (error) {
      alert(error.message);
    }
 
  }

  return (
    <div className="flex bg-[#F2F2F2] justify-center items-center min-h-screen">
      <div className="bg-white max-w-2xl mx-auto p-4 rounded-[12px]">
        <h2 className="text-xl font-semibold text-center">Session Summary</h2>
        <br />
      
       
        <br />
        {attempts.length > 0 ? (
          attempts.map((attempt, index) => (
            <div key={index} className="my-2 p-2 border-b">
                <div style={{display: index ===0 ? '': 'none'}} className='flex flex-row  justify-between items-center'> <p><b>Your Email:</b> {email}</p> 
        <p className='float-right'><b>Marks Obtained :</b> {totalObtainedMarks}/{attempts.reduce((acc, attempt) => acc + attempt.question_marks, 0)}</p></div>
              <div className='w-full mt-[24px]' style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0 }}>
                    <b>Question {index + 1}:</b> {attempt.question.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
                <div style={{ marginLeft: '20px', alignSelf: 'start' }}>
                  <span className=''><b>[</b> <b>Marks :</b> {extractMarks(attempt.ai_feedback)}/{attempt.question_marks} <b>]</b></span>
                </div>
              </div>

              <p className='mt-[4px]'><b>Your Answer:</b> {attempt.answer}</p>
              <br />
              <p><b>Feedback:</b> {trimedText(attempt.ai_feedback)}</p>
              <br />
              <Accordion>
                <AccordionSummary  aria-controls="panel1a-content" id="panel1a-header">
                  <Typography><b>Actual Answer:</b></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {attempt.actual_answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))
        ) : (
          <p className="text-center">No questions were attempted.</p>
        )}
         {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center  z-50">
          <div className="bg-white p-4 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-[12px]">Your feedback matters, send it here</h3>
            <textarea className="mt-2 p-2 w-full h-32 border border-gray-300 rounded resize-none" placeholder="Enter your feedback here...." value={text} onChange={(e)=>{setText(e.target.value)}} ></textarea>
            <div className="flex justify-end gap-2 mt-4">
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={toggleModal}>Close</button>
              <button className="flex bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" style={{backgroundColor: text.length === 0 ? 'grey' : ''}} onClick={handleSubmitFeedback} disabled={text.length === 0} >Submit {loading && (
    <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )}</button>
            
            </div>
          </div>
        </div>
      )}
      {feedbackSubmitted && (<div className='flex justify-center mb-[20px] gap-3'>
        <b>Feedback Submitted</b> <img src={verify} alt='verify' />
      </div>)}
        <div className="flex justify-center gap-4 mt-4 flex-col">
       {!feedbackSubmitted &&  ( <button className="bg-[white] w-full hover:opacity-[0.7] text-purple-700 font-bold py-2 px-4  border-[1px] border-[grey] rounded"onClick={toggleModal}>Share Feedback</button>)}
          <button className="bg-[#8854C0] w-full hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmitResponse}>Start Over</button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" style={{ display: "none" }} onClick={onEmail}>Email Summary</button>
        </div>
      </div>
    </div>
  );
}

export default SessionSummary;
