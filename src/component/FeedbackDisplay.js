import React, { useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import thumbsUp from "../images/thumb_up_0.png"
import thumbsDown from "../images/thumb_down_0.png"
import thumbsUpSelected from "../images/thumb_up.png"
import thumbsDownSelected from "../images/thumb_down.png"
import thumb_down_red from '../images/thumbdown_red.png'
const FeedbackDisplay = ({ feedback, modelAnswer, onNext, onEnd, loading,question_marks, question, rubric, answer,prompts }) => {
  const [isOpen, setIsOpen] = useState(true)
    const [isOpenAnswer, setIsOpenAnswer] = useState(true)
    const [thumbUpResponse, setThumbUpResponse] = useState(0);
    const [thumbDownResponse, setThumbDownResponse] = useState(0);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const feedbackResponse = useRef();
    const [feedbackText, setFeedbackText]= useState("");
    const [feedbackId, setFeedbackId] = useState(null);
     const cancled = useRef(false);
  const extractMarks = (feedback) => {
    // Regular expression to find "Marks: " followed by one or more digits
    const regex = /Marks=(\d+)/;
    const match = feedback.match(regex);
    return match ? match[1] : "Not found";
  };

  const trimedText = () =>{
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
  const handleOpenCloseFeedback = () =>{
    if(isOpen){
      setIsOpen(false);
    }
    else{
      setIsOpen(true);
    }
  }
  const handleOpenCloseAnswer = () =>{
    if(isOpenAnswer){
      setIsOpenAnswer(false);
    }
    else{
      setIsOpenAnswer(true);
    }
  }
  const handleSubmitResponse = async () =>{
    setFeedbackId(null);
    onNext();


  }
  const handleEnd = () =>{
    setFeedbackId(null);
    onEnd();
  }
  const handleThumbsUp = () =>{
    if(thumbUpResponse ===0){
    setThumbUpResponse(1);
    setThumbDownResponse(0);
feedbackResponse.current =1;
cancled.current = false;
setFeedbackText(null);
    submitResponse();
    }
    else{
      return;
    }
  }
  const handleThumbsDown = () =>{
    if(thumbDownResponse ===0 ){
    setThumbUpResponse(0);
    setThumbDownResponse(2);
    setIsFeedbackDialogOpen(true);
    feedbackResponse.current =2;
    
  }
  else{
    return;
  }
  }
  const closeFeedbackDialog = () => {
    setIsFeedbackDialogOpen(false);
    setIsFeedbackDialogOpen(false);
    setFeedbackText(null);
    cancled.current = true;
    submitResponse();
    
  }
  const handleSubmit = async () =>{
    setIsFeedbackDialogOpen(false);
    cancled.current = false;
    submitResponse();
  }
  const submitResponse = async () => {
    var sbj_name = localStorage.getItem('subject_name');
    var topic_name = localStorage.getItem('topic_name');
    var mail = localStorage.getItem('email');
  
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/submit_question_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mail,
          subject_name: sbj_name,
          topic: topic_name === 'undefined' ? "ALL Topics" : topic_name,
          question: question,
          student_answer: answer,
          question_marks: question_marks,
          obtained_marks: extractMarks(feedback),
          ai_feedback: feedback,
          actual_answer: modelAnswer,
          rubric:rubric,
          student_response: feedbackResponse.current ,
          student_question_feedback:  feedbackResponse.current === 2 && cancled.current === false ? feedbackText : null,
          prompt:prompts ,
          question_feedback_id: feedbackId,
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Extract JSON body from the response
        console.log("response data: ", responseData); // Log the response data
  setFeedbackId(responseData.question_feedback_id)
        // Access and log the question_feedback_id if available
       
      } else {
        console.log("Response was not OK", response.status);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <div className="flex justify-center items-center ">
      <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-lg text-left bg-[#D6D6D6] opacity-[0.9]">
        
      <Accordion onClick={handleOpenCloseFeedback}  expanded={isOpen}>
          <AccordionSummary
        
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{width:'100%'}}><b>Feedback <span className='float-right'>  [ Marks : {extractMarks(feedback)}/{question_marks}  ]</span></b></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography >
              {trimedText()}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <div className='w-full flex justify-end gap-[8px] '>  <p className='mt-1' style={{fontFamily:'Roboto', fontSize:'12px', lineHeight:'20px',fontWeight:'500', color:"#7B7B7B"}}>Please rate MockBot's analysis</p><button><img className='btn' height={24} onClick={handleThumbsUp} src={thumbUpResponse === 0 ? thumbsUp :thumbsUpSelected} alt="tu"/></button><button><img className='btn' onClick={handleThumbsDown} src={thumbDownResponse === 0 ? thumbsDown : thumbsDownSelected} alt="tu"/></button></div>
        <Accordion onClick={handleOpenCloseAnswer}  expanded={isOpenAnswer}>
          <AccordionSummary
          
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography><b>Actual Answer</b></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {modelAnswer}
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        <div className="flex justify-center gap-[80px] mt-6">
         
         
          <button className="bg-white  w-[280px] hover:bg-[wheat] text-[#1C1B1F] font-bold py-2 px-4 rounded transition duration-150 ease-in-out" onClick={handleEnd}>End</button>
          <button className="bg-[#8854C0] w-[280px] hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center justify-center" onClick={handleSubmitResponse}>
  Next
  {loading && (
    <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )}
</button>
        </div>
        
      </div>
      {isFeedbackDialogOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
    <div className="bg-white rounded-lg w-96">
      <div className="flex flex-col items-start p-4 ">
        <div className="flex items-center w-full  mb-2">
      
         
       
          <div className="flex font-medium px-2 gap-2">   <img className='mt-1' src={thumb_down_red} alt="tdr" />Provide additional feedback</div>
      
        </div>
        <textarea
          className="w-full h-24 p-2 mt-2 mb-4 text-sm text-gray-800 bg-gray-100 rounded-lg focus:outline-none  focus:shadow-outline resize-none"
          placeholder="Type here to explain what could be improved..."
          value={feedbackText}
          onChange={(e)=>{setFeedbackText(e.target.value)}}
        />
        <div className="flex justify-end w-full ">
          <button className="px-4 py-2 mr-3 text-sm text-[#8854C0] background-transparent rounded-lg hover:bg-gray-200 focus:outline-none" onClick={closeFeedbackDialog}>CANCEL</button>
          <button className="px-4 py-2 text-sm text-[#8854C0] background-transparent rounded-lg  hover:bg-gray-200 focus:outline-none" onClick={handleSubmit}>SUBMIT</button>
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default FeedbackDisplay;
