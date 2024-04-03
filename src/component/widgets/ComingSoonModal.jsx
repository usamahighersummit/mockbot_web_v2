import rocket from '../../images/rocket.png'
const ComingSoonModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center"> {/* Adjusted max-w-md for wider modal */}
          <div className="flex justify-center items-start">
            {/* Center the image by wrapping it in a div with flex utilities */}
            <div className="flex justify-center w-full">
              <img src={rocket} alt="" className="mx-auto" /> {/* mx-auto for horizontal centering */}
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <span className="text-3xl">&times;</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center" style={{ fontFamily: 'roboto' }}>Coming Soon</h2>
          {/* Updated class to prevent text wrapping and adjusted font size for fitting text in one line */}
          <p className="mt-2 mb-4 text-gray-600 " style={{ fontFamily: 'roboto', fontSize: '14px' }}>Just a heads up, I'm crafting some neat content for you.</p>
          <p className="text-gray-500" style={{ fontFamily: 'roboto' }}>Got queries or thoughts?</p>
                  <a href="mailto:mockbot@highersummit.com" className="text-[#8854C0] hover:text-blue-800" style={{ fontFamily: 'roboto' }}><span className="text-gray-500 mr-1" style={{ fontFamily: 'roboto' }}> Email me at</span>mockbot@highersummit.com</a>
        </div>
      </div>
      
    );
  };
  export default ComingSoonModal;
  