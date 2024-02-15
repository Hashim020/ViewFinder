import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const adminSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
)
adminSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Admin = mongoose.model('Admin', adminSchema)

export default Admin