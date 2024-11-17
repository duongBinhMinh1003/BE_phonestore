import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class chitietsanpham extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    soSeri: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    trangThai: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ngayNhap: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    maPB: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'phienbansp',
        key: 'maPB'
      }
    }
  }, {
    sequelize,
    tableName: 'chitietsanpham',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
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
