import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.TEXT('long'), // 改用TEXT類型存儲Base64編碼的圖片
    allowNull: true,
    defaultValue: null
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'manager'),
    defaultValue: 'user'
  }
}, {
  timestamps: true
});
