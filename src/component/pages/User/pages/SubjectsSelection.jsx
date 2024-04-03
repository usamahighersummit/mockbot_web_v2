import React, { useEffect, useState } from 'react';
import {  useNavigate } from "react-router-dom";
const SubjectsSelection = ({ country ,year,checked,profileExists,selectedSubjects}) => {
    const navigate = useNavigate();
    const [copiedSubjects, setCopiedSubjects] = useState([]); 
  const [subjects, setSubjects] = useState([]);

  // Function to handle selecting a subject
  const handleSelectSubject = (selectedSubject) => {
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
    fetchSubjects();
  }, []);
  useEffect(() => {
    setCopiedSubjects([...selectedSubjects]);
  }, [selectedSubjects]);
  return (
    <div className="bg-white shadow-md rounded-lg p-8 mb-4">
      <h2 className="text-center text-2xl font-semibold my-4">Select your subjects for GCSE</h2>
      <p className="text-center text-gray-600">You can select more than one</p>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {subjects.map((subject) => (
          <button
            key={subject.subject_id}
            disabled={subject.availability_status === 0} // Disable button if subject is not available
            onClick={() => handleSelectSubject(subject)}
            className={`text-sm font-semibold py-2 px-4 rounded-lg 
                        ${copiedSubjects.find((s) => s.subject_id === subject.subject_id) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} 
                        flex items-center justify-center`}
          >
            {subject.subject_name} {copiedSubjects.find((s) => s.subject_id === subject.subject_id) ? '✓' : '+'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-4 border-t border-gray-300 pt-4">
        {copiedSubjects.map((subject) => (
          <div key={subject.subject_id} className="bg-blue-100 rounded-full px-4 py-1 flex items-center">
            <span className="text-blue-600 font-semibold">{subject.subject_name}</span>
            <button className="text-blue-600 hover:text-blue-800 ml-2" onClick={() => handleSelectSubject(subject)}>✕</button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Save and close
        </button>
      </div>
    </div>
  );
};

export default SubjectsSelection;
