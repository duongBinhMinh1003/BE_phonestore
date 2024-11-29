import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class chitietphieunhap extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maPN: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'phieunhap',
        key: 'maPN'
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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    donGiaNhap: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chitietphieunhap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maPN" },
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
