import mysql2 from "mysql2";
import { responseData } from "../config/reponse.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Op } from "sequelize";

const models = initModels(sequelize);

const getPhone = async (req, res) => {
  try {
    const products = await models.sanpham.findAll({
      include: [
        {
          model: models.phienbansp,
          as: "phienbansps",
          required: false, // Cho phép lấy sản phẩm mà không cần phải có phiên bản
          attributes: [
            "maPB",
            "mauSac",
            "RAM",
            "ROM",
            "trangThai",
            "giaGiam",
            "giaBan",
            "soLuong",
          ],
        },
      ],
    });

    return responseData(res, "Lấy sản phẩm thành công", 200, products);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const updatePhone = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const {
      maSP,
      tenSP,
      thuongHieu,
      pin,
      camTruoc,
      camSau,
      heDieuHanh,
      xuatXu,
      thoiGianBaoHanh,
      hinhAnh,
      trangThai,
    } = req.body;

    // Kiểm tra nếu không có ID
    if (!maSP) {
      return res.status(400).json({ message: "ID sản phẩm là bắt buộc" });
    }

    // Tìm sản phẩm cần cập nhật
    const product = await models.sanpham.findOne({ where: { maSP } });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Cập nhật thông tin sản phẩm
    await product.update({
      tenSP,
      hinhAnh,
      thuongHieu,
      pin,
      camTruoc,
      camSau,
      heDieuHanh,
      xuatXu,
      thoiGianBaoHanh,
      trangThai,
    });

    // Trả về kết quả thành công
    return responseData(res, "Cập nhật sản phẩm thành công", 200, product);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const addPhone = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const {
      tenSP,
      thuongHieu,
      pin,
      camTruoc,
      camSau,
      heDieuHanh,
      xuatXu,
      thoiGianBaoHanh,
      hinhAnh,
      trangThai,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !tenSP ||
      !thuongHieu ||
      !pin ||
      !camTruoc ||
      !camSau ||
      !heDieuHanh ||
      !xuatXu ||
      !thoiGianBaoHanh ||
      !hinhAnh ||
      !trangThai
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm" });
    }
    // Lấy khuyến mãi gần nhất để tạo mã mới
    const lastSanPham = await models.sanpham.findOne({
      order: [["maSP", "DESC"]], // Sắp xếp theo maKM giảm dần
      attributes: ["maSP"], // Chỉ lấy trường maKM
    });

    // Tạo mã khuyến mãi mới dựa trên mã khuyến mãi gần nhất
    const newMaSP = lastSanPham
      ? `SP0${parseInt(lastSanPham.maSP.slice(2)) + 1}`
      : "SP001";

    // Tạo sản phẩm mới trong cơ sở dữ liệu
    const newProduct = await models.sanpham.create({
      maSP: newMaSP,
      tenSP,
      thuongHieu,
      pin,
      camTruoc,
      camSau,
      heDieuHanh,
      xuatXu,
      thoiGianBaoHanh,
      hinhAnh,
      trangThai,
    });

    // Trả về phản hồi thành công
    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: newProduct,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);

    // Xử lý lỗi và trả về phản hồi thất bại
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

const searchProducts = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
  }

  try {
    const products = await models.sanpham.findAll({
      include: [
        {
          model: models.phienbansp,
          as: "phienbansps",
          attributes: [
            "maPB",
            "mauSac",
            "RAM",
            "ROM",
            "trangThai",
            "giaGiam",
            "giaBan",
          ],
        },
      ],
    });

    // Sử dụng RegExp để tìm kiếm từ khóa trong tên sản phẩm
    const regex = new RegExp(keyword, "i"); // 'i' để không phân biệt chữ hoa và chữ thường
    const filteredProducts = products.filter((product) =>
      regex.test(product.tenSP)
    );

    return responseData(
      res,
      "Tìm kiếm sản phẩm thành công",
      200,
      filteredProducts
    );
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const getRandomProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9; // Lấy số lượng sản phẩm cần lấy từ query hoặc mặc định là 5

    const randomProducts = await models.sanpham.findAll({
      include: [
        {
          model: models.phienbansp,
          as: "phienbansps",
          attributes: [
            "maPB",
            "mauSac",
            "RAM",
            "ROM",
            "trangThai",
            "giaGiam",
            "giaBan",
          ],
        },
      ],
      order: sequelize.literal("RAND()"), // Sắp xếp ngẫu nhiên
      limit: limit, // Giới hạn số sản phẩm trả về
    });

    return responseData(
      res,
      "Lấy sản phẩm ngẫu nhiên thành công",
      200,
      randomProducts
    );
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm ngẫu nhiên:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const sortPhone = async (req, res) => {
  try {
    const products = await models.sanpham.findAll({
      include: [
        {
          model: models.phienbansp,
          as: "phienbansps",
          attributes: [
            "maPB",
            "mauSac",
            "RAM",
            "ROM",
            "trangThai",
            "giaGiam",
            "giaBan",
          ],
        },
      ],
      order: [
        [{ model: models.phienbansp, as: "phienbansps" }, "giaGiam", "ASC"],
      ], // Sắp xếp tăng dần theo giaGiam
    });

    return responseData(res, "Lấy sản phẩm thành công", 200, products);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

const getPhienBan = async (req, res) => {
  try {
    const products = await models.phienbansp.findAll({
      include: [
        {
          model: models.sanpham,
          as: "maSP_sanpham",
          attributes: ["maSP", "tenSP", "hinhAnh"],
        },
      ],
    });
    responseData(res, "Lấy phiên bản sản phẩm thành công", 200, products);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phiên bản sản phẩm:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSanPhamById = async (req, res) => {
  const { id } = req.query;

  try {
    // Tìm sản phẩm theo id và kèm theo dữ liệu từ bảng phienbansp
    const sanPham = await models.sanpham.findOne({
      where: { maSP: id }, // Điều kiện tìm kiếm sản phẩm theo maSP
      include: [
        {
          model: models.phienbansp,
          as: "phienbansps", // Tên alias cho quan hệ giữa sanpham và phienbansp
          attributes: [
            "maPB",
            "mauSac",
            "RAM",
            "ROM",
            "trangThai",
            "giaGiam",
            "giaBan",
          ],
        },
      ],
    });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!sanPham) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Trả về thông tin sản phẩm cùng với các phiên bản sản phẩm
    return res.status(200).json({
      message: "Lấy sản phẩm thành công",
      sanPham,
    });
  } catch (error) {
    console.error("Error in getSanPhamById:", error);
    res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};

const getKhuyenMai = async (req, res) => {
  try {
    const promotions = await models.khuyenmai.findAll();
    responseData(res, "Lấy khuyến mãi sản phẩm thành công", 200, promotions);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu khuyến mãi sản phẩm:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getKhuyenMaiById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID khuyến mãi không được cung cấp" });
    }

    const promotion = await models.khuyenmai.findOne({
      where: { maKM: id },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Khuyến mãi không tồn tại" });
    }

    responseData(res, "Lấy chi tiết khuyến mãi thành công", 200, promotion);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết khuyến mãi:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateKhuyenMai = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body (cập nhật tất cả các thuộc tính)
    const { id, moTa, dieuKien, mucGiam, trangThai } = req.body;

    // Kiểm tra xem tất cả các tham số có được cung cấp không
    if (
      !id ||
      !moTa ||
      !dieuKien ||
      mucGiam === undefined ||
      trangThai === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin khuyến mãi" });
    }

    // Thực hiện cập nhật các thuộc tính của khuyến mãi
    const result = await models.khuyenmai.update(
      {
        moTa: moTa,
        dieuKien: dieuKien,
        mucGiam: mucGiam,
        trangThai: trangThai,
      },
      { where: { maKM: id } } // Điều kiện xác định khuyến mãi cần cập nhật
    );

    // Kiểm tra nếu không có bản ghi nào được cập nhật
    if (result[0] === 0) {
      return res.status(404).json({ message: "Khuyến mãi không tồn tại" });
    }

    // Trả về phản hồi thành công nếu cập nhật thành công
    res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật khuyến mãi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addKhuyenMai = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { moTa, dieuKien, mucGiam, trangThai } = req.body;

    // Kiểm tra nếu dữ liệu không đầy đủ
    if (!moTa || !dieuKien || !mucGiam || !trangThai) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin khuyến mãi.",
      });
    }

    // Lấy khuyến mãi gần nhất để tạo mã mới
    const lastPromotion = await models.khuyenmai.findOne({
      order: [["maKM", "DESC"]], // Sắp xếp theo maKM giảm dần
      attributes: ["maKM"], // Chỉ lấy trường maKM
    });

    // Tạo mã khuyến mãi mới dựa trên mã khuyến mãi gần nhất
    const newMaKM = lastPromotion
      ? `KM${parseInt(lastPromotion.maKM.slice(2)) + 1}`
      : "KM1";

    // Tạo đối tượng mới cho khuyến mãi và lưu vào cơ sở dữ liệu
    const newKhuyenMai = await models.khuyenmai.create({
      maKM: newMaKM,
      moTa,
      dieuKien,
      mucGiam,
      trangThai,
    });

    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      message: "Khuyến mãi đã được thêm thành công!",
      data: newKhuyenMai,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi thêm khuyến mãi.",
    });
  }
};

