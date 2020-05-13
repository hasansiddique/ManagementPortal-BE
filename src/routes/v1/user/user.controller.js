import jwt from 'jsonwebtoken';
import UserModel from './user.model';
import asyncHandler from '../../../middleware/async';
import config from "../../../config";

// @desc      Register user
// @route     POST /v1/user/register
// @access    Public
export const registerUser = asyncHandler(async (ctx) => {
  let user;
  const { username, email, password } = ctx.request.body;
  user = await UserModel.find();
  // if (user.length > 1) {
  //   ctx.throw(400, 'Registered users with maximum length exceeded ');
  // }
  user = await UserModel.findOne({ email });
  if (user) {
    ctx.throw(400, 'user with same credentials already exists');
  }
  user = await UserModel.findOne({ username });
  if (user) {
    ctx.throw(400, 'UserName already exists');
  }
  await UserModel.create({
    username,
    email,
    password,
  });
  ctx.status = 201;
  ctx.body = { success: true, status: 'user Successfully Registered' };
});


// @desc      Login user
// @route     POST /v1/user/login
// @access    Public
export const loginUser = asyncHandler(async(ctx) => {
  const { email, password } = ctx.request.body;
  // Validate emil & password
  if (!email || !password) {
    ctx.throw(400, 'please provide email and password');
  }
  // Check for user in database
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) {
    ctx.throw(400, 'Invalid credentials');
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    ctx.throw(400, 'Invalid credentials');
  }
  const userById = await UserModel.findById(user.id);
  // Create token
  const token = user.getJwtToken();
  const refreshToken = user.getSignedRefreshJwtToken();
  const test2 = await UserModel.findByIdAndUpdate(user.id, {refreshToken}, { new: true, runValidators: true} )
  ctx.status = 200;
  ctx.body = { success: true, user: userById, token: { accessToken: token, refreshToken } };
});

// @desc      get loggedIn User
// @route     Get /v1/user/getUser/:id
// @access    Private
export const getUser = asyncHandler(async(ctx) => {
  const user = await UserModel.findById(ctx.params.id);
  ctx.body = { success: true, user };
});

// @desc      get loggedIn User refresh token
// @route     POST /v1/user/token
// @access    Private
export const token = asyncHandler(async(ctx) => {
  const { token } = ctx.request.body;
  if (token === null) return ctx.status = 401;
  const refreshToken = await UserModel.findOne({refreshToken: token})
  ctx.assert(refreshToken, 403, 'User with specified token is not found')
  const decoded = jwt.verify(token, config.jwtConfig.JWT_REFRESH_SECRET);
  const user = await UserModel.findById(decoded.id);
  const accessToken = user.getJwtToken();
  ctx.body = { success: true, accessToken };
});

// @desc      Logout User with its refresh token access token
// @route     Get /v1/user/token
// @access    Private
export const logOut = asyncHandler(async (ctx) => {
  const { token } = ctx.request.body;
  if (!token) {
    ctx.throw(400, 'please add payload');
  }
  const refreshToken = await UserModel.findOne({refreshToken: token})
  ctx.assert(refreshToken, 404, 'User with specified token is not found')
  await UserModel.findOneAndUpdate({refreshToken: token}, {refreshToken: null})
  ctx.status = 200;
  ctx.body = { success: true, status: 'User successfully logout' };
});

// @desc      Update user password
// @route     Put /v1/users/update-password
// @access    Private
export const updatePassword =  asyncHandler(async (ctx) => {
  const user = await UserModel.findById(ctx.user.id).select('+password');
  const { currentpassword, newpassword } = ctx.request.body;
  if (!currentpassword || !newpassword) {
    ctx.throw(400, 'please provide passwords fields');
  }
  // Check current password
  if (!(await user.matchPassword(currentpassword))) {
    ctx.throw(401, 'Password is Incorrect')
  }
  user.password = newpassword;
  await user.save();
  ctx.status = 200;
  ctx.body = { success: true, status: 'Password successfully Updated' };
})
