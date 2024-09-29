module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
      tokenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      refreshToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId'
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      timestamps: true,
      tableName: 'Tokens', 
    });
  
    RefreshToken.associate = models => {
        RefreshToken.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return RefreshToken;
  };
  