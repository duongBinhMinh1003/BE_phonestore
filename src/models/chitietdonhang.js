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
    soSeri: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'chitietsanpham',
        key: 'soSeri'
      }
    },
    giaBan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    maPB: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'phienbansp',
        key: 'maPB'
      }
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
          { name: "soSeri" },
        ]
      },
      {
        name: "soSeri",
        using: "BTREE",
        fields: [
          { name: "soSeri" },
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
