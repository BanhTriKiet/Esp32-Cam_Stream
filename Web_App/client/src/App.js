import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
function App() {
  const [base64, setBase64] = useState('');
  const lastRenderTimeRef = useRef(0);
  const [fps, setFps] = useState(0);
  useEffect(() => {
    const fetchImageContinuously = async () => {
      try {
        while (true) {
          const response = await axios.get('http://localhost:8080/stream', {
            responseType: 'json',
          });
          const buffer64 = Buffer.from(response.data.data, 'decimal').toString('base64');
          setBase64(buffer64);
           const currentTime = performance.now();
          const timeSinceLastRender = currentTime - lastRenderTimeRef.current; 
          const fps = Math.round(1000 / timeSinceLastRender); 
          setFps(fps);
          lastRenderTimeRef.current = currentTime; 


          requestAnimationFrame(fetchImageContinuously); 
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImageContinuously();
  }, []);

  return (
    <div>
      {base64 && <img  src={`data:image/jpeg;base64,${base64}`} alt="stream" />}
      <p>FPS: {fps}</p>
    </div>
  );
}

export default App