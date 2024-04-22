import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://192.168.1.13:8080/image';
function App() {
  const [base64, setBase64] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const lastRenderTimeRef = useRef(0);
  const [fps, setFps] = useState(0);
  const [image, setImage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.13:8080/stream'); // Thay đổi địa chỉ và cổng của máy chủ WebSocket tại đây

    ws.onopen = () => {
      console.log('Connected to server');
    };

    ws.onmessage = (event) => {
      const receivedImage = event.data;
      const blob = new Blob([receivedImage], { type: 'image/jpeg' });
          const newImageUrl = URL.createObjectURL(blob);
          setImageUrl(newImageUrl);

          if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
          }
          const currentTime = performance.now();
          const timeSinceLastRender = currentTime - lastRenderTimeRef.current; 
          const fps = Math.round(1000 / timeSinceLastRender); 
          setFps(fps);
          lastRenderTimeRef.current = currentTime; 
    };

    ws.onclose = () => {
      console.log('Disconnected from server');
    };

    return () => {
      ws.close();
    };
  }, []);


  return (
    <div>
      {/* {base64 && <img  src={`data:image/jpeg;base64,${base64}`} alt="stream" />} */}
      <p>FPS: {fps}</p>
      {imageUrl && <img src={imageUrl} alt="stream" />}
    </div>
  );
}

export default App