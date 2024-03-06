import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  replies: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});


const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