const getPhieuBaoHanh = async (req, res) => {
  try {
    const phieuBaoHanh = await models.phieubaohanh.findAll();
    responseData(res, "Lấy phiếu bảo hành thành công", 200, phieuBaoHanh);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phiếu bảo hành:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getNhaCungCap = async (req, res) => {
  try {
    const nhaCungCap = await models.nhacungcap.findAll();
    responseData(res, "Lấy phiếu bảo hành thành công", 200, nhaCungCap);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phiếu bảo hành:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getOrder = async (req, res) => {
  const { maKH } = req.params; // Lấy mã khách hàng từ URL hoặc req.body nếu dùng POST

  try {
    // Tìm các đơn hàng có mã khách hàng tương ứng
    const donhang = await models.donhang.findAll({
      where: { maKH }, // Điều kiện lọc theo mã khách hàng
    });

    // Kiểm tra nếu không có đơn hàng nào
    if (donhang.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng nào cho mã khách hàng này.",
      });
    }

    responseData(res, "Lấy danh sách đơn hàng thành công", 200, donhang);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phiếu đơn hàng:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getChiTietOrder = async (req, res) => {
  const { maDH } = req.params; // Lấy mã khách hàng từ URL hoặc req.body nếu dùng POST

  try {
    // Tìm các đơn hàng có mã khách hàng tương ứng
    const donhang = await models.chitietdonhang.findAll({
      where: { maDH }, // Điều kiện lọc theo mã khách hàng
    });

    // Kiểm tra nếu không có đơn hàng nào
    if (donhang.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng nào cho mã khách hàng này.",
      });
    }

    responseData(res, "Lấy danh sách đơn hàng thành công", 200, donhang);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phiếu đơn hàng:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updateNhaCungCap = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body (cập nhật tất cả các thuộc tính)
    const { maNCC, tenNCC, diaChi, sdt, email, trangThai } = req.body;

    // Kiểm tra xem tất cả các tham số có được cung cấp không
    if (
      !maNCC ||
      !tenNCC ||
      !diaChi ||
      !sdt ||
      !email ||
      trangThai === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin khuyến mãi" });
    }

    // Thực hiện cập nhật các thuộc tính của khuyến mãi
    const result = await models.nhacungcap.update(
      {
        maNCC,
        tenNCC,
        diaChi,
        sdt,
        email,
        trangThai,
      },
      { where: { maNCC: maNCC } } // Điều kiện xác định khuyến mãi cần cập nhật
    );

    // Kiểm tra nếu không có bản ghi nào được cập nhật
    if (result[0] === 0) {
      return res.status(404).json({ message: "Khuyến mãi không tồn tại" });
    }

    // Trả về phản hồi thành công nếu cập nhật thành công
    res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật khuyến mãi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addNhaCungCap = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { tenNCC, diaChi, sdt, email, trangThai } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!tenNCC || !diaChi || !sdt || !email || !trangThai) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm" });
    }
    // Lấy khuyến mãi gần nhất để tạo mã mới
    const lastNCC = await models.nhacungcap.findOne({
      order: [["maNCC", "DESC"]], // Sắp xếp theo maKM giảm dần
      attributes: ["maNCC"], // Chỉ lấy trường maKM
    });

    // Tạo mã khuyến mãi mới dựa trên mã khuyến mãi gần nhất
    const newMaNCC = lastNCC
      ? `NCC0${parseInt(lastNCC.maNCC.slice(3)) + 1}`
      : "NCC001";

    // Tạo sản phẩm mới trong cơ sở dữ liệu
    const newNhaCungCap = await models.nhacungcap.create({
      maNCC: newMaNCC,
      tenNCC,
      diaChi,
      sdt,
      email,
      trangThai,
    });

    // Trả về phản hồi thành công
    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: newNhaCungCap,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);

    // Xử lý lỗi và trả về phản hồi thất bại
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

/*
  maPBH : maPBHEl,
            thoiGianTao : thoiGianTaoEl,
            tongTien : tongTienEl,
            trangThai : trangThaiEl,
            maNV : MaNVEl,
            soSeri : soSeriEl,
            noiDung : noiDungEl
*/
const updatePhieuBaoHanh = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body (cập nhật tất cả các thuộc tính)
    const { maPBH, thoiGianTao, tongTien, trangThai, maNV, soSeri, noiDung } =
      req.body;

    // Kiểm tra xem tất cả các tham số có được cung cấp không
    if (
      !maPBH ||
      !thoiGianTao ||
      !tongTien ||
      !maNV ||
      !soSeri ||
      !noiDung ||
      trangThai === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin khuyến mãi" });
    }

    // Thực hiện cập nhật các thuộc tính của khuyến mãi
    const result = await models.phieubaohanh.update(
      {
        maPBH,
        thoiGianTao,
        tongTien,
        trangThai,
        maNV,
        soSeri,
        noiDung,
      },
      { where: { maPBH: maPBH } } // Điều kiện xác định khuyến mãi cần cập nhật
    );

    // Kiểm tra nếu không có bản ghi nào được cập nhật
    if (result[0] === 0) {
      return res.status(404).json({ message: "Khuyến mãi không tồn tại" });
    }

    // Trả về phản hồi thành công nếu cập nhật thành công
    res.status(200).json({ message: "Cập nhật khuyến mãi thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật khuyến mãi:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addBaoHanh = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { thoiGianTao, tongTien, trangThai, maNV, soSeri, noiDung } =
      req.body;

    // Kiểm tra nếu dữ liệu không đầy đủ
    if (
      !thoiGianTao ||
      !tongTien ||
      !maNV ||
      !soSeri ||
      !noiDung ||
      trangThai === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bảo hành.",
      });
    }

    // Lấy bảo hành gần nhất để tạo mã mới
    const lastBaoHanh = await models.phieubaohanh.findOne({
      order: [["maPBH", "DESC"]], // Sắp xếp theo maPBH giảm dần
      attributes: ["maPBH"], // Chỉ lấy trường maPBH
    });

    // Tạo mã bảo hành mới dựa trên mã bảo hành gần nhất
    const newMaPBH = lastBaoHanh
      ? `PBH0${parseInt(lastBaoHanh.maPBH.slice(3)) + 1}`
      : "PBH1";

    // Tạo đối tượng mới cho bảo hành và lưu vào cơ sở dữ liệu
    const newBaoHanh = await models.phieubaohanh.create({
      maPBH: newMaPBH,
      thoiGianTao,
      tongTien,
      trangThai,
      maNV,
      soSeri,
      noiDung,
    });

    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      message: "Bảo hành đã được thêm thành công!",
      data: newBaoHanh,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bảo hành:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi thêm bảo hành.",
    });
  }
};

