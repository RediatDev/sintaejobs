
module.exports = (sequelize, DataTypes) => {
    const JobBackup = sequelize.define('JobBackup', {
      jobId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      jobCategory: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobSalary: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobType: {
        type: DataTypes.ENUM('full_time', 'part_time', 'hourly_basis', 'remote'),
        allowNull: false,
      },
      jobAcceptance: {
        type: DataTypes.ENUM('A', 'P'),
        allowNull: false,
      },
      jobDeadline: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jobGender: {
        type: DataTypes.ENUM('Male', 'Female', 'Male/Female'),
        allowNull: true,
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
      tableName: 'JobBackup',
    });
  
    JobBackup.associate = models => {
        JobBackup.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return JobBackup;
  };
  