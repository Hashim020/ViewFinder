import cloudinary from "../../config/cloudinary.js";
import asyncHandler from 'express-async-handler';
import Contest from '../../models/contestModel.js'
import User from '../../models/userModel.js'

const createContest = asyncHandler(async (req, res) => {
    const { name, description, expiry, image } = req.body;
    const createdBy = req.user._id;
  
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: "Contest",
      });
  
      const newContest = new Contest({
        contestName: name,
        contestDescription: description,
        coverPhoto: result.secure_url,
        createdBy,
        expiryDate: expiry,
      });
  
      const savedContest = await newContest.save();
  
      await User.findByIdAndUpdate(createdBy, { $push: { contests: savedContest._id } });
  
      res.status(201).json(savedContest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

  const getContests = async (req, res) => {
    try {
        const contests = await Contest.find({ isListed: true }).populate('createdBy');
        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const userParticipation = async (req, res) => {
    const { postId, contestId } = req.body;
    console.log(req.body);

    try {
        const contest = await Contest.findByIdAndUpdate(
            contestId,
            {
                $addToSet: {
                    participation: postId,
                    participants: req.user._id
                }
            },
            { new: true }
        );

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        res.status(200).json({ contest,sucess:"True" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getSelectedContest = asyncHandler(async (req, res) => {
    const { contestId } = req.params;
  
    try {
      const contest = await Contest.findById(contestId)
        .populate('participation')
        .populate('participants')
        .populate('createdBy');
  
      if (!contest) {
        return res.status(404).json({ success: false, message: 'Contest not found' });
      }
  
      res.status(200).json({ success: true, data: contest });
    } catch (error) {
      console.error('Error fetching contest:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });





export {
    createContest,
    getContests,
    userParticipation,
    getSelectedContest
};
