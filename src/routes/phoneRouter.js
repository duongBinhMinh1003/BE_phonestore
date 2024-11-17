import express from 'express'
import {  updateKhuyenMai, getKhuyenMai, getKhuyenMaiById, getPhienBan, getPhone, getSanPhamById, getPhieuBaoHanh, addKhuyenMai, updatePhieuBaoHanh, addBaoHanh, deleteBaoHanh, getPhieuNhap, updatePhieuNhap, addPhieuNhap, deletePhieuNhap, sortPhone, getRandomProducts, searchProducts } from '../controller/phoneController.js';
const phoneRouter = express.Router();

phoneRouter.get("/get-phone",getPhone)
phoneRouter.get("/search",searchProducts)
phoneRouter.get("/get-sortphone",sortPhone)
phoneRouter.get("/get-randomphone",getRandomProducts)
phoneRouter.get("/get-phienban",getPhienBan)
phoneRouter.get("/getPhoneById/",getSanPhamById)
phoneRouter.get("/get-promotion/",getKhuyenMai)
phoneRouter.get("/get-promotionById",getKhuyenMaiById)
phoneRouter.put("/update-promotion", updateKhuyenMai);
phoneRouter.get("/get-phieuBaoHanh", getPhieuBaoHanh);
phoneRouter.post("/add-khuyenmai", addKhuyenMai);
phoneRouter.put("/update-baohanh", updatePhieuBaoHanh);
phoneRouter.post("/add-baohanh", addBaoHanh);
phoneRouter.post("/delete-baohanh", deleteBaoHanh);
phoneRouter.get("/get-phieuNhap", getPhieuNhap);
phoneRouter.put("/update-phieunhap", updatePhieuNhap);
phoneRouter.post("/add-phieunhap", addPhieuNhap);
phoneRouter.post("/delete-phieunhap", deletePhieuNhap);

export default phoneRouter;