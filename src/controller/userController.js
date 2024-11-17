import mysql2 from 'mysql2';
import { responseData } from '../config/reponse.js';
import sequelize from '../models/connect.js';
import initModels from '../models/init-models.js';



const models = initModels(sequelize); 



const login = async (req, res) => {
  const { tenDangNhap, matKhau } = req.body;
  try {
      const checkUser = await models.taikhoan.findOne({
          where: {
            tenDangNhap: tenDangNhap,
              matKhau: matKhau 
          }
      });
      if (!checkUser) {
         
          return res.status(401).send("Login không thành công!");
      }
      res.send(checkUser)
  } catch (error) {
      console.error('Error in loginUser:', error);
      return res.status(500).json({ message: 'Internal server error123' });
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
    const { tenDangNhap, matKhau, quyen, trangThai,email} = req.body; // Thêm email vào req.body

    try {
        // Kiểm tra xem tài khoản đã tồn tại
        const existingAccount = await models.taikhoan.findOne({
            where: { tenDangNhap }
        });

        if (existingAccount) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
        }
        
        const existingEmail = await models.khachhang.findOne({
            where: { email }
        });

        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }




        // Tạo tkId mới
        const lastAccount = await models.taikhoan.findOne({
            order: [['tkId', 'DESC']],
            attributes: ['tkId']
        });

        const newTkId = lastAccount ? `TK${parseInt(lastAccount.tkId.slice(2)) + 1}` : 'TK1';

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
                quyen: newAccount.quyen,
                trangThai: newAccount.trangThai 
            },
        });

    } catch (error) {
        console.error('Error in signUp:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const postUser = async (req, res) => {
    const { hoTen, ngaySinh, gioiTinh, diaChi, sdt, email, trangThai} = req.body;

    try {
        // Kiểm tra email trong bảng khachhang
        const existingEmail = await models.khachhang.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

      

        // Tạo tkId mới cho tài khoản
        const lastAccount = await models.taikhoan.findOne({ order: [['tkId', 'DESC']], attributes: ['tkId'] });
        const newTkId = lastAccount ? `TK${parseInt(lastAccount.tkId.slice(2)) + 1}` : 'TK1';

        // Tạo bản ghi tài khoản mới
        const newAccount = await models.taikhoan.create({
            tkId: newTkId,
            tenDangNhap: email,  // dùng email làm tên đăng nhập
            matKhau: 'defaultPassword',  // mật khẩu mặc định
            quyen: 'kh',
            trangThai
        });

        // Tạo maKH mới cho người dùng
        const lastUser = await models.khachhang.findOne({ order: [['maKH', 'DESC']], attributes: ['maKH'] });
        const newMaKh = lastUser ? `KH${parseInt(lastUser.maKH.slice(2)) + 1}` : 'KH1';

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
            maTK: newTkId
        });

        return res.status(201).json({
            message: "Tạo người dùng thành công",
            user: newUser
        });

    } catch (error) {
        console.error('Error in postUser:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

const getUser = async (req, res) => {
    // Lấy `id` từ query string (ví dụ: ?id=123)
    const { id } = req.query;

    try {
        // Tìm khách hàng theo `maTK`
        const khachHang = await models.khachhang.findOne({
            where: { maTK: id }  // Điều kiện tìm kiếm dựa vào `id`
        });

        // Kiểm tra nếu không tìm thấy khách hàng
        if (!khachHang) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại' });
        }

        // Trả về thông tin khách hàng
        res.status(200).json({
            message: 'Lấy thông tin khách hàng thành công',
            data: khachHang
        });

    } catch (error) {
        console.error('Lỗi khi lấy thông tin khách hàng:', error);
        res.status(500).json({ message: 'Lỗi hệ thống', error });
    }
};

const updateKhachHang = async (req, res) => {
    const { maKH, hoTen, ngaySinh, gioiTinh, sdt, diaChi, email } = req.body; // Lấy dữ liệu từ request body

    try {
        // Kiểm tra xem khách hàng có tồn tại hay không
        const existingCustomer = await models.khachhang.findOne({
            where: { maKH }
        });

        if (!existingCustomer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại' });
        }
        // Cập nhật thông tin khách hàng
        const updatedCustomer = await models.khachhang.update({
            hoTen: hoTen, 
            ngaySinh: ngaySinh, 
            gioiTinh: gioiTinh, 
            sdt: sdt , 
            diaChi: diaChi , 
            email: email  
        }, {
            where: { maKH }
        });
        return res.status(200).json({
            message: 'Cập nhật thông tin khách hàng thành công',
            updatedCustomer
        });

    } catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTaiKhoan = async (req, res) => {
    const { tkId , matKhau, email } = req.body;
    try {
        // Kiểm tra xem tài khoản có tồn tại hay không
        const existingAccount = await models.taikhoan.findOne({
            where: { tkId }
        });

        if (!existingAccount) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }
        // Cập nhật tài khoản
        const updatedAccount = await models.taikhoan.update({
            matKhau: matKhau,
        }, {
            where: { tkId }
        });

        return res.status(200).json({
            message: 'Cập nhật tài khoản thành công',
            updatedAccount
        });

    } catch (error) {
        console.error('Error updating account:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};








export {login,signUp,postUser,getUser,updateKhachHang,updateTaiKhoan};
