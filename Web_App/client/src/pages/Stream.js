import React, { useEffect, useState, useRef } from "react";
import "./style.css";

function Stream() {
  const [imageUrl, setImageUrl] = useState("");
  let fpsArray = [];
  const lastRenderTimeRef = useRef(0);
  const [fpsavg, setFpsavg] = useState(0);
  const logo = require("./received_image.jpg");
  useEffect(() => {
    const ws = new WebSocket("ws://banhtrikiet.zapto.org:8080/stream");

    ws.onopen = () => {
      console.log("Connected to server");
    };

    ws.onmessage = (event) => {
      const receivedImage = event.data;
      const blob = new Blob([receivedImage], { type: "image/jpeg" });
      const newImageUrl = URL.createObjectURL(blob);
      setImageUrl(newImageUrl);

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      //tính fps
      const currentTime = performance.now();
      const timeSinceLastRender = currentTime - lastRenderTimeRef.current;
      const fps = Math.round(1000 / timeSinceLastRender);
      fpsArray.push(fps);
      lastRenderTimeRef.current = currentTime;
      //tính toán fps trung bình trong 10 frame
      if (fpsArray.length >= 10) {
        const sum = fpsArray.reduce((acc, val) => acc + val, 0);
        setFpsavg(Math.round(sum / fpsArray.length));
        //trượt frame
        fpsArray.shift();
      } else {
        setFpsavg(fps);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App">
      <div>
        <div className="streamContainer">
          <div className="content">
            {imageUrl && <img className="image" src={imageUrl} alt="stream" />}
            {/* <img className="image" src={logo} alt="stream" /> */}
            <p className="fps">FPS: {fpsavg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stream;
