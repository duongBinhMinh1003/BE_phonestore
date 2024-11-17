import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class hinhanh extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maHA: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: true
    },
    maSP: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'sanpham',
        key: 'maSP'
      }
    }
  }, {
    sequelize,
    tableName: 'hinhanh',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maHA" },
        ]
      },
      {
        name: "maSP",
        using: "BTREE",
        fields: [
          { name: "maSP" },
        ]
      },
    ]
  });
  }
}
