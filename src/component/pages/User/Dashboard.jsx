import React, {useState,useEffect} from 'react';
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [data,setData] =useState({});
  const getProfileData = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${process.env.REACT_APP_REST_API_BASE_URL}/get_profile_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setData(data.data);
      // Assuming each item in data.data has a subject_list you want to display
      const subjectsFromData = data.data.flatMap(item => item.subject_list ? item.subject_list : []);
      setSubjects(subjectsFromData);
      if (data.data.length > 0) {
        setName(data.data[0].name);
      }
      console.log("subjects set:", subjectsFromData);
    } else {
      console.error('Failed to fetch subjects');
    }
  };
  useEffect(() => {
  

    getProfileData();
  }, []); // Empty dependency array to run only once on component mount
  useEffect(() => {
  
if(data?.length === 0){
  navigate("/about_you")
}
    
  }, [data]); // Empty dependency array to run only once on component mount
  
  const  handleClick = ( id) => {
    localStorage.setItem("subject_id",id) 
navigate("/quiz")
  }
  return (
    <>
    <Header />
    <div className="container mx-auto my-8 p-5 bg-white rounded shadow">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-700 text-center">Hi, {name} 👋</h1>
        <p className='text-center'>Welcome to your Save My Exams account and launchpad to stress-free and effective study.</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">My subjects</h2>
        <button onClick={()=>{navigate("/about_you")}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300">
          Add/edit subjects
        </button>
      </div>
      <table className="w-full text-left rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 border-b-2 border-gray-200">Subject</th>
            <th className="px-4 py-3 border-b-2 border-gray-200">Date</th>
            <th className="px-4 py-3 border-b-2 border-gray-200"></th>
          </tr>
        </thead>
        <tbody>
  {subjects.map((subject, index) => (
    <tr key={index} className="hover:bg-gray-100">
      <td className="px-4 py-3 border-b border-gray-200">{subject.subject_name}</td>
      <td className="px-4 py-3 border-b border-gray-200">
        {/* Assuming you want to display creation_timestamp as the date */}
        {new Date(subject.creation_timestamp).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 border-b border-gray-200"><button style={{fontFamily:"Roboto", backgroundColor:'#8854C0', color:'white',borderRadius:'4px', paddingTop:"8px" , paddingBottom:'8px', paddingRight:'24px',paddingLeft:"24px", fontSize:'14px'}} onClick={()=>handleClick(subject.subject_id)}>Start practicing</button></td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
    </>
  );
};

export default Dashboard;
