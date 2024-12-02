import express from "express";
import {
  updateKhuyenMai,
  getKhuyenMai,
  getKhuyenMaiById,
  getPhienBan,
  getPhone,
  getSanPhamById,
  getPhieuBaoHanh,
  addKhuyenMai,
  updatePhieuBaoHanh,
  addBaoHanh,
  deleteBaoHanh,
  getPhieuNhap,
  updatePhieuNhap,
  addPhieuNhap,
  deletePhieuNhap,
  sortPhone,
  getRandomProducts,
  searchProducts,
  updatePhone,
  addPhone,
  updatePhienBan,
  addPhienBan,
  getNhaCungCap,
  updateNhaCungCap,
  addNhaCungCap,
  getOrder,
  getChiTietOrder,
  getSPById,
  getSanPhamBySeri,
  getChiTietBymaPb,
  addChiTietPhieuNhap,
  saveCart,
  updateCart,
  checkCart,
  deleteCart,
  getCart,
  deleteCartKh,
  addDonHang,
  getChiTietSanPhamBymaPB,
  addChiTietDonHang,
} from "../controller/phoneController.js";
const phoneRouter = express.Router();

phoneRouter.get("/get-phone", getPhone);
phoneRouter.get("/get-nhacungcap", getNhaCungCap);
phoneRouter.get("/search", searchProducts);
phoneRouter.get("/get-sortphone", sortPhone);
phoneRouter.get("/get-randomphone", getRandomProducts);
phoneRouter.get("/get-phienban", getPhienBan);
phoneRouter.get("/getPhoneById/", getSanPhamById);
phoneRouter.get("/get-spbyid/:maSP", getSPById);
phoneRouter.get("/get-sanphambyseri/:soSeri", getSanPhamBySeri);
phoneRouter.get("/get-promotion/", getKhuyenMai);
phoneRouter.post("/check-cart", checkCart);
phoneRouter.post("/delete-cart", deleteCart);
phoneRouter.post("/delete-cartkh", deleteCartKh);
phoneRouter.get("/get-promotionById", getKhuyenMaiById);
phoneRouter.get("/get-ctbymapb/:maPB", getChiTietBymaPb);
phoneRouter.put("/update-promotion", updateKhuyenMai);
phoneRouter.get("/get-phieuBaoHanh", getPhieuBaoHanh);
phoneRouter.post("/add-khuyenmai", addKhuyenMai);
phoneRouter.put("/update-baohanh", updatePhieuBaoHanh);
phoneRouter.post("/add-baohanh", addBaoHanh);
phoneRouter.post("/delete-baohanh", deleteBaoHanh);
phoneRouter.get("/get-phieuNhap", getPhieuNhap);
phoneRouter.get("/get-order/:maKH", getOrder);
phoneRouter.get("/get-chitietorder/:maDH", getChiTietOrder);
phoneRouter.put("/update-phieunhap", updatePhieuNhap);
phoneRouter.post("/add-phieunhap", addPhieuNhap);
phoneRouter.post("/add-chitietphieunhap", addChiTietPhieuNhap);
phoneRouter.post("/delete-phieunhap", deletePhieuNhap);
phoneRouter.put("/update-sanpham", updatePhone);
phoneRouter.post("/add-phone", addPhone);
phoneRouter.post("/add-donhang", addDonHang);
phoneRouter.put("/update-phienban", updatePhienBan);
phoneRouter.put("/update-nhacungcap", updateNhaCungCap);
phoneRouter.post("/add-phienban", addPhienBan);
phoneRouter.post("/add-nhacungcap", addNhaCungCap);
phoneRouter.post("/save-cart", saveCart);
phoneRouter.put("/update-cart", updateCart);
phoneRouter.post("/get-cart", getCart);
phoneRouter.post("/get-ctspbyid", getChiTietSanPhamBymaPB);
phoneRouter.post("/add-chitietdonhang", addChiTietDonHang);
export default phoneRouter;
