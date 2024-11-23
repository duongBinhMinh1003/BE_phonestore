import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class sanpham extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maSP: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    tenSP: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    hinhAnh: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    thuongHieu: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pin: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    camTruoc: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    camSau: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    heDieuHanh: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    xuatXu: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    thoiGianBaoHanh: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    trangThai: {
      type: DataTypes.ENUM('on','off'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sanpham',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maSP" },
        ]
      },
    ]
  });
  }
}
