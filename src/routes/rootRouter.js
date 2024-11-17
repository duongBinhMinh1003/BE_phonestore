import express from 'express'
import phoneRouter from './phoneRouter.js';
import userRouter from './userRouter.js';

const rootRouter = express.Router();

rootRouter.use("/phonestore",phoneRouter);
rootRouter.use("/user",userRouter);

export default rootRouter;