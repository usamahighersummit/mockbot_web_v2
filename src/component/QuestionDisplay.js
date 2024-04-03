import React, { useState } from 'react';
import FeedbackDisplay from './FeedbackDisplay';
import Lottie from 'react-lottie';
import * as animationData from '../images/loading2.json';
import amplitude from "amplitude-js";
import ReactGA from "react-ga4"
const QuestionDisplay = ({ question, answer, setAnswer, onSubmit, onSkip, onEnd, questionNumber, feedback, modelAnswer, onNext, analyzing,prompts }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading,setLoading] = useState(false)
  const handleSubmit = async () => {
    await onSubmit();
    setShowFeedback(true);
    amplitude.getInstance().logEvent("Question Attempted");
    ReactGA.event("Submit button", {
      submit_question: "Q"+questionNumber+ " "+"Submit", // 'subject_name' as a custom parameter
      // Include any other custom parameters here
      
    });
    
  };

  const handleNextQuestion = () => {
    setLoading(true);
    // Hide feedback before moving to next question
    amplitude.getInstance().logEvent("Viewed Next Question");
    ReactGA.event("Next button", {
      next_question: "Q"+questionNumber+ " "+"next", // 'subject_name' as a custom parameter
      // Include any other custom parameters here
      
    });
    setTimeout(() => {
   
      setLoading(false);
      setShowFeedback(false);
      setAnswer("");
      onNext();
  }, 2000);
  
  };
  const handleSkip = () =>{
onSkip();
ReactGA.event("Skipped button", {
  Skip_button: "Q"+questionNumber+ " "+"skipped", // 'subject_name' as a custom parameter
  // Include any other custom parameters here
  
});
  }

  const handleEnd = () =>{
  onEnd();
  ReactGA.event(" End button", {
    end_button: "Q"+questionNumber+ " "+"ended", // 'subject_name' as a custom parameter
    // Include any other custom parameters here
    
  });
  }
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="w-full p-2" style={{ maxWidth: '800px' }}>
        <div className='w-full mb-[20px]' style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0 }}>
              <b>Question {questionNumber}:</b> {question.question.replace(/<[^>]*>/g, '')}
            </p>
          </div>
          <div style={{ marginLeft: '20px', alignSelf: 'start' }}>
            <span className='font-bold'>[ Marks : {question.question_marks} ]</span>
          </div>
        </div>
        {question.image_file_name && (
          <div className="flex items-center justify-start mb-[20px]">
            <img
              className="images"
              alt="Question"
              src={process.env.REACT_APP_CDN_URL_FOR_QUESTION_IMAGES + question.image_file_name}
            />
          </div>
        )}
        <textarea
          className="w-full text-black p-2 border rounded resize-none"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer here"
          rows={6}
          disabled={showFeedback}
        ></textarea>
        <div className="flex justify-end my-2 gap-2">
          {!showFeedback && (
            <>
              <button className="bg-[#8854C0] text-white font-bold py-2 px-4 rounded disabled:opacity-50 w-[416px]" onClick={handleSubmit} disabled={!answer.trim()}>Submit</button>
              <button className="bg-[#322E33] bg-opacity-30 text-[purple]  py-2 px-4 rounded" style={{ fontFamily: "Roboto" }} onClick={handleSkip}>Skip</button>
              <button className="bg-[#1C1B1F] bg-opacity-30 text-[#1C1B1F]  py-2 px-4 rounded" style={{ fontFamily: "Roboto" }} onClick={handleEnd}>End</button>
            </>
          )}
        </div>
        {analyzing && (
         <div className="flex justify-center items-center ">
         <div className="text-center">
           <div role="status">
           <Lottie options={defaultOptions} height={256} width={256} />
           </div>
           <br />
           <div>“Please wait while we analyze your response...”</div>
         </div>
       </div>
        )}
        {showFeedback && !analyzing && (
         <FeedbackDisplay
         question={question.question}
         rubric={question.rubric}
         answer={answer}
         feedback={feedback}
         modelAnswer={modelAnswer}
         onNext={handleNextQuestion}
         onEnd={onEnd}
         loading={loading}
         question_marks={question.question_marks}
         prompts={prompts}
   
       />
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
