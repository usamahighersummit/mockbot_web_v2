import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../Header';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Toggler from './widgets/Toggler';
import LeadingTable from './tables/LeadingTable';
import OnPressEndTable from './tables/OnPressEndTable';
import QuestionFeedbackTable from './tables/QuestionFeedbackTable';
const Tracking = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState();
   const [subjects, setSubjects] = useState();
    const [emailData, setEmailData] = useState();
    const [numberOfRows, setNumberOfRows] = useState(150);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentEmailPage, setCurrentEmailPage] = useState(1);
    const [numberOfRows2, setNumberOfRows2] = useState(150);
    const [questionFeedbackData, setQuestionFeedbackData] = useState();
const [currentQuestionFeedbackPage, setCurrentQuestionFeedbackPage] = useState(1);
const [numberOfRowsQuestionFeedback, setNumberOfRowsQuestionFeedback] = useState(150);

    const totalPages = Math.ceil(data?.length / numberOfRows2);
    const totalEmailPages = Math.ceil(emailData?.length / numberOfRows);
    const totalFeedbackPages = Math.ceil(questionFeedbackData?.length / numberOfRowsQuestionFeedback)
    // Change page handlers
    const handlePageChange = (newPageNumber) => {
      setCurrentPage(Math.max(1, Math.min(newPageNumber, totalPages)));
    };
    
    const handleEmailPageChange = (newPageNumber) => {
      setCurrentEmailPage(Math.max(1, Math.min(newPageNumber, totalEmailPages)));
    };
    const handleFeedbackPageChange = (newPageNumber) => {
    
      setCurrentQuestionFeedbackPage(Math.max(1, Math.min(newPageNumber, totalFeedbackPages)));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const loginData = {
        email: email,
        password: password,
      };
      try {
      
        const response = await axios.post(`${process.env.REACT_APP_REST_API_BASE_URL}/admin_login`, loginData);
        console.log('Login successful', response.data);
        if(response.data.state === 0){
          alert('Invalid  credentials')
        }
        else{  setIsLoggedIn(true);
          setData(response.data.data)
        setEmailData(response.data.trial_emails);
        }
      
     
        
      } catch (error) {
        alert("login failed")
        console.error('Login failed', error.response || error);
        setEmail('');
        setPassword('');
      }
  
     
    };
    const getSubjects = async (e) => {
   
      try {
      
        const response = await axios.get(`${process.env.REACT_APP_REST_API_BASE_URL}/get_subjects_admin`);
        console.log('Subjects Here:', response.data);
     setSubjects(response.data);
      
     
        
      } catch (error) {
     
        console.error('Subjects failed', error.response || error);
      
      }
  
     
    };
    const onDragEnd = async (result) => {
      if (!result.destination) return;
  
      const items = Array.from(subjects);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
     setSubjects(items);
   
      try {
        const response = await axios.post(`${process.env.REACT_APP_REST_API_BASE_URL}/update_subjects_order`, {
          list_of_subjects : items  // Ensure this matches the expected format of your API
        });
        console.log('D&D successful', response.data);
        getSubjects();
      } catch (error) {
        console.error('Update failed', error.response ? error.response.data : error);
      }
    };
  
    const toggleStatus = async (status,id) => {
 
 
      try {
        const response = await axios.post(`${process.env.REACT_APP_REST_API_BASE_URL}/update_subject_availability`, {
          availability_status: status === 1 ? 0 : 1 ,
          mock_subjects_id: id
        });
        console.log('status successful', response.data);
        getSubjects();
      } catch (error) {
        console.error('status failed', error.response ? error.response.data : error);
      }
    };
    
    function aggregateWords(input,) {
      if (!input || input.toLowerCase() === 'undefined') return 'All Topics'; // Handle null, undefined, or "undefined" string
    
      const words = input.split(',').map(word => word.trim()); // Split and trim spaces
      const counts = {}; // Object to hold word counts
    
      // Iterate over words to populate counts object
      words.forEach(word => {
        // Treat "undefined" as "All Topics"
        const normalizedWord = word === 'undefined' ? 'All Topics' : word;
    
        // Increment count for the word, initializing if necessary
        if (counts[normalizedWord]) {
          counts[normalizedWord]++;
        } else {
          counts[normalizedWord] = 1;
        }
      });
    
      // Construct the result array from the counts object
      const result = Object.entries(counts).map(([word, count]) => {
        return count > 1 ? `${word} (${count})` : word;
      });
    
      return result.join(', ');
    }
    
    function handleRowChange(event) {
      setNumberOfRows(Number(event.target.value));
      setCurrentEmailPage(1);
    }  
    function handleRowChange1(event) {
      setNumberOfRows2(Number(event.target.value));
      setCurrentPage(1);
    }  
    function handleRowChangeFeedback(event) {
      
      setNumberOfRowsQuestionFeedback(Number(event.target.value));
      setCurrentQuestionFeedbackPage(1);
    }  
 
    
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const getQuestionFeedback = async () => {
      try {
      
        const response = await axios.get(`${process.env.REACT_APP_REST_API_BASE_URL}/get_question_level_feedbacks`);
        console.log('feedback Here:', response.data);
        setQuestionFeedbackData(response.data.data);
      
     
        
      } catch (error) {
     
        console.error('Subjects failed', error.response || error);
      
      }
    };


        
    useEffect(()=>{
      getQuestionFeedback();
      getSubjects();
    },[])
  if (isLoggedIn) {
    const indexOfLastItem = currentPage * numberOfRows2;
    const indexOfFirstItem = indexOfLastItem - numberOfRows2;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const indexOfLastEmail = currentEmailPage * numberOfRows;
    const indexOfFirstEmail = indexOfLastEmail - numberOfRows;
    const currentEmails = emailData.slice(indexOfFirstEmail, indexOfLastEmail);

const indexOfLastFeedback = numberOfRowsQuestionFeedback === questionFeedbackData.length
? questionFeedbackData.length 
: currentQuestionFeedbackPage * numberOfRowsQuestionFeedback; 

const indexOfFirstFeedback = numberOfRowsQuestionFeedback === questionFeedbackData.length
? 0 
: indexOfLastFeedback - numberOfRowsQuestionFeedback; 

const questionFeedback = questionFeedbackData.slice(indexOfFirstFeedback, indexOfLastFeedback);


    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center mt-12 w-full px-4">
        <Tabs>
                        <TabList>
                            <Tab>On press end Table</Tab>
                            <Tab>Leading Table</Tab>
                            <Tab>Question Feedback Table</Tab>
                            <Tab>Subject Settings</Tab>
                        </TabList>
                        <TabPanel>
                        <OnPressEndTable
                currentItems={currentItems}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                numberOfRows2={numberOfRows2}
                setNumberOfRows2={setNumberOfRows2}
                handleRowChange1={handleRowChange1}
                data={data}
                aggregateWords={aggregateWords}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
        
              />
</TabPanel>
        
<TabPanel>
<LeadingTable
                currentEmails={currentEmails}
                handleEmailPageChange={handleEmailPageChange}
                currentEmailPage={currentEmailPage}
                totalEmailPages={totalEmailPages}
                numberOfRows={numberOfRows}
                setNumberOfRows={setNumberOfRows}
                handleRowChange={handleRowChange}
                emailData={emailData}
              />
            </TabPanel>
            <TabPanel> <QuestionFeedbackTable
    currentFeedback={questionFeedback} // Pass the current page items
    handleFeedbackPageChange={handleFeedbackPageChange}
    currentFeedbackPage={currentQuestionFeedbackPage}
    totalFeedbackPages={totalFeedbackPages} // Pass total pages for Question Feedback
    numberOfFeedbackRows={numberOfRowsQuestionFeedback}
    handleRowChangeFeedback={handleRowChangeFeedback}
    FeedbackQuestion={questionFeedbackData}
    // ... other props as needed
  /></TabPanel>
            <TabPanel>   <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="subjects">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="p-4">
            {subjects?.map((subject, index) => (
              <Draggable key={subject.mock_subjects_id} draggableId={String(subject.mock_subjects_id)} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex justify-center items-center mb-2"
                  >
                    <div className="flex items-center justify-between w-full max-w-xl p-4 border border-gray-200 rounded-md shadow-sm bg-white">
                      <p className="text-gray-800">{subject.subject_name}</p>
                      <Toggler isEnabled={subject.availability_status} onToggle={() => toggleStatus(subject.availability_status,subject.mock_subjects_id)} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext></TabPanel>
              </Tabs>
                
        </div>
      </>
    );
  }

      return (
        <>
        <Header />
        <div className=" flex items-center justify-center h-screen">
           
          <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <h3 className='font-bold text-center mb-[24px]' >Admin Login</h3>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        </>
      );
    };

export default Tracking
