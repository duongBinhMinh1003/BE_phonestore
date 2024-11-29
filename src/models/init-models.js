import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _chitietdonhang from  "./chitietdonhang.js";
import _chitietphieunhap from  "./chitietphieunhap.js";
import _chitietsanpham from  "./chitietsanpham.js";
import _danhgia from  "./danhgia.js";
import _donhang from  "./donhang.js";
import _giohang from  "./giohang.js";
import _hinhanh from  "./hinhanh.js";
import _khachhang from  "./khachhang.js";
import _khuyenmai from  "./khuyenmai.js";
import _nhacungcap from  "./nhacungcap.js";
import _nhanvien from  "./nhanvien.js";
import _phienbansp from  "./phienbansp.js";
import _phieubaohanh from  "./phieubaohanh.js";
import _phieudoitra from  "./phieudoitra.js";
import _phieunhap from  "./phieunhap.js";
import _sanpham from  "./sanpham.js";
import _taikhoan from  "./taikhoan.js";

export default function initModels(sequelize) {
  const chitietdonhang = _chitietdonhang.init(sequelize, DataTypes);
  const chitietphieunhap = _chitietphieunhap.init(sequelize, DataTypes);
  const chitietsanpham = _chitietsanpham.init(sequelize, DataTypes);
  const danhgia = _danhgia.init(sequelize, DataTypes);
  const donhang = _donhang.init(sequelize, DataTypes);
  const giohang = _giohang.init(sequelize, DataTypes);
  const hinhanh = _hinhanh.init(sequelize, DataTypes);
  const khachhang = _khachhang.init(sequelize, DataTypes);
  const khuyenmai = _khuyenmai.init(sequelize, DataTypes);
  const nhacungcap = _nhacungcap.init(sequelize, DataTypes);
  const nhanvien = _nhanvien.init(sequelize, DataTypes);
  const phienbansp = _phienbansp.init(sequelize, DataTypes);
  const phieubaohanh = _phieubaohanh.init(sequelize, DataTypes);
  const phieudoitra = _phieudoitra.init(sequelize, DataTypes);
  const phieunhap = _phieunhap.init(sequelize, DataTypes);
  const sanpham = _sanpham.init(sequelize, DataTypes);
  const taikhoan = _taikhoan.init(sequelize, DataTypes);

  chitietsanpham.belongsToMany(donhang, { as: 'maDH_donhangs', through: chitietdonhang, foreignKey: "soSeri", otherKey: "maDH" });
  donhang.belongsToMany(chitietsanpham, { as: 'soSeri_chitietsanphams', through: chitietdonhang, foreignKey: "maDH", otherKey: "soSeri" });
  khachhang.belongsToMany(phienbansp, { as: 'maPB_phienbansp_giohangs', through: giohang, foreignKey: "maKH", otherKey: "maPB" });
  phienbansp.belongsToMany(khachhang, { as: 'maKH_khachhangs', through: giohang, foreignKey: "maPB", otherKey: "maKH" });
  phienbansp.belongsToMany(phieunhap, { as: 'maPN_phieunhaps', through: chitietphieunhap, foreignKey: "maPB", otherKey: "maPN" });
  phieunhap.belongsToMany(phienbansp, { as: 'maPB_phienbansps', through: chitietphieunhap, foreignKey: "maPN", otherKey: "maPB" });
  chitietdonhang.belongsTo(chitietsanpham, { as: "soSeri_chitietsanpham", foreignKey: "soSeri"});
  chitietsanpham.hasMany(chitietdonhang, { as: "chitietdonhangs", foreignKey: "soSeri"});
  phieubaohanh.belongsTo(chitietsanpham, { as: "soSeri_chitietsanpham", foreignKey: "soSeri"});
  chitietsanpham.hasMany(phieubaohanh, { as: "phieubaohanhs", foreignKey: "soSeri"});
  chitietdonhang.belongsTo(donhang, { as: "maDH_donhang", foreignKey: "maDH"});
  donhang.hasMany(chitietdonhang, { as: "chitietdonhangs", foreignKey: "maDH"});
  danhgia.belongsTo(khachhang, { as: "maKH_khachhang", foreignKey: "maKH"});
  khachhang.hasMany(danhgia, { as: "danhgia", foreignKey: "maKH"});
  donhang.belongsTo(khachhang, { as: "maKH_khachhang", foreignKey: "maKH"});
  khachhang.hasMany(donhang, { as: "donhangs", foreignKey: "maKH"});
  giohang.belongsTo(khachhang, { as: "maKH_khachhang", foreignKey: "maKH"});
  khachhang.hasMany(giohang, { as: "giohangs", foreignKey: "maKH"});
  phieubaohanh.belongsTo(khachhang, { as: "maKH_khachhang", foreignKey: "maKH"});
  khachhang.hasMany(phieubaohanh, { as: "phieubaohanhs", foreignKey: "maKH"});
  donhang.belongsTo(khuyenmai, { as: "maKM_khuyenmai", foreignKey: "maKM"});
  khuyenmai.hasMany(donhang, { as: "donhangs", foreignKey: "maKM"});
  phieunhap.belongsTo(nhacungcap, { as: "maNCC_nhacungcap", foreignKey: "maNCC"});
  nhacungcap.hasMany(phieunhap, { as: "phieunhaps", foreignKey: "maNCC"});
  donhang.belongsTo(nhanvien, { as: "maNV_nhanvien", foreignKey: "maNV"});
  nhanvien.hasMany(donhang, { as: "donhangs", foreignKey: "maNV"});
  phieubaohanh.belongsTo(nhanvien, { as: "maNV_nhanvien", foreignKey: "maNV"});
  nhanvien.hasMany(phieubaohanh, { as: "phieubaohanhs", foreignKey: "maNV"});
  phieunhap.belongsTo(nhanvien, { as: "maNV_nhanvien", foreignKey: "maNV"});
  nhanvien.hasMany(phieunhap, { as: "phieunhaps", foreignKey: "maNV"});
  chitietdonhang.belongsTo(phienbansp, { as: "maPB_phienbansp", foreignKey: "maPB"});
  phienbansp.hasMany(chitietdonhang, { as: "chitietdonhangs", foreignKey: "maPB"});
  chitietphieunhap.belongsTo(phienbansp, { as: "maPB_phienbansp", foreignKey: "maPB"});
  phienbansp.hasMany(chitietphieunhap, { as: "chitietphieunhaps", foreignKey: "maPB"});
  chitietsanpham.belongsTo(phienbansp, { as: "maPB_phienbansp", foreignKey: "maPB"});
  phienbansp.hasMany(chitietsanpham, { as: "chitietsanphams", foreignKey: "maPB"});
  giohang.belongsTo(phienbansp, { as: "maPB_phienbansp", foreignKey: "maPB"});
  phienbansp.hasMany(giohang, { as: "giohangs", foreignKey: "maPB"});
  chitietphieunhap.belongsTo(phieunhap, { as: "maPN_phieunhap", foreignKey: "maPN"});
  phieunhap.hasMany(chitietphieunhap, { as: "chitietphieunhaps", foreignKey: "maPN"});
  danhgia.belongsTo(sanpham, { as: "maSP_sanpham", foreignKey: "maSP"});
  sanpham.hasMany(danhgia, { as: "danhgia", foreignKey: "maSP"});
  hinhanh.belongsTo(sanpham, { as: "maSP_sanpham", foreignKey: "maSP"});
  sanpham.hasMany(hinhanh, { as: "hinhanhs", foreignKey: "maSP"});
  phienbansp.belongsTo(sanpham, { as: "maSP_sanpham", foreignKey: "maSP"});
  sanpham.hasMany(phienbansp, { as: "phienbansps", foreignKey: "maSP"});
  khachhang.belongsTo(taikhoan, { as: "maTK_taikhoan", foreignKey: "maTK"});
  taikhoan.hasMany(khachhang, { as: "khachhangs", foreignKey: "maTK"});
  nhanvien.belongsTo(taikhoan, { as: "maTK_taikhoan", foreignKey: "maTK"});
  taikhoan.hasMany(nhanvien, { as: "nhanviens", foreignKey: "maTK"});

  return {
    chitietdonhang,
    chitietphieunhap,
    chitietsanpham,
    danhgia,
    donhang,
    giohang,
    hinhanh,
    khachhang,
    khuyenmai,
    nhacungcap,
    nhanvien,
    phienbansp,
    phieubaohanh,
    phieudoitra,
    phieunhap,
    sanpham,
    taikhoan,
  };
}
