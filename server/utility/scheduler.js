const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize');

// Schedule a job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  // Calculate time 5 minutes ago
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
