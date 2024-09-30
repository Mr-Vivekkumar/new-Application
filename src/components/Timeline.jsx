import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Timeline = ({ videoRef }) => {
    const { dialogues, currentDialogueIndex, setCurrentDialogueIndex } = useContext(AppContext);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (videoRef.current) { 
            videoRef.current.onloadedmetadata = () => {
                setDuration(videoRef.current.duration);
            };
        }
    }, [videoRef]);

    const handleClick = (index) => {
        setCurrentDialogueIndex(index);
        if (videoRef.current) {
            videoRef.current.currentTime = dialogues[index].startTime;
        }
    };

    const segmentWidth = (dialogue) => {
        if (!duration) return 0;
        return ((dialogue.endTime - dialogue.startTime) / duration) * 100;
    };


    return (
        <div className="w-full max-w-md mt-4 overflow-x-auto">
            <div className="flex" style={{ width: '100%' }}>
                {dialogues.map((dialogue, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`cursor-pointer border border-gray-300 h-8 flex items-center justify-center text-white ${index === currentDialogueIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
                        style={{ width: `${segmentWidth(dialogue)}%` }} 
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;