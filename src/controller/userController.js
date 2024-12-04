import mysql2 from "mysql2";
import { responseData } from "../config/reponse.js";
import sendMail from "../config/sendMail.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";
const models = initModels(sequelize);

const login = async (req, res) => {
  const { tenDangNhap, matKhau } = req.body;
  try {
    // Kiểm tra tài khoản đăng nhập
    const checkUser = await models.taikhoan.findOne({
      where: {
        tenDangNhap: tenDangNhap,
        matKhau: matKhau,
      },
    });

    if (!checkUser) {
      return res.status(401).send("Login không thành công!");
    }

    res.send(checkUser);
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const signUp = async (req, res) => {
//   const { tkId, tenDangNhap, matKhau, quyen, trangThai} = req.body;

//   try {

//       const newAcount = await models.taikhoan.create({
//           tkId,
//           tenDangNhap,
//           matKhau: matKhau,
//           quyen,
//           trangThai,
//       });

//       return res.status(200).json({
//           message: "Sign up thành công",
//           account: {
//               tkId: newAcount.tkId,
//               tenDangNhap: newAcount.tenDangNhap,
//               quyen: newAcount.quyen,
//               trangthai: newAcount.trangthai
//           },
//       });

//   } catch (error) {
//       console.error('Error in signUp:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//   }
// };

const signUp = async (req, res) => {
  const { tenDangNhap, matKhau, quyen, trangThai, email } = req.body;

  try {
    const existingAccount = await models.taikhoan.findOne({
      where: { tenDangNhap },
    });

    if (existingAccount) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    const existingEmail = await models.khachhang.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const lastAccount = await models.taikhoan.findOne({
      order: [["tkId", "DESC"]],
      attributes: ["tkId"],
    });

    const newTkId = lastAccount
      ? `TK0${parseInt(lastAccount.tkId.slice(2)) + 1}`
      : "TK001";

    const newAccount = await models.taikhoan.create({
      tkId: newTkId,
      tenDangNhap,
      matKhau,
      quyen,
      trangThai,
    });

    const promoCode = await models.khuyenmai.findOne({
      order: sequelize.random(),
      attributes: ["maKM"],
    });

    if (!promoCode) {
      return res.status(404).send("Không tìm thấy mã khuyến mãi.");
    }

    sendMail(email, "PHONE STORE", promoCode.maKM);
    return res.status(200).json({
      message: "Sign up thành công",
      account: {
        tkId: newAccount.tkId,
        tenDangNhap: newAccount.tenDangNhap,
        quyen: newAccount.quyen,
        trangThai: newAccount.trangThai,
      },
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postUser = async (req, res) => {
  const { hoTen, ngaySinh, gioiTinh, diaChi, sdt, email, trangThai } = req.body;

  try {
    // Kiểm tra email trong bảng khachhang
    const existingEmail = await models.khachhang.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo tkId mới cho tài khoản
    const lastAccount = await models.taikhoan.findOne({
      order: [["tkId", "DESC"]],
      attributes: ["tkId"],
    });
    const newTkId = lastAccount
      ? `TK${parseInt(lastAccount.tkId.slice(2))}`
      : "TK1";

    // Tạo bản ghi tài khoản mới

    // Tạo maKH mới cho người dùng
    const lastUser = await models.khachhang.findOne({
      order: [["maKH", "DESC"]],
      attributes: ["maKH"],
    });
    const newMaKh = lastUser
      ? `KH${parseInt(lastUser.maKH.slice(2)) + 1}`
      : "KH1";

    // Tạo người dùng mới trong bảng khachhang
    const newUser = await models.khachhang.create({
      maKH: newMaKh,
      hoTen,
      ngaySinh,
      gioiTinh,
      diaChi,
      sdt,
      email,
      trangThai,
      maTK: newTkId,
    });

    return res.status(201).json({
      message: "Tạo người dùng thành công",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in postUser:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.query;

  try {
    // Tìm khách hàng theo `maTK`
    const khachHang = await models.khachhang.findOne({
      where: { maTK: id },
    });

    // Tìm nhân viên theo `maTK`
    const nhanVien = await models.nhanvien.findOne({
      where: { maTK: id },
    });

    // Kiểm tra nếu cả hai không tồn tại
    if (!khachHang && !nhanVien) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dữ liệu với ID này" });
    }

    // Ưu tiên trả khách hàng, nếu không có trả nhân viên
    res.status(200).json({
      message: "Lấy thông tin thành công",
      data: khachHang
        ? { type: "khachHang", ...khachHang.dataValues }
        : { type: "nhanVien", ...nhanVien.dataValues },
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin:", error);
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};

const getKhachHang = async (req, res) => {
  try {
    // Tìm khách hàng theo `maTK`
    const khachHang = await models.khachhang.findAll();

    // Kiểm tra nếu cả hai không tồn tại
    if (!khachHang && !nhanVien) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dữ liệu với ID này" });
    }

    // Ưu tiên trả khách hàng, nếu không có trả nhân viên
    res.status(200).json({
      message: "Lấy thông tin thành công",
      khachHang,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin:", error);
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};

const updateKhachHang = async (req, res) => {
  const { maKH, hoTen, ngaySinh, gioiTinh, sdt, diaChi, email } = req.body; // Lấy dữ liệu từ request body

  try {
    // Kiểm tra xem khách hàng có tồn tại hay không
    const existingCustomer = await models.khachhang.findOne({
      where: { maKH },
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: "Khách hàng không tồn tại" });
    }
    // Cập nhật thông tin khách hàng
    const updatedCustomer = await models.khachhang.update(
      {
        hoTen: hoTen,
        ngaySinh: ngaySinh,
        gioiTinh: gioiTinh,
        sdt: sdt,
        diaChi: diaChi,
        email: email,
      },
      {
        where: { maKH },
      }
    );
    return res.status(200).json({
      message: "Cập nhật thông tin khách hàng thành công",
      updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaiKhoan = async (req, res) => {
  const { tkId, matKhau, email } = req.body;
  try {
    // Kiểm tra xem tài khoản có tồn tại hay không
    const existingAccount = await models.taikhoan.findOne({
      where: { tkId },
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    // Cập nhật tài khoản
    const updatedAccount = await models.taikhoan.update(
      {
        matKhau: matKhau,
      },
      {
        where: { tkId },
      }
    );

    return res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTaiKhoan = async (req, res) => {
  try {
    const taiKhoan = await models.taikhoan.findAll();
    responseData(res, "Lấy tài khoản hành thành công", 200, taiKhoan);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tài khoản hành:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaiKhoanAdmin = async (req, res) => {
  const { tkId, tenDangNhap, matKhau, quyen, trangThai } = req.body;
  try {
    // Kiểm tra xem tài khoản có tồn tại hay không
    const existingAccount = await models.taikhoan.findOne({
      where: { tkId },
    });

    if (!existingAccount) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    // Cập nhật tài khoản
    const updatedAccount = await models.taikhoan.update(
      {
        tenDangNhap: tenDangNhap,
        matKhau: matKhau,
        quyen: quyen,
        trangThai: trangThai,
      },
      {
        where: { tkId },
      }
    );

    return res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addTaiKhoan = async (req, res) => {
  const { tenDangNhap, matKhau, quyen, trangThai } = req.body; // Thêm email vào req.body

  try {
    // Kiểm tra xem tài khoản đã tồn tại
    const existingAccount = await models.taikhoan.findOne({
      where: { tenDangNhap },
    });

    if (existingAccount) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    // Tạo tkId mới
    const lastAccount = await models.taikhoan.findOne({
      order: [["tkId", "DESC"]],
      attributes: ["tkId"],
    });

    const newTkId = lastAccount
      ? `TK${parseInt(lastAccount.tkId.slice(2)) + 1}`
      : "TK1";

    // Tạo tài khoản mới
    const newAccount = await models.taikhoan.create({
      tkId: newTkId,
      tenDangNhap,
      matKhau,
      quyen,
      trangThai,
    });

    return res.status(200).json({
      message: "Sign up thành công",
      account: {
        tkId: newAccount.tkId,
        tenDangNhap: newAccount.tenDangNhap,
        matKhau: newAccount.matKhau,
        quyen: newAccount.quyen,
        trangThai: newAccount.trangThai,
      },
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getNhanVien = async (req, res) => {
  try {
    // Lấy thông tin nhân viên cùng tài khoản liên kết
    const taiKhoan = await models.nhanvien.findAll({
      include: [
        {
          model: models.taikhoan, // Liên kết với model tài khoản
          as: "maTK_taikhoan", // Alias nếu bạn đã định nghĩa
          attributes: ["tenDangNhap", "matKhau"], // Chỉ lấy các trường cần thiết
        },
      ],
    });

    // Trả về dữ liệu
    responseData(res, "Lấy nhân viên thành công", 200, taiKhoan);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateNhanVien = async (req, res) => {
  const {
    maNV,
    hoTen,
    ngaySinh,
    gioiTinh,
    diaChi,
    sdt,
    email,
    vaiTro,
    trangThai,
    tenDangNhap,
    matKhau,
  } = req.body;

  try {
    // Kiểm tra xem mã nhân viên có tồn tại hay không
    const nhanVien = await models.nhanvien.findOne({ where: { maNV } });
    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: "Nhân viên không tồn tại.",
      });
    }

    // Kiểm tra xem email có bị trùng với nhân viên khác không (cách không dùng Op)
    if (email) {
      const existingEmails = await models.nhanvien.findAll({
        where: { email },
      });

      // Loại bỏ nhân viên có mã `maNV` hiện tại
      const emailConflict = existingEmails.find((nv) => nv.maNV !== maNV);

      if (emailConflict) {
        return res.status(400).json({
          success: false,
          message: "Email đã được sử dụng bởi nhân viên khác.",
        });
      }
    }

    // Cập nhật thông tin trong bảng tài khoản nếu cần
    if (tenDangNhap || matKhau) {
      const taiKhoan = await models.taikhoan.findOne({
        where: { tkId: nhanVien.maTK },
      });

      if (!taiKhoan) {
        return res.status(404).json({
          success: false,
          message: "Tài khoản không tồn tại.",
        });
      }

      // Cập nhật tài khoản
      await taiKhoan.update({
        tenDangNhap: tenDangNhap || taiKhoan.tenDangNhap,
        matKhau: matKhau || taiKhoan.matKhau,
      });
    }

    // Cập nhật thông tin nhân viên
    await nhanVien.update({
      hoTen: hoTen || nhanVien.hoTen,
      ngaySinh: ngaySinh || nhanVien.ngaySinh,
      gioiTinh: gioiTinh || nhanVien.gioiTinh,
      diaChi: diaChi || nhanVien.diaChi,
      sdt: sdt || nhanVien.sdt,
      email: email || nhanVien.email,
      vaiTro: vaiTro || nhanVien.vaiTro,
      trangThai: trangThai || nhanVien.trangThai,
    });

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin nhân viên thành công.",
    });
  } catch (error) {
    console.error("Error in updateNhanVien:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
    });
  }
};

const addNhanVien = async (req, res) => {
  const {
    hoTen,
    ngaySinh,
    gioiTinh,
    diaChi,
    sdt,
    email,
    vaiTro,
    trangThai,
    tenDangNhap,
    matKhau,
  } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại trong bảng nhân viên
    const existingEmail = await models.nhanvien.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại. Vui lòng sử dụng email khác.",
      });
    }

    // Kiểm tra xem tên tài khoản đã tồn tại
    const existingAccount = await models.taikhoan.findOne({
      where: { tenDangNhap: tenDangNhap },
    });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.",
      });
    }

    // Lấy tài khoản cuối cùng để tạo mã mới
    const lastAccount = await models.taikhoan.findOne({
      order: [["tkId", "DESC"]],
      attributes: ["tkId"],
    });
    const newTkId = lastAccount
      ? `TK0${parseInt(lastAccount.tkId.slice(2), 10) + 1}`
      : "TK001";

    // Tạo tài khoản mới
    const newAccount = await models.taikhoan.create({
      tkId: newTkId,
      tenDangNhap: tenDangNhap || newTkId, // Nếu không có tên tài khoản, dùng tkId
      matKhau,
      quyen: vaiTro || "nv", // Gán quyền mặc định là nhân viên
      trangThai: trangThai || "on", // Trạng thái mặc định là "on"
    });

    // Lấy nhân viên cuối cùng để tạo mã mới
    const lastNv = await models.nhanvien.findOne({
      order: [["maNV", "DESC"]],
      attributes: ["maNV"],
    });
    const newNv = lastNv
      ? `NV0${parseInt(lastNv.maNV.slice(2), 10) + 1}`
      : "NV001";

    // Tạo nhân viên mới
    const newNhanVien = await models.nhanvien.create({
      maNV: newNv,
      hoTen,
      ngaySinh,
      gioiTinh,
      diaChi,
      sdt,
      email,
      vaiTro,
      trangThai,
      maTK: newTkId, // Sử dụng tkId vừa tạo
    });

    return res.status(200).json({
      success: true,
      message: "Thêm nhân viên thành công",
      data: {
        nhanVien: newNhanVien,
        tenDangNhap: newAccount,
      },
    });
  } catch (error) {
    console.error("Error in addNhanVien:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
    });
  }
};

export {
  login,
  signUp,
  postUser,
  getUser,
  updateKhachHang,
  updateTaiKhoan,
  getTaiKhoan,
  updateTaiKhoanAdmin,
  addTaiKhoan,
  getNhanVien,
  updateNhanVien,
  addNhanVien,
  getKhachHang,
};
