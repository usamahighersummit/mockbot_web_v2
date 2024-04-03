import React, { useState, useEffect, useRef } from 'react';
import SubjectSelector from './component/SubjectSelector';
import TopicSelector from './component/TopicSelector';
import EmailInput from './component/EmailInput';
import QuestionDisplay from './component/QuestionDisplay';
import SessionSummary from './component/SessionSummary';
import * as animationData from './images/quiz.json';
import * as animationData2 from './images/loading2.json';
import amplitude from 'amplitude-js';
import Lottie from "react-lottie";
import ReactGA from "react-ga4"
import Header from './component/Header';
import { useNavigate } from 'react-router-dom';
function Question() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [question, setQuestion] = useState(null);
  const prompts = useRef({evaluation_identity:"", evaluation_example:"", evaluation_model:" ",evaluation_query:""});
  const [answer, setAnswer] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('showTopics');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [email, setEmail] = useState("");
  const [loadingText, setLoadingText] = useState("")
  const [subject, setSubject] = useState([])
  const [quizLoading, setQuizLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0); // Add this line
  const [analyzing, setAnalyzing] = useState(false);
  const subjectID = useRef("");
const [prmpt, setprmpt] = useState();

//Done
  const fetchTopics = async () => {
    var sbj_id = localStorage.getItem('subject_id');
    try {
        const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/get_topics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ subject_id: sbj_id})
        });
      
        if (!response.ok) throw new Error('Failed to fetch topics');
        
        const data = await response.json();
        setTopics(data);
        setStage('showTopics');
      } 
      catch (err) {
        setError(err.message);
      }
  };



//Done
  const fetchQuestion = async (topicId = null, job = null) => {
    if (job === "question") {
       setQuestionNumber(prevNumber => prevNumber + 1); // Increment question number only on "Next Question"
    }
    else{
    setQuestionNumber(1)
    
    }

  
  
    try {
      const selectedtopic2 = localStorage.getItem('topic_id');
      const mail = localStorage.getItem('email_address');
      const topic_name = localStorage.getItem('topic_name');
      setSelectedTopic(selectedtopic2);
      console.log("topic pkr " + selectedtopic2);
      console.log("topic here is " + selectedtopic2);
      console.log("subject id " + subjectID.current);
  
      const url = `${process.env.REACT_APP_REST_API_BASE_URL}/fetch_questions`;
      const body = {
        chapter_id: selectedtopic2 !== 'null' ? selectedtopic2 : null,
        subject_id: selectedtopic2 === 'null' ?  subjectID.current : null
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) throw new Error('Failed to fetch question');
  
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
  
      if (data && data.length > 0) {
        console.log("in question" + data[0].question);
        setQuestion(data[0]);
        setAnswer('');
  
        if (job) {
          setStage('showQuestion');
          if(!topic_name){
            alert('question number is '+ questionNumber)
            if(questionNumber === 0){
         
            amplitude.getInstance().logEvent("Selected Topic : -  All Topic");
              
  ReactGA.event("Select Topic", {
    topic_name: " All Topic", // 'subject_name' as a custom parameter
    // Include any other custom parameters here
  });
            }
          }
          else{
            if(questionNumber === 0){
     
            amplitude.getInstance().logEvent("Selected Topic : - "+topic_name);
                         
  ReactGA.event("Select Topic", {
    topic_name: topic_name, // 'subject_name' as a custom parameter
    // Include any other custom parameters here
  });
            }
          }
        }
        else if(mail){
          if(topic_name === 'undefined'){
            if(questionNumber === 0){
            amplitude.getInstance().logEvent("Selected Topic : -  All Topic");
                         
  ReactGA.event("Select Topic", {
    topic_name: " All Topic", // 'subject_name' as a custom parameter
    // Include any other custom parameters here
  });
            }
          }
          else{
            if(questionNumber === 0){
            amplitude.getInstance().logEvent("Selected Topic : - "+topic_name);
            ReactGA.event("Select Topic", {
              topic_name: topic_name, // 'subject_name' as a custom parameter
              // Include any other custom parameters here
            });
            }
          }
          setQuizLoading(true);
          setTimeout(() => {
   
            setQuizLoading(false); 
            setStage('showQuestion');
     
        }, 5000);
        }
         else if( !mail) {
          setStage('email');
        }
      } else {
        setError('No questions found!');
        setStage('noQuestions');
      }
    } catch (err) {
      setError('No questions found!');
      setStage('noQuestions');
    } finally {
      // Any final cleanup can be done here if needed
    }
  };
  


  const handleEmailSubmit = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
  
    const topic_name = localStorage.getItem('topic_name');
 
    if (emailRegex.test(email)) { 
      localStorage.setItem('email_address', email);
      setQuizLoading(true); 
      amplitude.getInstance().logEvent("Student Email : "+email);
      if(email){
        const atIndex = email.indexOf('@'); // Find the index of '@'
        const localPart = email.substring(0, atIndex + 1); // Including '@' in the local part
        const domain = email.substring(atIndex + 1); // The domain part
    
    
        ReactGA.event("Enter email", {
          student_email: localPart + " "+ domain,
         
        });
        ReactGA.event("Start Mock button", {
          button: "Start Mock",
         
        });
      }
 
      setTimeout(() => {
   
          setQuizLoading(false); 
          setStage('showQuestion');
   
      }, 5000); 
      setEmail("");
    } else {
      alert("Invalid email");
    }
  };
  

