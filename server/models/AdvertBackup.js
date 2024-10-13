module.exports = (sequelize, DataTypes) => {
    const AdvertBackup = sequelize.define('AdvertBackup', {
      advertBackUpId: {
        type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      advertId: {
        type: DataTypes.UUID,
        allowNull: false,
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
        type: DataTypes.ENUM('Approved', 'Pending', 'UnderReview', 'Denied','Requested_to_pay','Uploaded'),
        allowNull: true,
        defaultValue:'UnderReview'
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
      mediaType:{
        type : DataTypes.STRING,
        allowNull: false,
      },
    }, {
      timestamps: true,
      tableName: 'AdvertBackup',
    });
  
  // Associations
  AdvertBackup.associate = models => {
    AdvertBackup.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });  // Relationship with User
    AdvertBackup.belongsTo(models.Advert, { foreignKey: 'advertId', onDelete: 'CASCADE' });  // Relationship with Advert
  };

    return AdvertBackup;
  };
  