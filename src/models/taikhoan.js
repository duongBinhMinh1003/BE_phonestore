import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class taikhoan extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    tkId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    tenDangNhap: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    matKhau: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    quyen: {
      type: DataTypes.ENUM('ql','nv','kh'),
      allowNull: false
    },
    trangThai: {
      type: DataTypes.ENUM('on','off'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'taikhoan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tkId" },
        ]
      },
    ]
  });
  }
}
