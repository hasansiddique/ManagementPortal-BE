import Router from 'koa-router';
import { registerUser, loginUser, getUser, token, logOut, updatePassword } from './user.controller';
import { Protect } from '../../../middleware/auth';

const router = Router({ prefix: '/users/' });

router.post('register', registerUser);
router.post('login', loginUser);
router.get(':id', Protect, getUser);
router.post('token', token);
router.post('logout', logOut);
router.put('update-password', Protect, updatePassword);

export default router;
