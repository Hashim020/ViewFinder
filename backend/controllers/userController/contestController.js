import cloudinary from "../../config/cloudinary.js";
import asyncHandler from 'express-async-handler';
import Contest from '../../models/contestModel.js'

const createContest = asyncHandler(async (req, res) => {
    
    const { name, description, Amount, expiry, type, image } = req.body;
    const createdBy = req.user._id;

    console.log(req.body);

    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "Contest",
        });

        const newContest = new Contest({
            contestName:name,
            contestDescription :description,
            price :Amount,
            coverPhoto: result.secure_url, 
            createdBy,
            expiryDate:expiry,
            type
        });

        await newContest.save();

        res.status(201).json(newContest); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export {
    createContest
};
