import Logger from 'loglevel';
import Dateformat from 'dateformat';
import mongoose from 'mongoose';

import config from '../config';
import { DATE_FORMAT } from '../common/constants';
import ConnectionState from '../common/ConnectionState';

class MongoDB {
  constructor() {
    this.state = ConnectionState.INIT;
    this.connect(config.mongodbConfig);
  }

  async connect(mongodbConfig) {
    if (this.state === ConnectionState.CONNECTING) {
      return;
    }
    if (this.pool) {
      this.disconnect();
    }

    this.state = ConnectionState.CONNECTING;
    const {
      // user, password,
      clusterUrl,
     // clusterPort,database,
    } = mongodbConfig;

    // const uri = `mongodb://${clusterUrl}:${clusterPort}/${database}`;
    const uri = `${clusterUrl}`;
    const connectionAuth = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // to be used when using cluster or credentials

      /* auth: {
        user,
        password,
      }, */
    };

    try {
      this.pool = await mongoose.connect(uri, connectionAuth);

      if (this.pool) {
        this.state = ConnectionState.READY;
        Logger.info(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=INFO message="Connected to MongoDB database."`);
      } else {
        this.state = ConnectionState.FAILED;
        Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="MongoDB database connection is not ready"`);
        setTimeout(() => this.connect(mongodbConfig), 1000 * 60);
      }
    } catch (error) {
      this.state = ConnectionState.FAILED;
      Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="Connect to MongoDB database failed. ${error}"`);
      setTimeout(() => this.connect(mongodbConfig), 1000 * 60);
    }
  }

  disconnect() {
    if (this.pool) {
      this.pool.on('error', (err) => {
        if (err) {
          Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="Disconnect  MongoDB connection failed. ${err}"`);
        }
        this.state = ConnectionState.DISCONNECTED;
      });
    }
  }

  restart() {
    this.disconnect();
    this.connect(config.mysqlConfig);
  }

}

const instance = new MongoDB();
export default instance;
