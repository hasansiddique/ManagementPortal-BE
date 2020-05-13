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
    queueLimit: 0
  },
  mongodbConfig: {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    clusterPort: process.env.MONGODB_CLUSTER_PORT || 27017,
    clusterUrl: process.env.MONGODB_CLUSTER_URL || 'localhost',
    database: process.env.MONGODB_DATABASE || 'wc_management_portal'
  },
  jwtConfig: {
    JWT_SECRET: '66e3c0d88cd78325c05c44ce95def7299c43c49d332c4a849d2dd558e82ef9795942051559ccc03ba1699618587dace2e4a832c098fa763a9259ac884a24cbc',
    JWT_EXPIRE: '14h',
    JWT_REFRESH_SECRET: '39e567d833049bde75321ccc5009034938bd085139f641a6eb89e8305e2724c9afe0fe79e3e887faffs55629a74e8949117d5a149fb7e44e8df1ba4598d0cbc79',
    JWT_REFRESH_EXPIRE: '182d'
  },
  uploadConfig: {
    FILE_UPLOAD_PATH: './uploads',
    MAX_FILE_UPLOAD: 2000000
  }
};