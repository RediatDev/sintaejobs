module.exports = (sequelize, DataTypes) => {
    const AdvertBackup = sequelize.define('AdvertBackup', {
      advertId: {
        type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      advertDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      adMediaLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Approved', 'Pending', 'UnderReview', 'Denied','Requested to pay','Uploaded'),
        allowNull: true,
        defaultValue:'Pending'
      },
      adTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
    }, {
      timestamps: true,
      tableName: 'AdvertBackup',
    });
  
    AdvertBackup.associate = models => {
      AdvertBackup.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return AdvertBackup;
  };
  