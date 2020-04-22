export default {
  serverHost: process.env.MOCK_URL || 'http://localhost:8000',
  serverPort: 8000,
  xApiKey: process.env.X_API_KEY,
  logLevel: process.env.LOGS_LEVEL || 'debug',
  mysqlConfig: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  mongodbConfig: {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    clusterPort: process.env.MONGODB_CLUSTER_PORT || 27017,
    clusterUrl: process.env.MONGODB_CLUSTER_URL || 'localhost',
    database: process.env.MONGODB_DATABASE || 'wc_management_portal',
  },
};
