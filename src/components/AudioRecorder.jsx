import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import WaveformVisualizer from "./WaveformVisualizer";

const AudioRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordingError, setRecordingError] = useState(null);

  const {
    setAudioForCurrentDialogue,
    setIsRecording: setContextIsRecording, // Use the original name
    currentDialogue,
  } = useContext(AppContext);

  const startRecording = async () => {
    setRecordingError(null);

    // Check for MediaRecorder support
    if (!window.MediaRecorder) {
      setRecordingError("MediaRecorder is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioForCurrentDialogue(blob, currentDialogue);
        setContextIsRecording(false); // Use the original name
        setIsRecording(false);
        setStream(null);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        setRecordingError("An error occurred with the MediaRecorder.");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setContextIsRecording(true); // Use the original name
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "NotFoundError") {
        setRecordingError(
          "Microphone access denied. Please grant permission in your browser settings."
        );
      } else {
        setRecordingError("An error occurred during recording. Please try again.");
      }
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Start Recording
      </button>
      <button
        onClick={stopRecording}
        disabled={!isRecording}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Stop Recording
      </button>
      {/* Waveform visualizer */}
      {stream && <WaveformVisualizer audioStream={stream} />}

      {/* Display the error message if one exists */}
      {recordingError && (
        <div className="text-red-500 mt-2">{recordingError}</div>
      )}
    </div>
  );
};

export default AudioRecorder;