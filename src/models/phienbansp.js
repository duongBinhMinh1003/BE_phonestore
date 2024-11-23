import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class phienbansp extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maPB: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    mauSac: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    RAM: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    ROM: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    maSP: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'sanpham',
        key: 'maSP'
      }
    },
    soLuong: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    giaGiam: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    giaBan: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    trangThai: {
      type: DataTypes.ENUM('on','off'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'phienbansp',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "maPB" },
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