const deleteBaoHanh = async (req, res) => {
  try {
    const { idBaoHanh } = req.body; // Lấy idBaoHanh từ body của request

    // Kiểm tra nếu không có idBaoHanh được cung cấp
    if (!idBaoHanh) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ID phiếu bảo hành để xóa.",
      });
    }

    // Thực hiện xóa phiếu bảo hành
    const deletedCount = await models.phieubaohanh.destroy({
      where: { maPBH: idBaoHanh },
    });

    // Kiểm tra nếu không có bản ghi nào được xóa
    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Phiếu bảo hành không tồn tại.",
      });
    }

    // Trả về phản hồi thành công nếu xóa thành công
    res.status(200).json({
      success: true,
      message: "Xóa phiếu bảo hành thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa phiếu bảo hành:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xóa phiếu bảo hành.",
    });
  }
};

const getPhieuNhap = async (req, res) => {
  try {
    const phieuNhap = await models.phieunhap.findAll();
    responseData(res, "Lấy phiếu nhập thành công", 200, phieuNhap);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phiếu nhập:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePhieuNhap = async (req, res) => {
  try {
    const { maPN, ngayTao, tongTien, trangThai, maNV, maNCC } = req.body;

    if (
      !maPN ||
      !ngayTao ||
      !tongTien ||
      !maNV ||
      !maNCC ||
      trangThai === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin khuyến mãi" });
    }

    const result = await models.phieunhap.update(
      {
        maPN,
        ngayTao,
        tongTien,
        trangThai,
        maNV,
        maNCC,
      },
      { where: { maPN: maPN } }
    );

    if (result[0] === 0) {
      return res.status(404).json({ message: "phiếu nhập không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật phiếu nhập thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật phiếu nhập:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addPhieuNhap = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { ngayTao, tongTien, trangThai, maNV, maNCC } = req.body;

    // Lấy bảo hành gần nhất để tạo mã mới
    const lastPhieuNhap = await models.phieunhap.findOne({
      order: [["maPN", "DESC"]], // Sắp xếp theo maPBH giảm dần
      attributes: ["maPN"], // Chỉ lấy trường maPBH
    });

    // Tạo mã bảo hành mới dựa trên mã bảo hành gần nhất
    const newMaPN = lastPhieuNhap
      ? `PN0${parseInt(lastPhieuNhap.maPN.slice(3)) + 1}`
      : "PN1";

    // Tạo đối tượng mới cho bảo hành và lưu vào cơ sở dữ liệu
    const newPhieuNhap = await models.phieunhap.create({
      maPN: newMaPN,
      ngayTao,
      tongTien,
      trangThai,
      maNV,
      maNCC,
    });

    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      message: "Bảo hành đã được thêm thành công!",
      data: newPhieuNhap,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bảo hành:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi thêm bảo hành.",
    });
  }
};

const deletePhieuNhap = async (req, res) => {
  try {
    const { maPN } = req.body; // Lấy idBaoHanh từ body của request

    // Kiểm tra nếu không có idBaoHanh được cung cấp
    if (!maPN) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ID phiếu bảo hành để xóa.",
      });
    }

    // Thực hiện xóa phiếu bảo hành
    const deletedCount = await models.phieunhap.destroy({
      where: { maPN: maPN },
    });

    // Kiểm tra nếu không có bản ghi nào được xóa
    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Phiếu bảo hành không tồn tại.",
      });
    }

    // Trả về phản hồi thành công nếu xóa thành công
    res.status(200).json({
      success: true,
      message: "Xóa phiếu bảo hành thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa phiếu bảo hành:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xóa phiếu bảo hành.",
    });
  }
};

