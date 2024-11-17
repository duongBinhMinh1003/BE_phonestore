import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class khachhang extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maKH: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    hoTen: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    ngaySinh: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gioiTinh: {
      type: DataTypes.ENUM('Nam','Nu'),
      allowNull: false
    },
    diaChi: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    sdt: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    trangThai: {
      type: DataTypes.ENUM('on','off'),
      allowNull: false
    },
    maTK: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'taikhoan',
        key: 'tkId'
      }
    }
  }, {
    sequelize,
    tableName: 'khachhang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maKH" },
        ]
      },
      {
        name: "maTK",
        using: "BTREE",
        fields: [
          { name: "maTK" },
        ]
      },
    ]
  });
  }
}
