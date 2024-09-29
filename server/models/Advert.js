
module.exports = (sequelize, DataTypes) => {
  const Advert = sequelize.define('Advert', {
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
    tableName: 'Adverts',
  });

  Advert.associate = models => {
    Advert.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };

  return Advert;
};
