import React from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from 'react-player'

const Video = () => {
    const location = useLocation();
    const videoName = location.state.videoName;
    const videoSource = location.state.videoSource;
    return (
        <div>
            <p>{videoName}</p>
            <video src={videoSource} type="video/mp4" width={500} height={500} autoPlay={true} />
        </div>
    )
}

export default Video