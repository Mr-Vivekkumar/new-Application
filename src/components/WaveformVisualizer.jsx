import React, { useRef, useEffect } from "react";

const WaveformVisualizer = ({ audioBlob }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!audioBlob) return;
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      audioContext.decodeAudioData(
        fileReader.result,
        (buffer) => {
          const canvas = canvasRef.current;
          const canvasCtx = canvas.getContext("2d");

          canvasCtx.fillStyle = "rgb(200, 200, 200)";
          canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = "rgb(0, 0, 0)";
          canvasCtx.beginPath();

          const data = buffer.getChannelData(0);
          const step = Math.ceil(data.length / canvas.width);
          const amp = canvas.height / 2;
          for (let i = 0; i < canvas.width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
              const datum = data[i * step + j];
              if (datum < min) {
                min = datum;
              }
              if (datum > max) {
                max = datum;
              }
            }
            canvasCtx.strokeRect(i, amp - min * amp, 1, max * amp);
          }

          canvasCtx.stroke();
        }
      );
    };

    fileReader.readAsArrayBuffer(audioBlob);

    return () => {
      audioContext.close();
    };
  }, [audioBlob]);

  return <canvas ref={canvasRef} width="300" height="100" />;
};

export default WaveformVisualizer;