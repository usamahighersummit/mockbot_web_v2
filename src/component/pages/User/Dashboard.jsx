import React, {useState,useEffect} from 'react';
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';
import icon1 from '../../../images/Icons.png'
import icon2 from '../../../images/Icons_2.png'
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
      <h1 className="text-3xl font-bold text-[#322E33]text-left" style={{fontFamily:'Roboto',fontSize:'28px',lineHeight:'36px'}}>Welcome Aboard, {name}!</h1>
      <p className="text-left mt-2 text-[#464646]" style={{fontFamily:'Roboto',fontSize:'20px',lineHeight:'24px'}}>Please choose a subject you wish to practice with MockBot's AI marking & feedback.</p>
      <div className="flex justify-between items-center mt-8  bg-gray-100">
        <h2 className="text-lg font-semibold text-gray-700  py-2 px-4 rounded-l-lg mb-[26px] mt-[18px]">My Subjects</h2>
        <button 
  onClick={() => { navigate("/about_you") }} 
  className="text-[#444780] font-bold py-2 px-4 rounded border border-[#444780] hover:bg-purple-100 border-2 transition ease-in-out duration-300 mr-2"
>
  + Add/edit subjects
</button>

      </div>
      <div className="bg-[#F2F2F2] rounded-lg">
        <table className="w-full text-left overflow-x-auto">
          <thead className="bg-[#E0E0E0] ">
            <tr>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-600" style={{fontFamily:'Roboto',fontSize:'16px',lineHeight:'24px', letterSpacing:'0.15px'}}>Subject</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-gray-600" style={{fontFamily:'Roboto',fontSize:'16px',lineHeight:'24px', letterSpacing:'0.15px'}}>Enrolment date</th>
              <th className="px-4 py-3 border-b-2 border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index} className="bg-[#F2F2F2]">
                <td className="px-2 py-2 border-b border-gray-200 font-medium text-gray-700 flex items-center" style={{fontFamily:'Roboto',fontSize:'16px',lineHeight:'24px', letterSpacing:'0.15px'}}>
        {/* Insert the icon next to the subject name */}
        <img src={index % 2 === 0 ? icon1 : icon2} alt="Icon" className="mr-2" />
        <button  onClick={() => handleClick(subject.subject_id)} >{subject.subject_name}</button>
      </td>
                <td className="px-2 py-2 border-b border-gray-200 text-gray-500" style={{fontFamily:'Roboto',fontSize:'16px',lineHeight:'24px', letterSpacing:'0.15px'}}>
                  {new Date(subject.creation_timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 border-b border-gray-200 text-left">
                  <button className="bg-[#444780] text-white rounded py-2 px-6 text-sm transition ease-in-out duration-300" onClick={() => handleClick(subject.subject_id)} style={{fontFamily:'Roboto',fontSize:'16px',lineHeight:'24px', letterSpacing:'0.15px'}}>Start practicing</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
  );
};

export default Dashboard;
