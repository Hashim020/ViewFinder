import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    birthdate: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profileImageName: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      }
    },
    profileCoverPicture: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      }
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
      }
    ],
    contests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest" 
      }
    ],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
