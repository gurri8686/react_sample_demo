import React from 'react';
import AudioRecorder from './components/AudioRecorder';
import 'bootstrap/dist/css/bootstrap.min.css';
import VideoRecorder from './components/VideoRecorder';
function App() {
  return (
    <div className="App">
    <div className="container mt-5">
      <div className="col-12">
        <div className="row">
          <div className="col-6">
            <AudioRecorder/>
          </div>
          <div className="col-6">
            <VideoRecorder/>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;
