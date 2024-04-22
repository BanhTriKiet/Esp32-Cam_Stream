import WebSocket, {WebSocketServer } from 'ws';
import express from 'express'
import expressWs from 'express-ws'; 
const app = express();
expressWs(app);


let image;
const streamConnections = []; // Mảng lưu trữ các kết nối trong endpoint "/stream"

// Định nghĩa endpoint "/image"
app.ws('/image', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('received: ', msg);
    image = msg;
    // Gửi dữ liệu hình ảnh đến tất cả các kết nối trong "/stream" endpoint
    streamConnections.forEach(function(client) {
      client.send(image);
    });
  });
});

// Định nghĩa endpoint "/stream"
app.ws('/stream', function(ws, req) {
  // Thêm kết nối mới vào mảng streamConnections khi có kết nối mới được thiết lập
  streamConnections.push(ws);

  ws.on('close', function() {
    // Xóa kết nối đã đóng khỏi mảng streamConnections
    const index = streamConnections.indexOf(ws);
    if (index !== -1) {
      streamConnections.splice(index, 1);
    }
  });
});
// app.ws('/image', function(ws, req) {
//   ws.on('message', function(msg) {
//     console.log('received: ', msg);

//     image=msg;

//   });
// });
// app.ws('/stream', function(ws, req){
//   const interval = setInterval(() => {

//       ws.send(image);

//   }, 0);
  
// });
app.listen(8080, () => { console.log("Server listening started on port 8080") })