const updatePhienBan = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { maPB, mauSac, RAM, ROM, soLuong, giaGiam, giaBan, trangThai } =
      req.body;

    // Kiểm tra nếu không có ID
    if (!maPB) {
      return res.status(400).json({ message: "ID sản phẩm là bắt buộc" });
    }

    // Tìm sản phẩm cần cập nhật
    const product = await models.phienbansp.findOne({ where: { maPB } });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Cập nhật thông tin sản phẩm
    await product.update({
      maPB,
      mauSac,
      RAM,
      ROM,
      soLuong,
      giaGiam,
      giaBan,
      trangThai,
    });

    // Trả về kết quả thành công
    return responseData(res, "Cập nhật sản phẩm thành công", 200, product);
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
const addPhienBan = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const {
      maSP,
      mauSac,
      RAM,
      ROM,
      soLuong,
      giaGiam,
      giaBan,
      trangThai,
      maPB,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !maSP ||
      !mauSac ||
      !RAM ||
      !ROM ||
      !soLuong ||
      !giaGiam ||
      !giaBan ||
      !trangThai
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin sản phẩm" });
    }
    const existingMaPhienBan = await models.phienbansp.findOne({
      where: { maPB },
    });

    if (existingMaPhienBan) {
      return res.status(400).json({ message: "Mã phiên bản đã tồn tại" });
    }

    // Lấy khuyến mãi gần nhất để tạo mã mới
    const lastPhienBan = await models.phienbansp.findOne({
      order: [["maPB", "DESC"]], // Sắp xếp theo maKM giảm dần
      attributes: ["maPB"], // Chỉ lấy trường maKM
    });

    // Tạo mã khuyến mãi mới dựa trên mã khuyến mãi gần nhất
    const newMaPB = lastPhienBan
      ? `PB0${parseInt(lastPhienBan.maPB.slice(2)) + 1}`
      : "PB001";

    // Tạo sản phẩm mới trong cơ sở dữ liệu
    const newProduct = await models.phienbansp.create({
      maPB: newMaPB,
      mauSac,
      RAM,
      ROM,
      maSP,
      soLuong,
      giaGiam,
      giaBan,
      trangThai,
    });

    // Trả về phản hồi thành công
    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: newProduct,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);

    // Xử lý lỗi và trả về phản hồi thất bại
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

