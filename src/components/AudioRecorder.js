import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import AudioVideoButton from './AudioVideoButton';
const AudioRecorder = () => {
  const [audioStream, setAudioStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleStartRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(audioStream);
      setIsRecording(true);
      setElapsedTime(0);
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = () => {
        const [audioBlob] = recordedChunksRef.current;
        handleAudioDownload(audioBlob);
      };

      const timerId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      mediaRecorderRef.current.timerId = timerId;
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error accessing audio stream:', error.message);
    }

  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      // Stop the media stream
      if (audioStream) {
        const tracks = audioStream.getTracks();
        tracks.forEach(track => track.stop());
      }
      setIsRecording(false);
      clearInterval(mediaRecorderRef.current.timerId);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };

  const handleAudioDownload = (audioBlob) => {
    const fileName = `recorded_audio.mp3`;
    saveAs(audioBlob, fileName);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.timerId) {
        clearInterval(mediaRecorderRef.current.timerId);
      }
    };
  }, []);

  return (
    <AudioVideoButton
      title="Audio Recording"
      isRecording={isRecording}
      elapsedTime={elapsedTime}
      handleStopRecording={handleStopRecording}
      handleStartRecording={handleStartRecording}
      recordingType='audio'
    />
  );
};

export default AudioRecorder;
