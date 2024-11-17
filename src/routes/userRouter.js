import express from 'express'
import { getUser, login, postUser, signUp, updateKhachHang, updateTaiKhoan } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post("/login",login)
userRouter.post("/signup",signUp)
userRouter.post("/post-user",postUser)
userRouter.get("/get-user",getUser)
userRouter.post("/update-khachhang",updateKhachHang)
userRouter.post("/update-taikhoan",updateTaiKhoan)
export default userRouter;