module.exports = (sequelize, DataTypes) => {
    const Advert = sequelize.define('Advert', {
      advertId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      advertDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      adVideo: {
        type: DataTypes.ENUM('DoneByUser', 'DoneByUs'),
        allowNull: false,
      },
      adPhoto: {
        type: DataTypes.ENUM('DoneByUser', 'DoneByUs'),
        allowNull: false,
      },
      adDuration: {
        type: DataTypes.STRING, 
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Approved', 'Pending','UnderReview','Denied'),
        allowNull: false,
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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
      },
    }, {
      timestamps: true, 
      tableName: 'Adverts'
    });
    Advert.associate= models =>{
        Advert.belongsTo(models.User,{foreignKey:'userId'})
        models.User.hasMany(Advert,{foreignKey:'userId'})
    }
    return Advert;
  };
  