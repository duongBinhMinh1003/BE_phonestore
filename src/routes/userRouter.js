import express from "express";
import {
  addNhanVien,
  addTaiKhoan,
  getNhanVien,
  getTaiKhoan,
  getUser,
  login,
  postUser,
  signUp,
  updateKhachHang,
  updateNhanVien,
  updateTaiKhoan,
  updateTaiKhoanAdmin,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signUp);
userRouter.post("/post-user", postUser);
userRouter.get("/get-user", getUser);
userRouter.get("/get-nhanvien", getNhanVien);
userRouter.post("/update-khachhang", updateKhachHang);
userRouter.post("/update-taikhoan", updateTaiKhoan);
userRouter.get("/get-taikhoan", getTaiKhoan);
userRouter.put("/update-taikhoanadmin", updateTaiKhoanAdmin);
userRouter.post("/add-taikhoan", addTaiKhoan);
userRouter.put("/update-nhanvien", updateNhanVien);
userRouter.post("/add-nhanvien", addNhanVien);
export default userRouter;
