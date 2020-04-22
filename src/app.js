/* eslint-disable no-console */
import Koa from 'koa';
import '@babel/polyfill';
import Logger from 'loglevel';
import Router from 'koa-router';
import Dateformat from 'dateformat';
import BodyParser from 'koa-bodyparser';

// Route imports
import index from './routes';
import log from './routes/v1/log';
import health from './routes/v1/health';
import mongodb from './services/MongoDB';
import { DATE_FORMAT } from './common/constants';
import userPreferencesRoutes from './routes/v1/userPreferences';

import config from './config';

// Define logger level
Logger.setLevel(config.logLevel);

// Initialize server
Logger.info(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=INFO message="Initializing node-server..."`);

const koa = new Koa();

const router = Router();
const v1router = Router();

// Declare v1 routes
v1router.use(log.routes());
v1router.use(health.routes());
v1router.use(userPreferencesRoutes.routes());

// Declare root routes
router.use(index.routes());
router.use('/v1', v1router.routes());

// Middleware
koa.use(BodyParser({
  extendTypes: {
    json: ['application/x-javascript', 'application/vnd.cia.v1+json'],
  },
}));

// Use routes
koa.use(router.routes());

// Listen to port
const port = parseInt(config.serverPort, 10);
const server = koa.listen(port, () => {
  Logger.info(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=INFO message="node-server started running on ${port}"`);
});

export default {
  server,
  mongodb,
};
/* eslint-enable no-console */
