import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class lsdonhang extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    thoiGian: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tinhTrang: {
      type: DataTypes.ENUM('da dat','da xac nhan','dang giao','da giao'),
      allowNull: true
    },
    maDH: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'donhang',
        key: 'maDH'
      }
    }
  }, {
    sequelize,
    tableName: 'lsdonhang',
    timestamps: false,
    indexes: [
      {
        name: "maDH",
        using: "BTREE",
        fields: [
          { name: "maDH" },
        ]
      },
    ]
  });
  }
}
