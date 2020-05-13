import Logger from 'loglevel';
import mysql from 'mysql2/promise';
import Dateformat from 'dateformat';
import ConnectionState from '../common/ConnectionState';
import config from '../config';
import { DATE_FORMAT } from '../common/constants';

class Mysql {
  constructor() {
    this.state = ConnectionState.INIT;
    config.mysqlConfig.host = config.mysqlConfig.host && config.mysqlConfig.host.split(',')[0];
    this.connect(config.mysqlConfig);
  }

  async connect(mysqlConfig) {
    if (this.state === ConnectionState.CONNECTING) {
      return;
    }

    if (this.pool) {
      this.disconnect();
    }

    this.state = ConnectionState.CONNECTING;

    try {
      this.pool = await mysql.createPool(mysqlConfig);
      const connection = await this.pool.getConnection();

      if (connection) {
        this.state = ConnectionState.READY;
        connection.release();
        Logger.info(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=INFO message="Connected to MySQL database."`);
      } else {
        this.state = ConnectionState.FAILED;
        Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="MySQL database connection is not ready"`); // Retry connection attempt after one minute

        setTimeout(() => this.connect(mysqlConfig), 1000 * 60);
      }
    } catch (error) {
      this.state = ConnectionState.FAILED;
      Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="Connect to MySQL database failed. ${error}"`); // Retry connection attempt after one minute

      setTimeout(() => this.connect(mysqlConfig), 1000 * 60);
    }
  }

  disconnect() {
    if (this.pool) {
      this.pool.end(err => {
        if (err) {
          Logger.error(`time="${Dateformat(Date.now(), DATE_FORMAT, true)}" level=ERROR message="Disconnect MySQL DB connection failed. ${err}"`);
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

const instance = new Mysql();
export default instance;