import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class phieubaohanh extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maPBH: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    thoiGianTao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tongTien: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false
    },
    trangThai: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    maNV: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'nhanvien',
        key: 'maNV'
      }
    },
    soSeri: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'chitietsanpham',
        key: 'soSeri'
      }
    },
    noiDung: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    maKH: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'khachhang',
        key: 'maKH'
      }
    }
  }, {
    sequelize,
    tableName: 'phieubaohanh',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maPBH" },
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
        name: "soSeri",
        using: "BTREE",
        fields: [
          { name: "soSeri" },
        ]
      },
    ]
  });
  }
}
