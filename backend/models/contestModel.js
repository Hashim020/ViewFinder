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
  price: {
    type: Number,
  },
  coverPhoto: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // referencing the User model
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
  type :{
    type: String,
    enum:["free", "paid"]
  }
});

const Contest = mongoose.model('Contest', contestSchema);

export default Contest;
