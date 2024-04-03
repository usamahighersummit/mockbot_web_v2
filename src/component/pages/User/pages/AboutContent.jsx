import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';

const AboutContent = ({ country, setCountry, year, setYear, handleContinue, checked, setChecked }) => {
 
  return (
    <div>
      <div className="text-center my-5">
        <h1 className="text-xl font-semibold">This is your Save My Exams, User Name!</h1>
        <p className="text-gray-600 mt-2">To get started, tell us about you</p>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Which country are you studying in?
          </label>
          <select value={country} onChange={(e) => { setCountry(e.target.value) }} id="country" name="country" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option>Select Country</option>
            <option value="england">England</option>
            <option value="pakistan">Pakistan</option>
            <option value="usa">USA</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year-group">
            Which year group are you in?
          </label>
          <select value={year} onChange={(e) => { setYear(e.target.value) }} id="year-group" name="year-group" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option>Select Year</option>
            <option value="year1">Year 1</option>
            <option value="year3">Year 3</option>
            <option value="year5">Year 5</option>
            <option value="year7">Year 7</option>
            <option value="year10">Year 10</option>
          </select>
        </div>
        {/* Material-UI Checkbox */}
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e)=>{setChecked(!checked)}} name="checked" color="primary" />}
          label="I want to hear about new subjects, study tips, and exclusive offers"
        />
        <div className="flex items-center justify-end w-full">
          <button disabled={!year && !country} onClick={handleContinue} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 " type="button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
