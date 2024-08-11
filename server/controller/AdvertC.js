const { sequelize, Advert } = require('../models');
let insertAdvert = async (req,res)=>{
    const { userId,advertDescription,status,adDuration,adPhoto,adVideo} = req.body;
  
    try {
        const newAdvert = await Advert.create({
            advertDescription,
            adVideo,
            adPhoto,
            adDuration,
            status,
            userId,
        });

        res.status(201).json({ message: 'Advert created successfully', newAdvert });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
}

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
module.exports ={deleteAdvert,updateAdvert,insertAdvert}