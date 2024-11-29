import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class giohang extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maKH: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'khachhang',
        key: 'maKH'
      }
    },
    maPB: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'phienbansp',
        key: 'maPB'
      }
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    donGia: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'giohang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maKH" },
          { name: "maPB" },
        ]
      },
      {
        name: "maPB",
        using: "BTREE",
        fields: [
          { name: "maPB" },
        ]
      },
    ]
  });
  }
}
