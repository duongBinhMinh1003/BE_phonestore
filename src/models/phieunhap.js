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
      type: DataTypes.DATE,
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
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'nhanvien',
        key: 'maNV'
      }
    },
    maNCC: {
      type: DataTypes.STRING(20),
      allowNull: false,
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
