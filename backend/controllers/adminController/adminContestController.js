import Contest from '../../models/contestModel.js';
import asyncHandler from 'express-async-handler';


const getAllContestsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const searchTerm = req.query.search || '';

  // Constructing the query
  const query = {};
  if (searchTerm) {
    // Adding search criteria if searchTerm is provided
    query.$or = [
      { contestName: { $regex: searchTerm, $options: 'i' } },
      { contestDescription: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Count total number of documents matching the query
  const totalCount = await Contest.countDocuments(query);

  // Fetch contests with pagination and populate createdBy, participation, and participants
  const contests = await Contest.find(query)
    .populate('createdBy', 'username')
    .populate('participation')
    .populate('participants', 'username')
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  // Calculating total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  res.json({ contests, totalPages });
});


const chooseContestWinner = asyncHandler(async (req, res) => {
  const { postId, contestId } = req.body;

  try {
    const contest = await Contest.findOneAndUpdate(
      { _id: contestId },
      { winner: postId },
      { new: true }
    );

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    res.status(200).json({ success: "true", message: 'Contest winner chosen successfully', contest });
  } catch (error) {
    console.error('Error choosing contest winner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



const unlistAndRelist = async (req, res) => {
  const { contestId } = req.body;

  try {
      const contest = await Contest.findById(contestId);

      if (!contest) {
          return res.status(404).json({ success: false, message: 'Contest not found' });
      }

      contest.isListed = !contest.isListed;

      await contest.save();

      res.status(200).json({ success: true, message: `Contest ${contest.isListed ? 'listed' : 'unlisted'} successfully` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};

export {
  getAllContestsAdmin,
  chooseContestWinner,
  unlistAndRelist
}