import React, { useState, useEffect, useRef } from 'react';

const VideoDuration = ({ videoUrl, videoDuration }) => {
    const [duration, setDuration] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        const handleLoadedMetadata = () => {
            setDuration(Math.round(videoElement.duration));
            videoDuration(Math.round(videoElement.duration))
        };

        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        // Cleanup the event listener on component unmount
        return () => {
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [videoUrl]);

    return (
        <div>
            <video ref={videoRef} src={videoUrl} style={{ display: 'none' }} />
            {duration &&
                <p>Duration: {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}s</p>
            }
        </div>
    );
};

export default VideoDuration;