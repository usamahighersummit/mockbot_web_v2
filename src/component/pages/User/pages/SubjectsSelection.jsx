import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import image1 from "../../../../images/CS.png";
import image2 from "../../../../images/GEO.png"; 
import image3 from "../../../../images/PSY.png"; 
import ComingSoonModal from '../../../widgets/ComingSoonModal';

const SubjectsSelection = ({ country, year, checked, profileExists, selectedSubjects }) => {
  const navigate = useNavigate();
  const [copiedSubjects, setCopiedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [comingSoon, setCommingSoon] = useState(false);
  const images = [image1, image2, image3]; // Array of images

  const getImageIndex = (index) => {
      const pattern = [0, 1, 2, 1, 2, 0];
      return pattern[index % pattern.length];
  };

  const handleSelectSubject = (selectedSubject) => {
      if (selectedSubject.availability_status === 0) {
          setCommingSoon(true);
          return;
      }

      setCopiedSubjects((prevSelectedSubjects) => {
          if (prevSelectedSubjects.some((subject) => subject.subject_id === selectedSubject.subject_id)) {
              // Subject is already selected, remove it
              return prevSelectedSubjects.filter((subject) => subject.subject_id !== selectedSubject.subject_id);
          } else {
              // Subject is not selected, add it
              return [...prevSelectedSubjects, selectedSubject];
          }
      });
  };

  function getCurrentDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
  
    const [date, time] = formattedDateTime.split(', ');
    const [month, day, year] = date.split('/');
    return `${year}-${month}-${day} ${time}`;
  }
  
  const handleSubmit = async () => {
    var time = getCurrentDateTime();
    const token = localStorage.getItem("access_token");
    const subjectIds = copiedSubjects.map(subject => subject.subject_id);
    const subjectIdsCsv = subjectIds.join(',');
  
    try {
      const apiUrl = profileExists 
        ? `${process.env.REACT_APP_REST_API_BASE_URL}/update_profile_data` // Adjust your "update" endpoint
        : `${process.env.REACT_APP_REST_API_BASE_URL}/add_profile_data`;
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          country,
          year,
          subject_ids_csv: subjectIdsCsv,
          current_time: time,
          preference: checked ? 1 : 0,
       
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else{
        navigate("/")
      }
  
      // Handle successful submission (navigate or show message)
    } catch (error) {
      console.error("Failed to submit profile data:", error);
      // Handle error (show error message)
    }
  };
  

  const fetchSubjects = async () => {
    // Assuming this is where your URL will come from
    const url = `${process.env.REACT_APP_REST_API_BASE_URL}/get_subjects`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const data = await response.json(); // Assuming the API returns JSON directly
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('Failed to fetch subjects.');
    }
  };


  useEffect(() => {
    setCopiedSubjects([...selectedSubjects]);
  }, [selectedSubjects]);

  useEffect(() => {
      fetchSubjects();
  }, []);

  useEffect(() => {
      setCopiedSubjects([...selectedSubjects]);
  }, [selectedSubjects]);

  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-4 relative pb-20"> {/* Added pb-20 for bottom padding */}
        <h2 className="text-center text-2xl font-semibold my-4" style={{fontSize:"28px",lineHeight:'36px', fontFamily:'Roboto',color:'#322E33'}}>Select your Subject</h2>
        <p className="text-center text-gray-600 mb-2" style={{fontSize:"20px",lineHeight:'24px', fontFamily:'Roboto',color:'#464646'}}>You can select more than one subject from the list.</p>
        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-[20px] md:mb-[50px] sm:mb-[120px] justify-items-center">
        {
  subjects.map((subject, index) => (
    <div
        key={subject.subject_id}
        className={`relative rounded-lg overflow-hidden flex justify-center items-center cursor-pointer
                    ${copiedSubjects.find((s) => s.subject_id === subject.subject_id) ? 'border-2 border-[#3E9A9B]' : ''}`}
        onClick={() => handleSelectSubject(subject)}
        style={{
            backgroundImage: `url(${images[getImageIndex(index)]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '236px', // Set fixed height
            width: '420px'  // Set fixed width
        }}
    >
        {copiedSubjects.find((s) => s.subject_id === subject.subject_id) && (
            <div
            className='z-9'
             style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Light black overlay
              
            }}></div>
        )}
        <div className="z-8 mb-[160px] text-center font-bold text-2xl text-[#F2F2F2]">
            {subject.subject_name}
        </div>
    </div>
  ))
}

        </div>
        
        {/* Layer for Selected Subjects */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4">
        <hr className=" mb-[20px] w-full border-t border-gray-400" />
            <div className="flex flex-wrap gap-2 justify-center">
              <p  className='mt-1' style={{fontSize:"16px",lineHeight:'24px', fontFamily:'Roboto'}}>Your Subjects:</p>
                {copiedSubjects.map((subject) => (
                    <div key={subject.subject_id} className="bg-blue-100 rounded-full px-4 py-1 flex items-center">
                        <span className="text-blue-600 font-semibold">{subject.subject_name}</span>
                        <button className="text-blue-600 hover:text-blue-800 ml-2" onClick={() => handleSelectSubject(subject)}>✕</button>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
            <button 
  onClick={handleSubmit}  
  disabled={copiedSubjects?.length < 1}
  style={{
    fontSize: "16px",
    lineHeight: '20px',
    fontFamily: 'Roboto',
    backgroundColor: copiedSubjects?.length < 1 ? "#D3D3D3" : "#444780", // Grey background if disabled, else original color
    color: copiedSubjects?.length  < 1 ? "#A9A9A9" : "white", // Grey text if disabled, else white
    cursor: copiedSubjects?.length < 1 ? "not-allowed" : "pointer", // Cursor change if disabled
  }}
  className="py-2 px-4 rounded hover:bg-purple-700 transition duration-300 ease-in-out"
>
  Save and close {">"}
</button>
            </div>
        </div>

        <ComingSoonModal isOpen={comingSoon} onClose={()=>{setCommingSoon(false)}} />
    </div>
  );
};

export default SubjectsSelection;
