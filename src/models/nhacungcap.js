import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class nhacungcap extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maNCC: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    tenNCC: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    diaChi: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    sdt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    trangThai: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'nhacungcap',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maNCC" },
        ]
      },
    ]
  });
  }
}
