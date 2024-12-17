import React from 'react';

const EditButton = ({ onClick, label = "Edit" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {label}
    </button>
  );
};

export default EditButton;
