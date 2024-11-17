import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class phieudoitra extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    maPhieu: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    soSeri: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    loai: {
      type: DataTypes.ENUM('doi','tra'),
      allowNull: false
    },
    ngayDoiTra: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hoanTien: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false
    },
    maKH: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    maNV: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'phieudoitra',
    timestamps: false
  });
  }
}
