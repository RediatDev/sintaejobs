module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.ENUM('Male', 'Female','Male/Female'),
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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'userId',
        },
      },
    }, {
      timestamps: true, 
      tableName: 'Jobs' 
    });
    Job.associate = models=>{
        Job.belongsTo(models.User,{foreignKey:'userId'})
        models.User.hasMany(Job,{foreignKey :'userId'})
    }
    return Job;
  };
  