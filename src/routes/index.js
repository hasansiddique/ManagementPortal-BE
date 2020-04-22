import Router from 'koa-router';

const router = Router({ prefix: '/' });

router.get('/', (ctx) => {
  ctx.body = 'OK';
});

export default router;
