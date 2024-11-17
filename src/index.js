import express from 'express'
import mysql2 from 'mysql2'
import cors from 'cors';
import rootRouter from './routes/rootRouter.js';
const app = express();
app.use(express.json());
app.listen(8080)
app.use(cors())
const connect = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    port:"3307",
    database:"db_phonestore"
    })
app.use(rootRouter)