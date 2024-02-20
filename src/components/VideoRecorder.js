import React, { useRef, useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import AudioVideoButton from './AudioVideoButton';
const VideoRecorder = () => {
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);


  const handleStartVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      recordedChunksRef.current = [];
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

      setAudioStream(audioStream);
      setVideoStream(videoStream);
      setIsRecording(true);
      setElapsedTime(0);

      const combinedStream = new MediaStream([...audioStream.getTracks(), ...videoStream.getTracks()]);

      mediaRecorderRef.current = new MediaRecorder(combinedStream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;

      mediaRecorderRef.current.onstop = () => {
        const [audioBlob] = recordedChunksRef.current;
        handleVideoDownload(audioBlob);
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



  const handleStopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();


      // Stop the media stream
      if (audioStream) {
        const tracks = audioStream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
      }
      setIsRecording(false);
      clearInterval(mediaRecorderRef.current.timerId);

      // Clear the srcObject of the videoRef
      if (videoRef.current) {
        const videoElement = videoRef.current;
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  };

  const handleVideoDownload = (audioBlob) => {
    const fileName = `recorded_video.mp4`;
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
      title="Video Recording"
      isRecording={isRecording}
      elapsedTime={elapsedTime}
      handleStopRecording={handleStopVideoRecording}
      handleStartRecording={handleStartVideoRecording}
      recordingType='video'
      videoRef={videoRef}
    />
  );
};

export default VideoRecorder;
