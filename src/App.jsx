import React, { useRef, useState, useEffect, useContext } from "react";
import VideoPlayer from "./components/VideoPlayer";
import AudioRecorder from "./components/AudioRecorder";
import DialogueDisplay from "./components/DialogueDisplay";
import Navigation from "./components/Navigation";
import Timeline from "./components/Timeline";
import DialogueTable from "./components/DialogueTable";
import "./App.css";
import { AppContext } from "./context/AppContext";

function App() {
  const videoRef = useRef(null);
  const [audioPlaybackMode, setAudioPlaybackMode] = useState("video");
  const [mergedAudio, setMergedAudio] = useState(null);

  const { dialogues, currentDialogueIndex } = useContext(AppContext);

  const handlePlayAudio = (audioBlob) => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleTimeUpdate = () => {
    const currentDialogue = dialogues[currentDialogueIndex];

    if (audioPlaybackMode === "recorded" && currentDialogue?.audio) {
      if (
        videoRef.current.currentTime >= currentDialogue.startTime &&
        videoRef.current.currentTime < currentDialogue.endTime
      ) {
        if (videoRef.current.paused) {
          handlePlayAudio(currentDialogue.audio);
        }
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const handlePlayVideoAudio = () => {
    setAudioPlaybackMode("video");
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  const handlePlayRecordedAudio = () => {
    setAudioPlaybackMode("recorded");
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
    }
  };

  const handlePlayBothAudio = () => {
    setAudioPlaybackMode("both");
    alert("Playing both audio tracks simultaneously is not yet implemented.");
  };

  return (
    <div className="app bg-gray-100 min-h-screen p-4">
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div>
          <VideoPlayer videoRef={videoRef} />
          <Timeline videoRef={videoRef} />
        </div>
        <div>
          <AudioRecorder />
          <DialogueDisplay />
          <Navigation />
        </div>
      </div>

      <div className="mt-4 flex">
        <button
          onClick={handlePlayVideoAudio}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Play Video Audio
        </button>
        <button
          onClick={handlePlayRecordedAudio}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Play Recorded Audio
        </button>
        <button
          onClick={handlePlayBothAudio}
          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Play Both
        </button>
      </div>
      <DialogueTable
        mergedAudio={mergedAudio}
        setMergedAudio={setMergedAudio}
      />
    </div>
  );
}

export default App;