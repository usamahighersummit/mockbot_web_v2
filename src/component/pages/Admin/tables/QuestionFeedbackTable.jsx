import thumbup from "../../../../images/thumb_up.png"
import thumbdown from "../../../../images/thumb_down.png"
import DetailsModal from "../widgets/DetailsModal";
import React , {useState} from "react";
const QuestionFeedbackTable = ({
  currentFeedback,
  handleFeedbackPageChange,
  currentFeedbackPage,
  totalFeedbackPages,
  numberOfFeedbackRows,
  handleRowChangeFeedback,
  FeedbackQuestion,
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDetails, setModalDetails] = useState({});
    function removeHTMLTags(htmlString) {
      // Create a new DOMParser instance
      var parser = new DOMParser();
      // Parse the HTML string into a document
      var doc = parser.parseFromString(htmlString, 'text/html');
      // Return the text content of the parsed document
      return doc.body.textContent || "";
  }
    const handleSeeMoreClick = (item) => {
      setModalDetails({
        email: item.email,
        date: new Date(item.creation_timestamp).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        time: new Date(item.creation_timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: process.env.REACT_APP_TIME_ZONE === "PAK" ?  'Etc/GMT-5' : 'Etc/GMT',
          hour12: true,
        }),
        subject: item.subject,
        topic: item.topic,
        question: removeHTMLTags(item.question),
        studentAnswer: item.student_answer,
        marksObtained: item.obtained_marks,
        mockbotFeedback: item.ai_feedback,
        actualAnswer: item.student_answer,
        rubric: item.rubric,
        studentFeedback: item.student_question_feedback,
      });
      setIsModalOpen(true);
    };
    return (
      <>
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-[silver]">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbs Up/ Thumbs down</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Feedback</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View  Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentFeedback.length > 0 ? (
              currentFeedback.map((item, index) => (
                <tr key={index}>
                     <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{index+1}</td>
                  <td className="max-w-[300px] px-6 py-3 text-left text-xs font-medium text-gray-500 overflow-hidden truncate">{item.email}</td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">   { new Date(item.creation_timestamp).toLocaleDateString('en-US', { year: 'numeric',month: '2-digit',day: '2-digit'})}</td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">  {new Date(item.creation_timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: process.env.REACT_APP_TIME_ZONE === "PAK" ?  'Etc/GMT-5' : 'Etc/GMT',
    hour12: true // Use 24-hour format
  })}</td>
                  <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500">{item.subject}</td>
                  <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500">{item.topic}</td>
                  <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500">{ removeHTMLTags(item.question)}</td>
                  <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 text-center">{item.obtained_marks}/{item.question_marks}</td>
                  <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 ">{item.student_response === 1 ? <img src={thumbup} alt=""/> : <img src={thumbdown} alt=""/> }</td>
                <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500">{item.student_question_feedback}</td>
                <td className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500">
                <button
              onClick={() => handleSeeMoreClick(item)}
              className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
            >
              See more
            </button>
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-3 text-center text-xs font-medium text-gray-900">No feedback available.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-full flex flex-col items-center justify-center mt-12 mb-12">
          <div className="flex">
            <div  className="flex" style={{display:numberOfFeedbackRows ===FeedbackQuestion.length ? 'none' : ''  }}>
            <button
              onClick={() => handleFeedbackPageChange(currentFeedbackPage - 1)}
              className={`mx-1 px-4 py-2 ${currentFeedbackPage === 1 ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
              disabled={currentFeedbackPage === 1}
            >
              {"<"}
            </button>
            <div> <span className="ml-2 mr-2 flex item-center mt-2">{currentFeedbackPage}</span></div>
           
            <button
              onClick={() => handleFeedbackPageChange(currentFeedbackPage + 1)}
              className={`mx-1 px-4 py-2 ${currentFeedbackPage === totalFeedbackPages ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
              disabled={currentFeedbackPage === totalFeedbackPages}
            >
              {">"}
            </button>
            </div>
            <select
           id="rowSelector"  className="mx-8  rounded"
              value={numberOfFeedbackRows}
              onChange={handleRowChangeFeedback}
            >
              <option value="150">150</option>
              <option value="300">300</option>
              <option value={FeedbackQuestion.length}>All</option>
            </select>
          </div>
        </div>
        <DetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} details={modalDetails} />
      </>
    );
  };
  
  export default QuestionFeedbackTable;
  