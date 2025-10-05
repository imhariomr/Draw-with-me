import express from 'express'
import 'dotenv/config'
import cors from 'cors'

const app = express();
const port = process.env.HTTP_PORT;

app.use(express.json());
app.use(cors());


app.listen(port,()=>{
    console.log(`App is listening on ${port}`);
})
