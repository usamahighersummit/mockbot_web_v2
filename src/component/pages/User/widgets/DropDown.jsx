import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const ref = useRef(null);
  const listboxRef = useRef(null); // Ref for the listbox

  // This function will be called when the user clicks outside of the dropdown
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Handle setting the focused index when the dropdown is opened
  useEffect(() => {
    const index = options.indexOf(value);
    if (index !== -1) {
      setFocusedIndex(index);
    }
  }, [isOpen, options, value]);

  // Scroll to the selected option when dropdown opens
  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const listItems = listboxRef.current.querySelectorAll('li');
      if (listItems[focusedIndex]) {
        listItems[focusedIndex].scrollIntoView({
          behavior: 'auto',
          block: 'nearest'
        });
      }
    }
  }, [isOpen, focusedIndex]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 text-center">
        {label}
      </label>
      <div onClick={() => setIsOpen(!isOpen)} className="mt-1 relative">
        <button
          className="bg-white relative w-full border-b border-gray-300 pl-3 pr-10 py-2 text-left cursor-default focus:outline-none sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span className="block truncate">{value || placeholder}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {/* Downward arrow icon */}
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
        {/* Dropdown menu */}
        {isOpen && (
          <ul
            ref={listboxRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          >
            {options.map((option, index) => (
              <li
                key={index}
                className={`text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9
                  ${value === option ? 'bg-[#ededed] text-black' : 'hover:text-grey-600  hover:text-black'}`}
                id="listbox-option-0"
                role="option"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <span className="font-normal block truncate mt-[12px] mb-[12px]">{option}</span>
                {value === option && (
                  <span className="text-grey-100 absolute inset-y-0 right-0 flex items-center pr-4">
                    {/* Checkmark icon */}
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
