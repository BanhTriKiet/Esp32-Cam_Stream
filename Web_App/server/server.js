import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'


const app = express()


app.use(cors())
app.use(bodyParser.raw({ type: 'image/jpeg' }));
let image;

app.post('/post', (req, res) => {
    image=req.body;
    res.send('Data received successfully');
    
});


app.get('/stream',(req,res)=>{
  res.json(image);
});


app.listen(8080, () => { console.log("Server listening started on port 8080") })

