import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class phieunhap extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maPN: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    ngayTao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tongTien: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.ENUM('chua xac nhan','da nhap'),
      allowNull: true
    },
    maNV: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'nhanvien',
        key: 'maNV'
      }
    },
    maNCC: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'nhacungcap',
        key: 'maNCC'
      }
    }
  }, {
    sequelize,
    tableName: 'phieunhap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maPN" },
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
        name: "maNCC",
        using: "BTREE",
        fields: [
          { name: "maNCC" },
        ]
      },
    ]
  });
  }
}
