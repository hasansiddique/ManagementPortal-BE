import Router from 'koa-router';
import Logger from 'loglevel';
import Dateformat from 'dateformat';

const router = Router({ prefix: '/log' });

router.post('/', (ctx) => {
  const body = ctx.request.body;
  const headers = ctx.request.headers;

  if (body.StartTime) {
    body.StartTime = Dateformat(body.StartTime, 'yyyy-mm-dd"T"HH:MM:ss.l"Z"', true);
  }

  if (Logger.getLevel() <= Logger.levels.TRACE) {
    Logger.trace(`Received Log request:\nbody: ${JSON.stringify(body)},\nheaders: ${JSON.stringify(headers)}`);
  }

  ctx.body = 'OK';
});

export default router;
