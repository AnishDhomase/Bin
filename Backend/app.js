import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import  cookieparser from 'cookie-parser'
import userrouter from './routes/User.routes.js'
import { dbconnect } from './db/db.js'
const app = express();
dotenv.config()
const PORT = process.env.PORT || 4000; 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());

// user routes

app.use('/user',userrouter)

dbconnect();


 app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
 })

