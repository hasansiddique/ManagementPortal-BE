import Router from 'koa-router';
import { addEmp, getAllEmp, singEmp, uptEmp, delEmp, empRecord } from './employee.controller';
import { Protect, Authorized } from '../../../middleware/auth';

const router = Router({ prefix: '/employee' });

// @ Todo (hanzlah) i think remove the Authorized middleware in get url later fix in future

router.post('/create', Protect, Authorized(1), addEmp);
router.get('/', Protect, Authorized(1, 2), getAllEmp);
router.get('/:id', Protect, Authorized(1, 2), singEmp);
router.put('/:id', Protect, Authorized(1, 2), uptEmp);
router.del('/:id', Protect, Authorized(1), delEmp);
router.get('/:id/record', Protect, empRecord);

export default router;
