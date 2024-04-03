// LeadingTable.js
import React from 'react';

const LeadingTable = ({ currentEmails, handleEmailPageChange, currentEmailPage, totalEmailPages, numberOfRows, setNumberOfRows,emailData, handleRowChange }) => {
  return (
    <>
           <div className="mt-4">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[silver]">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.no
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEmails.length > 0 ? currentEmails.map((item, index) => (
                      <tr key={index}>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index+1}
                        </td> 
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.trial_email ? item.trial_email : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.subject_name ? item.subject_name : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          { new Date(item.time_stamp).toLocaleDateString('en-US', { year: 'numeric',month: '2-digit',day: '2-digit'})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {new Date(item.time_stamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: process.env.REACT_APP_TIME_ZONE === "PAK" ?  'Etc/GMT-5' : 'Etc/GMT',
    hour12: true // Use 24-hour format
  })}
</td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          No emails available
                        </td>
                      </tr>
                    )}
                  </tbody>
                 
                </table>
              
              </div>
          
              <div className="w-full flex flex-col items-center justify-center mt-12 mb-12">
      <div   className='flex'>
        <div style={{display: numberOfRows === emailData.length ? 'none' : '' }}>
        <button
          onClick={() => handleEmailPageChange(currentEmailPage - 1)}
          className={`mx-1 px-4 py-2 ${currentEmailPage === 1 ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
          disabled={currentEmailPage === 1}
        >
          {"<"}
        </button>
        <span className='ml-2 mr-2'>{currentEmailPage}</span>
        <button
          onClick={() => handleEmailPageChange(currentEmailPage+1)}
          className={`mx-1 px-4 py-2 ${currentEmailPage === totalEmailPages ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
          disabled={currentEmailPage === totalEmailPages}
        >
          {">"}
        </button>
        </div>
        <div> <select id="rowSelector1"    className="mx-8  rounded" value={numberOfRows} onChange={handleRowChange}>
      <option value="150">150</option>
      <option value="300">300</option>
      <option  value={emailData.length }>All</option>
        

    </select>
    </div>
      </div>
    

</div>
            </div>
    </>
  );
};

export default LeadingTable;
