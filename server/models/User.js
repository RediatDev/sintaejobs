
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "User Name Already Taken",
      },
      is: {
        args: /^[a-zA-Z0-9_!@#$%^&*()+=\-{}\[\]|\\:;"'<>,.?/~`]*$/,
        msg: "User name should only contain alphabet, special characters",
      },
      validate: {
        notEmpty: { msg: "User Name cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email Already Exist",
      },
      validate: {
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Invalid Email Address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, undefined],
          msg: "Password should be at least 6 characters long",
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
          msg: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long",
        },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'subadmin', 'user'),
      defaultValue: "user",
    },
  }, {
    timestamps: true,
  });

  User.associate = models => {
    User.hasMany(models.Advert, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Job, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
