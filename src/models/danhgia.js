import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class danhgia extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maDG: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ngayDG: {
      type: DataTypes.DATE,
      allowNull: false
    },
    soSao: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    binhLuan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    trangThai: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    maKH: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'khachhang',
        key: 'maKH'
      }
    },
    maSP: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'sanpham',
        key: 'maSP'
      }
    }
  }, {
    sequelize,
    tableName: 'danhgia',
    timestamps: false,
    indexes: [
      {
        name: "maSP",
        using: "BTREE",
        fields: [
          { name: "maSP" },
        ]
      },
      {
        name: "maKH",
        using: "BTREE",
        fields: [
          { name: "maKH" },
        ]
      },
    ]
  });
  }
}
