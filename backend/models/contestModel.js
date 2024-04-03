import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const contestSchema = new Schema({
  contestName: {
    type: String,
    required: true
  },
  contestDescription: {
    type: String,
    required: true
  },
  coverPhoto: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  participation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;

export function updateContestStatus() {
  Contest.updateMany({ expiryDate: { $lt: new Date() } }, { $set: { isActive: false } })
    .then(() => console.log('Contest statuses updated successfully.'))
    .catch(err => console.error('Error updating contest statuses:', err));
}
