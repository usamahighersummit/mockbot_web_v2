import image1 from "../images/CS.png";
import image2 from "../images/GEO.png"; 
import image3 from "../images/PSY.png"; 
import amplitude from "amplitude-js";
import ReactGA from "react-ga4"

import { useState } from "react";
import ComingSoonModal from "./widgets/ComingSoonModal";
const SubjectSelector = ({ subjects, onSelectSubject }) => {
  const [comingSoon, setCommingSoon] = useState(false);
  // Array of images
 var email = localStorage.getItem("email")


 const  handleSubjectSelection = async(id,name, status) =>{
  if(status === 1){
  ReactGA.event("Select Subject", {
    subject_name: name, // 'subject_name' as a custom parameter
    // Include any other custom parameters here
  });
  if(email){
    const atIndex = email.indexOf('@'); // Find the index of '@'
    const localPart = email.substring(0, atIndex + 1); // Including '@' in the local part
    const domain = email.substring(atIndex + 1); // The domain part

 
    ReactGA.event("Enter email", {
      student_email: localPart + " "+ domain,
     
    });
    try {
      const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}get_user_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         email: email,
         subject_name: name,
        
        }),
      });
      if (response.ok){
 console.log("OK response")
      }
      else{
    
      }
    } catch (error) {
      console.log(error.message);
    }
    
  }
  localStorage.setItem("subject_name",name)
  localStorage.setItem("subject_id",id)
  handleSubmitResponse();
  amplitude.getInstance().logEvent("Selected Subject : - "+name);
}
else{
 setCommingSoon(true);
}
  }
  const images = [image1, image2, image3];

  const getImageIndex = (index) => {
    const pattern = [0, 1, 2, 1, 2, 0]; 
    return pattern[index % pattern.length]; 
  };

  const handleSubmitResponse = async () =>{
   
   var sbj_id = localStorage.getItem("subject_id");
        onSelectSubject(sbj_id);

   

  }
  return (
    <div className="flex flex-col justify-center items-center mt-5 md:mt-20 lg:mt-32">
    <h1 className="font-roboto font-medium text-xl leading-tight text-center text-[#322E33] mb-3 md:text-2xl md:leading-snug md:mb-4">
      Smash Your Exams with MockBot's AI Marking & Feedback
    </h1>
    <p className="font-roboto font-medium text-base leading-normal text-center text-[#322E33] mb-10 md:text-lg md:leading-relaxed md:mb-10">
      Dive into <u>topic-based exam questions</u> and get <u>instant, AI-powered feedback</u> for smarter studying<br className="hidden md:inline"/> and better grades. With MockBot, It's not just practice; it's targeted improvement.
    </p>
    <h1 className="font-roboto font-medium text-2xl leading-snug text-center text-[#322E33] mb-3 md:text-4xl md:leading-tight md:mb-4">
      Select your subject
    </h1>
    <p className="font-roboto font-normal text-sm leading-snug text-center text-[#464646] mb-12 md:text-base md:leading-normal md:mb-12">
      Pick a subject from the list to dive into specialized exam-style questions, perfect for testing your<br className="hidden md:inline"/> grasp on the topic and enhancing your exam readiness.
    </p>
    <div className="flex justify-center items-center text-center mb-6 px-4">
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {subjects.map((subject, index) => (
            <div
              key={subject.subject_name}
              className="group w-full md:w-1/4 p-1 flex flex-col items-center rounded-[8px] h-[221px] md:mx-0 mx-4 cursor-pointer relative overflow-hidden"
              onClick={() => handleSubjectSelection(subject.subject_id, subject.subject_name,subject.availability_status)}
              style={{
                backgroundImage: `url(${images[getImageIndex(index)]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition ease-in-out duration-300">
                {/* This div will serve as the hover overlay */}
              </div>
              <div className="z-10 px-6 py-4 w-full h-full flex items-center justify-center">
                <div className="text-center text-[#F2F2F2] font-roboto font-semibold text-lg leading-none  md:text-xl md:leading-tight mb-[150px]">
                  {subject.subject_name}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition ease-in-out duration-300 z-20">
                <span className="font-roboto text-[#F2F2F2] bg-[#8854C0] px-4 py-2 text-sm font-semibold rounded">
                 {subject.availability_status === 1 ? "Start practicing" : "Coming soon"} 
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
    <ComingSoonModal isOpen={comingSoon} onClose={()=>{setCommingSoon(false)}} />
  </div>
  
  );
};

export default SubjectSelector;
