import React, { useState } from 'react';

const TopicSelector = ({ topics, fetchQuestion, onRestart, setSelectedTopic }) => {
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const handleTopic = (topicID, topic_name) =>{
      localStorage.setItem('topic_id', topicID);
      localStorage.setItem('topic_name', topic_name);
     
   
    setSelectedTopicId(topicID);
    setSelectedTopic(topicID)
   // setSelectedTopic(topicID)
    }
    if (!topics || topics.length === 0) {
      return <div>No topics available</div>;
    }
    const handleSubmitResponse = async () =>{
    
     
          fetchQuestion();
    
  
    }
    return (
        <div className="flex flex-col items-center justify-center gap-4 mx-4 md:mx-800 lg:mx-16 xl:mx-32 mt-[80px] ">
            <div className="w-[100%] float-left mb-[20px]">  <h1  style={{ fontFamily: 'Roboto', fontWeight: '800', fontSize: '24px', lineHeight: '32px',  }}>
          Choose Topic
          <sub style={{ fontFamily: 'Roboto', fontWeight: '600', fontSize: '10px', lineHeight: '16px', letterSpacing: '0.5px', color: '#9F9F9F', marginLeft:'8px' }}>
            (Maximum: 01 Topic)
          </sub>
        </h1></div>
      
        <div className="flex flex-wrap justify-start gap-4">
          {topics.sort((a, b) => a.chapter_name.localeCompare(b.chapter_name)).map(topic => (
            <button
              className="px-[24px] py-[10px] rounded-full  "
              style={{ border: topic.chapter_id === selectedTopicId ? '':  '1.5px solid #8854C0', color: topic.chapter_id === selectedTopicId ? "white" : '#8854C0', backgroundColor: topic.chapter_id === selectedTopicId ? "#213970": ""  }}
              key={topic.topic_id}
              onClick={() => handleTopic(topic.chapter_id, topic.chapter_name)}
            >
              {topic.chapter_name}
            </button>
          ))}
        
        </div>
        <div className='mt-[24px] justify-center  '> 
        <p className='mb-[24px]' style={{fontFamily:'Roboto', fontWeight:'600',textAlign:'center' }} > OR</p>
      
          <button
    className={`px-[24px] py-[10px] rounded-full text-white bg-[#8854C0]`} 
    style={{ border:  selectedTopicId === 'null'  ? '':  '1px dashed #8854C0', color: selectedTopicId  === 'null' ? "white" : '#8854C0', backgroundColor: selectedTopicId  === 'null' ? "#213970": "white"  }}
    onClick={() =>{handleTopic('null'); }}
  >
    All Topics +
  </button></div>
     
        <div className="flex-col mt-[12px] w-[100%] mb-[24px]">
        <button className="float-left py-[10px] px-[24px]"    style={{ border: '1.5px solid #535255', color: '#535255', borderRadius:'4px', gap:'8px', opacity:'0.53' }} onClick={onRestart} >Back</button>
        <button  className="float-right py-[10px] px-[24px]"  style={{ border: selectedTopicId !== null ? '1.5px solid #8854C0' :"#535255", backgroundColor: selectedTopicId !== null ? '#8854C0' : '#535255',opacity: selectedTopicId !== null ? " " :"0.51", borderRadius:'4px', gap:'8px', color:'white' }} disabled={!selectedTopicId} onClick={handleSubmitResponse} >Next</button>
        </div>
      </div>
      
    );
  };
  
  export default TopicSelector;
  