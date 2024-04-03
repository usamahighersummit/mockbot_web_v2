// OnPressEndTable.js
import React from 'react';

const OnPressEndTable = ({ currentItems, handlePageChange, currentPage, totalPages, numberOfRows2, setNumberOfRows2, handleRowChange1, data, aggregateWords, hoveredIndex, setHoveredIndex }) => {
  return (
    <>
         <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-[silver]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Choose Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Choose Topic Select
                    </th>
                    <th scope="col" className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No of attempted Question<br></br> on pressing end
                    </th>
                    <th scope="col" className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                    </th>
                    <th scope="col" className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startover
                    </th>
                    <th scope="col" className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                    </th>
                    <th scope="col" className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Latest  Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
             {currentItems.length > 0 ? currentItems.map((datas, index) => (<tr key={index}>  <td
     
          className="max-w-[300px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="truncate cursor-pointer">
            {datas.student_email ? datas.student_email : "N/A"}
            {hoveredIndex === index && (
              <div className="absolute top-2 left-0 w-auto p-2 bg-white shadow-lg border rounded-md z-10 font-[8px]">
                {datas.student_email}
              </div>
            )}
          </div>
        </td>



                    <td scope="col" className="max-w-[300px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {datas.subject_names ? aggregateWords(datas.subject_names) : 'N/A'}
                    </td>
                    <td scope="col" className="max-w-[300px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {datas.topic_names ? aggregateWords(datas.topic_names) : 'N/A'}
                    </td>
                    <td scope="col" className="max-w-[20px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {datas.no_of_questions_per_response ? datas.no_of_questions_per_response : 'N/A'}
                    </td>
                    <td scope="col" className="max-w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {datas.feedback ? datas.feedback.split(',').join(',\n') : 'N/A'}
                    </td>
                    <td scope="col" className="max-w-[20px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {datas.no_of_responses ? datas.no_of_responses : 'N/A'}
                    </td>
                    <td scope="col" className="max-w-[140px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {datas.creation_dates ?  datas.creation_dates.split(',').join(',\n'): 'N/A'}
                    </td>
                    <td scope="col" className="max-w-[140px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {datas.latest_date}
                    </td>
                    </tr>)):
                 (<tr><td colSpan={7} className=" px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">no data in table</td></tr>)}
                </tbody>
            
              </table>
              <div className="w-full flex flex-col items-center justify-center mt-12 mb-12">

      <div  className='flex'>
        <div  style={{display: numberOfRows2 === data.length ? 'none' : '' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`mx-1 px-4 py-2 ${currentPage === 1 ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span className='ml-2 mr-2'>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage+1)}
          className={`mx-1 px-4 py-2 ${currentPage === totalPages ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        </div>
        <div> <select id="rowSelector"  className="mx-8  rounded" value={numberOfRows2} onChange={handleRowChange1}>
      <option value="150">150</option>
      <option value="300">300</option>
      <option value={data.length }>All</option>
    
    
    </select></div>
      </div>

</div>
    </>
  );
};

export default OnPressEndTable;
