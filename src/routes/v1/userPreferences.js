import Router from 'koa-router';
import Logger from 'loglevel';

import mongodb from '../../services/MongoDB';

const router = Router({ prefix: '/user-preferences' });

/* TODO @(hasiddiq): added for testing */
router.get('/', async (ctx) => {
  try {
    const UserSchema = mongodb.pool.Schema({
      username: String,
      name: String,
      email: String,
    });

    const User = await mongodb.pool.model('User', UserSchema, 'users');
    const newUser = new User({ username: ctx.query.username, name: 'Hasan Siddique', email: 'hasiddiq@cisco.com' });

    await newUser.save((err, user) => {
      if (err) return err;
      return user;
    });

    ctx.body = {
      user_preferences: newUser,
    };
  } catch (error) {
    // handleMongoError(error);
    Logger.error(`DB query failed. ${error}`);
    ctx.status = 500;
    ctx.body = {
      errorMessage: `DB query failed. ${error}`,
    };
  }
});

export default router;
