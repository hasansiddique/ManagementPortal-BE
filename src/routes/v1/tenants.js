import Router from 'koa-router';
import Logger from 'loglevel';
import Dateformat from 'dateformat';

import mysql from '../../services/Mysql';
import { DATE_FORMAT } from '../../common/constants';
import { handleMysqlError } from '../../common/utils';

const router = Router({ prefix: '/tenants' });

router.get('/count', async (ctx) => {
  const startTime = ctx.query.startTime;
  const endTime = ctx.query.endTime;

  function generateQuery(funded = false) {
    let query = `
      select count(*) as total
      from users
      where
        funded=${funded}
        and status='ACTIVE'
    `;

    if (startTime) {
      query += ` and created_at >= DATE('${startTime}')`;
    }
    if (endTime) {
      query += ` and created_at < DATE('${endTime}')`;
    }

    return query;
  }

  try {
    let [rows] = await mysql.pool.query(generateQuery(true));
    const funded = rows[0].total;

    [rows] = await mysql.pool.query(generateQuery(false));
    const unfunded = rows[0].total;
    ctx.body = {
      funded,
      unfunded,
    };
    Logger.info(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=INFO message="GET /v1/users/count?startTime=${startTime}&endTime=${endTime} return=${JSON.stringify(ctx.body)}"`);
  } catch (error) {
    handleMysqlError(error);
    Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="DB query failed. ${error}"`);
    ctx.status = 500;
  }
});

export default router;
