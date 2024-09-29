// * Correction using chtGPT
const { Advert, AdvertBackup,User } = require('../models');
const {upload} =require('../fileHandler/fileValidator.js')

//* Set ffmpeg path

//* Controller for inserting an advert
const insertAdvert = async (req, res) => {
    const { advertDescription } = req.body;
    const { userId } = req.params;
    const adMediaLink = req.file ? req.file.path : null;  

    try {
    
      if (req.fileValidationError) {
        return res.status(400).send(`Error: ${req.fileValidationError}`);
      }
  
      //* Validate required fields
      if (!adMediaLink || !userId || !advertDescription) {
        return res.status(400).send('All fields including advert photo or video are required');
      }
  
      await Advert.create({
        advertDescription,
        adMediaLink,
        userId,
        mediaType:req.file.mimetype 
      });
  
      await AdvertBackup.create({
        advertDescription,
        adMediaLink,
        userId,
        mediaType:req.file.mimetype 
      });

      res.status(201).json({ message: 'Advert created successfully '});
    } catch (error) {

      res.status(500).json({ message: error.message });
    }
  };
// * ChatGPT assist end here
let updateAdvert = async (req,res)=>{
    const { advertId } = req.params;
    const updateFields = ['advertDescription', 'status', 'adDuration', 'adPhoto', 'adVideo', 'userId'];
    try {
        const advert = await Advert.findByPk(advertId);

        if (!advert) {
            return res.status(404).json({ message: 'Advert not found' });
        }

        // Dynamically update only the provided fields
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                advert[field] = req.body[field];
            }
        });

        await advert.save();

        res.json({ message: 'Advert updated successfully', advert });
    } catch (error) {
   
        res.status(500).json({ message: error.message });
    }
}
//* Delete user
let deleteAdvert = async (req,res)=>{
    const { advertId } = req.params;

    try {
        const advert = await Advert.findByPk(advertId);

        if (!advert) {
            return res.status(404).json({ message: 'Advert not found' });
        }

        await advert.destroy();

        res.json({ message: 'Advert deleted successfully' });
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
}

//* get all uploaded media file
let getAllMedia = async (req,res)=>{
  try {
    const adverts = await Advert.findAll({
        include: [{
            model: User,
            attributes: ['userId', 'userName', 'email'], 
        }],
        order: [['adTimestamp', 'DESC']], 
    });
    res.status(200).json({
        success: true,
        data: adverts,
    });
} catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({
        success: false,
        message: 'Error fetching media',
        error: error.message,
    });
}
}

//* admin review section for uploading 
let adminReview = async (req,res)=>{
   


}




module.exports ={deleteAdvert,updateAdvert,insertAdvert,adminReview,getAllMedia}