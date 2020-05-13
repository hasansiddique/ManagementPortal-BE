import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../../config';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'please add a userName'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please add a email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'please add a password'],
    minlength: 6,
    select: false,
  },
  typeOfId: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  refreshToken:{
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { id: true });

// // Ensure virtual fields are serialised.
// userSchema.set('toJSON', {
//   virtuals: true,
// });

// eslint-disable-next-line func-names
userSchema.methods.getJwtToken = function () {
  // eslint-disable-next-line no-underscore-dangle,no-return-await
  return jwt.sign({ id: this._id }, config.jwtConfig.JWT_SECRET, { expiresIn: config.jwtConfig.JWT_EXPIRE });
};

// refresh token
userSchema.methods.getSignedRefreshJwtToken = function() {
  return jwt.sign({ id: this._id }, config.jwtConfig.JWT_REFRESH_SECRET, { expiresIn: config.jwtConfig.JWT_REFRESH_EXPIRE });
};

// eslint-disable-next-line func-names
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// eslint-disable-next-line func-names
userSchema.methods.matchPassword = async function (enteredPassword) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('user', userSchema);

export default UserModel;
