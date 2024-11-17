import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class donhang extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maDH: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    diaChiNhan: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ngayDat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tongTien: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false
    },
    hinhThucThanhToan: {
      type: DataTypes.STRING(50),
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
    maNV: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'nhanvien',
        key: 'maNV'
      }
    },
    maKM: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'khuyenmai',
        key: 'maKM'
      }
    }
  }, {
    sequelize,
    tableName: 'donhang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maDH" },
        ]
      },
      {
        name: "maKH",
        using: "BTREE",
        fields: [
          { name: "maKH" },
        ]
      },
      {
        name: "maNV",
        using: "BTREE",
        fields: [
          { name: "maNV" },
        ]
      },
      {
        name: "maKM",
        using: "BTREE",
        fields: [
          { name: "maKM" },
        ]
      },
    ]
  });
  }
}