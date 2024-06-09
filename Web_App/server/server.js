import { Stream } from "stream";
import express from "express";
import expressWs from "express-ws";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
// import ffprobe  from 'ffprobe-static';
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { resolve } from "path";
import { rejects } from "assert";
import { uploadToBucket } from "./s3.js";
import {
  addOrUpdateVideoInfos,
  getAllVideosInfos,
  getVideosInfosByTime,
} from "./dynamo.js";
import dotenv from "dotenv";

dotenv.config();
ffmpeg.setFfmpegPath(ffmpegStatic);
const app = express();
expressWs(app);
let imagesQueue = []; // mảnh lưu trữ các buffer của hình ảnh
const streamConnections = []; // Mảng lưu trữ các kết nối trong endpoint "/stream"
let flag = 0;
let currentTime, startTime; //Các biến để xác định thời gian lưu ảnh

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createVideo(prefix, videoName, thumbnailName) {
  return new Promise((resolve, reject) => {
    ffmpeg({ source: Stream.Readable.from(imagesQueue, { objectMode: false }) })
      .inputFPS(15)
      .outputOptions(["-pix_fmt yuv420p", "-movflags faststart"])
      .toFormat("mp4")
      .output("video.mp4")
      .on("error", (err) => {
        // console.error("Error creating video:", err);
        return reject(err);
      })
      .on("end", () => {
        const videoSource =
          process.env.AWS_CLOUDFRONT_DISTRUBUTION +
          "/saved_videos/" +
          prefix +
          "/" +
          videoName +
          ".mp4";
        const thumbnailSource =
          process.env.AWS_CLOUDFRONT_DISTRUBUTION +
          "/saved_thumbnails/" +
          prefix +
          "/" +
          thumbnailName +
          ".png";
        const videoInfos = {
          videoName: videoName,
          thumbnail: thumbnailSource,
          videoSource: videoSource,
          time: new Date().getTime() / 60000,
        };
        addOrUpdateVideoInfos(videoInfos);
        uploadToBucket("saved_videos", prefix, "video.mp4", videoName + ".mp4");
        console.log("Video created successfully!");
        imagesQueue.length = 0;
        return resolve();
      })
      .run();
  });
}

function createThumbnail(prefix, thumbnailName) {
  ffmpeg({ source: "./video.mp4" })
    .screenshots({
      timestamps: [0],
      filename: "thumbnail.png",
    })
    .on("error", (err) => {
      console.error("Error creating video:", err);
    })
    .on("end", () => {
      uploadToBucket(
        "saved_thumbnails",
        prefix,
        "thumbnail.png",
        thumbnailName + ".png"
      );
      console.log("Thumbnail taken!");
    });
}

async function processVideo() {
  const prefix = getRandomInt(1, 20);
  const videoName =
    new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }) +
    "-" +
    new Date().toLocaleDateString().replace(/\//g, "-");
  const thumbnailName = videoName + " thumbnail";
  await createVideo(prefix, videoName, thumbnailName);
  createThumbnail(prefix, thumbnailName);
}
// Kiểm tra tin nhắn gửi đến /image (Esp32 gửi đến server)
app.ws("/image", function (ws, req) {
  ws.on("message", function (msg) {
    //kiểm tra xem tin nhắn có nhận lần đầu
    if (flag == 0) {
      startTime = performance.now();
    }
    flag = 1;
    // Gửi dữ liệu hình ảnh đến tất cả các kết nối trong "/stream" endpoint
    streamConnections.forEach(function (client) {
      client.send(msg);
    });
    //thêm tin nhắn vào buffer
    currentTime = performance.now();
    // console.log(currentTime, startTime);
    imagesQueue.push(msg);
    //hàm biến ảnh thành video 10s thì hợp lại thành video 1 lần
    if (currentTime - startTime >= 60000) {
      processVideo();
      startTime = performance.now();
    }
  });
});

// Kiểm tra kết nối đến stream (Client kết nối đến webServer)
app.ws("/stream", function (ws, req) {
  // Thêm kết nối mới vào mảng streamConnections khi có kết nối mới được thiết lập
  streamConnections.push(ws);

  ws.on("close", function () {
    // Xóa kết nối đã đóng khỏi mảng streamConnections
    const index = streamConnections.indexOf(ws);
    if (index !== -1) {
      streamConnections.splice(index, 1);
    }
  });
});

app.get("/videos", async (req, res) => {
  try {
    const data = await getAllVideosInfos();
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.get("/search/:from/:to", async (req, res) => {
  try {
    const data = await getVideosInfosByTime(req.params.from, req.params.to);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});
app.listen(8080, () => {
  console.log("Server listening started on port 8080");
});
