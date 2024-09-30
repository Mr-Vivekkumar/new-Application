import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navigation = () => {
  const { currentDialogueIndex, setCurrentDialogueIndex, dialogues } = useContext(AppContext);

  const handleNext = () => {
    console.log("Current Index (Next):", currentDialogueIndex); // Log current index
    console.log("Dialogues Length:", dialogues.length); // Log dialogues length
    setCurrentDialogueIndex((prevIndex) => Math.min(prevIndex + 1, dialogues.length - 1));
  };

  const handlePrevious = () => {
    console.log("Current Index (Previous):", currentDialogueIndex); // Log current index
    setCurrentDialogueIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className="mt-4">
      <button onClick={handlePrevious} disabled={currentDialogueIndex === 0} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50">
        Previous
      </button>
      <button onClick={handleNext} disabled={currentDialogueIndex === dialogues.length - 1} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default Navigation;