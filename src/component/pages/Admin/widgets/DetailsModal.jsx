const DetailsModal = ({ isOpen, onClose, details }) => {
  const trimedText = (feedback) =>{
    var str = feedback;
    str = str.replace(details.marksObtained," ");
    str = str.replace("Awarded"," ")
    str = str.replace("Marks"," ")
    str = str.replace("Question"," ")
    str = str.replace("Q"," ")
    str = str.replace(":"," ")
    str = str.replace("1"," ")
    str = str.replace("feedback"," ")
    str = str.replace("separator"," ")
    str = str.replace("**"," ")
    str = str.replace("="," ")
    str = str.replace("Marks"," ")
    return str;
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="bg-white p-5 rounded-lg w-[80%] mx-auto my-20">
        <h2 className="text-xl font-bold mb-4">Details</h2>
        <ul>
          <li><strong>Student Email:</strong> {details.email}</li>
          <li><strong>Date:</strong> {details.date}</li>
          <li><strong>Time:</strong> {details.time}</li>
          <li><strong>Subject Name:</strong> {details.subject}</li>
          <li><strong>Topic:</strong> {details.topic}</li>
          <li><strong>Question:</strong> {details.question}</li>
          <li><strong>Student Answer:</strong> {details.studentAnswer}</li>
          <li><strong>Marks Obtained:</strong> {details.marksObtained}</li>
          <li><strong>Mockbot Feedback:</strong> {trimedText(details.mockbotFeedback)}</li>
          <li><strong>Actual Answer:</strong> {details.actualAnswer}</li>
          <li><strong>Rubric:</strong> {details.rubric}</li>
         {details.studentFeedback?.length >0 &&( <li><strong>Student Feedback:</strong> {details.studentFeedback}</li>)}
        </ul>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default DetailsModal;