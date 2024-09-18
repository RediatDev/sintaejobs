module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "User Name Already Taken",
      },
      validate: {
        notEmpty: { msg: "User Name cannot be empty" },
        is: {
          args: /^[a-zA-Z0-9_!@#$%^&*()+=\-{}\[\]|\\:;"'<>,.?/~`]*$/,
          msg: "User name should only contain alphabets and special characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "You can't create an account with this email",
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
      type: DataTypes.ENUM("1", "2", "3", "4", "5"),
      defaultValue: '5',
    },
    sq1: {
      type: DataTypes.ENUM(
        "What was the name of the street you grew up on?",
        "In what city did your parents meet?"
      ),
      allowNull: false,
    },
    sqa1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Answer cannot be empty" },
        isDateFormat(value) {
          const alphaRegex = /^[a-zA-Z]+$/;
          if (!alphaRegex.test(value)) {
            throw new Error("Answer must contain only alphabetical characters");
          }
        }
      }
    },
    passwordUpdateLink: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    passwordUpdateLinkCreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    passwordAttempt: {
      type: DataTypes.STRING,
    }
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
