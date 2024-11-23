import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class khuyenmai extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maKM: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    moTa: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    dieuKien: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false
    },
    mucGiam: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'khuyenmai',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maKM" },
        ]
      },
    ]
  });
  }
}
