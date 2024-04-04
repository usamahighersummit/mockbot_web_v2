import React, {useState, useEffect} from 'react';
import { Checkbox  } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../widgets/DropDown';
const AboutContent = ({ country, setCountry, year, setYear, handleContinue, checked, setChecked, profileExists, selectedSubjects }) => {
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch list of countries from a data source
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        // Extract country names from the fetched data
        const countryNames = data.map(country => country.name.common);
        // Update state with the list of country names
        setCountries(countryNames);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);
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
    const subjectIds = selectedSubjects.map(subject => subject.subject_id);
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
  const yearGroups = [...Array(14).keys()].map(n => `Year ${n + 7}`);
  return (
    <div  >
      {/* Main content container */}
      <div className="text-center mt-20 mb-5">
        <h1 style={{ fontFamily: "Roboto", fontSize: '16px', lineHeight: "24px", fontWeight: "400", color: '#464646' }}>
          Welcome to MockBot AI, User Name!
        </h1>
        <p style={{ fontFamily: "Roboto", fontSize: '22px', lineHeight: "36px", fontWeight: "600", color: '#322E33' }}>
          To get started, tell us about you
        </p>
      </div>

      {/* Form container */}
      <div className="w-full max-w-md mx-auto">
        {/* Country select */}
        <div className="mb-4">
        <Dropdown
        label="Which country are you studying in?"
        options={countries}
        value={country}
        onChange={setCountry}
        placeholder="Select Country"
      />


        </div>

        {/* Year group select */}
        <div className="mb-4">
        <Dropdown
        label="Which year group are you in?"
        options={yearGroups}
        value={year}
        onChange={setYear}
        placeholder="Select Year"
      />
        </div>

        {/* Checkbox with label */}
        <div className="mb-4 flex items-center">
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            name="checked"
            style={{ color: purple[500] }} // Set color to Material-UI purple
            className="p-0" // Remove padding if any
          />
          <span className="text-gray-700 mt-[20px]">I want to hear about new subjects, study tips, and exclusive offers</span>
        </div>
      </div>

      {/* Separator */}
      <hr className="fixed bottom-[100px] left-0 w-full border-t border-gray-400" />

      {/* Fixed bottom container */}
      <div className="fixed bottom-[30px] w-full px-4 py-2 bg-white"> {/* Add bg color if needed */ }
        <div className="max-w-[90%] mx-auto w-full flex justify-end">
                      <button onClick={handleSubmit} style={{fontSize:"16px",lineHeight:'20px', fontFamily:'Roboto', display: !profileExists ? 'none': '' }} className="bg-[#444780] hover:bg-purple-700 text-white  py-2 px-4 rounded">
                    Save and close {">"}
                </button>
            
        <button
  disabled={!year || !country}
  onClick={handleContinue}
  className={`ml-4 inline-block ${ !year || !country ? "bg-gray-300 text-gray-700" : "bg-[#444780] text-white"} py-2 px-4 rounded hover:bg-purple-700 focus:outline-none focus:shadow-outline`}
  style={{ fontFamily: 'Roboto', fontSize: '16px', lineHeight: '24px', letterSpacing: '0.15px' }}
  type="button"
>
  Continue {">"}
</button>


        </div>
      </div>
    </div>
  );
};

export default AboutContent;