const getSPById = async (req, res) => {
  const { maSP } = req.params; // Lấy maSP từ tham số URL

  try {
    // Tìm sản phẩm theo maSP và kèm theo dữ liệu từ bảng phienbansp
    const sanPham = await models.sanpham.findOne({
      where: { maSP }, // Điều kiện lọc theo maSP
      include: [
        {
          model: models.phienbansp, // Kết nối với bảng phienbansp
          as: "phienbansps", // Alias đã khai báo trong quan hệ
          attributes: ["RAM", "mauSac", "giaBan", "ROM", "maPB"], // Các cột cần lấy từ bảng phienbansp
        },
      ],
    });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!sanPham) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Trả về thông tin sản phẩm cùng với các phiên bản sản phẩm
    return res.status(200).json({
      message: "Lấy sản phẩm thành công",
      sanPham,
    });
  } catch (error) {
    console.error("Error in getSanPhamById:", error);
    return res.status(500).json({ message: "Lỗi hệ thống", error });
  }
};
const getSanPhamBySeri = async (req, res) => {
  const { soSeri } = req.params; // Lấy số seri từ URL

  try {
    // Tìm sản phẩm theo số seri và kết hợp dữ liệu từ bảng phienbansanpham
    const sanpham = await models.chitietsanpham.findOne({
      where: { soSeri }, // Điều kiện lọc theo số seri
      include: [
        {
          model: models.phienbansp, // Bảng liên kết
          as: "maPB_phienbansp", // Alias đã khai báo trong quan hệ
          attributes: ["RAM", "mauSac", "giaGiam", "ROM", "maSP", "ROM"], // Các cột cần lấy từ phienbansanpham
        },
      ],
    });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!sanpham) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm với số seri này.",
      });
    }

    // Trả về dữ liệu
    responseData(res, "Lấy thông tin sản phẩm thành công", 200, sanpham);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getChiTietBymaPb = async (req, res) => {
  const { maPB } = req.params;

  // Kiểm tra nếu maPB không tồn tại hoặc không hợp lệ
  if (!maPB) {
    return res.status(400).json({
      success: false,
      message: "Mã phiên bản (maPB) là bắt buộc.",
    });
  }

  try {
    // Tìm kiếm chi tiết sản phẩm với mã phiên bản maPB
    const chitiet = await models.chitietsanpham.findOne({
      where: { maPB },
    });

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (!chitiet) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm với mã phiên bản này.",
      });
    }

    // Trả về dữ liệu sản phẩm chi tiết

    return responseData(res, "Lấy thông tin sản phẩm thành công", 200, chitiet);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getPhone,
  getPhienBan,
  getSanPhamById,
  getKhuyenMai,
  getKhuyenMaiById,
  updateKhuyenMai,
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
};