//Done
const handleSubmit = async () => {
   setAnalyzing(true);
  try {
    const quiz_content = {
      question: question.question,
      actual_answer: question.answer,
      rubric: question.rubric,
      answer: answer,
      question_marks:question.question_marks,

    };

    console.log("Indentity:" + prompts.current.evaluation_identity + "\n Example : " + prompts.current.evaluation_example + "\n question: " + quiz_content.question + "\n actual answer" + quiz_content.actual_answer + "\n rubric: " + quiz_content.rubric + "\n student answer: " + quiz_content.answer + "\n Query: " + prompts.current.evaluation_query);

    const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/evaluate_question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: quiz_content,
        subject_id: subjectID.current,
        question_marks:question.question_marks,
        question_id: question.predefined_question_answer_id,
      }),
    });

    if (!response.ok) throw new Error('Failed to submit answer');

    const data = await response.json();
    console.log("sasadasdas",JSON.stringify(data.message))
    setSubmissionResult(data.response.replace(/[#_]/g, ' '));
    console.log("Data is", data);
    const regex = /Marks=(\d+)/;
    const match =  data.response.replace(/[#_]/g, ' ').match(regex);
    setprmpt(JSON.stringify(data.message))
    setAttempts(prev => [...prev, {
      question: question.question,
      answer,
      rubric: question.rubric,
      ai_feedback: data.response.replace(/[#_]/g, ' '),
      actual_answer: question.answer,
      question_marks:question.question_marks,
      obtained_marks: parseInt(match[1]),
      question_context: 0,
      image_name: question.image_file_name,
      prompt: JSON.stringify(data.message)
    }]);
   
    setTimeout(() => {
   
      // Stop showing quiz preparation loading once questions are fetched
      // setStage('feedback');
       setAnalyzing(false);
  }, 4000);
  } catch (error) {
    setError(error.message);
  } finally {
   
  }
};



  const handleNextQuestion = () => {
  
    fetchQuestion(selectedTopic,"question");

  };

  const handleSkip =  () => {
    amplitude.getInstance().logEvent("Question Skipped");
    fetchQuestion(selectedTopic, "question");
    
  };

  const handleEnd = async () => {
    if(attempts.length>0){
    var sbj_id = localStorage.getItem('subject_id');
    var sbj_name = localStorage.getItem('subject_name');
    var topic_id = localStorage.getItem('topic_id');
    var topic_name = localStorage.getItem('topic_name');
   var mail = localStorage.getItem('email_address');

    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/submit_response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
     
        },
        body: JSON.stringify({
          student_email: mail,
         subject_id: sbj_id,
         subject_name: sbj_name,
         topic_id: topic_id,
         topic_name: topic_name === 'undefined' ? sbj_name+" All Topics" : topic_name,
         question_list: attempts
        }),
      });
      if (response.ok){
        setStage('end');
        setQuestionNumber(1);
        amplitude.getInstance().logEvent("Session Ended");
       
      }
      else{

      
      }
    } catch (error) {
      alert(error.message);
    }
  } else{
    setStage('end');
    setQuestionNumber(1);
    amplitude.getInstance().logEvent("Session Ended");
  }
  
  
  };

  const handleBack = () => {
    if (stage === 'end') {
      setAttempts([]);
    }
    setStage('showTopics');
    setError('');
    setAnswer('');
    localStorage.removeItem("topic_id")
  };
  const handleBack2 = () => {

  navigate("/")
    setError('');
    setAnswer('');

  };


  const handleEmail =  async ( ) =>{
    var mail = localStorage.getItem('email_address');
    const summary = attempts.map(attempt => attempt.feedback).join('\n');
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/send_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         email: mail,
         summary: summary
        }),
      });
      if (response.ok){
      alert("email sent");
      }
      else{
        alert("email sending failed")
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // Done 
  const fetchSubject = async () => {

    const url = `${process.env.REACT_APP_REST_API_BASE_URL}/get_subjects`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch Subject');
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (data) {
       console.log("Data"+JSON.stringify(data))
        setSubject(data);
       
      } else {
        setError('No Subjects found!');
      
      }
    } catch (err) {
      setError('No Subjects found!');
   
    } finally {
    
    }
  };
 
