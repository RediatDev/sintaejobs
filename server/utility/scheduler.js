const cron = require('node-cron');
const { User, Advert, AdvertBackup } = require('../models'); // Adjust the path as necessary
const { Op } = require('sequelize');

// Schedule a job to run every 5 minutes for user cleanup
cron.schedule('*/5 * * * *', async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    await User.update(
      {
        passwordUpdateLink: null,
        passwordUpdateLinkCreatedAt: null,
      },
      {
        where: {
          passwordUpdateLinkCreatedAt: {
            [Op.lt]: fiveMinutesAgo,
          },
          passwordUpdateLink: {
            [Op.not]: null,
          },
        },
      }
    );
    console.log('Expired password update links cleaned up.');
  } catch (error) {
    console.error('Error cleaning up expired password update links:', error);
  }
});

// Schedule a job to run daily at midnight for advert cleanup
cron.schedule('0 0 * * *', async () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

  try {
    // Delete old adverts
    const deletedAdverts = await Advert.destroy({
      where: {
        status: {
          [Op.or]: ['Requested_to_pay', 'Denied']
        },
        updatedAt: {
          [Op.lt]: tenDaysAgo
        }
      }
    });

    console.log(`Deleted ${deletedAdverts} old adverts.`);

    // Delete old adverts from AdvertBackup
    const deletedBackupAdverts = await AdvertBackup.destroy({
      where: {
        status: {
          [Op.or]: ['Requested_to_pay', 'Denied']
        },
        updatedAt: {
          [Op.lt]: tenDaysAgo
        }
      }
    });

    console.log(`Deleted ${deletedBackupAdverts} old adverts from backup.`);
    
  } catch (error) {
    console.error('Error deleting old adverts:', error);
  }
});
