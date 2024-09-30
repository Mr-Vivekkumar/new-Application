import React, { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const { dialogues, setCurrentDialogueIndex } = useContext(AppContext);

    const formatTime = (seconds) => {
        const milliseconds = Math.round((seconds % 1) * 1000);
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingSeconds = totalSeconds % 60;
        const remainingMinutes = minutes % 60;

        return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    };

    const findCurrentDialogueIndex = () => {
        const index = dialogues.findIndex(dialogue =>
            currentTime >= dialogue.startTime && currentTime < dialogue.endTime
        );
        setCurrentDialogueIndex(index);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleSeek = (time) => {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
        findCurrentDialogueIndex();
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, []);

    useEffect(() => {
        const animationFrameId = requestAnimationFrame(findCurrentDialogueIndex);
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentTime, dialogues, findCurrentDialogueIndex]);

    return (
        <div className="w-full max-w-md">
            <video 
                ref={videoRef} 
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"  // Replace with your video URL
                type="video/mp4" 
                controls 
                className="w-full" 
                onTimeUpdate={handleTimeUpdate} 
            />
            <div className="mt-2">
                <input
                    type="range"
                    min="0"
                    max={videoRef.current?.duration || 0}
                    step="any"
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="w-full"
                />
            </div>
            <p className="text-center mt-2">Current Time: {formatTime(currentTime)}</p>
        </div>
    );
};

export default VideoPlayer;