useEffect(()=>{fetchSubject();},[])
const handleSubject =  ( id) => {
    subjectID.current = id;
    setLoading(true); 
    setLoadingText("“Loading your topics, please wait...”");
   
    fetchTopics(); 
    setTimeout(() => {
        setLoading(false); 
        setLoadingText("");

    }, 4000);
   
  }

  useEffect(()=>{
    fetchTopics();
  },[])
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData2,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen"> {/* Full screen centering */}
        <div className="text-center"> {/* Center text */}
        <div role="status">
          <Lottie options={defaultOptions2} height={176} width={176} />
          </div>
          <br></br>
        <div>{loadingText.length>0 ? loadingText : "“Please wait while we analyze your response...”"}</div>  
        </div>
      </div>
    );
  }
  if (quizLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div role="status">
          <Lottie options={defaultOptions} height={256} width={256} />
          </div>
          <br />
          <div>Please wait while your quiz is being prepared...</div>
        </div>
      </div>
    );
  }
  if (error && stage !== 'noQuestions' && stage !== 'feedback') return  <div className="flex flex-col justify-center items-center min-h-screen gap-4"><div className="text-red-500 text-center py-4">{error}</div> <button className=" py-[10px] px-[24px]"    style={{ border: '1.5px solid #535255', color: 'white', borderRadius:'4px', gap:'8px',backgroundColor:'black' }} onClick={handleBack2}>Back</button></div> ;

  return (
    <div className=" " >
      <Header stage={stage} />
      {stage === 'initial' && <SubjectSelector subjects={subject} onSelectSubject={handleSubject} />}
      {stage === 'showTopics' && <TopicSelector   setSelectedTopic={setSelectedTopic} onRestart={handleBack2}  topics={topics} fetchQuestion={fetchQuestion} />}
      {stage === 'email' && <EmailInput email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} stage={stage} />}
      {stage === 'showQuestion' && question && (
        <QuestionDisplay
        questionNumber={questionNumber}
        feedback={submissionResult}
          question={question}
          answer={answer}
          setAnswer={setAnswer}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          onEnd={handleEnd}
          modelAnswer={question.answer}
          onNext={handleNextQuestion}
          analyzing={analyzing}
          prompts={prmpt}
       
        />
      )}
    
      {stage === 'end' && <SessionSummary attempts={attempts} onRestart={handleBack} onEmail={handleEmail} />}
      {stage === 'noQuestions' && (
       <div className="flex flex-col justify-center items-center min-h-screen gap-4">
          <p style={{color:'red'}}> No questions found!</p>
          <button className=" py-[10px] px-[24px]"    style={{ border: '1.5px solid #535255', color: 'white', borderRadius:'4px', gap:'8px',backgroundColor:'black' }} onClick={handleBack}>Back</button>
        </div>
      )}
    </div>
  );
}

export default Question;
