import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class nhanvien extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maNV: {
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
    vaiTro: {
      type: DataTypes.ENUM('ql','nv'),
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
    tableName: 'nhanvien',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maNV" },
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
