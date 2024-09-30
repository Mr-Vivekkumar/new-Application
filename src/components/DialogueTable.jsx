import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const DialogueTable = ({ mergedAudio, setMergedAudio }) => {
  const {
    dialogues,
    currentDialogueIndex,
    setCurrentDialogueIndex,
    isRecording,
    mergeAudioBlobs,
  } = useContext(AppContext);

  const handlePlayAudio = (audioBlob) => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleMergeAudio = () => {
    mergeAudioBlobs().then((blob) => {
      setMergedAudio(blob); // Update the mergedAudio state with the new blob
    });
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">No.</th>
            <th className="px-4 py-2">Original</th>
            <th className="px-4 py-2">Translated</th>
            <th className="px-4 py-2">Audio</th>
          </tr>
        </thead>
        <tbody>
          {dialogues.map((dialogue, index) => (
            <tr
              key={index}
              className={index === currentDialogueIndex ? "bg-gray-200" : ""}
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{dialogue.original}</td>
              <td className="border px-4 py-2">{dialogue.translated}</td>
              <td className="border px-4 py-2">
                {dialogue.audio && (
                  <button
                    onClick={() => handlePlayAudio(dialogue.audio)}
                    disabled={isRecording}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Play
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleMergeAudio}
        disabled={isRecording}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Merge Audio
      </button>

      {/* Conditionally render a Play button for the merged audio */}
      {mergedAudio && (
        <button
          onClick={() => handlePlayAudio(mergedAudio)}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Play Merged Audio
        </button>
      )}
    </div>
  );
};

export default DialogueTable;