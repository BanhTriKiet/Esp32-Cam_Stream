import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from 'react-player'

const Video = () => {
    const location = useLocation();
    const videoName = location.state.videoName;
    const videoSource = location.state.videoSource;
    const videoDuration = location.state.duration;
    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const playerRef = useRef(null);
    const handleProgress = (state) => {
        setPlayed(state.playedSeconds);
    };
    const handleSeekChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setPlayed(newTime);
        playerRef.current.seekTo(newTime);
    };
    return (
        <div className="videoContainer">
            <ReactPlayer ref={playerRef}
                className="video"
                url={videoSource}
                playing={playing}
                controls={false}
                onProgress={handleProgress} />
            <div className="progressBarContainer">
                <input
                    type="range"
                    min={0}
                    max={videoDuration}
                    step="any"
                    value={played}
                    onChange={handleSeekChange}
                    style={{ width: '400px' }}
                />
                <p>{Math.floor(played / 60)}:{String(Math.round(played % 60)).padStart(2, '0')}/ {Math.floor(videoDuration / 60)}:{String(videoDuration % 60).padStart(2, '0')}s</p>
            </div>
            <button className="playButton" onClick={() => setPlaying(!playing)} >
                <p>Play</p>
            </button>
            <p>Video name: {videoName} <br /> </p>
        </div >
    )
}

export default Video