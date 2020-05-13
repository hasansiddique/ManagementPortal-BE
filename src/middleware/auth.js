import jwt from 'jsonwebtoken';
import config from '../config';
import asyncHandler from './async';
import UserModel from '../routes/v1/user/user.model';

// Protect routes
export const Protect = asyncHandler(async (ctx, next) => {
  let token;
  if (ctx.headers.authorization.startsWith('Bearer')) {
    token = ctx.headers.authorization.split(' ')[1];
  }
  try {
    let decoded;
    if (token) {
      decoded = jwt.verify(token, config.jwtConfig.JWT_SECRET)
    }
    if (token && decoded.id || decoded.id === ctx.params.id) {
       ctx.user = await UserModel.findById(decoded.id);
      return next();
    }
  } catch (err) {
    ctx.throw(401, 'Not authorized to access this route');
  }
  return null;
});

// Grant access to specific typeOfId
export const Authorized = (...roles) => {
  return (ctx, next) => {
    if (!roles.includes(ctx.user.typeOfId)) {
     ctx.throw(403, `User is not authorized to access this route`)
    }
    return next();
  }
}
