import React, {useState,useEffect} from 'react';
import Header from '../../Header';
import SubjectsSelection from './pages/SubjectsSelection'; // Import your SubjectsSelection component
import AboutContent from './pages/AboutContent';

const AboutYou = () => {
    const [activeTab, setActiveTab] = useState('aboutYou');
    const [selectedSubjects, setSelectedSubjects] = useState([]); // Add state for selected subjects if needed for the SubjectsSelection component
    const [country, setCountry] = useState("");
    const [year, setYear] = useState("");
    const [checked,setChecked] = useState(true);
    const [subjects, setSubjects] = useState([]);
  const [profileExists, setProfileExists] = useState(false);
   
  
    const handleTabClick = (tabName) => {
      setActiveTab(tabName);
      console.log(`${tabName} tab clicked`);
    };

    const onSelectSubject = (subject) => {
      // Logic to add or remove subjects from the selectedSubjects array
      console.log(subject); // Placeholder for actual logic
    };
    const handleContinue = () =>{
  setActiveTab('yourSubjects');
    }
    const fetchProfileData = async () => {
      const token = localStorage.getItem("access_token");
    
      try {
        const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/fetch_user_profile_subjects`, { // Adjust endpoint as needed
          method: 'POST', // This might be a GET request if you're fetching data
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        if (data && data.data && data.data[0].subject_list && data.data[0].subject_list.length > 0) {
          // Assuming 'subject_list' is the key indicator of existing profile data
       
          setCountry(data.data[0].country);
          setYear(data.data[0].year);
          const subjectsArray = Object.values(data.data[0].subject_list); // Converts the values of the object into an array
        
         
          const selectedSubjects = subjectsArray.filter(subject => subject.is_selected === 1);
          console.log(JSON.stringify(selectedSubjects, null, 2));
          setSelectedSubjects(selectedSubjects);
         
          setProfileExists(true); // Profile exists because meaningful data was returned
        } else {
          setProfileExists(false); // No meaningful profile data was returned, so the profile does not exist
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setProfileExists(false); // If an error occurs, assume no profile exists
      }
    };
    
    useEffect(() => {
      // Define the function to fetch the data
    
  
      // Call the fetch function
      fetchProfileData();
    }, []); // The empty dependency array ensures this effect runs only once after the initial render
    return (
      <>
        <Header />
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center my-5 cursor-pointer">
            <div className={`text-center px-4 py-2 ${activeTab === 'aboutYou' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`} onClick={() => handleTabClick('aboutYou')}>
              About You
            </div>
           
            <div className={`text-center px-4 py-2 ${activeTab === 'yourSubjects' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`} onClick={() => handleTabClick('yourSubjects')}>
              Your Subjects
            </div>
          </div>

          {activeTab === 'aboutYou' && (
            // About You content goes here
          <AboutContent country={country} setCountry={setCountry} year={year} setYear={setYear} handleContinue={handleContinue} checked={checked} setChecked={setChecked}/>
          )}

     

          {activeTab === 'yourSubjects' && (
            // Your Subjects content, you can use your SubjectsSelection component here
            <SubjectsSelection profileExists={profileExists} country={country} year={year} onSelectSubject={onSelectSubject} selectedSubjects={selectedSubjects} setSelectedSubjects={selectedSubjects} checked={checked} />
          )}
        </div>
      </>
    )
}

export default AboutYou;
