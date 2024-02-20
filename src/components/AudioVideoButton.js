import React from "react";
import audioImage from '../assets/images/audioImage.gif';
const AudioVideoButton = ({ title, isRecording, elapsedTime, handleStopRecording, handleStartRecording, recordingType, videoRef = null }) => {

    
    return (
        <div >
            <h1 className="mb-4">{title}</h1>
            <p className="mb-3">{isRecording ? `Recording Time: ${elapsedTime} seconds` : ''}</p>
            <button
                className={`btn ${isRecording ? 'btn-danger' : 'btn-success'}`}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
                {isRecording ? `Stop ${title}` : `Start ${title}`}
            </button>
            <br />
            <br />
            {recordingType == 'audio' &&
                isRecording && <img src={audioImage} width="300" height="300" />
            }
            {recordingType == 'video' &&
                <video ref={videoRef} autoPlay playsInline width="300" height="300" />
            }
        </div>
    )
}
export default AudioVideoButton;