import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import room from './routes/room.route'
const app = express();
app.use(express.json());
const port = process.env.HTTP_PORT || 4000;
app.use(cors());

app.use('/api/v1',room);
app.listen(port,()=>{
    console.log(`App is listening on ${port}`);
})
