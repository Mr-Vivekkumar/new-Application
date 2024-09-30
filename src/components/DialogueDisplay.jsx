import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import WaveformVisualizer from "./WaveformVisualizer";

const DialogueDisplay = () => {
  const {
    currentDialogue,
    setCurrentDialogue,
    isRecording,
    setAudioForCurrentDialogue,
    setIsRecording: setAppIsRecording,
  } = useContext(AppContext);
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isReRecording, setIsReRecording] = useState(false);
  const [recordingError, setRecordingError] = useState(null);

  useEffect(() => {
    if (currentDialogue) {
      setOriginalText(currentDialogue.original);
      setTranslatedText(currentDialogue.translated);
    }
  }, [currentDialogue]);

  const handleOriginalChange = (e) => {
    setOriginalText(e.target.value);
    setCurrentDialogue({ ...currentDialogue, original: e.target.value });
  };

  const handleTranslatedChange = (e) => {
    setTranslatedText(e.target.value);
    setCurrentDialogue({ ...currentDialogue, translated: e.target.value });
  };

  const handlePlayDialogueAudio = () => {
    if (currentDialogue?.audio) {
      const audioUrl = URL.createObjectURL(currentDialogue.audio);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleReRecord = async () => {
    setRecordingError(null); // Clear previous errors
    setIsReRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setAppIsRecording(true);

      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioForCurrentDialogue(blob, currentDialogue);
        setAppIsRecording(false);
        setStream(null);
        setIsReRecording(false); // Reset re-recording state
      };

      mediaRecorder.start();
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "NotFoundError") {
        setRecordingError(
          "Microphone access denied. Please grant permission in your browser settings."
        );
      } else {
        setRecordingError("An error occurred during recording. Please try again.");
      }
      console.error("Error accessing microphone:", err);
      setIsReRecording(false); // Reset re-recording state in case of error
    }
  };

  const handleStopReRecord = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setAppIsRecording(false);
      setIsReRecording(false);
      setStream(null);
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded">
      <p className="mb-2">
        Original:{" "}
        <input
          type="text"
          value={originalText}
          onChange={handleOriginalChange}
          className="border border-gray-400 px-2 py-1 rounded"
        />
      </p>
      <p>
        Translated:{" "}
        <input
          type="text"
          value={translatedText}
          onChange={handleTranslatedChange}
          className="border border-gray-400 px-2 py-1 rounded"
        />
      </p>

      {currentDialogue?.audio && (
        <WaveformVisualizer audioBlob={currentDialogue.audio} />
      )}

      <button
        onClick={handlePlayDialogueAudio}
        disabled={!currentDialogue?.audio || isRecording || stream}
        className="mt-2 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded mr-2"
      >
        Play
      </button>

      {isRecording || isReRecording ? (
        <div>
          <button
            onClick={handleStopReRecord}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Stop Recording
          </button>
          {isReRecording && (
            <span className="text-red-500 ml-2">Re-recording...</span>
          )}
        </div>
      ) : (
        <button
          onClick={handleReRecord}
          disabled={isRecording}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Re-record
        </button>
      )}

      {/* Error message display */}
      {recordingError && (
        <div className="text-red-500 mt-2">{recordingError}</div>
      )}
    </div>
  );
};

export default DialogueDisplay;