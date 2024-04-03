const Toggler = ({ isEnabled, onToggle }) => (
    <div
      onClick={onToggle}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
        isEnabled === 1 ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
          isEnabled === 1 ? 'translate-x-6' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
export default Toggler;  