import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class chitietdonhang extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maDH: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'donhang',
        key: 'maDH'
      }
    },
    maPB: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'phienbansp',
        key: 'maPB'
      }
    },
    donGia: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chitietdonhang',
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
