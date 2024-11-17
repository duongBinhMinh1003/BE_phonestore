import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class phieutra extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maPhieu: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    ngayTra: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    lyDo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hoanTien: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: true
    },
    maKH: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'khachhang',
        key: 'maKH'
      }
    },
    maNV: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'nhanvien',
        key: 'maNV'
      }
    },
    maDH: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'donhang',
        key: 'maDH'
      }
    },
    trangThai: {
      type: DataTypes.ENUM('on','off'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phieutra',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maPhieu" },
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
        name: "maDH",
        using: "BTREE",
        fields: [
          { name: "maDH" },
        ]
      },
    ]
  });
  }
}
